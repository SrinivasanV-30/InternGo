/*
  Warnings:

  - Added the required column `mentorId` to the `Milestones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Milestones" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "learning_resources" TEXT[],
ADD COLUMN     "mentorId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Milestones" ADD CONSTRAINT "Milestones_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
