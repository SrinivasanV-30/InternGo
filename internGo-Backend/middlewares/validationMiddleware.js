import { signUpValidationSchema,signInValidationSchema, userCreateValidationSchema } from "../schema/authenticationSchema.js";
import { taskSchema } from "../schema/dailyUpdateSchema.js";
import { feedbackValidationSchema } from "../schema/feedbackSchema.js";
import { interactionValidationSchema } from "../schema/interactionSchema.js";
import { milestoneCreateValidationSchema, milestoneUpdateValidationSchema, objectiveCreateValidationSchema,objectivesCreateValidationSchema, objectiveUpdateValidationSchema,objectivesUpdateValidationSchema, planCreateValidationSchema, planUpdateValidationSchema, usersPlanValidationSchema } from "../schema/planSchema.js";
import { assetUpdateValidationSchema, assetValidationSchema, profileUpdateValidationSchema } from "../schema/userProfileSchema.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";

export const emailValidation = async(req,res,next)=>{
    const authorizedDomain="finestcoder.com";
    const domain=req.body.email.split('@')[1];
    if(authorizedDomain!=domain)
    {
        logger.error("Not authorized domain. Please continue with a authorized domain.");
        return sendResponse(res,403,"Not authorized domain. Please continue with a authorized domain.");
    }
    next();
}
export const signUpValidation = async(req,res,next)=>{
    try{
        await signUpValidationSchema.validateAsync(req.body);
        next();
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}
export const signInValidation = async(req,res,next)=>{
    try{
        await signInValidationSchema.validateAsync(req.body);
        next();
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message);
    }
}
export const userCreateValidation = async(req,res,next)=>{
    try{
        await userCreateValidationSchema.validateAsync(req.body);
        next();
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const profileUpdateValidation = async(req,res,next)=>{
    try{
        await profileUpdateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const assetValidation = async(req,res,next)=>{
    try{
        await assetValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const assetUpdateValidation = async(req,res,next)=>{
    try{
        await assetUpdateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const planCreateValidation = async(req,res,next)=>{
    try{
        await planCreateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const planUpdateValidation = async(req,res,next)=>{
    try{
        await planUpdateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}


export const objectiveCreateValidation = async(req,res,next)=>{
    try{
        await objectiveCreateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const objectiveUpdateValidation = async(req,res,next)=>{
    try{
        await objectiveUpdateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const objectivesCreateValidation = async(req,res,next)=>{
    try{
        await objectivesCreateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const objectivesUpdateValidation = async(req,res,next)=>{
    try{
        await objectivesUpdateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}


export const milestoneCreateValidation = async(req,res,next)=>{
    try{
        await milestoneCreateValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const milestoneUpdateValidation = async(req,res,next)=>{
    try{
        await milestoneUpdateValidationSchema.validateAsync(req.body);
        next();     
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}


export const usersPlanValidation = async(req,res,next)=>{
    try{
        await usersPlanValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const dailyUpdateTaskValidation = async(req,res,next)=>{
    try{
        await taskSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const interactionValidation = async(req,res,next)=>{
    try{
        await interactionValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}

export const feedbackValidation = async(req,res,next)=>{
    try{
        await feedbackValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details[0].message)
    }
}
