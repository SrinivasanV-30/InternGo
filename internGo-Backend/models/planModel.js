import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
const prisma= new PrismaClient();

export const getPlans=async()=>{
    try{
        const allPlans=await prisma.plans.findMany();
        return allPlans;
    }
    catch(error){
        logger.error(error.message)
    }
}

// expor