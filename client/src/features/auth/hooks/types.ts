import z from 'zod';

export const RoleSchema = z.enum(['USER', 'ADMIN']);

export const UserSchema = z.object({
  id: z.string(),
  githubId: z.number(),
  username: z.string(),
  email: z.string().nullable(),
  avatarUrl: z.url().nullable(),
  role: RoleSchema,
});

export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
