/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `pushNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pushNotification_userId_key" ON "pushNotification"("userId");
