import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignmentService } from './assignment.service';
import {
  AssignmentDetailResponseDto,
  AssignmentResponseDto,
  PaginatedAssignmentsResponseDto,
} from './dtos/assignment-response.dto';
import { CreateAssignmentDto } from './dtos/create-assignment.dto';
import { QueryDto } from './dtos/query.dto';
import { UpdateAssignmentDto } from './dtos/update-assignment.dto';

@ApiTags('admin/assignments')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/assignments')
export class AdminAssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  findAll(@Query() query: QueryDto): Promise<PaginatedAssignmentsResponseDto> {
    return this.assignmentService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: '해당 ID의 과제가 없으면 null을 반환합니다.',
    schema: {
      nullable: true,
      allOf: [{ $ref: getSchemaPath(AssignmentDetailResponseDto) }],
    },
  })
  findOne(
    @Param('id') id: string,
  ): Promise<AssignmentDetailResponseDto | null> {
    return this.assignmentService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateAssignmentDto,
  ): Promise<AssignmentDetailResponseDto> {
    return this.assignmentService.create(dto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
  ): Promise<AssignmentDetailResponseDto> {
    return this.assignmentService.update(id, dto);
  }

  @Patch(':id/publish')
  @ApiParam({ name: 'id', format: 'uuid' })
  publish(@Param('id') id: string): Promise<AssignmentResponseDto> {
    return this.assignmentService.publish(id);
  }

  @Patch(':id/unpublish')
  @ApiParam({ name: 'id', format: 'uuid' })
  unpublish(@Param('id') id: string): Promise<AssignmentResponseDto> {
    return this.assignmentService.unpublish(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id') id: string): Promise<AssignmentResponseDto> {
    return this.assignmentService.remove(id);
  }
}
