import z from 'zod';

export const GithubAppStatusSchema = z.object({
  connected: z.boolean(),
  accountLogin: z.string().nullable(),
});

export const GithubRepoListSchema = z.array(z.string());

export type GithubAppStatus = z.infer<typeof GithubAppStatusSchema>;
