import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GithubAppModule } from '../github-app/github-app.module';
import { PullRequestModule } from '../pull-request/pull-request.module';
import { RepoController } from './repo.controller';
import { RepoService } from './repo.service';

@Module({
  imports: [AuthModule, GithubAppModule, PullRequestModule],
  providers: [RepoService],
  controllers: [RepoController],
})
export class RepoModule {}
