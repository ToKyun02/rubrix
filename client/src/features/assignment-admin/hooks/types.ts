import { z } from 'zod';

export const TierSchema = z.enum([
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
]);
export const TrackSchema = z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK']);

export const RubricItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  points: z.number(),
  aiGuide: z.string(),
  assignmentId: z.string(),
});

export const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  tier: TierSchema,
  track: TrackSchema,
  tags: z.array(z.string()),
  hoursEstimate: z.number(),
  requirementsMd: z.string(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  rubricItems: z.array(RubricItemSchema),
});

export const CreateAssignmentInputSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  tier: TierSchema,
  track: TrackSchema,
  tags: z.array(z.string()),
  hoursEstimate: z.number().int().min(1, '1시간 이상 입력하세요'),
  requirementsMd: z.string().min(1, '요구사항을 입력하세요'),
  rubricItems: z.array(
    RubricItemSchema.pick({ name: true, points: true, aiGuide: true }),
  ),
});
export const UpdateAssignmentInputSchema = z.object({
  id: z.string(),
  data: CreateAssignmentInputSchema.partial(),
});

export type Tier = z.infer<typeof TierSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type RubricItem = z.infer<typeof RubricItemSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentInputSchema>;
export type UpdateAssignmentInput = z.infer<typeof UpdateAssignmentInputSchema>;
