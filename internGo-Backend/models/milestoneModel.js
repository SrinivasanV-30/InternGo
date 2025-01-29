import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
const prisma= new PrismaClient();

export const getPlans=async()=>{
    try{
        const allPlans=await prisma.plans.findMany({
            include:{
                objectives:{
                    orderBy:{
                        createdAt:"asc"
                    }
                },
                users:true
            }

        });
        return allPlans;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getMilestoneByName=async(name)=>{
    try{
        const milestone=await prisma.milestones.findFirst({
            where:{
                name:name
            }
        });
        return milestone;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getMilestoneById=async(id)=>{
    try{
        console.log(id)
        const milestone=await prisma.milestones.findUnique({
            where:{
                id:id
            },
            include:{
                objectives:true
            }
        });
        return milestone;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const createMilestones=async(milestoneData)=>{
    try{
        const createdMilestones=await prisma.milestones.create({
            data:milestoneData
        })
        return createdMilestones;
    }
    catch(error)
    {
        logger.error(error.message);
    }
}
export const updateMilestones=async(milestoneId,milestoneData)=>{
    try{
        const updatedMilestones=await prisma.milestones.update({
            where:{
                id:milestoneId
            },
            data:milestoneData
        })
        return updatedMilestones;
    }
    catch(error)
    {
        logger.error(error.message);
    }
}