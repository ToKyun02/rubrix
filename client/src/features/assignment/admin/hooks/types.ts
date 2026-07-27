import { z } from 'zod';
import {
  RubricItemSchema,
  TierSchema,
  TrackSchema,
} from '@/features/assignment/hooks/types';

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

export type CreateAssignmentInput = z.infer<typeof CreateAssignmentInputSchema>;
export type UpdateAssignmentInput = z.infer<typeof UpdateAssignmentInputSchema>;
