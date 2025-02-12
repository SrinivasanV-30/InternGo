/*
  Warnings:

  - Added the required column `senderId` to the `HelpDesk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `HelpDesk` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HelpStatus" AS ENUM ('PENDING', 'RESOLVED');

-- AlterTable
ALTER TABLE "HelpDesk" ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "status" "HelpStatus" NOT NULL;

-- CreateTable
CREATE TABLE "_HelpDeskMentors" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HelpDeskMentors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HelpDeskAdmins" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HelpDeskAdmins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HelpDeskMentors_B_index" ON "_HelpDeskMentors"("B");

-- CreateIndex
CREATE INDEX "_HelpDeskAdmins_B_index" ON "_HelpDeskAdmins"("B");

-- AddForeignKey
ALTER TABLE "HelpDesk" ADD CONSTRAINT "HelpDesk_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HelpDeskMentors" ADD CONSTRAINT "_HelpDeskMentors_A_fkey" FOREIGN KEY ("A") REFERENCES "HelpDesk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HelpDeskMentors" ADD CONSTRAINT "_HelpDeskMentors_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HelpDeskAdmins" ADD CONSTRAINT "_HelpDeskAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "HelpDesk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HelpDeskAdmins" ADD CONSTRAINT "_HelpDeskAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
