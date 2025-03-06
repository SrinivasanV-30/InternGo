import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const createPushNotification = async (userId, fcmToken) => {
    try {
        const notification = await prisma.pushNotification.create({
            data: {
                userId:userId,
                fcmToken:[fcmToken],
            },
        });

        return notification;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getPushNotificationById = async (id) => {
    try {
        return await prisma.pushNotification.findUnique({
            where: { id },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const getUserPushNotifications = async (userId) => {
    try {
        return await prisma.pushNotification.findFirst({
            where: { userId },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const upsertNotification = async (userId, fcmToken) => {
    try {
        const userData= await getUserPushNotifications(userId);
        console.log(userData)
        let updatedFcmToken=[fcmToken];
        if(userData){
            updatedFcmToken = [...updatedFcmToken,...userData.fcmToken];
        }
        const notification = await prisma.pushNotification.upsert({
            where: { userId },
            update: { updatedFcmToken },
            create: { userId, updatedFcmToken },
        });
        return notification;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const updateFcmToken = async (userId, newFcmToken) => {
    try {
        const userData= await getUserPushNotifications(userId);
        let updatedFcmToken = [...userData.fcmToken,newFcmToken];
        return await prisma.pushNotification.updateMany({
            where: { userId },
            data: { fcmToken: updatedFcmToken },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteNotificationById = async (id) => {
    try {
        return await prisma.pushNotification.delete({
            where: { id },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteAllUserNotifications = async (userId) => {
    try {
        return await prisma.pushNotification.deleteMany({
            where: { userId },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};
