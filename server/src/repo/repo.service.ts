import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectRepoDto } from './dtos/connect-repo.dto';

@Injectable()
export class RepoService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserAndAssignment(userId: string, assignmentId: string) {
    return this.prisma.repo.findUnique({
      where: { userId_assignmentId: { userId, assignmentId } },
    });
  }

  connect(userId: string, dto: ConnectRepoDto) {
    return this.prisma.repo.upsert({
      where: {
        userId_assignmentId: { userId, assignmentId: dto.assignmentId },
      },
      update: { githubFullName: dto.githubFullName },
      create: {
        userId,
        ...dto,
      },
    });
  }

  listPullRequests(userId: string, assignmentId: string) {
    return this.prisma.repo
      .findUnique({
        where: {
          userId_assignmentId: { userId, assignmentId },
        },
      })
      .pullRequests({ orderBy: { openedAt: 'desc' } });
  }
}
