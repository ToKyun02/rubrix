import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { ListSubmissionsQueryDto } from './dtos/list-submissions-query.dto';
import { SubmissionService } from './submission.service';

@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get()
  findAll(@Query() query: ListSubmissionsQueryDto, @Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.findAllByAssignment(
      req.user.sub,
      query.assignmentId,
    );
  }

  @Get('stats')
  stats(@Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.getStats(req.user.sub);
  }

  @Get('summary')
  summary(@Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.getSummary(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.findOne(req.user.sub, id);
  }

  @Post()
  create(@Body() dto: CreateSubmissionDto, @Req() req: Request) {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.create(req.user.sub, dto.pullRequestId);
  }
}
