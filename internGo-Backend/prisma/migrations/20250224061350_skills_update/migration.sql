/*
  Warnings:

  - You are about to drop the column `skills` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "skills",
ADD COLUMN     "primary_skill" TEXT,
ADD COLUMN     "secondary_skills" TEXT[];
