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
import { ApiCookieAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { ListSubmissionsQueryDto } from './dtos/list-submissions-query.dto';
import {
  SubmissionDetailResponseDto,
  SubmissionListItemResponseDto,
  SubmissionResponseDto,
  SubmissionStatsResponseDto,
  SubmissionSummaryItemResponseDto,
} from './dtos/submission-response.dto';
import { SubmissionService } from './submission.service';

@ApiTags('submissions')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get()
  findAll(
    @Query() query: ListSubmissionsQueryDto,
    @Req() req: Request,
  ): Promise<SubmissionListItemResponseDto[]> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.findAllByAssignment(
      req.user.sub,
      query.assignmentId,
    );
  }

  @Get('stats')
  stats(@Req() req: Request): Promise<SubmissionStatsResponseDto> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.getStats(req.user.sub);
  }

  @Get('summary')
  summary(@Req() req: Request): Promise<SubmissionSummaryItemResponseDto[]> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.getSummary(req.user.sub);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<SubmissionDetailResponseDto> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.findOne(req.user.sub, id);
  }

  @Post()
  create(
    @Body() dto: CreateSubmissionDto,
    @Req() req: Request,
  ): Promise<SubmissionResponseDto> {
    if (req.user == null) {
      throw new UnauthorizedException();
    }
    return this.submissionService.create(req.user.sub, dto.pullRequestId);
  }
}
