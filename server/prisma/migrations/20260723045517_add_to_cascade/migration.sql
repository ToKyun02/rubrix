-- DropForeignKey
ALTER TABLE "RubricItem" DROP CONSTRAINT "RubricItem_assignmentId_fkey";

-- AddForeignKey
ALTER TABLE "RubricItem" ADD CONSTRAINT "RubricItem_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
