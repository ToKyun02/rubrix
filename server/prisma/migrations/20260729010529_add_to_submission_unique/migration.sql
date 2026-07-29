/*
  Warnings:

  - A unique constraint covering the columns `[userId,pullRequestId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submission_userId_pullRequestId_key" ON "Submission"("userId", "pullRequestId");
