
import { createObjectives, getObjectiveByName, updateObjectives } from "../models/objectiveModel.js";
import { createPlans,getPlanByName,getPlanById,updatePlans, getPlans } from "../models/planModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { findUserByUserId, updateUser } from "../models/userModel.js";
import { getMilestoneById,getMilestoneByName,createMilestones, updateMilestones } from "../models/milestoneModel.js";

export const getAllPlans=async(req,res)=>{
    try{
        const allPlans=await getPlans();
        logger.info("Fetched Successfully");
        sendResponse(res,200,"Fetched Successfully",allPlans)
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getPlan=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const plan=await getPlanById(planId);
        logger.info("Fetched Successfully");
        sendResponse(res,200,"Fetched Successfully",plan)
    }
    catch(error){
        logger.error(error.message);
    }
}

export const createPlan=async(req,res)=>{
    try{
        const planData=req.body;
        const existingPlan=await getPlanByName(planData.name);
        if(existingPlan)
        {
            logger.error("Plan already exists");
            return sendResponse(res,409,"Plan already exists");
        }
        const createdPlan=await createPlans(planData);
        if(!createdPlan){
            logger.error("Plan create unsuccessful!!");
            return sendResponse(res,400,"Plan create unsuccessful!!");
        }
        logger.info("Plan created successfully!!");
        sendResponse(res,201,"Plan created successfully!!",createdPlan);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updatePlan=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const planData=req.body;
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const updatedPlan=await updatePlans(planId,planData);
        if(!updatedPlan)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,400,"Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res,200,"Update successful",updatedPlan);

    }
    catch(error){
        logger.error(error.message);
    }
}

export const createObjective=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const milestoneId=req.body.milestoneId;
        const objectiveData=req.body;
        const existingObjective=await getObjectiveByName(objectiveData.name);
        if(existingObjective)
        {
            logger.error("Objective already exists");
            return sendResponse(res,409,"Objective already exists");
        }
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const existingMilestone=await getMilestoneById(milestoneId);
        console.log(existingMilestone)
        if(!existingMilestone)
        {
            logger.error("Milestone not found!!!");
            return sendResponse(res,404,"Milestone not found!!!");
        }
        await createObjectives(objectiveData);
        logger.info("Objective added successfully!");
        return sendResponse(res,201,"Objective added successfully!");
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateObjective=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const {objectiveId,objectiveData}=req.body;
        console.log(objectiveId)
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const updatedObjective=await updateObjectives(objectiveId,objectiveData);
        if(!updatedObjective)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,400,"Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res,200,"Update successful",updatedObjective);

    }
    catch(error){
        logger.error(error.message);
    }
}


export const createMilestone=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const milestoneData=req.body;
        const existingMilestone=await getMilestoneByName(milestoneData.name);
        if(existingMilestone)
        {
            logger.error("Milestone already exists");
            return sendResponse(res,409,"Milestone already exists");
        }
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        milestoneData.planId=planId;
        await createMilestones(milestoneData);

        logger.info("Milestone added successfully!");
        return sendResponse(res,201,"Milestone added successfully!");
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateMilestone=async(req,res)=>{
    try{
        
        const {milestoneId,milestoneData}=req.body;
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const existingMilestone=await getMilestoneById(milestoneId);
        if(!existingMilestone)
        {
            logger.error("Milestone not found!!!");
            return sendResponse(res,404,"Milestone not found!!!");
        }
        const updatedMilestone=await updateMilestones(milestoneId,milestoneData);
        if(!updatedMilestone)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,400,"Update unsuccessful");
        }
        logger.info("Milestone updated successfully!");
        return sendResponse(res,200,"Milestone updated successfully!");
    }
    catch(error){
        logger.error(error.message);
    }
}

export const addUser=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const userId=req.body.userId;
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        const existingUser=await findUserByUserId(userId);
        if(!existingUser)
        {
            logger.error("User not found!!!");
            return sendResponse(res,404,"User not found!!!");
        }
        const updatedUser=await updateUser(userId,{planId:planId})
        if(!updatedUser)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,400,"Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res,200,"Update successful",updatedUser);
    }
    catch(error){
        logger.error(error.message);
    }
}


