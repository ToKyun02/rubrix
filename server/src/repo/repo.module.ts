import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RepoController } from './repo.controller';
import { RepoService } from './repo.service';

@Module({
  imports: [AuthModule],
  providers: [RepoService],
  controllers: [RepoController],
})
export class RepoModule {}
