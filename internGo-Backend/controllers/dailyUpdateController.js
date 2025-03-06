import { Prisma } from "@prisma/client";
import { createDailyUpdates, dailyUpdateCount, deleteDailyUpdates, getDailyUpdateByUserIdAndDate, getDailyUpdates, getDailyUpdatesByDate, updateDailyUpdate } from "../models/dailyUpdateModel.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";
import { findUserByUserId } from "../models/userModel.js";
import { createDailyUpdateTask, deleteDailyUpdateTasks, getTaskById, updateDailyUpdateTask } from "../models/dailyUpdateTaskModel.js";

//Admin
export const getDailyUpdateByDateAndFiltering=async(req,res)=>{
    try{
        const dailyUpdateData=req.body;
        const limit=parseInt(req.query.limit)||10;
        const offset=parseInt(req.query.offset)||0;
    
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
            whereCondition.date={
                gte: new Date(dailyUpdateData.date + "T00:00:00.000Z"),
                lte: new Date(dailyUpdateData.date + "T23:59:59.999Z")
            };
  
        }
        const userWithDailyUpdates= await getDailyUpdatesByDate(offset,limit,whereCondition);
        const total_items = await dailyUpdateCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
        logger.info("Fetched successfully")
        sendResponse(res,200,"Fetched successfully",{
            data:userWithDailyUpdates,
            total_pages
        });
        
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
                
                return await updateDailyUpdateTask(task.taskId,task.taskData);
            } else {
                
                task.taskData.dailyUpdateId=dailyUpdateId;
                return await createDailyUpdateTask(task.taskData);
            }
            
        });
        const tasks=await Promise.all(tasksPromises);
        const totalActualTime = tasks.reduce((total, task) => total + (task.actualTime || 0), 0);
        
        await updateDailyUpdate(dailyUpdateId,{
            totalActualTime:totalActualTime
        })
        logger.info("Upserted successfully");
        sendResponse(res,200,"Upserted successfully",{
            tasks:tasks,
            totalActualTime:totalActualTime
        });
    }
    catch(error){
        logger.error(error.message);
    }
}

export const deleteDailyUpdateTask=async(req,res)=>{
    try{
        const taskId=parseInt(req.params.id);
        const taskDetails=await getTaskById(taskId);
        const dailyUpdateId=taskDetails.dailyUpdateId;
        if(!taskDetails)
        {
            logger.info("Task not found!!");
            return sendResponse(res,404,"Task not found!!!");
        }
        await deleteDailyUpdateTasks(taskId);
        const dailyUpdate=await getDailyUpdates(dailyUpdateId);
        if(dailyUpdate.tasks.length===0){
            await deleteDailyUpdates(dailyUpdateId)

        }
        logger.info("Deleted successfully");
        sendResponse(res,204,"Deleted successfully");       
    }
    catch(error){
        logger.error(error.message);
    }
}