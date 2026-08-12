import { ApiProperty } from '@nestjs/swagger';

export class GithubAppStatusResponseDto {
  connected!: boolean;

  @ApiProperty({ type: String, nullable: true })
  accountLogin!: string | null;
}

export class GithubAppWebhookResponseDto {
  received!: boolean;
}
