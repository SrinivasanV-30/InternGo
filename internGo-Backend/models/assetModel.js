import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createAsset = async (data) => {
    try {
        const newAsset = await prisma.assets.create({
            data: data,
        });
        return newAsset;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getAssetById = async (id) => {
    try {
        const asset = await prisma.assets.findUnique({
            where: {
                id: id,
            },
        });
        return asset;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
export const getAssetByUserId = async (userId) => {
    try {
        const assets = await prisma.assets.findMany({
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
        const updatedAsset = await prisma.assets.update({
            where: {
                id: id,
            },
            data: data,
        });
        return updatedAsset;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
