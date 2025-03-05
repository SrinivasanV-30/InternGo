import logger from '../utils/logger.js';

export const trainingDetailsHelper = async (userPlan) => {
    try {
        let userId = userPlan.id;
        let currentMilestone = null;

        if (!userPlan.plan || !userPlan.plan.startDate) {
            logger.error(`Invalid user plan structure for user ${userId}`);
            return null;
        }

        let startDate = new Date(userPlan.plan.startDate); // Clone startDate
        let now = new Date();
        let userDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

        for (const milestone of userPlan.plan.milestones) {
            if (!milestone.milestoneDays || isNaN(milestone.milestoneDays)) {
                logger.error(`Skipping invalid milestone for user ${userId}`);
                continue;
            }

            let milestoneDate = new Date(startDate.getTime());
            milestoneDate.setDate(startDate.getDate() + milestone.milestoneDays);

            let milestoneDaysFromStart = Math.floor((milestoneDate - startDate) / (1000 * 60 * 60 * 24));

            if (userDays >= milestoneDaysFromStart) {
                currentMilestone = milestone;
                logger.info(`Milestone reached for user ${userId}`);
            }

            console.log({ currentMilestone, userDays, milestoneDaysFromStart, milestone });
        }

        return currentMilestone;
    } catch (error) {
        logger.error(`Error in trainingDetailsHelper: ${error.message}`);
        return null;
    }
};
