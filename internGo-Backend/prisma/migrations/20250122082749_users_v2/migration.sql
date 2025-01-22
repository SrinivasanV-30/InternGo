/*
  Warnings:

  - You are about to drop the column `certification_status` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "certification_status",
ADD COLUMN     "certificates_submission_status" BOOLEAN,
ADD COLUMN     "education" TEXT[],
ADD COLUMN     "phone_no" INTEGER;
