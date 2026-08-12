import { ApiProperty } from '@nestjs/swagger';

export class RepoResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ format: 'uuid' })
  assignmentId!: string;

  @ApiProperty({ example: 'ToKyun02/rubrix-assignment-01' })
  githubFullName!: string;

  connectedAt!: Date;
}

export class RepoPullRequestResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  repoId!: string;

  number!: number;

  branch!: string;

  sha!: string;

  additions!: number;

  deletions!: number;

  openedAt!: Date;

  submitted!: boolean;
}
