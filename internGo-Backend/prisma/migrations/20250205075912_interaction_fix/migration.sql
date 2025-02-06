/*
  Warnings:

  - Added the required column `internEmail` to the `Interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interactions" ADD COLUMN     "internEmail" TEXT NOT NULL;
