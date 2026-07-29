import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PullRequestModule } from '../pull-request/pull-request.module';
import { GithubAppController } from './github-app.controller';
import { GithubAppService } from './github-app.service';

@Module({
  imports: [AuthModule, PullRequestModule],
  controllers: [GithubAppController],
  providers: [GithubAppService],
  exports: [GithubAppService],
})
export class GithubAppModule {}
