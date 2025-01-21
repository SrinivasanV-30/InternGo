import { signUpValidationSchema,signInValidationSchema } from "../schema/authenticationSchema.js";
import sendResponse from "../utils/response.js";

export const emailValidation = (req,res,next)=>{
    const authorizedDomain="finestcoder.com";
    const domain=req.body.email.split('@')[1];
    if(authorizedDomain!=domain)
    {
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
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
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
            return sendResponse(res,400,error.details);
        })
    }
    catch(error)
    {
        console.log(error)
    }
}