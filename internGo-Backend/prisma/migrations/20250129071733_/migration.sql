/*
  Warnings:

  - You are about to drop the column `mentorName` on the `Objectives` table. All the data in the column will be lost.
  - You are about to drop the column `noOfDays` on the `Objectives` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Objectives` table. All the data in the column will be lost.
  - You are about to drop the column `noOfDays` on the `Plans` table. All the data in the column will be lost.
  - Added the required column `milestoneId` to the `Objectives` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectiveDays` to the `Objectives` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `roadmapType` on the `Objectives` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `planDays` to the `Plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoadmapType" AS ENUM ('DEFAULT', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "Objectives" DROP CONSTRAINT "Objectives_planId_fkey";

-- AlterTable
ALTER TABLE "Objectives" DROP COLUMN "mentorName",
DROP COLUMN "noOfDays",
DROP COLUMN "planId",
ADD COLUMN     "milestoneId" INTEGER NOT NULL,
ADD COLUMN     "objectiveDays" INTEGER NOT NULL,
DROP COLUMN "roadmapType",
ADD COLUMN     "roadmapType" "RoadmapType" NOT NULL;

-- AlterTable
ALTER TABLE "Plans" DROP COLUMN "noOfDays",
ADD COLUMN     "planDays" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Milestones" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "milestoneDays" INTEGER NOT NULL,
    "mentorName" TEXT NOT NULL,

    CONSTRAINT "Milestones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Milestones" ADD CONSTRAINT "Milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectives" ADD CONSTRAINT "Objectives_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
