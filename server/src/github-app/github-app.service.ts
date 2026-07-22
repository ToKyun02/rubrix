import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

interface GithubInstallationResponse {
  account: { login: string };
}

@Injectable()
export class GithubAppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private generateAppJwt(): string {
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
      {
        iat: now - 60,
        exp: now + 9 * 60,
        iss: this.config.getOrThrow<string>('GITHUB_APP_ID'),
      },
      this.config.getOrThrow<string>('GITHUB_APP_PRIVATE_KEY'),
      { algorithm: 'RS256' },
    );
  }

  async getInstallationAccountLogin(installationId: number): Promise<string> {
    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}`,
      {
        headers: {
          Authorization: `Bearer ${this.generateAppJwt()}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );

    const data = (await res.json()) as GithubInstallationResponse;
    return data.account.login;
  }

  async saveInstallation(installationId: number, userId: string) {
    const accountLogin = await this.getInstallationAccountLogin(installationId);

    return this.prisma.githubInstallation.upsert({
      where: { userId },
      update: { installationId, accountLogin },
      create: { installationId, accountLogin, userId },
    });
  }

  async getInstallationByUserId(userId: string) {
    return this.prisma.githubInstallation.findUnique({ where: { userId } });
  }
}
