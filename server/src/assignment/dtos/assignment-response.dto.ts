import { ApiProperty } from '@nestjs/swagger';
import { Tier, Track } from '../../generated/prisma/enums';

export class RubricItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  name!: string;

  points!: number;

  aiGuide!: string;

  @ApiProperty({ format: 'uuid' })
  assignmentId!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export class AssignmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  title!: string;

  @ApiProperty({ enum: Tier, enumName: 'Tier' })
  tier!: Tier;

  @ApiProperty({ enum: Track, enumName: 'Track' })
  track!: Track;

  @ApiProperty({ type: [String] })
  tags!: string[];

  hoursEstimate!: number;

  requirementsMd!: string;

  @ApiProperty({ type: Date, nullable: true })
  publishedAt!: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export class AssignmentDetailResponseDto extends AssignmentResponseDto {
  @ApiProperty({ type: [RubricItemResponseDto] })
  rubricItems!: RubricItemResponseDto[];
}

export class PaginatedAssignmentsResponseDto {
  @ApiProperty({ type: [AssignmentDetailResponseDto] })
  items!: AssignmentDetailResponseDto[];

  total!: number;

  limit!: number;

  offset!: number;
}
