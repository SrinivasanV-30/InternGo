import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createObjectives=async(objectivesData)=>{
    try{
        const createdObjectives=await prisma.objectives.create({
            data:objectivesData
        })
        return createdObjectives;
    }
    catch(error){
        logger.error(error.message);
    }
}
export const updateObjectives=async(planId,objectiveId,objectivesData)=>{
    try{
        const updatedObjectives=await prisma.objectives.update({
            where:{
                planId:planId,
                id:objectiveId
            },
            data:objectivesData
        })
        return updatedObjectives;
    }
    catch(error){
        logger.error(error.message);
    }
}
