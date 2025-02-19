import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createOtpRecord = async (otpData) => {
    try {
        return await prisma.otpStorage.create({
            data: otpData,
        });
    } catch (error) {
        logger.error(`Error creating OTP record: ${error.message}`);
        throw new Error("Failed to create OTP record");
    }
};

export const getOtpByEmail = async (email) => {
    try {
        return await prisma.otpStorage.findFirst({
            where: { email: email },
        });
    } catch (error) {
        logger.error(`Error fetching OTP record by email: ${error.message}`);
        throw new Error("Failed to fetch OTP record by email");
    }
};


export const deleteOtpRecord = async (email) => {
    try {
        return await prisma.otpStorage.deleteMany({
            where: { email: email },
        });
    } catch (error) {
        logger.error(`Error deleting OTP record: ${error.message}`);
        throw new Error("Failed to delete OTP record");
    }
};
