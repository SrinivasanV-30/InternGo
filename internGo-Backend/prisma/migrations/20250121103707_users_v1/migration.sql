-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'LEAVE', 'EXAMINATION', 'SHADOWING', 'DEPLOYED');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "asset_number" INTEGER,
ADD COLUMN     "certification_status" BOOLEAN,
ADD COLUMN     "leaves" INTEGER,
ADD COLUMN     "status" "Status";
