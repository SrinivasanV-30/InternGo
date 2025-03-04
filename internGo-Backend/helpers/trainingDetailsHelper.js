
import logger from '../utils/logger.js';

export const trainingDetailsHelper=async(userPlan)=>{
    try{
        let userId=userPlan.id;
        let currentMilestone;
        let milestoneCount = 0;
        for (const milestone of userPlan.plan.milestones) {
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }

            if (milestoneCount >= userPlan.daysWorked) {
                currentMilestone = milestone;
                logger.info(`Milestone found for user ${userId}`);
                
            }

            milestoneCount += milestone.milestoneDays;
        }
        return currentMilestone
    }
    catch(error){
        logger.error(error.message)
    }
}