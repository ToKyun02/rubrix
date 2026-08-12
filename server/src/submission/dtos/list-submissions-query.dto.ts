import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListSubmissionsQueryDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f1c0b6e-1c7a-4a2e-9d0b-2b1a5c8e7d10',
  })
  @IsString()
  @IsNotEmpty()
  assignmentId!: string;
}
