import { ApiProperty } from '@nestjs/swagger';
import { Severity, SubmissionStatus, Tier } from '../../generated/prisma/enums';

export class SubmissionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ format: 'uuid' })
  assignmentId!: string;

  @ApiProperty({ format: 'uuid' })
  pullRequestId!: string;

  roundNumber!: number;

  @ApiProperty({ enum: SubmissionStatus, enumName: 'SubmissionStatus' })
  status!: SubmissionStatus;

  @ApiProperty({ type: Number, nullable: true })
  totalScore!: number | null;

  createdAt!: Date;
}

export class SubmissionListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  roundNumber!: number;

  @ApiProperty({ enum: SubmissionStatus, enumName: 'SubmissionStatus' })
  status!: SubmissionStatus;

  @ApiProperty({ type: Number, nullable: true })
  totalScore!: number | null;
}

export class SubmissionStatsResponseDto {
  completedAssignments!: number;

  @ApiProperty({ type: Number, nullable: true })
  averageScore!: number | null;

  @ApiProperty({ enum: Tier, enumName: 'Tier', nullable: true })
  tier!: Tier | null;

  @ApiProperty({ enum: Tier, enumName: 'Tier', nullable: true })
  nextTier!: Tier | null;
}

export class SubmissionSummaryItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  assignmentId!: string;

  assignmentTitle!: string;

  @ApiProperty({ type: Number, nullable: true })
  bestScore!: number | null;

  @ApiProperty({ enum: SubmissionStatus, enumName: 'SubmissionStatus' })
  latestStatus!: SubmissionStatus;

  lastActivityAt!: Date;

  @ApiProperty({ format: 'uuid' })
  latestSubmissionId!: string;
}

class SubmissionAssignmentDto {
  title!: string;
}

class SubmissionPullRequestDto {
  number!: number;
  branch!: string;
  sha!: string;
}

class ScoredRubricItemDto {
  name!: string;
  points!: number;
}

class SubmissionScoreResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  submissionId!: string;

  @ApiProperty({ format: 'uuid' })
  rubricItemId!: string;

  score!: number;

  summary!: string;

  rubricItem!: ScoredRubricItemDto;
}

class ReviewCommentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  submissionId!: string;

  filePath!: string;

  lineNumber!: number;

  @ApiProperty({ enum: Severity, enumName: 'Severity' })
  severity!: Severity;

  tag!: string;

  body!: string;
}

export class SubmissionDetailResponseDto extends SubmissionResponseDto {
  assignment!: SubmissionAssignmentDto;

  pullRequest!: SubmissionPullRequestDto;

  @ApiProperty({ type: [SubmissionScoreResponseDto] })
  scores!: SubmissionScoreResponseDto[];

  @ApiProperty({ type: [ReviewCommentResponseDto] })
  comments!: ReviewCommentResponseDto[];
}
