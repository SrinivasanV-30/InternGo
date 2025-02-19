import { getDailyUpdateByUserIdAndDate } from "../models/dailyUpdateModel.js";
import { existingNotification } from "../models/notificationModel.js";
import {getUsersByStatus, updateUser } from "../models/userModel.js";
import { sendNotification, sendToAdmins } from "../services/notificationService.js";


export const updateDaysWorked=async()=>{
    try{
        const allActiveUsers= await getUsersByStatus("ACTIVE");
        const now=new Date();
        
        allActiveUsers.forEach(async(user)=>{
            const hasUserUpdatedToday=await getDailyUpdateByUserIdAndDate(user.id,now);
            if(hasUserUpdatedToday){
                await updateUser(user.id,{daysWorked:user.daysWorked+1});
            }
            else{
                const existingNotifications=await existingNotification(hasUserUpdatedToday.id,'dailyUpdate-remainder-intern');
                if(!existingNotifications){
                    sendNotification(user.id,'dailyUpdate-remainder-intern',hasUserUpdatedToday.id,`You haven't updated your daily task yet. Please update it soon!`);
                }
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}

export const dailyUpdatesNotUpdated=async()=>{
    try{
        const allActiveUsers= await getUsersByStatus("ACTIVE");
        const now=new Date();
        
        allActiveUsers.forEach(async(user)=>{
            const hasUserUpdatedToday=await getDailyUpdateByUserIdAndDate(user.id,now);
            if(!hasUserUpdatedToday){
                const existingNotifications=await existingNotification(hasUserUpdatedToday.id,'dailyUpdate-remainder-admin');
                if(!existingNotifications){
                    sendToAdmins('dailyUpdate-remainder-admin',hasUserUpdatedToday.id,`${user.name} from ${user.batch}-${user.year} has not submitted their daily task updates.`);
                }
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}