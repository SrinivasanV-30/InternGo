import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDailyUpdateByDate=async(date)=>{
    try{
        const allDailyUpdates=await prisma.dailyUpdates.findMany({
            where:{
                date:date
            },
            include:{
                tasks:true
            }
        })
        return allDailyUpdates;
    }
    catch(error){

    }
}

// export const createDaily