import {
    createObjectives,
    deleteObjectives,
    getObjectiveById,
    getObjectiveByName,
    updateObjectives,
} from "../models/objectiveModel.js";
import {
    createPlans,
    getPlanByName,
    getPlanById,
    updatePlans,
    getPlans,
    deletePlans,
} from "../models/planModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import {
    findUserByName,
    findUserByUserId,
    getInternBasedOnFilters,
    getInternBasedOnSearch,
    internsCount,
    updateUser,
} from "../models/userModel.js";
import {
    getMilestoneById,
    getMilestoneByName,
    createMilestones,
    updateMilestones,
    deleteMilestones,
} from "../models/milestoneModel.js";

export const getAllPlans = async (req, res) => {
    try {
        const allPlans = await getPlans();
        logger.info("Fetched Successfully");
        sendResponse(res, 200, "Fetched Successfully", allPlans);
    } catch (error) {
        logger.error(error.message);
    }
};

export const getPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const plan = await getPlanById(planId);
        plan.count = plan.users.length;
        logger.info("Fetched Successfully");
        sendResponse(res, 200, "Fetched Successfully", plan);
    } catch (error) {
        logger.error(error.message);
    }
};

export const createPlan = async (req, res) => {
    try {
        const planData = req.body;
        const existingPlan = await getPlanByName(planData.name);
        if (existingPlan) {
            logger.error("Plan already exists");
            return sendResponse(res, 409, "Plan already exists");
        }
        const createdPlan = await createPlans(planData);
        if (!createdPlan) {
            logger.error("Plan create unsuccessful!!");
            return sendResponse(res, 400, "Plan create unsuccessful!!");
        }
        logger.info("Plan created successfully!!");
        sendResponse(res, 201, "Plan created successfully!!", createdPlan);
    } catch (error) {
        logger.error(error.message);
    }
};

export const updatePlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const planData = req.body;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const updatedPlan = await updatePlans(planId, planData);
        if (!updatedPlan) {
            logger.info("Update unsuccessful");
            return sendResponse(res, 400, "Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res, 200, "Update successful", updatedPlan);
    } catch (error) {
        logger.error(error.message);
    }
};

export const createObjective = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const milestoneId = req.body.milestoneId;
        const objectiveData = req.body;
        const existingObjective = await getObjectiveByName(objectiveData.name);
        if (existingObjective) {
            logger.error("Objective already exists");
            return sendResponse(res, 409, "Objective already exists");
        }
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const existingMilestone = await getMilestoneById(milestoneId);
        console.log(existingMilestone);
        if (!existingMilestone) {
            logger.error("Milestone not found!!!");
            return sendResponse(res, 404, "Milestone not found!!!");
        }
        await createObjectives(objectiveData);
        
        logger.info("Objective added successfully!");
        return sendResponse(res, 201, "Objective added successfully!");
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateObjective = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const { objectiveId, objectiveData } = req.body;
        console.log(objectiveId);
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const updatedObjective = await updateObjectives(objectiveId, objectiveData);
        if (!updatedObjective) {
            logger.info("Update unsuccessful");
            return sendResponse(res, 400, "Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res, 200, "Update successful", updatedObjective);
    } catch (error) {
        logger.error(error.message);
    }
};

export const createMilestone = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const milestoneData = req.body;
        const existingMilestone = await getMilestoneByName(milestoneData.name);
        if (existingMilestone) {
            logger.error("Milestone already exists");
            return sendResponse(res, 409, "Milestone already exists");
        }
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const mentorDetails = await findUserByName(milestoneData.mentorName);
        if (!mentorDetails) {
            logger.error("Mentor not found!!!");
            return sendResponse(res, 404, "Mentor not found!!!");
        }
        if (mentorDetails.role.roleName != "Mentors") {
            logger.error("User is not a mentor!!");
            return sendResponse(res, 403, "User is not a mentor!!");
        }
        milestoneData.planId = planId;
        await createMilestones(milestoneData);

        logger.info("Milestone added successfully!");
        return sendResponse(res, 201, "Milestone added successfully!");
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateMilestone = async (req, res) => {
    try {
        const { milestoneId, milestoneData } = req.body;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        const existingMilestone = await getMilestoneById(milestoneId);
        if (!existingMilestone) {
            logger.error("Milestone not found!!!");
            return sendResponse(res, 404, "Milestone not found!!!");
        }
        const mentorDetails = await findUserByName(milestoneData.mentorName);
        if (!mentorDetails) {
            logger.error("Mentor not found!!!");
            return sendResponse(res, 404, "Mentor not found!!!");
        }
        if (mentorDetails.role.roleName != "Mentors") {
            logger.error("User is not a mentor!!");
            return sendResponse(res, 403, "User is not a mentor!!");
        }
        const updatedMilestone = await updateMilestones(milestoneId, milestoneData);
        if (!updatedMilestone) {
            logger.info("Update unsuccessful");
            return sendResponse(res, 400, "Update unsuccessful");
        }
        logger.info("Milestone updated successfully!");
        return sendResponse(res, 200, "Milestone updated successfully!");
    } catch (error) {
        logger.error(error.message);
    }
};

export const addUsers = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const userIds = req.body.userIds;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        userIds.forEach(async (userId) => {
            const existingUser = await findUserByUserId(userId);
            if (!existingUser) {
                logger.error("User not found!!!");
                return sendResponse(res, 404, "User not found!!!");
            }
            const updatedUser = await updateUser(userId, { planId: planId });
            if (!updatedUser) {
                logger.info("Update unsuccessful");
                return sendResponse(res, 400, "Update unsuccessful");
            }
        });
        logger.info("Added interns successfully");
        sendResponse(res, 200, "Added interns successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const deletePlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        await deletePlans(planId);
        logger.info("Deleted successfully!!!");
        sendResponse(res, 204, "Deleted successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const deleteMilestone = async (req, res) => {
    try {
        const milestoneId = parseInt(req.params.id);
        const existingMilestone = await getMilestoneById(milestoneId);
        if (!existingMilestone) {
            logger.error("Milestone not found!!!");
            return sendResponse(res, 404, "Milestone not found!!!");
        }
        await deleteMilestones(milestoneId);
        logger.info("Deleted successfully!!!");
        sendResponse(res, 204, "Deleted successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const deleteObjective = async (req, res) => {
    try {
        const objectiveId = parseInt(req.params.id);
        const existingObjective = await getObjectiveById(objectiveId);
        if (!existingObjective) {
            logger.error("Objective not found!!!");
            return sendResponse(res, 404, "Objective not found!!!");
        }
        await deleteObjectives(objectiveId);
        logger.info("Deleted successfully!!!");
        sendResponse(res, 204, "Deleted successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const removeUsers = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const userIds = req.body.userIds;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        userIds.forEach(async (userId) => {
            const existingUser = await findUserByUserId(userId);
            if (!existingUser) {
                logger.error("User not found!!!");
                return sendResponse(res, 404, "User not found!!!");
            }
            const updatedUser = await updateUser(userId, { planId: null });
            if (!updatedUser) {
                logger.info("Update unsuccessful");
                return sendResponse(res, 400, "Update unsuccessful");
            }
        });
        logger.info("Removed interns successfully");
        sendResponse(res, 200, "Removed interns successfully");
    } catch (error) {
        logger.error(error.message);
    }
};

export const getPlanUsers = async (req, res) => {
    try {
        const { name, year, status, batch, designation, planStatus } =req.body || {};
        const planId = parseInt(req.params.id);
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const whereCondition = {
            role: { roleName: "Interns" },
        };
        if (name && name.trim() !== "") {
            const searchedInterns = await getInternBasedOnSearch(
                name.trim(),
                offset,
                limit
            );
            const total_items = await internsCount({ name: name.trim() });
            const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;

            return sendResponse(res, 200, "Fetched successfully", {
                data: searchedInterns,
                total_pages,
            });
        }
        if (planStatus) {
            if (planStatus === "Present") {
                whereCondition.planId = planId;
            }
            if (planStatus === "Not Present") {
                
                whereCondition.OR = [
                    { planId: null },
                    { planId: { not: planId } }
                ]
            }
        }
        if (year && year.length > 0) {
            whereCondition.year = { in: year };
        }
        if (status && status.length > 0) {
            whereCondition.status = { in: status };
        }
        if (batch && batch.length > 0) {
            whereCondition.batch = { in: batch };
        }
        if (designation && designation.length > 0) {
            whereCondition.designation = { in: designation };
        }
        console.log(whereCondition);
        const interns = await getInternBasedOnFilters(
            whereCondition,
            offset,
            limit
        );
        const total_items = await internsCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
        sendResponse(res, 200, "Fetched successfully", {
            data: interns,
            total_pages,
        });
    } catch (error) {
        logger.error(`Error fetching interns: ${error.message}`);
        sendResponse(res, 500, "Internal server error");
    }
};

export const getTrainingDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const userPlan = await getTrainingPlan(userId);
        console.log(userPlan);
        const trainingPlan = await getPlanById(userPlan.planId);
        if (!trainingPlan) {
            logger.error("Training plan not found!!!");
            return sendResponse(res, 404, "Training plan not found!!!");
        }
        const milestones = trainingPlan.milestones;
        console.log(userId, milestones);
        if (!milestones) {
            logger.error("Milestones not found!!!");
            return sendResponse(res, 404, "Milestones not found!!!");
        }
        milestones.forEach((milestone) => {
            if (milestone.milestoneDays >= userPlan.daysWorked) {
                logger.info("Training plan fetched!!");
                return sendResponse(
                    res,
                    200,
                    "Training fetched successfully",
                    milestone
                );
            }
        });
    } catch (error) {
        logger.error(error.message);
    }
};
