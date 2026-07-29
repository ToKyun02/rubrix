import { IsNotEmpty, IsString } from 'class-validator';

export class ListSubmissionsQueryDto {
  @IsString()
  @IsNotEmpty()
  assignmentId!: string;
}
