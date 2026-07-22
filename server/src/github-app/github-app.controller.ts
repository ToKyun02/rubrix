import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
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

    await this.githubAppService.saveInstallation(
      Number(installationId),
      req.user!.sub,
    );

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
}
