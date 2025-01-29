-- DropForeignKey
ALTER TABLE "Milestones" DROP CONSTRAINT "Milestones_planId_fkey";

-- DropForeignKey
ALTER TABLE "Objectives" DROP CONSTRAINT "Objectives_milestoneId_fkey";

-- CreateTable
CREATE TABLE "DailyUpdates" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "DailyUpdates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Milestones" ADD CONSTRAINT "Milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectives" ADD CONSTRAINT "Objectives_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
