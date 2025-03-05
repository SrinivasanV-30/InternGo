import logger from '../utils/logger.js';

export const trainingDetailsHelper = async (userPlan) => {
    try {
        let userId = userPlan.id;
        let currentMilestone = null;

        if (!userPlan.plan || !userPlan.plan.startDate || !userPlan.plan.milestones || !userPlan.plan.milestones.length) {
            logger.error(`Invalid user plan structure for user ${userId}`);
            return null;
        }

        // let startDate = new Date(userPlan.plan.startDate);
        // let now = new Date();
        let userDays = userPlan.daysWorked
        // let milestoneDate = new Date(startDate.getTime());
        console.log(userPlan.plan.milestones,"userday",userDays)
        let milestoneCount=0;
        for (const milestone of userPlan.plan.milestones) {
            
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }
            milestoneCount+=milestone.milestoneDays
            // milestoneDate.setDate(startDate.getDate() + milestone.milestoneDays);
            // let milestoneDaysFromStart = Math.floor((milestoneDate - startDate) / (1000 * 60 * 60 * 24));
            
            console.log({ milestoneCount });
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
