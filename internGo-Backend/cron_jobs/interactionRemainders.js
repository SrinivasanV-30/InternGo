import { getUpcomingInteractions } from "../models/interactionModel.js";
import { existingNotification } from "../models/notificationModel.js";
import { getUserPlans } from "../models/userModel.js";
import { convertTimeStringandDate } from "../services/dateTimeService.js";
import { sendNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js"

export const sendRemaindersForInteraction = async () => {
    try {
        const upcomingInteractions = await getUpcomingInteractions();
        const now = new Date();
        console.log("Current Date and Time: ", now);

        upcomingInteractions.forEach(async (interaction) => {
            // console.log(interaction.isScheduled);
            if (interaction.isScheduled) {
                const interactionDate = convertTimeStringandDate(interaction.date, interaction.time);
                const timeDiff = interactionDate.getTime() - now.getTime();

                if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
                    const existingNotifications = await existingNotification(interaction.id, 'interaction-remainder');
                    console.log("Existing Notifications: ", existingNotifications);

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


export const sendSchedulingRemindersToAdmins=async()=>{
    try{
        const userPlan=await getUserPlans();  
        

    }
    catch(error)
    {
        logger.error(error.message);
    }
}
