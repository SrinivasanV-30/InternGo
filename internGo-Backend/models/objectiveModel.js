import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getObjectiveByName = async (name) => {
    try {
        const objective = await prisma.objectives.findFirst({
            where: {
                name: name,
            },
        });
        return objective;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getObjectiveById = async (id) => {
    try {
        const objective = await prisma.objectives.findUnique({
            where: {
                id: id,
            },
        });
        return objective;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createObjective = async (objectivesData) => {
    try {
        const createdObjectives = await prisma.objectives.create({
            data: objectivesData,
        });
        return createdObjectives;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createObjectives = async (objectivesData) => {
    try {
        const createdObjectives = await prisma.objectives.createManyAndReturn({
            data: objectivesData,
        });
        return createdObjectives;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};


export const updateObjectives = async (objectiveId, objectivesData) => {
    try {
        const updatedObjectives = await prisma.objectives.update({
            where: {
                id: objectiveId,
            },
            data: objectivesData,
        });
        return updatedObjectives;
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
