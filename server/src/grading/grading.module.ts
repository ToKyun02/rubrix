import { Module } from '@nestjs/common';
import { GithubAppModule } from '../github-app/github-app.module';
import { AiService } from './ai.service';
import { GradingService } from './grading.service';

@Module({
  imports: [GithubAppModule],
  providers: [AiService, GradingService],
  exports: [GradingService],
})
export class GradingModule {}
