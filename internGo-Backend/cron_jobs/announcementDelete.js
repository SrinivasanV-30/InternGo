import { deleteNotification } from "../controllers/notificationController";
import { deleteSingleNotification, getAnnouncements } from "../models/notificationModel"
import logger from "../utils/logger.js"


export const announcementDelete=async()=>{
    try{
        const announcements=await getAnnouncements();
        const now=new Date();
        announcements.forEach((announcement)=>{
            const diff=now-announcement.createdAt;
            if(diff>=1000*60*60*24*2){
                deleteSingleNotification(announcement.id);
            }
        })
    }
    catch(error){
        logger.info(error.message)
    }
}