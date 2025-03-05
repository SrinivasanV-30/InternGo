import logger from '../utils/logger.js';

export const trainingDetailsHelper = async (userPlan) => {
    try {
        let userId = userPlan.id;
        let currentMilestone = null;

        if (!userPlan.plan || !userPlan.plan.startDate || !userPlan.plan.milestones || !userPlan.plan.milestones.length) {
            logger.error(`Invalid user plan structure for user ${userId}`);
            return null;
        }

       
        let userDays = userPlan.daysWorked
        
        let milestoneCount=0;
        for (const milestone of userPlan.plan.milestones) {
            
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }
            milestoneCount+=milestone.milestoneDays
            
            if (userDays <= milestoneCount) {
                currentMilestone = milestone;
                logger.info(`User ${userId} reached milestone: ${milestone.name || 'Unnamed Milestone'}`);
                return currentMilestone
            }

        }

        return currentMilestone;
    } catch (error) {
        logger.error(`Error in trainingDetailsHelper: ${error.message}`);
        return null;
    }
};
