import { findUserByUserId } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { createNotification, deleteAllNotifications, deleteSingleNotification, getAnnouncements, getNotificationById, getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../models/notificationModel.js";
import sendResponse from "../utils/response.js";
import { sendBroadcastNotification } from "../services/notificationService.js";
import { createPushNotification, getUserPushNotifications, updateFcmToken, upsertNotification } from "../models/pushNotificationModel.js";

export const getNotificationsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found");
            return sendResponse(res, 404, "User not found");
        }
        const userNotifications = await getUserNotifications(userId);
        logger.info("Notifications fetched successfully");
        sendResponse(res, 200, "Notifications fetched successfully", userNotifications);
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const markAsRead = async (req, res) => {
    try {
        const readNotifications = req.body;
        readNotifications.notificationIds.forEach(async (notificationId) => {
            return await markNotificationAsRead(notificationId);
        })
        sendResponse(res, 200, "Marked successfully");
    }
    catch (error) {
        logger.error(error.message)
    }
}

export const createAnnoncement = async (req, res) => {
    try {
        const message = req.body;
    
        sendBroadcastNotification("announcement", message.message)
        sendResponse(res, 200, "Announcement created successfully");
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const getAnnouncement = async (req, res) => {
    try {
        const announcements = await getAnnouncements();
        logger.info("Announcements fetched successfully");
        sendResponse(res, 200, "Announcements fetched successfully", announcements);
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found");
            return sendResponse(res, 404, "User not found")
        }
        await markAllNotificationsAsRead(userId);
        sendResponse(res, 200, "Marked successfully");
    }
    catch (error) {
        logger.error(error.message);
    }
}
export const deleteNotification = async (req, res) => {
    try {
        const notifications = req.body;
        // console.log(notifications)
        notifications.notificationIds.forEach(async (id) => {
            let notification;
            if (id) {
                notification = await getNotificationById(id);
            }
            if (notification) {
                await deleteSingleNotification(id)
            }
        })
        logger.info("Deleted sucessfully");
        sendResponse(res, 204, "Deleted successfully")
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const clearAllNotification = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found");
            return sendResponse(res, 404, "User not found")
        }
        await deleteAllNotifications(userId);
        logger.info("Deleted sucessfully");
        sendResponse(res, 204, "Deleted successfully")
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const userFCMUpsert = async (req, res) => {
    try {
        const request = req.body;
        const userDetails = await findUserByUserId(request.userId);
        if (!userDetails) {
            logger.error("User not found");
            return sendResponse(res, 404, "User not found")
        }
        const userData = await getUserPushNotifications(request.userId);
        if (userData) {
            await updateFcmToken(request.userId, request.fcmToken);
        }
        else {
            await createPushNotification(request.userId, request.fcmToken);
        }
        logger.info("Registered FCMToken successfully");
        sendResponse(res, 201, "Registered FCMToken successfully");
    }
    catch (error) {
        logger.error(error.message)
    }
}

export const deleteFCM = async(req,res)=>{
    try{
        const request = req.body;
        const userFCM=await getUserPushNotifications(request.userId);
        if(!userFCM){
            logger.error("No FCM Tokens found!!");
            return sendResponse(res,404,"No FCM Tokens found!!");
        }
        
        userFCM.fcmToken = userFCM.fcmToken.filter((token)=>{
            if(token!=request.fcmToken){
                return token
            }
        });
        await updateFcmToken(request.userId,userFCM.fcmToken)
        logger.info("Deleted FCMToken successfully");
        sendResponse(res, 204, "Deleted FCMToken successfully");

    }
    catch(error){
        logger.error(error.message)
    }
}