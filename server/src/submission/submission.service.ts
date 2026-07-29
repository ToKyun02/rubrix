import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GradingService } from '../grading/grading.service';
import { PrismaService } from '../prisma/prisma.service';

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
}
