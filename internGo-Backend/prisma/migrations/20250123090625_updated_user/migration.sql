/*
  Warnings:

  - The values [LEAVE] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `asset_number` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `leaves` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalEmail]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `education` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ACTIVE', 'NOT_ACTIVE', 'EXAMINATION', 'SHADOWING', 'DEPLOYED');
ALTER TABLE "Users" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "asset_number",
DROP COLUMN "leaves",
ADD COLUMN     "assetId" INTEGER,
ADD COLUMN     "bankDetails" JSONB,
ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "permanentAddress" TEXT,
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "profilePercentage" INTEGER,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Assets" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assetType" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "givenOn" TIMESTAMP(3) NOT NULL,
    "returnedOn" TIMESTAMP(3),

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_personalEmail_key" ON "Users"("personalEmail");

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
