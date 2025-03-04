
import logger from '../utils/logger.js';

export const trainingDetailsHelper=async(userPlan)=>{
    try{
        let userId=userPlan.id;
        let currentMilestone=null;
       
        let milestoneDate=new Date(userPlan.plan.startDate);
        console.log(milestoneDate)
        let now=new Date();
        let userDays=Math.floor((now - userPlan.planStartDate)/(1000*60*60*24));
        for (const milestone of userPlan.plan.milestones) {
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }

            milestoneDate.setDate(milestoneDate.getDate()+milestone.milestoneDays);
            if (userDays >= Math.floor((milestoneDate-new Date(userPlan.plan.planStartDate))/(1000*60*60*24))) {
                currentMilestone = milestone;
                logger.info(`Milestone found for user ${userId}`);
                
            }
            console.log(currentMilestone,userDays,milestoneDate)
        }
        return currentMilestone;
    }
    catch(error){
        logger.error(error.message)
    }
}