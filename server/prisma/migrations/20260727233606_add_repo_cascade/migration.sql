-- DropForeignKey
ALTER TABLE "Repo" DROP CONSTRAINT "Repo_assignmentId_fkey";

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
