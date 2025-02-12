import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getPlans = async () => {
    try {
        return await prisma.plans.findMany();
        
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getPlanByName = async (name) => {
    try {
        return await prisma.plans.findFirst({
            where: {
                name: name,
            },
        });
        
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getPlanById = async (planId) => {
    try {
        return await prisma.plans.findUnique({
            where: {
                id: planId,
            },
            include: {
                milestones: {
                    orderBy:{
                        createdAt:"asc"
                    },
                    include: {
                        objectives: {
                            orderBy:{
                            createdAt:"asc"
                            },
                        },
                    },
                },
                users: {
                    select: {
                        id:true,
                        name: true,
                        profilePhoto: true,
                        email: true,
                        batch: true,
                        year: true,
                        designation: true,
                        status: true,
                        employeeId: true,
                    }
                },
            },
        });

        
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createPlans = async (planData) => {
    try {
        return await prisma.plans.create({
            data: planData,
        });
         
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
export const updatePlans = async (planId, planData) => {
    try {
        return await prisma.plans.update({
            where: {
                id: planId,
            },
            data: planData,
        });
        return
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const deletePlans = async (planId) => {
    try {
        await prisma.plans.delete({
            where: {
                id: planId,
            },
        });
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
