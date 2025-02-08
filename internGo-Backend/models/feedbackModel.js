import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js"; 

const prisma=new PrismaClient();

export const createFeedback = async (feedbackData) => {
    try {
        return await prisma.feedbacks.create({
            data: feedbackData,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getFeedbackByInteraction = async (interactionId) => {
    try {
        return await prisma.feedbacks.findMany({
            where: { interactionId },
            include: {
                intern: { select: { name: true, email: true } },
                interviewer: { select: { name: true, email: true } },
                interaction: true,
            },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getFeedbackByIntern = async (internId) => {
    try {
        return await prisma.feedbacks.findMany({
            where: { internId },
            include: { interaction: true },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const updateFeedback = async (id, updatedData) => {
    try {
        return await prisma.feedbacks.update({
            where: { id },
            data: updatedData,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteFeedback = async (id) => {
    try {
        return await prisma.feedbacks.delete({
            where: { id },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};
