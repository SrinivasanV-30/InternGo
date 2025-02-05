-- CreateTable
CREATE TABLE "Interactions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "assignedIntern" TEXT NOT NULL,
    "assignedMentor" TEXT NOT NULL,
    "assignedInterviewer" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interactions" ADD CONSTRAINT "Interactions_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
