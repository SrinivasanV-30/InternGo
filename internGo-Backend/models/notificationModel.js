import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma=new PrismaClient();

export const createNotification = async (userId=null, type, referencesId=null, message) => {
    try{
        const notification= await prisma.notifications.create({
        data: {
            userId: userId || null,
            type,
            referencesId,
            message,
            },
        });
    
        return notification
    }
    catch(error){
        logger.error(error.message)
        throw new Error(error.message);
    }
};

export const getUserNotifications = async (userId) => {
    try{
        return await prisma.notifications.findMany({
            where: { 
                userId:userId,
                type:{ not : 'announcement'}
            },
            orderBy: { createdAt: "desc" },
        });
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
        
    }
};

export const getAnnouncements = async () => {
    try{
        return await prisma.notifications.findMany({
            where: { 
                type:'announcement'
            },
            orderBy: { createdAt: "desc" },
        });
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
        
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try{
        return await prisma.notifications.update({
        where: { id: notificationId },
        data: { isRead: true },
        });
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
};



export const getAllUserIds = async () => {
    try{
        const users = await prisma.users.findMany({
            select: { id: true },
        });
        return users.map((user) => user.id);        
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
    
};

export const existingNotification=async(id,type)=>{
    try{
        return await prisma.notifications.findFirst({
            where:{
                referencesId:id,
                type:type
            },
        });
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const markAllNotificationsAsRead = async (userId) => {
    try {
        return await prisma.notifications.updateMany({
            where: { userId:userId, isRead: false },
            data: { isRead: true },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteSingleNotification = async (id) => {
    try {
        return await prisma.notifications.delete({
            where: { id },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteAllNotifications = async (userId) => {
    try {
        return await prisma.notifications.deleteMany({
            where: { userId:userId },
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
};