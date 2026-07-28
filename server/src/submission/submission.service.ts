import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

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

    const roundNumber =
      (await this.prisma.submission.count({
        where: { userId, assignmentId: pullRequest.repo.assignmentId },
      })) + 1;

    return this.prisma.submission.create({
      data: {
        userId,
        assignmentId: pullRequest.repo.assignmentId,
        pullRequestId,
        roundNumber,
      },
    });
  }
}
