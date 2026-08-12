import type { RawBodyRequest } from '@nestjs/common';
import {
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PullRequestService } from '../pull-request/pull-request.service';
import {
  GithubAppStatusResponseDto,
  GithubAppWebhookResponseDto,
} from './dtos/github-app-response.dto';
import { GithubAppService } from './github-app.service';

@ApiTags('github-app')
@Controller('github-app')
export class GithubAppController {
  constructor(
    private readonly githubAppService: GithubAppService,
    private readonly pullRequestService: PullRequestService,
    private readonly config: ConfigService,
  ) {}

  @Get('callback')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'installation_id', description: 'GitHub 설치 ID' })
  @ApiQuery({
    name: 'setup_action',
    description: 'install / update 이외의 값은 취소로 처리됩니다.',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    description: '설치를 시작한 과제 ID. 리다이렉트 대상 결정에 사용됩니다.',
  })
  @ApiResponse({
    status: 302,
    description:
      'github_app=connected | cancelled | error 쿼리와 함께 클라이언트로 리다이렉트',
  })
  async callback(
    @Query('installation_id') installationId: string,
    @Query('setup_action') setupAction: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const clientUrl = this.config.get('CLIENT_URL');
    const redirectBase = state
      ? `${clientUrl}/assignments/${state}`
      : clientUrl;

    if (setupAction !== 'install' && setupAction !== 'update') {
      return res.redirect(`${redirectBase}?github_app=cancelled`);
    }

    try {
      await this.githubAppService.saveInstallation(
        Number(installationId),
        req.user!.sub,
      );
    } catch {
      return res.redirect(`${redirectBase}?github_app=error`);
    }

    return res.redirect(`${redirectBase}?github_app=connected`);
  }

  @Get('status')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: Request): Promise<GithubAppStatusResponseDto> {
    const installation = await this.githubAppService.getInstallationByUserId(
      req.user!.sub,
    );

    return {
      connected: !!installation,
      accountLogin: installation?.accountLogin ?? null,
    };
  }

  @Post('webhook')
  @ApiHeader({
    name: 'x-hub-signature-256',
    description: 'HMAC SHA-256 서명',
    required: true,
  })
  @ApiHeader({
    name: 'x-github-event',
    description: '이벤트 종류 (installation, pull_request 등)',
    required: true,
  })
  @ApiBody({
    description: 'GitHub 웹훅 페이로드 (이벤트 종류에 따라 형태가 다릅니다)',
    schema: { type: 'object', additionalProperties: true },
  })
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
  ): Promise<GithubAppWebhookResponseDto> {
    const isValid = this.githubAppService.verifyWebhookSignature(
      req.rawBody!,
      signature,
    );
    if (!isValid) throw new UnauthorizedException();

    if (event === 'installation' && req.body.action === 'deleted') {
      await this.githubAppService.deleteInstallation(req.body.installation.id);
    }

    if (
      event === 'pull_request' &&
      (req.body.action === 'opened' || req.body.action === 'reopened')
    ) {
      await this.pullRequestService.recordPullRequest(req.body);
    }

    return { received: true };
  }

  @Get('repos')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [String],
    description: 'owner/repo 형식의 문자열 배열. 미연동이면 빈 배열',
  })
  async repos(@Req() req: Request): Promise<string[]> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    const installation = await this.githubAppService.getInstallationByUserId(
      req.user.sub,
    );

    if (!installation) {
      return [];
    }

    return this.githubAppService.listInstallationRepos(
      installation.installationId,
    );
  }
}
