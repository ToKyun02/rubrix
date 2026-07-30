import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssignmentModule } from './assignment/assignment.module';
import { AuthModule } from './auth/auth.module';
import { GithubAppModule } from './github-app/github-app.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { RepoModule } from './repo/repo.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GithubAppModule,
    PrismaModule,
    AssignmentModule,
    RepoModule,
    SubmissionModule,
    HealthModule,
  ],
})
export class AppModule {}
