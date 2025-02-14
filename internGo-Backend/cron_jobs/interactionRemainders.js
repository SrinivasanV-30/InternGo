import { getStartedInteractions, getUpcomingInteractions, updateInteractions } from "../models/interactionModel.js";
import { existingNotification } from "../models/notificationModel.js";
import { getUserPlans } from "../models/userModel.js";
import { convertTimeStringandDate } from "../services/dateTimeService.js";
import { sendNotification, sendToAdmins } from "../services/notificationService.js";
import logger from "../utils/logger.js"

export const sendRemaindersForInteraction = async () => {
    try {
        const upcomingInteractions = await getUpcomingInteractions();
        const now = new Date();
        console.log("Current Date and Time: ", now);

        upcomingInteractions.forEach(async (interaction) => {
           
            if (interaction.isScheduled) {
                const interactionDate = convertTimeStringandDate(interaction.date, interaction.time);
                const timeDiff = interactionDate.getTime() - now.getTime();

                if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
                    const existingNotifications = await existingNotification(interaction.id, 'interaction-remainder');
                    

                    if (!existingNotifications) {
                        console.log("Sending Notifications...");
                        sendNotification(interaction.internId, "interaction-remainder", interaction.id, `Your ${interaction.name} interaction is scheduled to start at ${interaction.time}. Your mentor is ${interaction.assignedInterviewer}. Be prepared!`);
                        sendNotification(interaction.interviewerId, "interaction-remainder", interaction.id, `Your ${interaction.name} interaction with intern ${interaction.assignedIntern} is scheduled to start at ${interaction.time}. Get ready!`);
                    }
                }

                
            }
        });
    } catch (error) {
        logger.error(error.message);
    }
};

export const interactionFeedbackPending=async()=>{
    try{
        const startedInteractions=await getStartedInteractions();
        const now = new Date();
        startedInteractions.forEach(async(interaction)=>{
            if(interaction.interactionStatus!="FEEDBACK_PENDING" && !interaction.feedback)
            {
                await updateInteractions(interaction.id,{interactionStatus:"FEEDBACK_PENDING"})
            }
            else{
                if(now.getTime()>interaction.updatedAt.getTime()+(1000*60*60*24) && !interaction.feedback){
                    sendNotification(interaction.interviewerId,'feedback-pending',interaction.id,`Please provide feedback for your recent ${interaction.name} interaction with ${interaction.internName}.`);
                }
            }
        })

    }
    catch(error){
        logger.error(error.message);
    }
}


export const sendSchedulingRemindersToAdmins=async()=>{
    try{
        const users=await getUserPlans();  
        const today=new Date();
    
        // console.log(users);
        users.forEach(async (user) => {
            const { planStartDate, plan } = user;

            plan?.milestones?.forEach((milestone) => {
                milestone?.objectives?.forEach(async (objective) => {
                   
                    const dueDate1 = new Date(planStartDate);
                    dueDate1.setDate(dueDate1.getDate() + Math.floor(objective.objectiveDays/2));
                    const dueDate2 = new Date(planStartDate);
                    dueDate2.setDate(dueDate2.getDate() + Math.floor(objective.objectiveDays));
                    // console.log(dueDate1,dueDate2)
                    
                    if ((dueDate1.toDateString() === today.toDateString())||(dueDate2.toDateString() === today.toDateString())) {
                        const dueDate=dueDate1.toDateString() === today.toDateString()?1:2;
                        const existingNoti=await existingNotification(objective.id,`interaction-due ${dueDate}`)
                        if(!existingNoti){
                            sendToAdmins(`interaction-due ${dueDate}`,objective.id,` Interaction to be scheduled for "${objective.name}" (User: "${user.name}") under "${plan.name}".`)
                        }
                    }
                });
            });
        });

    }
    catch(error)
    {
        logger.error(error.message);
    }
}
