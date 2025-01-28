/*
  Warnings:

  - Added the required column `roadmapType` to the `Objectives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Objectives" ADD COLUMN     "roadmapType" TEXT NOT NULL;
