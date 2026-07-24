import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [AuthModule],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
