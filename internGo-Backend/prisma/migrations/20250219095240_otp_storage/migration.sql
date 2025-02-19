-- CreateTable
CREATE TABLE "otpStorage" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otpStorage_pkey" PRIMARY KEY ("id")
);
