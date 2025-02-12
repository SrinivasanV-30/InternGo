import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getObjectiveByName = async (name) => {
    try {
        return await prisma.objectives.findFirst({
            where: {
                name: name,
            },
        });
       
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getObjectiveById = async (id) => {
    try {
        return await prisma.objectives.findUnique({
            where: {
                id: id,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createObjective = async (objectivesData) => {
    try {
        return await prisma.objectives.create({
            data: objectivesData,
        });

    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createObjectives = async (objectivesData) => {
    try {
        return await prisma.objectives.createManyAndReturn({
            data: objectivesData,
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};


export const updateObjectives = async (objectiveId, objectivesData) => {
    try {
        return await prisma.objectives.update({
            where: {
                id: objectiveId,
            },
            data: objectivesData,
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const deleteObjectives = async (objectiveId) => {
    try {
        await prisma.objectives.delete({
            where: {
                id: objectiveId,
            },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
