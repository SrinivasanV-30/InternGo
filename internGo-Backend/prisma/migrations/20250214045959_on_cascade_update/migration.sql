-- DropForeignKey
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyUpdateTasks" DROP CONSTRAINT "DailyUpdateTasks_dailyUpdateId_fkey";

-- DropForeignKey
ALTER TABLE "DailyUpdates" DROP CONSTRAINT "DailyUpdates_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUpdates" ADD CONSTRAINT "DailyUpdates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUpdateTasks" ADD CONSTRAINT "DailyUpdateTasks_dailyUpdateId_fkey" FOREIGN KEY ("dailyUpdateId") REFERENCES "DailyUpdates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
