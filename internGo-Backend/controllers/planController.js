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
    getTrainingPlan,
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
import { sendNotification } from "../services/notificationService.js";

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
        const createdObjectives = await createObjectives(objectiveData);

        logger.info("Objective added successfully!");
        return sendResponse(res, 201, "Objective added successfully!", createdObjectives);
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
        const existingObjective = await getObjectiveById(objectiveId);
        if (!existingObjective) {
            logger.error("Objective not found!!!");
            return sendResponse(res, 404, "Objective not found!!!");
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


export const createMultipleObjectives = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const milestoneId = req.body.objectiveDatas[0].milestoneId;
        const objectiveDatas = req.body.objectiveDatas;

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

        const createdObjectives = await createObjectives(objectiveDatas);

        logger.info("Objectives added successfully!");
        return sendResponse(res, 201, "Objectives added successfully!", createdObjectives);
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateMultipleObjectives = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const objectiveDatas = req.body.objectiveDatas;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        let updatedDatas = [];
        await objectiveDatas.forEach(async (objectiveData) => {
            console.log(objectiveData)
            const objective = await getObjectiveById(objectiveData.objectiveId)
            if (!objective) {
                logger.error("Objective not found!!!");
                sendResponse(res, 404, "Objective not found!!!", objectiveData);
                throw new Error("Objective not found!!!");

            }
            const updatedObjective = await updateObjectives(objectiveData.objectiveId, objectiveData.objectiveData);
            if (!updatedObjective) {
                logger.info("Update unsuccessful");
                return sendResponse(res, 400, "Update unsuccessful");
            }
            updatedDatas.push(updatedObjective);
        })
        logger.info("Updated successfully");
        sendResponse(res, 200, "Update successful", updatedDatas);
    } catch (error) {
        logger.error(error.message);
    }
};

export const createMilestone = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const milestoneData = req.body;
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        let totalMilestoneDays=0;
        existingPlan.milestones.forEach((milestone)=>{
            totalMilestoneDays+=milestone.milestoneDays;
            if(totalMilestoneDays>existingPlan.planDays){
                logger.error("Milestone days must not exceed total plan days.");
                return sendResponse(res, 400, "Milestone days must not exceed total plan days.");
            }
        })
        if(totalMilestoneDays+milestoneData.milestoneDays>existingPlan.planDays){
            logger.error("Milestone days must not exceed total plan days.");
            return sendResponse(res, 400, "Milestone days must not exceed total plan days.");
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
        milestoneData.mentorId=mentorDetails.id;
        const createdMilestone = await createMilestones(milestoneData);
        logger.info("Milestone added successfully!");
        return sendResponse(res, 201, "Milestone added successfully!", createdMilestone);
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateMilestone = async (req, res) => {
    try {
        const planId = parseInt(req.params.id);
        const { milestoneId, milestoneData } = req.body;
        // console.log(milestoneId)
        const existingPlan = await getPlanById(planId);
        if (!existingPlan) {
            logger.error("Plan not found!!!");
            return sendResponse(res, 404, "Plan not found!!!");
        }
        if(milestoneData.milestoneDays){
            let totalMilestoneDays=0;
            existingPlan.milestones.forEach((milestone)=>{
                if(milestone.id!=milestoneId){
                    totalMilestoneDays+=milestone.milestoneDays;
                    if(totalMilestoneDays>existingPlan.planDays){
                        logger.error("Milestone days must not exceed total plan days.");
                        return sendResponse(res, 400, "Milestone days must not exceed total plan days.");
                    }
                }
            })
            if(totalMilestoneDays+milestoneData.milestoneDays>existingPlan.planDays){
                logger.error("Milestone days must not exceed total plan days.");
                return sendResponse(res, 400, "Milestone days must not exceed total plan days.");
            }
        }
        const existingMilestone = await getMilestoneById(milestoneId);
        if (!existingMilestone) {
            logger.error("Milestone not found!!!");
            return sendResponse(res, 404, "Milestone not found!!!");
        }
        if(milestoneData.mentorName)
        {
            const mentorDetails = await findUserByName(milestoneData.mentorName);
            if (!mentorDetails) {
                logger.error("Mentor not found!!!");
                return sendResponse(res, 404, "Mentor not found!!!");
            }
            if (mentorDetails.role.roleName != "Mentors") {
                logger.error("User is not a mentor!!");
                return sendResponse(res, 403, "User is not a mentor!!");
            }
            milestoneData.mentorId=mentorDetails.id;
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
            const updatedUser = await updateUser(userId, { planId: planId, planStartDate: new Date(), daysWorked:0 });
            if (!updatedUser) {
                logger.info("Update unsuccessful");
                return sendResponse(res, 400, "Update unsuccessful");
            }
            sendNotification(userId,'added-user',null,`You have been added to the "${existingPlan.name}" plan.`)
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
        const { name, year, status, batch, designation, planStatus } = req.body || {};
        const planId = parseInt(req.params.id);
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const whereCondition = {
            role: { roleName: "Interns" },
        };
        if (name && name.trim() !== "") {
            // const searchedInterns = await getInternBasedOnSearch(
            //     name.trim(),
            //     offset,
            //     limit
            // );
            // searchedInterns.forEach((intern)=>{
            //     if(intern.profilePhoto)
            //     {intern.profilePhoto=process.env.AWS_BUCKET_DOMAIN+intern.profilePhoto;
            //     console.log(intern.profilePhoto)}
            // })
            // const total_items = await internsCount({ name: name.trim() });
            // const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;

            // return sendResponse(res, 200, "Fetched successfully", {
            //     data: searchedInterns,
            //     total_pages,
            // });
            whereCondition.name = {
                contains: name,
                mode: 'insensitive'
            };
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
        // console.log(whereCondition);
        const interns = await getInternBasedOnFilters(
            whereCondition,
            offset,
            limit
        );
        interns.forEach((intern) => {
            if (intern.profilePhoto && !(intern.profilePhoto.includes("https://lh3.googleusercontent.com/"))) {
                intern.profilePhoto = process.env.AWS_BUCKET_DOMAIN + intern.profilePhoto;
                // console.log(intern.profilePhoto)
            }
        })
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
