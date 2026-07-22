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
import type { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GithubAppService } from './github-app.service';

@Controller('github-app')
export class GithubAppController {
  constructor(
    private readonly githubAppService: GithubAppService,
    private readonly config: ConfigService,
  ) {}

  @Get('callback')
  @UseGuards(JwtAuthGuard)
  async callback(
    @Query('installation_id') installationId: string,
    @Query('setup_action') setupAction: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const clientUrl = this.config.get('CLIENT_URL');

    if (setupAction !== 'install' && setupAction !== 'update') {
      return res.redirect(`${clientUrl}?github_app=cancelled`);
    }

    try {
      await this.githubAppService.saveInstallation(
        Number(installationId),
        req.user!.sub,
      );
    } catch {
      return res.redirect(`${clientUrl}?github_app=error`);
    }

    return res.redirect(`${clientUrl}?github_app=connected`);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: Request) {
    const installation = await this.githubAppService.getInstallationByUserId(
      req.user!.sub,
    );

    return {
      connected: !!installation,
      accountLogin: installation?.accountLogin ?? null,
    };
  }

  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
  ) {
    const isValid = this.githubAppService.verifyWebhookSignature(
      req.rawBody!,
      signature,
    );
    if (!isValid) throw new UnauthorizedException();

    if (event === 'installation' && req.body.action === 'deleted') {
      await this.githubAppService.deleteInstallation(
        req.body.installation.id,
      );
    }

    return { received: true };
  }
}
