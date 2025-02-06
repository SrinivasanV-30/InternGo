/*
  Warnings:

  - Added the required column `duration` to the `Interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interactionStatus` to the `Interactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InteractionStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Interactions" ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "interactionStatus" "InteractionStatus" NOT NULL;
