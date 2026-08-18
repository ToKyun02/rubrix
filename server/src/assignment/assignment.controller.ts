import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignmentService } from './assignment.service';
import {
  AssignmentDetailResponseDto,
  PaginatedAssignmentsResponseDto,
} from './dtos/assignment-response.dto';
import { QueryDto } from './dtos/query.dto';

@ApiTags('assignments')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  findAll(@Query() query: QueryDto): Promise<PaginatedAssignmentsResponseDto> {
    return this.assignmentService.findPublished(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AssignmentDetailResponseDto })
  @ApiNotFoundResponse({ description: '해당 ID의 과제가 없습니다.' })
  findOne(@Param('id') id: string): Promise<AssignmentDetailResponseDto> {
    return this.assignmentService.findOne(id);
  }
}
