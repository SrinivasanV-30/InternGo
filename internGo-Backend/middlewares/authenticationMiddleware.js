import { findUserByEmail } from "../models/userModel.js";
import { jwtVerify } from "../services/jwtService.js";
import sendResponse from "../utils/response.js";

export const authenticateUser=async(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader.split(" ")[1];
    const user=await jwtVerify(token);
    req.user=user;
    // console.log(req.user);
    next();
}


export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try{
            const userEmail = req.user.email;
            const userDetails = await findUserByEmail(userEmail);
            if (!userDetails) {
                return sendResponse(res,404,"User not found!!!")
            }

            const userPermissions=userDetails.role.permissions;
            // console.log(userPermissions)
        
            if (userPermissions.includes(requiredPermission)) {
                return next();
            } 
            else {
                return res.status(403).send('Access Denied: Permission not found');
            }
        }
        catch(error){
            console.log(error);
        }
    };
  };