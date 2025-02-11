import { createNotification, getAllUserIds } from "../models/notificationModel.js";
import { io, lookUps } from "./webSocketService.js";
import logger from "../utils/logger.js";
import { getUserByRole } from "../models/userModel.js";

export const sendNotification = async (userId, type, referenceId, message) => {
    try {
        console.log(lookUps[userId])
        const createdNotification=await createNotification(userId, type, referenceId, message);
        io.to(lookUps[userId]).emit("notification", {createdNotification});
    } 
    catch (error) {
        logger.error(error.message);
    }
};

export const sendBroadcastNotification = async ( type, message) => {
    try {
        const userIds = await getAllUserIds();
        for (const id of userIds) {
            const createdNotification=await sendNotification(id, type, referenceId, message);
            // io.to(id).emit("notification", {createdNotification});
        }
    } 
    catch (error) {
        logger.error(error.message);
    }
};

export const sendToAdmins = async(type, message)=>{
    try{
        const adminUsers=await getUserByRole("Admins");
        adminUsers.forEach((adminUser)=>{
            sendNotification(adminUser.id,type,null,message);
        })
    }
    catch(error){
        logger.error(error.message);
    }
}