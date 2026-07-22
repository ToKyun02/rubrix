import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface GithubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GithubProfile {
  id: number;
  login: string;
  avatar_url: string;
  email: string | null;
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async exchangeCodeForToken(code: string): Promise<string> {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.get('GITHUB_CLIENT_ID'),
        client_secret: this.config.get('GITHUB_CLIENT_SECRET'),
        code,
      }),
    });

    const data = (await res.json()) as GithubTokenResponse;

    if (!data.access_token) {
      throw new UnauthorizedException(
        data.error_description ?? 'GitHub 인증에 실패했습니다.',
      );
    }
    return data.access_token;
  }

  async getGithubProfile(accessToken: string): Promise<GithubProfile> {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      throw new UnauthorizedException('GitHub 프로필 조회에 실패했습니다.');
    }
    return res.json() as Promise<GithubProfile>;
  }

  async getPrimaryEmail(accessToken: string): Promise<string | null> {
    const res = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) return null;

    const emails = (await res.json()) as GithubEmail[];
    const primary = emails.find((e) => e.primary && e.verified);
    return primary?.email ?? null;
  }

  async upsertUser(profile: GithubProfile, email: string | null) {
    const resolvedEmail = profile.email ?? email;
    return this.prisma.user.upsert({
      where: { githubId: profile.id },
      update: {
        username: profile.login,
        avatarUrl: profile.avatar_url,
        email: resolvedEmail,
      },
      create: {
        githubId: profile.id,
        username: profile.login,
        avatarUrl: profile.avatar_url,
        email: resolvedEmail,
      },
    });
  }

  async loginWithGithub(code: string) {
    const accessToken = await this.exchangeCodeForToken(code);
    const profile = await this.getGithubProfile(accessToken);
    const email = await this.getPrimaryEmail(accessToken);
    const user = await this.upsertUser(profile, email);
    const token = this.generateJwt(user);
    return { user, token };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  generateJwt(user: { id: string }) {
    return this.jwt.sign({ sub: user.id });
  }
}
