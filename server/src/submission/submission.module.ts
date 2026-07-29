import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GradingModule } from '../grading/grading.module';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [AuthModule, GradingModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
