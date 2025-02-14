import { getDailyUpdateByUserIdAndDate } from "../models/dailyUpdateModel.js";
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
                sendNotification(user.id,'dailyUpdate-remainder',null,`You haven't updated your daily task yet. Please update it soon!`);
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
                sendToAdmins('dailyUpdate-remainder',null,`${user.name} from batch ${user.batch}-${user.year} has not submitted their daily task updates.`);
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}