/*
  Warnings:

  - A unique constraint covering the columns `[userId,assignmentId]` on the table `Repo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repo_userId_assignmentId_key" ON "Repo"("userId", "assignmentId");
