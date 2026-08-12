import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ACCESS_TOKEN_TTL_MS } from './auth.constants';
import { AuthService } from './auth.service';
import { LogoutResponseDto, UserResponseDto } from './dtos/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('me')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<UserResponseDto> {
    return this.authService.getUserById(req.user!.sub);
  }

  @Get('github/callback')
  @ApiQuery({ name: 'code', required: false, description: 'GitHub 인가 코드' })
  @ApiQuery({ name: 'error', required: false, description: '인가 실패 사유' })
  @ApiResponse({
    status: 302,
    description: '성공 시 과제 목록으로, 실패 시 로그인 페이지로 리다이렉트',
  })
  async githubCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ): Promise<void> {
    const clientUrl = this.config.get('CLIENT_URL');

    if (error) return res.redirect(`${clientUrl}/login?error=${error}`);
    if (!code) return res.redirect(`${clientUrl}/login?error=no_code`);

    const { token } = await this.authService.loginWithGithub(code);

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      maxAge: ACCESS_TOKEN_TTL_MS,
    });

    return res.redirect(`${clientUrl}/assignments`);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): LogoutResponseDto {
    res.clearCookie('access_token');
    return { success: true };
  }
}
