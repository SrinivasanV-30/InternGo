// import { getUpcomingInteractions } from "../models/interactionModel.js";
// import { existingNotification } from "../models/notificationModel.js";
// import { convertTimeStringandDate } from "../services/dateTimeService.js";
// import { sendNotification } from "../services/notificationService.js";
// import logger from "../utils/logger.js"


// export const sendRemaindersForInteraction=async()=>{
//     try{
//         const upcomingInteractions=await getUpcomingInteractions();
//         const now=new Date();
//         upcomingInteractions.forEach(async(interaction)=>{
//             console.log(interaction)
//             const interactionDate=convertTimeStringandDate(interaction.date,interaction.time)
//             const timeDiff=now-interactionDate;
            
//             if((timeDiff>0 && timeDiff <= 30 * 60 * 1000)){
//                 const {internId,interviewerId,name,interviewerName,internName}=interaction;
//                 // console.log(id,internId,interviewerId,name,interviewerName,internName)
//                 const existingNotifications= await existingNotification(id,'interaction-remainder');
//                 if(!existingNotifications){
//                     sendNotification(internId,"interaction-remainder",id,`Your "${name}" is scheduled to start in 30 minutes. Your mentor is ${interviewerName}. Be prepared!`);
//                     sendNotification(internId,"interaction-remainder",id,`Your "${name}" with intern ${internName} is scheduled to start in 30 minutes. Get ready!`);
//                 }
//             }   
//         })
//     }
//     catch(error){
//         logger.error(error.message);
//     }
// }