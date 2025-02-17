/*
  Warnings:

  - Added the required column `senderName` to the `HelpDesk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HelpDesk" ADD COLUMN     "senderName" TEXT NOT NULL;
