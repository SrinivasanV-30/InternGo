
import { createObjectives, updateObjectives } from "../models/objectiveModel.js";
import { createPlans,getPlanByName,getPlanById,updatePlans, getPlans } from "../models/planModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { findUserByUserId, updateUser } from "../models/userModel.js";

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
            return sendResponse(res,201,"Plan create unsuccessful!!");
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
            return sendResponse(res,500,"Update unsuccessful");
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
        const objectiveData=req.body;
        const existingObjective=await getPlanByName(planData.name);
        if(existingObjective)
        {
            logger.error("Plan already exists");
            return sendResponse(res,409,"Plan already exists");
        }
        const existingPlan=await getPlanById(planId);
        if(!existingPlan)
        {
            logger.error("Plan not found!!!");
            return sendResponse(res,404,"Plan not found!!!");
        }
        objectiveData.planId=planId;
        await createObjectives(objectiveData);
        logger.info("Objective added successfully!");
        return sendResponse(res,404,"Objective added successfully!");
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
        const updatedObjective=await updateObjectives(planId,objectiveId,objectiveData);
        if(!updatedObjective)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,500,"Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res,200,"Update successful",updatedObjective);

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
        if(!updatedObjective)
        {
            logger.info("Update unsuccessful");
            return sendResponse(res,500,"Update unsuccessful");
        }
        logger.info("Updated successfully");
        sendResponse(res,200,"Update successful",updatedObjective);
    }
    catch(error){
        logger.error(error.message);
    }
}
