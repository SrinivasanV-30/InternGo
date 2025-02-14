-- AlterEnum
ALTER TYPE "InteractionStatus" ADD VALUE 'FEEDBACK_PENDING';

-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_internId_fkey";

-- DropForeignKey
ALTER TABLE "Interactions" DROP CONSTRAINT "Interactions_internId_fkey";

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
