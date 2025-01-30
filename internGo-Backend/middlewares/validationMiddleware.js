import { signUpValidationSchema,signInValidationSchema, userCreateValidationSchema } from "../schema/authenticationSchema.js";
import { addUsersValidationSchema, milestoneCreateValidationSchema, milestoneUpdateValidationSchema, objectiveCreateValidationSchema, objectiveUpdateValidationSchema, planCreateValidationSchema, planUpdateValidationSchema } from "../schema/planSchema.js";
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details);
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
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
        return sendResponse(res,400,error.details)
    }
}


export const addUsersValidation = async(req,res,next)=>{
    try{
        await addUsersValidationSchema.validateAsync(req.body);
        next(); 
    }
    catch(error)
    {
        logger.error(`${JSON.stringify(error.details)}`);
        return sendResponse(res,400,error.details)
    }
}