-- CreateTable
CREATE TABLE "Feedbacks" (
    "id" SERIAL NOT NULL,
    "interactionId" INTEGER NOT NULL,
    "internId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "ratings" JSONB NOT NULL,
    "descriptive_feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
