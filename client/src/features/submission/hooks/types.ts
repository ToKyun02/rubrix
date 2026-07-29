import { z } from 'zod';

export const SubmissionStatusSchema = z.enum([
  'PENDING',
  'GRADING',
  'GRADED',
  'FAILED',
]);
export const SeveritySchema = z.enum(['INFO', 'WARNING', 'CRITICAL']);

export const SubmissionScoreSchema = z.object({
  id: z.string(),
  rubricItemId: z.string(),
  score: z.number(),
  summary: z.string(),
  rubricItem: z.object({
    name: z.string(),
    points: z.number(),
  }),
});

export const ReviewCommentSchema = z.object({
  id: z.string(),
  filePath: z.string(),
  lineNumber: z.number(),
  severity: SeveritySchema,
  tag: z.string(),
  body: z.string(),
});

export const SubmissionDetailSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  roundNumber: z.number(),
  status: SubmissionStatusSchema,
  totalScore: z.number().nullable(),
  createdAt: z.string(),
  assignment: z.object({ title: z.string() }),
  pullRequest: z.object({
    number: z.number(),
    branch: z.string(),
    sha: z.string(),
  }),
  scores: z.array(SubmissionScoreSchema),
  comments: z.array(ReviewCommentSchema),
});

export const SubmissionSummarySchema = z.object({
  id: z.string(),
  roundNumber: z.number(),
  status: SubmissionStatusSchema,
  totalScore: z.number().nullable(),
});

export const SubmissionStatsSchema = z.object({
  completedAssignments: z.number(),
  averageScore: z.number().nullable(),
});

export const SubmissionSummaryRowSchema = z.object({
  assignmentId: z.string(),
  assignmentTitle: z.string(),
  bestScore: z.number().nullable(),
  latestStatus: SubmissionStatusSchema,
  lastActivityAt: z.string(),
  latestSubmissionId: z.string(),
});

export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;
export type Severity = z.infer<typeof SeveritySchema>;
export type SubmissionDetail = z.infer<typeof SubmissionDetailSchema>;
export type SubmissionSummary = z.infer<typeof SubmissionSummarySchema>;
export type SubmissionStats = z.infer<typeof SubmissionStatsSchema>;
export type SubmissionSummaryRow = z.infer<typeof SubmissionSummaryRowSchema>;
