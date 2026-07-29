import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tier } from '../generated/prisma/client';
import { GradingService } from '../grading/grading.service';
import { PrismaService } from '../prisma/prisma.service';

const TIER_ORDER: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
const PASSING_SCORE = 85;

@Injectable()
export class SubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gradingService: GradingService,
  ) {}

  async create(userId: string, pullRequestId: string) {
    const pullRequest = await this.prisma.pullRequest.findUnique({
      where: { id: pullRequestId },
      include: { repo: true },
    });

    if (!pullRequest) {
      throw new NotFoundException('PR을 찾을 수 없습니다.');
    }
    if (pullRequest.repo.userId !== userId) {
      throw new ForbiddenException('본인의 PR만 제출할 수 있습니다.');
    }

    const existing = await this.prisma.submission.findUnique({
      where: { userId_pullRequestId: { userId, pullRequestId } },
    });
    if (existing) {
      throw new ConflictException('이미 제출한 PR입니다.');
    }

    const roundNumber =
      (await this.prisma.submission.count({
        where: { userId, assignmentId: pullRequest.repo.assignmentId },
      })) + 1;

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        assignmentId: pullRequest.repo.assignmentId,
        pullRequestId,
        roundNumber,
      },
    });

    void this.gradingService.grade(submission.id);

    return submission;
  }

  async findOne(userId: string, id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: { select: { title: true } },
        pullRequest: { select: { number: true, branch: true, sha: true } },
        scores: {
          include: { rubricItem: { select: { name: true, points: true } } },
        },
        comments: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('제출을 찾을 수 없습니다.');
    }
    if (submission.userId !== userId) {
      throw new ForbiddenException('본인의 제출만 볼 수 있습니다.');
    }

    return submission;
  }

  findAllByAssignment(userId: string, assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { userId, assignmentId },
      orderBy: { roundNumber: 'desc' },
      select: { id: true, roundNumber: true, status: true, totalScore: true },
    });
  }

  async getStats(userId: string) {
    const graded = await this.prisma.submission.findMany({
      where: { userId, status: 'GRADED' },
      select: {
        assignmentId: true,
        totalScore: true,
        assignment: { select: { tier: true } },
      },
    });

    const completedAssignments = new Set(graded.map((g) => g.assignmentId))
      .size;
    const averageScore = graded.length
      ? Math.round(
          graded.reduce((sum, g) => sum + (g.totalScore ?? 0), 0) /
            graded.length,
        )
      : null;

    const clearedTierIndexes = graded
      .filter((g) => (g.totalScore ?? 0) >= PASSING_SCORE)
      .map((g) => TIER_ORDER.indexOf(g.assignment.tier));

    const tierIndex = clearedTierIndexes.length
      ? Math.max(...clearedTierIndexes)
      : -1;
    const tier = tierIndex >= 0 ? TIER_ORDER[tierIndex] : null;
    const nextTier =
      tierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[tierIndex + 1] : null;

    return { completedAssignments, averageScore, tier, nextTier };
  }

  async getSummary(userId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      include: { assignment: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const byAssignment = new Map<
      string,
      {
        assignmentId: string;
        assignmentTitle: string;
        bestScore: number | null;
        latestStatus: (typeof submissions)[number]['status'];
        lastActivityAt: Date;
        latestSubmissionId: string;
      }
    >();

    for (const s of submissions) {
      const row = byAssignment.get(s.assignmentId);
      if (!row) {
        byAssignment.set(s.assignmentId, {
          assignmentId: s.assignmentId,
          assignmentTitle: s.assignment.title,
          bestScore: s.totalScore,
          latestStatus: s.status,
          lastActivityAt: s.createdAt,
          latestSubmissionId: s.id,
        });
      } else if (
        s.totalScore != null &&
        (row.bestScore == null || s.totalScore > row.bestScore)
      ) {
        row.bestScore = s.totalScore;
      }
    }

    return [...byAssignment.values()];
  }
}
