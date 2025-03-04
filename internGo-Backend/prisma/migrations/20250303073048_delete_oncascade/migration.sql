-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_interviewerId_fkey";

-- DropForeignKey
ALTER TABLE "Interactions" DROP CONSTRAINT "Interactions_interviewerId_fkey";

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
