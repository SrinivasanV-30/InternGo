import { signUpValidationSchema,signInValidationSchema, userCreateValidationSchema } from "../schema/authenticationSchema.js";
import { assetValidationSchema, profileUpdateValidationSchema } from "../schema/userProfileSchema.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";

export const emailValidation = (req,res,next)=>{
    const authorizedDomain="finestcoder.com";
    const domain=req.body.email.split('@')[1];
    if(authorizedDomain!=domain)
    {
        logger.error("Not authorized domain. Please continue with a authorized domain.");
        return sendResponse(res,403,"Not authorized domain. Please continue with a authorized domain.");
    }
    next();
}
export const signUpValidation = (req,res,next)=>{
    try{
        const result = signUpValidationSchema.validateAsync(req.body);
        result.then(()=>{
            next()
        })
        result.catch((error)=>{
            logger.error(error.details);
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        logger.error(error.details);
        return sendResponse(res,400,error.details)
    }
}
export const signInValidation = (req,res,next)=>{
    try{
        const result = signInValidationSchema.validateAsync(req.body);
        result.then(()=>{
            next()
        })
        result.catch((error)=>{
            logger.error(error.details);
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        logger.error(error.details);
        return sendResponse(res,400,error.details);
    }
}
export const userCreateValidation = (req,res,next)=>{
    try{
        const result = userCreateValidationSchema.validateAsync(req.body);
        result.then(()=>{
            next()
        })
        result.catch((error)=>{
            logger.error(error.details);
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        logger.error(error.details);
        return sendResponse(res,400,error.details)
    }
}

export const profileUpdateValidation = (req,res,next)=>{
    try{
        const result = profileUpdateValidationSchema.validateAsync(req.body);
        result.then(()=>{
            next()
        })
        result.catch((error)=>{
            logger.error(error.details);
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        logger.error(error.details);
        return sendResponse(res,400,error.details)
    }
}

export const assetValidation = (req,res,next)=>{
    try{
        const result = assetValidationSchema.validateAsync(req.body);
        result.then(()=>{
            next()
        })
        result.catch((error)=>{
            logger.error(error.details);
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        logger.error(error.details);
        return sendResponse(res,400,error.details)
    }
}