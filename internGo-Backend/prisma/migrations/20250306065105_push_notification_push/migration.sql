/*
  Warnings:

  - The `fcmToken` column on the `pushNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pushNotification" DROP COLUMN "fcmToken",
ADD COLUMN     "fcmToken" TEXT[];
