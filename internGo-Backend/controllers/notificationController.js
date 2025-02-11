import { findUserByUserId } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { createNotification, deleteAllNotifications, deleteSingleNotification, getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../models/notificationModel.js";
import sendResponse from "../utils/response.js";

export const getNotificationsByUserId=async(req,res)=>{
    try{    
        const userId=req.params.id;
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found");
            return sendResponse(res,404,"User not found");
        }
        const userNotifications=await getUserNotifications(userId);
        logger.info("Notifications fetched successfully");
        sendResponse(res,200,"Notifications fetched successfully",userNotifications);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const markAsRead=async(req,res)=>{
    try{
        const readNotifications=req.body;
        readNotifications.notificationIds.forEach(async(notificationId)=>{
            return await markNotificationAsRead(notificationId);
        })
        sendResponse(res,200,"Marked successfully");
    }
    catch(error){
        logger.error(error.message)
    }
}

export const createAnnoncement=async(req,res)=>{
    try{
        const message = req.body;
        console.log(message)
        await createNotification(null,"announcement",null,message.message)
        
        sendResponse(res,200,"Announcement created successfully");
    }
    catch(error){
        logger.error(error.message)
    }
}

export const markAllAsRead=async(req,res)=>{
    try{
        const userId=req.params.id;
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found");
            return sendResponse(res,404,"User not found")
        }
        await markAllNotificationsAsRead(userId);
        sendResponse(res,200,"Marked successfully");
    }
    catch(error){
        logger.error(error.message)
    }
}
export const deleteNotification=async(req,res)=>{
    try{
        const notifications=req.body;
        console.log(notifications)
        notifications.notificationIds.forEach(async(id)=>{
            await deleteSingleNotification(id)
        })
        logger.info("Deleted sucessfully");
        sendResponse(res,204,"Deleted successfully")
    }
    catch(error){
        logger.error(error.message);
    }
}

export const clearAllNotification=async(req,res)=>{
    try{
        const userId=req.params.id;
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found");
            return sendResponse(res,404,"User not found")
        }
        await deleteAllNotifications(userId);
        logger.info("Deleted sucessfully");
        sendResponse(res,204,"Deleted successfully")
    }
    catch(error){
        logger.error(error.message);
    }
}

