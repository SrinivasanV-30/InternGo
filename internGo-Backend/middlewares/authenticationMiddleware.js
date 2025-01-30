import { findUserByEmail } from "../models/userModel.js";
import { jwtVerify } from "../services/jwtService.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";

export const authenticateUser=async(req,res,next)=>{
    try{
        const authHeader=req.headers['authorization'];
        if(!authHeader){
            logger.error("Token not present!!!")
            return sendResponse(res,401,"Token not present!!!");
        }
        const token=authHeader.split(" ")[1];
        const user=await jwtVerify(token);

        req.user=user;
        console.log(req.user);
        next();
    }
    catch(error){
        logger.error(error.message);
        return sendResponse(res,401,error.message);
    }
}


export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try{
            const userEmail = req.user.email;
            const userDetails = await findUserByEmail(userEmail);
            if (!userDetails) {
                logger.error("User not found!!!")
                return sendResponse(res,404,"User not found!!!")
            }

            const userPermissions=userDetails.role.permissions;
            let flag=0;
            // console.log(userPermissions)
            // console.log(requiredPermission,userPermissions)
            await requiredPermission.forEach(item => {
                
                if (userPermissions.includes(item)) {
                    flag=1;
                }    
            });
            if(flag==0){
            logger.error("Access Denied. Permission not found");
            return sendResponse(res,401,"Access Denied. Permission not found");
            }
            if(flag==1)
            {
                return next();
            }

        }
        catch(error){
            logger.error(error.message)
        }
    };
  };

export const checkUser=async(req,res,next)=>{
    try{
        const id=req.params.id;
        
        console.log(req.user.userId,req.user.role)
        if(!id){
            logger.error("Invalid ID format!!!");
            return sendResponse(res,400,"Invalid ID format!!!");
        }
        if(req.user.role == "Admins" || id==req.user.userId){
            return next();
        }
        logger.error("Access Denied. Can not access other interns.");
        return sendResponse(res,401,"Access Denied. Can not access other interns.");
    }
    catch(error){
        logger.error(error.message);
    }
}