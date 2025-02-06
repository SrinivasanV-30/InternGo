import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma=new PrismaClient();

export const createNotification = async (userId, type, referencesId, message) => {
    try{
        const noti= await prisma.notifications.create({
        data: {
            userId: userId || null,
            type,
            referencesId,
            message,
        },
    });
    console.log(noti);
    return noti
    }
    catch(error){
        logger.error(error.message)
    }
};

export const getNotificationsByUserId = async (userId) => {
    return await prisma.notifications.findMany({
        where: { OR: [{ userId }, { userId: null }] },
        orderBy: { createdAt: "desc" },
    });
};

export const markNotificationAsRead = async (notificationId) => {
    return await prisma.notifications.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
};

export const getAllUserIds = async () => {
    const users = await prisma.users.findMany({
        select: { id: true },
    });
    return users.map((user) => user.id);
};
