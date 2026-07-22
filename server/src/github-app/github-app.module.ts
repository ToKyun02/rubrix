import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GithubAppController } from './github-app.controller';
import { GithubAppService } from './github-app.service';

@Module({
  imports: [AuthModule],
  controllers: [GithubAppController],
  providers: [GithubAppService],
})
export class GithubAppModule {}
