-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "HelpDesk" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpDesk_pkey" PRIMARY KEY ("id")
);
