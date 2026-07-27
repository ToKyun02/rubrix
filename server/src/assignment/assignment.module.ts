import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminAssignmentController } from './admin-assignment.controller';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [AuthModule],
  providers: [AssignmentService],
  controllers: [AssignmentController, AdminAssignmentController],
})
export class AssignmentModule {}
