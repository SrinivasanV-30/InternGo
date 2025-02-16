import { getAllPendingHelpDesks } from "../models/helpDeskModel";
import { findUserByUserId } from "../models/userModel.js";
import { sendNotification, sendToAdmins } from "../services/notificationService.js";
import logger from "../utils/logger.js"


export const helpDeskReminder=async()=>{
    try{
        const allHelpdeskRequests=await getAllPendingHelpDesks();
        const now=new Date();
        allHelpdeskRequests.forEach(async(request) => {
            const userDetails=await findUserByUserId(request.userId);
            const timeDiff=now-request.createdAt;
            if(timeDiff>1000*60*60*24*2){
                if(request.recepientId){
                    const recepient=await findUserByUserId(request.recepientId);
                    sendToAdmins('helpdesk-delay',null,` HelpDesk request from ${userDetails.name} - Subject: ${request.subject} has been delayed by Mentor ${recepient.name}. Please review for further action.`)
                }
                else{
                    sendToAdmins('helpdesk-remainder',null,`Pending HelpDesk request from ${userDetails.name} - Subject: ${request.subject}. Please resolve soon.`)
                }
            }
            if(timeDiff>1000*60*60*24){
                if(request.recepientId){
                    sendNotification(request.recepientId,'helpdesk-remainder',null,`Pending HelpDesk request from ${userDetails.name} - Subject: ${request.subject}. Please resolve soon.`)
                }
                else{
                    sendToAdmins('helpdesk-remainder',null,`Pending HelpDesk request from ${userDetails.name} - Subject: ${request.subject}. Please resolve soon.`)
                }
            }
        });

    }
    catch(error){
        logger.error(error.message);
    }
}