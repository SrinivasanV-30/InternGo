-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ResolvedStatus" AS ENUM ('PENDING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Recepient" AS ENUM ('Mentors', 'Admins');

-- CreateTable
CREATE TABLE "HelpDesk" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resolvedStatus" "ResolvedStatus" NOT NULL,
    "priority" "Priority" NOT NULL,
    "recepient" "Recepient" NOT NULL,
    "recepientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpDesk_pkey" PRIMARY KEY ("id")
);
