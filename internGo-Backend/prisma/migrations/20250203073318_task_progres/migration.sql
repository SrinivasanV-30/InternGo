/*
  Warnings:

  - Added the required column `taskProgress` to the `DailyUpdateTasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyUpdateTasks" ADD COLUMN     "taskProgress" "TaskProgress" NOT NULL;
