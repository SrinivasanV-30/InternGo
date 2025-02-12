import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma=new PrismaClient();

export const createInteractions=async(data)=>{
    try{
        return await prisma.interactions.create({
            data:data
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
        
    }
}

export const getInteractions = async (offset, limit,whereCondition) => {
    try {
        return await prisma.interactions.findMany({
            skip: offset,
            take: limit,
            where:whereCondition,
            orderBy:{
                createdAt:"desc"
            }
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const interactionCount=async(whereCondition)=>{
    try{
        return await prisma.interactions.count({
            where:whereCondition 
        });
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getInteractionById = async (id) => {
    try {
        return await prisma.interactions.findUnique({ where: { id } });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};


export const updateInteractions = async (id, data) => {
    try {
        return await prisma.interactions.update({
            where: { id:id },
            data,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteInteraction = async (id) => {
    try {
        return await prisma.interactions.delete({ where: { id } });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getUpcomingInteractions=async()=>{
    try{
        const date=new Date();
        return await prisma.interactions.findMany({
            where:{
                date:{
                    gte:date
                }
            }
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getInteractionByQuery=async(whereCondition)=>{
    try{
        return await prisma.interactions.count({
            where:whereCondition
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}