import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createHelpDesk = async (helpDeskData) => {
    try {
        return await prisma.helpDesk.create({
            data: helpDeskData,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getHelpDeskByClause = async (whereClause) => {
    try {
        return await prisma.helpDesk.findMany({
            where: whereClause,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getAllHelpDesks = async () => {
    try {
        return await prisma.helpDesk.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getAllPendingHelpDesks = async () => {
    try {
        return await prisma.helpDesk.findMany({
            where:{
                resolvedStatus:"PENDING"
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const updateHelpDesk = async (id, updatedData) => {
    try {
        return await prisma.helpDesk.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteHelpDesk = async (id) => {
    try {
        return await prisma.helpDesk.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};
