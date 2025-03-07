import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createDailyUpdateTask=async(tasks)=>{
    try{
        return await prisma.dailyUpdateTasks.create({
            data:tasks
        })
    }
    catch(error)
    {
        logger.error(error.message);
    }
}

export const getTaskById=async(taskId)=>{
    try{
        return await prisma.dailyUpdateTasks.findUnique({
            where:{
                id:taskId
            }
        })   
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateDailyUpdateTask=async(taskId,taskData)=>{
    try{
        return await prisma.dailyUpdateTasks.update({
            where:{id:taskId},
            data:taskData
        })
    }
    catch(error)
    {
        logger.error(error.message);
    }
}

export const deleteDailyUpdateTasks=async(taskId)=>{
    try{
        return await prisma.dailyUpdateTasks.delete({
            where:{
                id:taskId
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}