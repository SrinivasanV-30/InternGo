/*
  Warnings:

  - You are about to drop the `HelpDesk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HelpDeskAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HelpDeskMentors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HelpDesk" DROP CONSTRAINT "HelpDesk_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_HelpDeskAdmins" DROP CONSTRAINT "_HelpDeskAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_HelpDeskAdmins" DROP CONSTRAINT "_HelpDeskAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_HelpDeskMentors" DROP CONSTRAINT "_HelpDeskMentors_A_fkey";

-- DropForeignKey
ALTER TABLE "_HelpDeskMentors" DROP CONSTRAINT "_HelpDeskMentors_B_fkey";

-- DropTable
DROP TABLE "HelpDesk";

-- DropTable
DROP TABLE "_HelpDeskAdmins";

-- DropTable
DROP TABLE "_HelpDeskMentors";

-- DropEnum
DROP TYPE "HelpStatus";

-- DropEnum
DROP TYPE "Priority";
