import { getDailyUpdateByUserIdAndDate } from "../models/dailyUpdateModel.js";
import { deleteSingleNotification, existingNotification } from "../models/notificationModel.js";
import {getUsersByStatus, updateUser } from "../models/userModel.js";
import { sendNotification, sendToAdmins } from "../services/notificationService.js";


export const updateDaysWorked=async()=>{
    try{
        const allActiveUsers= await getUsersByStatus("ACTIVE");
        const now=new Date();
        
        allActiveUsers.forEach(async(user)=>{
            const hasUserUpdatedToday=await getDailyUpdateByUserIdAndDate(user.id,now);
            if(hasUserUpdatedToday && user.planId){
                await updateUser(user.id,{daysWorked:user.daysWorked+1});
                
            }
            else{
                const existingNotifications=await existingNotification(user.id,`dailyUpdate-remainder-intern ${now}`);
                if(!existingNotifications){
                    sendNotification(user.id,`dailyUpdate-remainder-intern ${now}`,user.id,`You haven't updated your daily task yet. Please update it soon!`);
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
                const existingAdminNotification=await existingNotification(user.id,`dailyUpdate-remainder-admin ${now}`);
                const existingInternNotification=await existingNotification(user.id,`dailyUpdate-remainder-intern ${now}`)
                if(existingInternNotification){
                    deleteSingleNotification(existingInternNotification.id)
                }
                if(!existingAdminNotification){
                    sendToAdmins(`dailyUpdate-remainder-admin ${now}`,user.id,`${user.name} from ${user.batch}-${user.year} has not submitted their daily task updates.`);
                }
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}