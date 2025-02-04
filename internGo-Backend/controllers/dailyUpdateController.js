import { Prisma } from "@prisma/client";
import { createDailyUpdates, getDailyUpdateByUserIdAndDate, getDailyUpdatesByDate } from "../models/dailyUpdateModel.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";
import { findUserByUserId } from "../models/userModel.js";
import { createDailyUpdateTask, updateDailyUpdateTask } from "../models/dailyUpdateTaskModel.js";

//Admin
export const getDailyUpdateByDateAndFiltering=async(req,res)=>{
    try{
        const dailyUpdateData=req.body;
        let whereCondition={user:{},date:{}};
        if(dailyUpdateData.name && dailyUpdateData.name.trim!=""){
            whereCondition.user.name={
                contains: dailyUpdateData.name,
                mode:'insensitive'
            };
        }
        if(dailyUpdateData.batch && dailyUpdateData.batch.length>0)
        {
            whereCondition.user.batch={in:dailyUpdateData.batch}
        }
        if (dailyUpdateData.year && dailyUpdateData.year.length > 0) {
            whereCondition.user.year = { in: dailyUpdateData.year };
        }
        if (dailyUpdateData.status && dailyUpdateData.status.length > 0) {
            whereCondition.user.status = { in: dailyUpdateData.status };
        }
        if (dailyUpdateData.designation && dailyUpdateData.designation.length > 0) {
            whereCondition.user.designation = { in: dailyUpdateData.designation };
        }
        if(dailyUpdateData.date)
        {   
            const startDate = new Date(dailyUpdateData.date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(dailyUpdateData.date);
            endDate.setHours(23, 59, 59, 999);
            
            whereCondition.date={
                gte:startDate,
                lte:endDate
            };
            
        }
        console.log(dailyUpdateData.date)
        const userWithDailyUpdates= await getDailyUpdatesByDate(whereCondition);
        sendResponse(res,200,"Success",userWithDailyUpdates)
        console.log(userWithDailyUpdates);
    

    }
    catch(error){
        logger.error(error.message);
    }
}

export const createDailyUpdate=async(req,res)=>{
    try{
        const userId=req.params.id;
        const dailyUpdateDetails=req.body;
        dailyUpdateDetails.date=(new Date(dailyUpdateDetails.date));
    
        const userDetails=await findUserByUserId(userId);
        if(!userDetails)
        {
            logger.info("User not found!!");
            return sendResponse(res,404,"User not found!!!");
        }
        dailyUpdateDetails.userId=userId;
        const createdDailyUpdate=await createDailyUpdates(dailyUpdateDetails);
        if(!createdDailyUpdate){
            logger.error("Daily update create unsuccessful");
            return sendResponse(res,500,"Daily update create unsuccessful");    
        }
        logger.info("Daily update created successfully");
        sendResponse(res,201,"Daily update created successfully",createdDailyUpdate);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getSingleDayUpdates=async(req,res)=>{
    try{
        const userId=req.params.id;
        const date=new Date(req.query.date);
        const today=new Date();
        const tomorrow=new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        let dailyUpdate=await getDailyUpdateByUserIdAndDate(userId,date);
        if(!dailyUpdate &&((date.getDate===tomorrow.getDate && date.getMonth===tomorrow.getMonth && date.getFullYear===tomorrow.getFullYear)||(date.getDate===today.getDate && date.getMonth===today.getMonth && date.getFullYear===today.getFullYear))){
            logger.info("Fetched successfully")
            return sendResponse(res,200,"Fetched successfully",[]);
        }
        if(!dailyUpdate){
            logger.error("No daily update found!!");
            return sendResponse(res,404,"No daily update found!!");        
        }
        logger.info("Fetched successfully")
        sendResponse(res,200,"Fetched successfully",dailyUpdate);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const upsertDailyUpdatesTasks=async(req,res)=>{
    try{
        const userId=req.params.id;
        const dailyUpdateTasks=req.body;
        let dailyUpdate=await getDailyUpdateByUserIdAndDate(userId,dailyUpdateTasks.date);
        
        if(!dailyUpdate){
            const userDetails=await findUserByUserId(userId);
            if(!userDetails)
                {
                    logger.info("User not found!!");
                    return sendResponse(res,404,"User not found!!!");
                }
            let dailyUpdateDetails={userId:userId,date:new Date(dailyUpdateTasks.date)}
            dailyUpdateDetails.userId=userId;
            dailyUpdate=await createDailyUpdates(dailyUpdateDetails);
            
        }
        const dailyUpdateId = dailyUpdate.id;
    
        const tasksPromises= dailyUpdateTasks.tasks.map(async (task) => {
            if (task.taskId) {
                console.log(task)
                return await updateDailyUpdateTask(task.taskId,task.taskData);
            } else {
                console.log(task)
                task.taskData.dailyUpdateId=dailyUpdateId;
                return await createDailyUpdateTask(task.taskData);
            }
        });
        const tasks=await Promise.all(tasksPromises);
        sendResponse(res,200,"Upserted successfully",tasks)
    }
    catch(error){
        logger.error(error.message);
    }
}