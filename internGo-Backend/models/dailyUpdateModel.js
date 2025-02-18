import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getDailyUpdatesByDate = async (offset,limit,whereCondition) => {
    try {
        return await prisma.dailyUpdates.findMany({
            skip:offset,
            take:limit,
            where:whereCondition,
            include: {
                user:{
                    select:{
                        name:true,
                        id:true,
                        designation:true,
                    }
                },
                tasks: true,
            },
            orderBy:{
                date:"desc"
            }
        });
        
    } catch (error) { 
        logger.error(error.message);
        throw new Error(error);
        
    }
};

export const getDailyUpdateByUserId = async (userId) => {
    try {
        return await prisma.dailyUpdates.findMany({
            where: {
                userId:userId,
            },
            include: {
                tasks: true,
            },
        });
        
    } catch (error) { 
        logger.error(error.message);
        throw new Error(error);
        
    }
};

export const getDailyUpdateByUserIdAndDate = async (userId,date) => {
    try {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        return await prisma.dailyUpdates.findFirst({
            where: {
                userId:userId,
                date:{
                    gte:startDate,
                    lte:endDate
                }
            },select:{
                tasks:true,
                id:true
            }
            
        });
        
    } catch (error) { 
        logger.error(error.message);
        throw new Error(error);
        
    }
};

export const dailyUpdateCount = async (whereCondition) => {
    try {
        const dailyUpdatesCount = await prisma.dailyUpdates.count({
            where: whereCondition,
        });
        return dailyUpdatesCount;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createDailyUpdates = async (dailyUpdateData)=>{
    try{
        return await prisma.dailyUpdates.create({
            data:dailyUpdateData
        })
        
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}

export const getDailyUpdates = async (dailyUpdateId)=>{
    try{
        return await prisma.dailyUpdates.findUnique({
            where:{
                id:dailyUpdateId
            },
            include:{
                tasks:true
            }
        })
        
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}

export const deleteDailyUpdates = async (dailyUpdateId)=>{
    try{
        return await prisma.dailyUpdates.delete({
            where:{
                id:dailyUpdateId
            }
        })
        
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}

export const updateDailyUpdate = async (dailyUpdateId,dailyUpdateData)=>{
    try{
        return await prisma.dailyUpdates.update({
            where:{
                id:dailyUpdateId
            },
            data:dailyUpdateData
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
}
