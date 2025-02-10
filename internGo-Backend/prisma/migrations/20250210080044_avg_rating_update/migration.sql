/*
  Warnings:

  - Added the required column `avg_rating` to the `Feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedbacks" ADD COLUMN     "avg_rating" DOUBLE PRECISION NOT NULL;
