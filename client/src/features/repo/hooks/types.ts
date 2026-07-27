import z from 'zod';

export const RepoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  assignmentId: z.string(),
  githubFullName: z.string(),
  connectedAt: z.string(),
});

export type Repo = z.infer<typeof RepoSchema>;
