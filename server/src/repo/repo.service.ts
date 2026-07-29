import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubAppService } from '../github-app/github-app.service';
import { PrismaService } from '../prisma/prisma.service';
import { PullRequestService } from '../pull-request/pull-request.service';
import { ConnectRepoDto } from './dtos/connect-repo.dto';

@Injectable()
export class RepoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubAppService: GithubAppService,
    private readonly pullRequestService: PullRequestService,
  ) {}

  findByUserAndAssignment(userId: string, assignmentId: string) {
    return this.prisma.repo.findUnique({
      where: { userId_assignmentId: { userId, assignmentId } },
    });
  }

  async connect(userId: string, dto: ConnectRepoDto) {
    const repo = await this.prisma.repo.upsert({
      where: {
        userId_assignmentId: { userId, assignmentId: dto.assignmentId },
      },
      update: { githubFullName: dto.githubFullName },
      create: {
        userId,
        ...dto,
      },
    });

    try {
      const installation =
        await this.githubAppService.getInstallationByUserId(userId);
      if (installation) {
        const summaries = await this.githubAppService.listOpenPullRequests(
          installation.installationId,
          dto.githubFullName,
        );
        const details = await Promise.all(
          summaries.map((pr) =>
            this.githubAppService.getPullRequestDetails(
              installation.installationId,
              dto.githubFullName,
              pr.number,
            ),
          ),
        );
        await this.pullRequestService.backfillPullRequests(
          repo.id,
          details.map((pr) => ({
            number: pr.number,
            branch: pr.head.ref,
            sha: pr.head.sha,
            additions: pr.additions,
            deletions: pr.deletions,
            openedAt: pr.created_at,
          })),
        );
      }
    } catch (error) {
      console.error(`레포 연결 백필 실패 (repoId=${repo.id})`, error);
      await this.prisma.repo.delete({ where: { id: repo.id } });
      throw new BadRequestException(
        '레포 연결에 실패했습니다. 다시 시도해주세요.',
      );
    }

    return repo;
  }

  async listPullRequests(userId: string, assignmentId: string) {
    const pullRequests = await this.prisma.repo
      .findUnique({ where: { userId_assignmentId: { userId, assignmentId } } })
      .pullRequests({
        orderBy: { openedAt: 'desc' },
        include: { submissions: true },
      });

    if (pullRequests == null) return [];

    return pullRequests.map(({ submissions, ...pr }) => ({
      ...pr,
      submitted: submissions.length > 0,
    }));
  }
}
