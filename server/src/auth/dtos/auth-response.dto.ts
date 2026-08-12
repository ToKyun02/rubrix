import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/enums';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  githubId!: number;

  username!: string;

  @ApiProperty({ type: String, nullable: true })
  email!: string | null;

  @ApiProperty({ type: String, nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role!: Role;

  createdAt!: Date;
  updatedAt!: Date;
}

export class LogoutResponseDto {
  success!: boolean;
}
