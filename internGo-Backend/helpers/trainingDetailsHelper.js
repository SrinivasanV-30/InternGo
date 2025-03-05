import logger from '../utils/logger.js';

export const trainingDetailsHelper = async (userPlan) => {
    try {
        let userId = userPlan.id;
        let currentMilestone = null;

        if (!userPlan.plan || !userPlan.plan.startDate || !userPlan.plan.milestones || !userPlan.plan.milestones.length) {
            logger.error(`Invalid user plan structure for user ${userId}`);
            return null;
        }

        let startDate = new Date(userPlan.plan.startDate);
        let now = new Date();
        let userDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

        let milestoneDate = new Date(startDate.getTime());

        for (const milestone of userPlan.plan.milestones) {
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }

            milestoneDate.setDate(startDate.getDate() + milestone.milestoneDays);
            let milestoneDaysFromStart = Math.floor((milestoneDate - startDate) / (1000 * 60 * 60 * 24));

            if (userDays >= milestoneDaysFromStart) {
                currentMilestone = milestone;
                logger.info(`User ${userId} reached milestone: ${milestone.name || 'Unnamed Milestone'}`);
            } else {
                break;
            }

            console.log({ currentMilestone, userDays, milestoneDaysFromStart, milestone });
        }

        return currentMilestone;
    } catch (error) {
        logger.error(`Error in trainingDetailsHelper: ${error.message}`);
        return null;
    }
};
