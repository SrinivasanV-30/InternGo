import { createNotification, getAllUserIds } from "../models/notificationModel.js";
import { io, lookUps } from "./webSocketService.js";
import logger from "../utils/logger.js";
import { getUserByRole } from "../models/userModel.js";

export const sendNotification = async (userId = null, type, referenceId = null, message) => {
    try {
        // console.log(lookUps[userId])
        const createdNotification = await createNotification(userId, type, String(referenceId), message);
        const sockets = lookUps.get(userId);
        // console.log(sockets);
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
            // console.log(lookUps)
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

export const sendToAdmins = async (type,referenceId=null, message) => {
    try {
        const adminUsers = await getUserByRole("Admins");
        adminUsers.forEach((adminUser) => {
            sendNotification(adminUser.id, type, referenceId, message);
        })
    }
    catch (error) {
        logger.error(error.message);
    }
}