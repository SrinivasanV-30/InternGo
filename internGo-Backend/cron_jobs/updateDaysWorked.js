import { getDailyUpdateByUserIdAndDate } from "../models/dailyUpdateModel.js";
import { getUserByRole, getUsersByStatus, updateUser } from "../models/userModel.js";
import { sendNotification } from "../services/notificationService.js";


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
                // const adminUsers=await getUserByRole("Admins");
                // adminUsers.forEach((adminUser)=>{
                sendNotification(user.id,'dailyUpdate-remainder',null,`You haven't updated your daily task yet. Please update it soon!`);
                // })
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}