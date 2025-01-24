import sendResponse from "../utils/response.js";
import { findUserByUserId, getAllInterns, updateUser } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { profilePercentage } from "../utils/profilePercentage.js";
import { createAsset, getAssetByUserId } from "../models/assetModel.js";
import handleError from "../utils/handleError.js";


export const getAllIntern = async(req,res)=>{
    try{
        const allIntern=await getAllInterns();
        
        sendResponse(res,200,"Fetched successfully",allIntern);
    }
    catch(error){
        handleError(error,"User Controller");
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
        const updatedUserProfilePercentage=await updateUser(userId,{profilePercentage:percentage});
        const response = {data:updatedUserProfile,profilePercentage:updatedUserProfilePercentage.profilePercentage};
        logger.info("Updated successfully");
        sendResponse(res,200,"Updated successfully",response);
    }
    catch(error){
        handleError(error,"User Controller");
    }
}

export const getUser=async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        console.log(userId)
        const internProfile=await findUserByUserId(userId);
        sendResponse(res,200,"Fetched successfully",internProfile);
    }
    catch(error){
        handleError(error,"User Controller");
    }
}
export const getUserAssets=async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        const assets=await getAssetByUserId(userId);
        logger.info("Assets fetched successfully");
        sendResponse(res,200,"Assets fetched successfully",assets)
    }
    catch(error){
        handleError(error,"User Controller");
    }
}

export const createUserAsset=async(req,res)=>{
    try{
        const userAsset=req.body;
        userAsset.givenOn=new Date(userAsset.givenOn);
        console.log(userAsset)
        const createdAsset=await createAsset(userAsset);
        logger.info("Created asset successfully");
        sendResponse(res,201,"Created asset successfully",createdAsset);
    }
    catch(error){
        handleError(error,"User Controller");
    }
}