/*
  Warnings:

  - A unique constraint covering the columns `[interactionId]` on the table `Feedbacks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Feedbacks_interactionId_key" ON "Feedbacks"("interactionId");
