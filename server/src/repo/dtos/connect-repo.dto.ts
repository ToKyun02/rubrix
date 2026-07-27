import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectRepoDto {
  @IsString()
  @IsNotEmpty()
  assignmentId!: string;

  @IsString()
  @IsNotEmpty()
  githubFullName!: string;
}
