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

export const UpdateRubricItemsInputSchema = z.object({
  id: z.string(),
  rubricItems: z.array(
    RubricItemSchema.pick({ name: true, points: true, aiGuide: true }),
  ),
});

export type Tier = z.infer<typeof TierSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type RubricItem = z.infer<typeof RubricItemSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type UpdateRubricItemsInput = z.infer<
  typeof UpdateRubricItemsInputSchema
>;
