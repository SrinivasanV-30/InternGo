import sendResponse from "../utils/response.js";
import { findUserByUserId, getAllInterns, getInternBasedOnFilters, getInternBasedOnSearch, internsCount, updateUser } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { profilePercentage } from "../utils/profilePercentage.js";
import { createAsset, getAssetByUserId, updateAsset } from "../models/assetModel.js";
import { uploadImageToS3 } from "../services/s3Service.js";
import cron from 'node-cron';


export const getAllIntern = async(req,res)=>{
    try{
        const allIntern=await getAllInterns();
        
        sendResponse(res,200,"Fetched successfully",allIntern);
    }
    catch(error){

        logger.error(error,"User Controller");
    }

}

export const updateUserProfile = async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        const userData=req.body;
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found!!!");
            return sendResponse(res,404,"User not found!!!");
        }
        if ("dateOfJoining" in userData) {
            if (isNaN(new Date(userData.dateOfJoining))) {
                return sendResponse(res, 400, "Invalid dateOfJoining format. Please use a valid date.");
            }
            userData.dateOfJoining = new Date(userData.dateOfJoining);
        }
        if(userData.profilePhoto){
            const imageData=await uploadImageToS3(userData.profilePhoto,userDetails.name);
            if(!imageData){
                return sendResponse(res, 400, "Invalid image!!!");
            }
            userData.profilePhoto=imageData.Location;
        }
        if ("dateOfBirth" in userData) {
            if (isNaN(new Date(userData.dateOfBirth))) {
                return sendResponse(res, 400, "Invalid dateOfBirth format. Please use a valid date.");
            }
            userData.dateOfBirth = new Date(userData.dateOfBirth);
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
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
    }
}

export const updateUserAsset=async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        const userAsset=req.body;
        if ("givenOn" in userAsset) {
            if (isNaN(new Date(userAsset.givenOn))) {
                return sendResponse(res, 400, "Invalid givenOn format. Please use a valid date.");
            }
            userAsset.givenOn = new Date(userAsset.givenOn);
        }
        if ("returnedOn" in userAsset) {
            if (isNaN(new Date(userAsset.returnedOn))) {
                return sendResponse(res, 400, "Invalid returnedOn format. Please use a valid date.");
            }
            userAsset.returnedOn = new Date(userAsset.returnedOn);
        }
        const updatedAsset=await updateAsset(userId,userAsset);
        logger.info("Updated asset successfully");
        sendResponse(res,201,"Updated asset successfully",updatedAsset);
    }
    catch(error){
        logger.error(error.message);
    }
}

// export const getInternsWithFilters=async(req,res)=>{
//     try{
//         const limit=parseInt(req.query.limit);
//         const offset=parseInt(req.query.offset);
//         const filters=req.body;
//         const whereCondition = {
//             role: { roleName: "Interns" },
//         };

//         if (filters.year && filters.year.length > 0) {
//             whereCondition.year = { in: filters.year };
//         }
//         if (filters.status && filters.status.length > 0) {
//             whereCondition.status = { in: filters.status };
//         }
//         if (filters.batch && filters.batch.length > 0) {
//             whereCondition.batch = { in: filters.batch };
//         }
//         if (filters.designation && filters.designation.length > 0) {
//             whereCondition.designation = { in: filters.designation };
//         }
//         const interns=await getInternBasedOnFilters(whereCondition,offset,limit);
//         const total_items=await internsCount(whereCondition);
//         // console.log(total_items)
//         const  total_pages = total_items==0 ? 0 : (total_items-1) / limit+1;
//         // console.log(total_pages);
//         const response={
//             data:interns,
//             total_pages:total_pages
//         }
//         logger.info("Fetched successfully!!");
//         sendResponse(res,200,"Fetched successfully",response);
//     }
//     catch(error)
//     {
//         logger.error(error.message);
//     }
// }

// export const searchInterns=async(req,res)=>{
//     try{
//         const intern=req.body;

//         const limit=parseInt(req.query.limit);
//         const offset=parseInt(req.query.offset);
//         if(internName==""){
            
//             logger.info("Fetched successfully!!");
//             return sendResponse(res,200,"Fetched successfully",interns);
//         }
//         console.log(internName.name)
//         const searchedInterns=await getInternBasedOnSearch(internName.name,offset,limit);
//         const total_items=await internsCount(internName);
//         let total_pages;
//         // console.log(total_items)
//         if(total_items==1){
//             total_pages=1;
//         }
//         else{
//             total_pages = total_items==0 ? 0 : (total_items-1) / limit+1;
//         }
//         console.log(total_pages);
//         const response={
//             data:searchedInterns,
//             total_pages:total_pages
//         }
//         logger.info("Fetched successfully!!");
//         sendResponse(res,200,"Fetched successfully",response);
//     }
//     catch(error){
//         logger.error(error.message);
//     }
// }


export const getInterns = async (req, res) => {
    try {
        const { name, year, status, batch, designation } = req.body || {};
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const whereCondition = {
            role: { roleName: "Interns" },
        };

        if (name && name.trim() !== "") {
            const searchedInterns = await getInternBasedOnSearch(name.trim(), offset, limit);
            const total_items = await internsCount({ name: name.trim() });
            const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;

            return sendResponse(res, 200, "Fetched successfully", {
                data: searchedInterns,
                total_pages,
            });
        }

        if (year && year.length > 0) {
            whereCondition.year = { in: year };
        }
        if (status && status.length > 0) {
            whereCondition.status = { in: status };
        }
        if (batch && batch.length > 0) {
            whereCondition.batch = { in: batch };
        }
        if (designation && designation.length > 0) {
            whereCondition.designation = { in: designation };
        }

        const interns = await getInternBasedOnFilters(whereCondition, offset, limit);
        const total_items = await internsCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;

        sendResponse(res, 200, "Fetched successfully", {
            data: interns,
            total_pages,
        });
    } catch (error) {
        logger.error(`Error fetching interns: ${error.message}`);
        sendResponse(res, 500, "Internal server error");
    }
};
