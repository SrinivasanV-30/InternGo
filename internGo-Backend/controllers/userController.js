import sendResponse from "../utils/response.js";
import { findUserByUserId, getAllInterns, updateUser } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { profilePercentage } from "../utils/profilePercentage.js";


export const getAllIntern = async(req,res)=>{
    try{
        const allIntern=await getAllInterns();
        
        sendResponse(res,200,"Fetched successfully",allIntern);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateUserProfile = async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        const userData=req.body;
        if ("dateOfJoining" in userData) {
            if (isNaN(new Date(userData.dateOfJoining))) {
                return sendResponse(res, 400, "Invalid dateOfJoining format. Please use a valid date.");
            }
            userData.dateOfJoining = new Date(userData.dateOfJoining);
        }
      
        if ("dateOfBirth" in userData) {
            if (isNaN(new Date(userData.dateOfBirth))) {
                return sendResponse(res, 400, "Invalid dateOfBirth format. Please use a valid date.");
            }
            userData.dateOfBirth = new Date(userData.dateOfBirth);
        }
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found!!!");
            return sendResponse(res,404,"User not found!!!");
        }
        const updatedUserProfile=await updateUser(userId,userData);
        if(!updatedUserProfile){
            return sendResponse(res,400,"Update unsuccessful");
        }
        const percentage=await profilePercentage(updatedUserProfile);
        const response = {data:updatedUserProfile,profilePercentage:percentage};
        logger.info("Updated successfully");
        sendResponse(res,200,"Updated successfully",response);
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getUser=async(req,res)=>{
    try{
        const userId=req.params.id;
        console.log(userId)
        const internProfile=await findUserByUserId(userId);
        sendResponse(res,200,"Fetched successfully",internProfile);
    }
    catch(error){
        logger.error(error.message);
    }
}