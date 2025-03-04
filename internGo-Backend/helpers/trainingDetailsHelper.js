
import logger from '../utils/logger.js';

export const trainingDetailsHelper=async(userPlan)=>{
    try{
        let userId=userPlan.id;
        let currentMilestone=null;
       
        console.log(userPlan)
        let milestoneTargetDate=userPlan.plan.startDate;
        let now=new Date();
        let userDays=Math.floor((now - userPlan.planStartDate)/(1000*60*60*24));
        for (const milestone of userPlan.plan.milestones) {
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }
        
            milestoneTargetDate.setDate(milestoneTargetDate.getDate() + milestone.milestoneDays);

            let milestoneDaysFromStart = Math.floor((milestoneTargetDate - new Date(userPlan.planStartDate)) / (1000 * 60 * 60 * 24));


            if (userDays >= milestoneDaysFromStart) {
                currentMilestone = milestone;
                logger.info(`Milestone found for user ${userId}`);
                
            }
            console.log(currentMilestone,userDays,milestoneDate,milestoneDaysFromStart)
        }
        return currentMilestone;
    }
    catch(error){
        logger.error(error.message)
    }
}