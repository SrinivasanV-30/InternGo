-- CreateTable
CREATE TABLE "pushNotification" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pushNotification_pkey" PRIMARY KEY ("id")
);
