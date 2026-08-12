import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConnectRepoDto } from './dtos/connect-repo.dto';
import {
  RepoPullRequestResponseDto,
  RepoResponseDto,
} from './dtos/repo-response.dto';
import { RepoService } from './repo.service';

@ApiTags('repos')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('repos')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':assignmentId')
  @ApiParam({ name: 'assignmentId', format: 'uuid' })
  @ApiOkResponse({
    description: '연결된 레포지토리가 없으면 null을 반환합니다.',
    schema: {
      nullable: true,
      allOf: [{ $ref: getSchemaPath(RepoResponseDto) }],
    },
  })
  findOne(
    @Param('assignmentId') assignmentId: string,
    @Req() req: Request,
  ): Promise<RepoResponseDto | null> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.repoService.findByUserAndAssignment(req.user.sub, assignmentId);
  }

  @Get(':assignmentId/pull-requests')
  @ApiParam({ name: 'assignmentId', format: 'uuid' })
  listPullRequests(
    @Param('assignmentId') assignmentId: string,
    @Req() req: Request,
  ): Promise<RepoPullRequestResponseDto[]> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }

    return this.repoService.listPullRequests(req.user.sub, assignmentId);
  }

  @Post()
  connect(
    @Body() dto: ConnectRepoDto,
    @Req() req: Request,
  ): Promise<RepoResponseDto> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.repoService.connect(req.user.sub, dto);
  }
}
