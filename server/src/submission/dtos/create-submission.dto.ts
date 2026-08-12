import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({
    format: 'uuid',
    example: '9a2f4c31-88b7-4f5d-9e21-0c6d3a7b1e44',
  })
  @IsString()
  @IsNotEmpty()
  pullRequestId!: string;
}
