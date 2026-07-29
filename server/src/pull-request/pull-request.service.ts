import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface PullRequestWebhookPayload {
  repository: { full_name: string };
  pull_request: {
    number: number;
    head: { ref: string; sha: string };
    additions: number;
    deletions: number;
    created_at: string;
  };
}

@Injectable()
export class PullRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async recordPullRequest(payload: PullRequestWebhookPayload) {
    const repos = await this.prisma.repo.findMany({
      where: { githubFullName: payload.repository.full_name },
    });

    if (repos.length === 0) return;

    const { pull_request: pr } = payload;

    await Promise.all(
      repos.map((repo) =>
        this.prisma.pullRequest.upsert({
          where: { repoId_number: { repoId: repo.id, number: pr.number } },
          update: {
            branch: pr.head.ref,
            sha: pr.head.sha,
            additions: pr.additions,
            deletions: pr.deletions,
          },
          create: {
            repoId: repo.id,
            number: pr.number,
            branch: pr.head.ref,
            sha: pr.head.sha,
            additions: pr.additions,
            deletions: pr.deletions,
            openedAt: pr.created_at,
          },
        }),
      ),
    );
  }

  async backfillPullRequests(
    repoId: string,
    pullRequests: {
      number: number;
      branch: string;
      sha: string;
      additions: number;
      deletions: number;
      openedAt: string;
    }[],
  ) {
    await this.prisma.pullRequest.createMany({
      data: pullRequests.map((pr) => ({ repoId, ...pr })),
      skipDuplicates: true,
    });
  }
}
