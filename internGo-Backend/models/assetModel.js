import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createAsset = async (data) => {
    try {
        return await prisma.assets.create({
            data: data,
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getAssetById = async (id) => {
    try {
        return await prisma.assets.findUnique({
            where: {
                id: id,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
export const getAssetByUserId = async (userId) => {
    try {
        return await prisma.assets.findMany({
            where: {
                userId: userId,
            },
        });
        return assets;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const updateAsset = async (id, data) => {
    try {
        return await prisma.assets.update({
            where: {
                id: id,
            },
            data: data,
        });
    
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
