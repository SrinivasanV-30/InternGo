import { PrismaClient } from "@prisma/client";
import { updateAsset } from "./assetModel";

const prisma = new PrismaClient();

export const getDailyUpdateByDate = async (date) => {
    try {
        const allDailyUpdates = await prisma.dailyUpdates.findMany({
            where: {
                date: date,
            },
            include: {
                tasks: true,
            },
        });
        return allDailyUpdates;
    } catch (error) { 
        logger.error(error.message);
        throw new Error(error);
        
    }
};

export const getDailyUpdateByUserId = async (userId) => {
    try {
        const allDailyUpdates = await prisma.dailyUpdates.findMany({
            where: {
                userId:userId,
            },
            include: {
                tasks: true,
            },
        });
        return allDailyUpdates;
    } catch (error) { 
        logger.error(error.message);
        throw new Error(error);
        
    }
};

export const createDailyUpdate = async (dailyUpdateData)=>{
    try{
        const createdDailyUpdate=await prisma.dailyUpdates.create({
            data:dailyUpdateData
        })
        return createdDailyUpdate;
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}

export const updateDailyUpdate = async (dailyUpdateId,dailyUpdateData)=>{
    try{
        const updatedDailyUpdate=await prisma.dailyUpdates.update({
            where:{
                id:dailyUpdateId
            },
            data:dailyUpdateData
        })
        return updatedDailyUpdate;
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}
