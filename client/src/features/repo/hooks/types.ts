import z from 'zod';

export const RepoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  assignmentId: z.string(),
  githubFullName: z.string(),
  connectedAt: z.string(),
});

export const PullRequestSchema = z.object({
  id: z.string(),
  number: z.number(),
  branch: z.string(),
  sha: z.string(),
  additions: z.number(),
  deletions: z.number(),
  openedAt: z.string(),
  submitted: z.boolean(),
});

export type Repo = z.infer<typeof RepoSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
