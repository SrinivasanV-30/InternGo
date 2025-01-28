import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createObjectives=async(objectivesData)=>{
    try{
        const createdObjectives=await prisma.objectives.createMany({
            data:objectivesData
        })
        return createdObjectives;
    }
    catch(error){
        logger.error(error.message);
    }
}
