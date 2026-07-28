import { Module } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';

@Module({
  providers: [PullRequestService],
  exports: [PullRequestModule],
})
export class PullRequestModule {}
