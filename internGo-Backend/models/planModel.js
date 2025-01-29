import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
import { createObjectives } from "./objectiveModel.js";
const prisma= new PrismaClient();

export const getPlans=async()=>{
    try{
        const allPlans=await prisma.plans.findMany({
            include:{
                milestones:true,
                users:true
            }

        });
        return allPlans;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getPlanByName=async(name)=>{
    try{
        const allPlans=await prisma.plans.findFirst({
            where:{
                name:name
            }
        });
        return allPlans;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getPlanById=async(planId)=>{
    try{
        const allPlans = await prisma.plans.findUnique({
            where: {
                id: planId
            },
            include: {
                milestones: {
                    include: {
                        objectives: true
                    }
                },
                users: true
            }
        });
        
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
export const updatePlans=async(planId,planData)=>{
    try{
        const updatedPlans=await prisma.plans.update({
            where:{
                id:planId
            },
            data:planData
        })
        return updatedPlans;
    }
    catch(error)
    {
        logger.error(error.message);
    }
}