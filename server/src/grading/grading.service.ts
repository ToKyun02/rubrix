import { Injectable, Logger } from '@nestjs/common';
import { GithubAppService } from '../github-app/github-app.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';

@Injectable()
export class GradingService {
  private readonly logger = new Logger(GradingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubAppService: GithubAppService,
    private readonly aiService: AiService,
  ) {}

  async grade(submissionId: string) {
    try {
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: { status: 'GRADING' },
      });
      const submission = await this.prisma.submission.findUniqueOrThrow({
        where: { id: submissionId },
        include: {
          assignment: { include: { rubricItems: true } },
          pullRequest: { include: { repo: true } },
        },
      });

      const installation =
        await this.prisma.githubInstallation.findUniqueOrThrow({
          where: { userId: submission.pullRequest.repo.userId },
        });

      const diff = await this.githubAppService.getPullRequestDiff(
        installation.installationId,
        submission.pullRequest.repo.githubFullName,
        submission.pullRequest.number,
      );

      const result = await this.aiService.grade(
        submission.assignment.requirementsMd,
        submission.assignment.rubricItems,
        diff,
      );

      const totalScore = result.scores.reduce((sum, s) => sum + s.score, 0);

      await this.prisma.$transaction([
        this.prisma.submissionScore.createMany({
          data: result.scores.map((s) => ({
            submissionId,
            rubricItemId: s.rubricItemId,
            score: s.score,
            summary: s.summary,
          })),
        }),
        this.prisma.reviewComment.createMany({
          data: result.comments.map((c) => ({
            submissionId,
            filePath: c.filePath,
            lineNumber: c.lineNumber,
            severity: c.severity,
            tag: c.tag,
            body: c.body,
          })),
        }),
        this.prisma.submission.update({
          where: { id: submissionId },
          data: { status: 'GRADED', totalScore },
        }),
      ]);
    } catch (error) {
      this.logger.error(`채점 실패 (submissionId=${submissionId})`, error);
      await this.prisma.submission
        .update({
          where: { id: submissionId },
          data: { status: 'FAILED' },
        })
        .catch(() => {});
    }
  }
}
