import { findUserByEmail } from "../models/userModel.js";
import { jwtVerify } from "../services/jwtService.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";

export const authenticateUser=async(req,res,next)=>{
    try{
        const authHeader=req.headers['authorization'];
        if(!authHeader){
            logger.error("Token not present!!!")
            return sendResponse(res,403,"Token not present!!!");
        }
        const token=authHeader.split(" ")[1];
        const user=await jwtVerify(token);
        req.user=user;
        // console.log(req.user);
        next();
    }
    catch(error){
        logger.error(error.message);
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
                    return next();
                }    
            });
            if(flag==0){
            logger.error("Access Denied. Permission not found");
            return sendResponse(res,403,"Access Denied. Permission not found");
            }

        }
        catch(error){
            logger.error(error.message)
        }
    };
  };

export const checkUser=async(req,res,next)=>{
    try{
        const id=parseInt(req.params.id);
        console.log("check",id)
        if(req.user.role != "Admin" && id!=req.user.userId){
            logger.error("Access Denied. Permission not found");
            return sendResponse(res,403,"Access Denied. Can not access other interns.");
        }
        next();
    }
    catch(error){
        logger.error(error.message);
    }
}