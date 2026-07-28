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
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConnectRepoDto } from './dtos/connect-repo.dto';
import { RepoService } from './repo.service';

@UseGuards(JwtAuthGuard)
@Controller('repos')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':assignmentId')
  findOne(@Param('assignmentId') assignmentId: string, @Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.repoService.findByUserAndAssignment(req.user.sub, assignmentId);
  }

  @Get(':assignmentId/pull-requests')
  listPullRequests(
    @Param('assignmentId') assignmentId: string,
    @Req() req: Request,
  ) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }

    return this.repoService.listPullRequests(req.user.sub, assignmentId);
  }

  @Post()
  connect(@Body() dto: ConnectRepoDto, @Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.repoService.connect(req.user.sub, dto);
  }
}
