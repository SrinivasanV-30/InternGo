import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
const prisma = new PrismaClient();

export const getPlans = async () => {
    try {
        return await prisma.plans.findMany({
            include: {
                objectives: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                users: true,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getMilestoneByName = async (name) => {
    try {
        return await prisma.milestones.findFirst({
            where: {
                name: name,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getMilestoneById = async (id) => {
    try {
        // console.log(id);
        return await prisma.milestones.findUnique({
            where: {
                id: id,
            },
            include: {
                objectives: true,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createMilestones = async (milestoneData) => {
    try {
        return await prisma.milestones.create({
            data: milestoneData,
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
export const updateMilestones = async (milestoneId, milestoneData) => {
    try {
        return await prisma.milestones.update({
            where: {
                id: milestoneId,
            },
            data: milestoneData,
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const deleteMilestones = async (milestoneId) => {
    try {
        await prisma.milestones.delete({
            where: {
                id: milestoneId,
            },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
