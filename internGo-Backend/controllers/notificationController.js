import { getUpcomingInteractions } from "../models/interactionModel.js";
import { convertTimeStringandDate } from "../services/dateTimeService.js";
import logger from "../utils/logger.js"


export const sendRemaindersForInteraction=async()=>{
    try{
        const upcomingInteractions=await getUpcomingInteractions();
        const now=new Date();
        upcomingInteractions.forEach((interaction)=>{
            console.log(interaction)
            const interactionDate=convertTimeStringandDate(interaction.date,interaction.time)
            console.log(interactionDate)
            const timeDiff=now-interactionDate;

            if(timeDiff>0 && timeDiff <= 30 * 60 * 1000){
                const {internId,interviewerId,interactionName}=interaction;
                console.log(internId,interviewerId,interactionName)
            }
        })
    }
    catch(error){
        logger.error(error.message);
    }
}