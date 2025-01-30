/*
  Warnings:

  - Added the required column `updatedAt` to the `DailyUpdates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DailyUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskProgress" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "DailyUpdates" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DailyUpdateTasks" (
    "id" SERIAL NOT NULL,
    "dailyUpdateId" INTEGER NOT NULL,
    "taskName" TEXT NOT NULL,
    "activitiesPlanned" TEXT NOT NULL,
    "activitiesCompleted" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "actualTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyUpdateTasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyUpdates" ADD CONSTRAINT "DailyUpdates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUpdateTasks" ADD CONSTRAINT "DailyUpdateTasks_dailyUpdateId_fkey" FOREIGN KEY ("dailyUpdateId") REFERENCES "DailyUpdates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
