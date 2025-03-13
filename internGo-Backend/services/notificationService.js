import { createNotification, getAllUserIds } from "../models/notificationModel.js";
import { io, lookUps } from "./webSocketService.js";
import logger from "../utils/logger.js";
import { getUserByRole } from "../models/userModel.js";
import { getAccessToken } from "./firebaseService.js";
import axios from "axios";
import { serviceAccount } from "../config/firebaseConfig.js";
import { getUserPushNotifications } from "../models/pushNotificationModel.js";
import { capitalizeFirstLetter } from "../helpers/capitalizeFirstLetter.js";
import dotenv from 'dotenv';

dotenv.config();

export const sendNotification = async (userId = null, type, referenceId = null, message) => {
    try {
        
        const createdNotification = await createNotification(userId, type, String(referenceId), message);
        const sockets = lookUps.get(userId);
        const userFcmToken=await getUserPushNotifications(userId);
        if(userFcmToken){
            userFcmToken.fcmToken.forEach((token)=>{
                sendPushNotification(token,type,message);
            })
        }
        
        if (sockets) {
            sockets.forEach(socketId => {
                io.to(socketId).emit("notification", { createdNotification });
            });
        }
    }
    catch (error) {
        logger.error(error.message);
    }
};

export const sendBroadcastNotification = async (type, message) => {
    try {
        const userIds = await getAllUserIds();
        const createdNotification = await createNotification(null, 'announcement', null, message);
        for (const id of userIds) {
            const sockets = lookUps.get(id);
            const userFcmToken=await getUserPushNotifications(id);
            if(userFcmToken){
                userFcmToken.fcmToken.forEach((token)=>{
                    
                    sendPushNotification(token,type,message);
                })
            }
            if (sockets) {
                sockets.forEach(socketId => {
                    io.to(socketId).emit("announcement", { createdNotification });

                });
            }
        }
    }
    catch (error) {
        logger.error(error.message);
    }
};

export const sendToAdmins = async (type, referenceId = null, message) => {
    try {
        const adminUsers = await getUserByRole("Admins");
        adminUsers.forEach(async(adminUser) => {
            const userFcmToken=await getUserPushNotifications(adminUser.id);
            if(userFcmToken){
                userFcmToken.fcmToken.forEach((token)=>{
                    sendPushNotification(token,type,message);
                })
            }
            sendNotification(adminUser.id, type, referenceId, message);
        })
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const sendPushNotification = async (fcmToken, type, body) => {
    try {
        const accessToken = await getAccessToken();
        // console.log((capitalizeFirstLetter(type?.split("-")[0]) +" "+ (type?.split("-")[1]?capitalizeFirstLetter(type?.split("-")[1]):"").trim()))
        const message = {
            message: {
                token: fcmToken,
                notification: {
                    title: ((capitalizeFirstLetter(type?.split("-")[0])).trim() +" "+ (type?.split("-")[1]?capitalizeFirstLetter(type?.split("-")[1]):"").trim())?.trim(),
                    body: body
                },
                android: {
                    priority: "high",
                    notification: {
                        sound: "interngo",
                        channelId: "fcm_default_channel",
                        icon: "ic_stat_notification",
                    },
                },
            }
        }
        const response = await axios.post(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
            message,
            {
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            }
        );
        
        logger.info("FCM Push Notification Successful!!");
    }
    catch (error) {
        logger.error(error)
    }
}