import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
const prisma= new PrismaClient();

export const getPlans=async()=>{
    try{
        const allPlans=await prisma.plans.findMany();
        return allPlans;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const createPlans=async(planData)=>{
    try{
        const createPlans=await prisma.plans.create({
            data:planData
        })
        return createPlans;
    }
    catch(error)
    {
        logger.error(error.message);
    }
}
export const updatePlans=async(planData)=>{
    try{
        const updatedPlans=await prisma.plans.update({
            where:{
                id:planId
            },
            data:planData
        })
        return createPlans;
    }
    catch(error)
    {
        logger.error(error.message);
    }
}