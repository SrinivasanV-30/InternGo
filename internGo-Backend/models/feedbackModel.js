import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const calculateAvgRating = (ratings) => {
    const scores = Object.values(ratings);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

export const calculateOverallRating = (ratings) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating , 0) * 2 / ratings.length;
}


export const createFeedback = async (feedbackData) => {
    try {
        return await prisma.feedbacks.create({
            data: feedbackData
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getFeedbackByInteraction = async (interactionId) => {
    try {
        return await prisma.feedbacks.findMany({
            where: { interactionId: interactionId },
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
            where: { internId: internId },
            include: {
                interaction: true,
                intern: {
                    select: {
                        name: true,
                        zone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getFeedbackRatingsByIntern = async (internId) => {
    try {
        const feedbacks = await prisma.feedbacks.findMany({
            where: { internId: internId },
            select: { avg_rating: true },
        })
        // console.log(feedbacks)
        return feedbacks.map((result) => result.avg_rating);
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const updateFeedback = async (id, updatedData) => {
    try {
        return await prisma.feedbacks.update({
            where: { id: id },
            data: updatedData,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteFeedback = async (id) => {
    try {
        return await prisma.feedbacks.delete({ where: { id } });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};
