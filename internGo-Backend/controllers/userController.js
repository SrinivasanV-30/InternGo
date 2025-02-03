import sendResponse from "../utils/response.js";
import {
    findUserByUserId,
    getInternBasedOnFilters,
    getInternBasedOnSearch,
    getTrainingPlan,
    internsCount,
    updateUser,
} from "../models/userModel.js";
import logger from "../utils/logger.js";
import { profilePercentage } from "../utils/profilePercentage.js";
import {
    createAsset,
    getAssetByUserId,
    updateAsset,
} from "../models/assetModel.js";
import { uploadImageToS3 } from "../services/s3Service.js";
import url from 'url';
// import cron from "node-cron";
import { getPlanById } from "../models/planModel.js";

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found!!!");
            return sendResponse(res, 404, "User not found!!!");
        }
        if ("dateOfJoining" in userData) {
            if (isNaN(new Date(userData.dateOfJoining))) {
                return sendResponse(
                    res,
                    400,
                    "Invalid dateOfJoining format. Please use a valid date."
                );
            }
            userData.dateOfJoining = new Date(userData.dateOfJoining);
        }
        if (userData.profilePhoto) {
            const key = await uploadImageToS3(
                userData.profilePhoto,
                userDetails.name
            );
            if (!key) {
                return sendResponse(res, 400, "Invalid image!!!");
            }
            
            userData.profilePhoto = key;
        }
        if ("dateOfBirth" in userData) {
            if (isNaN(new Date(userData.dateOfBirth))) {
                return sendResponse(
                    res,
                    400,
                    "Invalid dateOfBirth format. Please use a valid date."
                );
            }
            userData.dateOfBirth = new Date(userData.dateOfBirth);
        }
        const updatedUserProfile = await updateUser(userId, userData);
        if (!updatedUserProfile) {
            return sendResponse(res, 400, "Update unsuccessful");
        }
        const percentage = await profilePercentage(updatedUserProfile);
        const updatedUserProfilePercentage = await updateUser(userId, {
            profilePercentage: percentage,
        });
        const response = {
            data: updatedUserProfile,
            profilePercentage: updatedUserProfilePercentage.profilePercentage,
        };
        logger.info("Updated successfully");
        sendResponse(res, 200, "Updated successfully", response);
    } catch (error) {
        logger.error(error.message);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found!!!");
            return sendResponse(res, 404, "User not found!!!");
        }
        const internProfile = await findUserByUserId(userId);
        if(internProfile.profilePhoto)
        {
            internProfile.profilePhoto=process.env.AWS_BUCKET_DOMAIN+internProfile.profilePhoto;
            console.log(internProfile.profilePhoto)
        }
        sendResponse(res, 200, "Fetched successfully", internProfile);
    } catch (error) {
        logger.error(error.message);
    }
};
export const getUserAssets = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found!!!");
            return sendResponse(res, 404, "User not found!!!");
        }
        const assets = await getAssetByUserId(userId);
        logger.info("Assets fetched successfully");
        sendResponse(res, 200, "Assets fetched successfully", assets);
    } catch (error) {
        logger.error(error.message);
    }
};

export const createUserAsset = async (req, res) => {
    try {
        const userAsset = req.body;
        const userDetails = await findUserByUserId(userAsset.userId);
        if(!userDetails)
        {
            logger.error("User not found!!!");
            return sendResponse(res, 404, "User not found!!!");
        }
        userAsset.givenOn = new Date(userAsset.givenOn);
        console.log(userAsset);
        const createdAsset = await createAsset(userAsset);
        logger.info("Created asset successfully");
        sendResponse(res, 201, "Created asset successfully", createdAsset);
    } catch (error) {
        logger.error(error.message);
    }
};

export const updateUserAsset = async (req, res) => {
    try {
        const assetId = parseInt(req.params.id);
        const userAsset = req.body;
        if ("givenOn" in userAsset) {
            if (isNaN(new Date(userAsset.givenOn))) {
                return sendResponse(
                    res,
                    400,
                    "Invalid givenOn format. Please use a valid date."
                );
            }
            userAsset.givenOn = new Date(userAsset.givenOn);
        }
        if ("returnedOn" in userAsset) {
            if (isNaN(new Date(userAsset.returnedOn))) {
                return sendResponse(
                    res,
                    400,
                    "Invalid returnedOn format. Please use a valid date."
                );
            }
            userAsset.returnedOn = new Date(userAsset.returnedOn);
        }
        const updatedAsset = await updateAsset(assetId, userAsset);
        logger.info("Updated asset successfully");
        sendResponse(res, 201, "Updated asset successfully", updatedAsset);
    } catch (error) {
        logger.error(error.message);
    }
};

export const getInterns = async (req, res) => {
    try {
        const { name, year, status, batch, designation } = req.body || {};
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const whereCondition = {
            role: { roleName: "Interns" },
        };
        if (name && name.trim() !== "") {
            // const searchedInterns = await getInternBasedOnSearch(
            //     name.trim(),
            //     offset,
            //     limit
            // );
            // searchedInterns.forEach((intern)=>{
            //     if(intern.profilePhoto && !(intern.profilePhoto.includes("https://lh3.googleusercontent.com/")))
            //     {
            //         intern.profilePhoto=process.env.AWS_BUCKET_DOMAIN+intern.profilePhoto;
            //     }
            // })
            // const total_items = await internsCount({ name: name.trim() });
            // const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
           
            // return sendResponse(res, 200, "Fetched successfully", {
            //     data: searchedInterns,
            //     total_pages,
            // });
            whereCondition.name={
                    contains: name,
                    mode:'insensitive'
            };
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
        console.log(whereCondition)
        const interns = await getInternBasedOnFilters(
            whereCondition,
            offset,
            limit
        );
        interns.forEach((intern)=>{
            if(intern.profilePhoto && !(intern.profilePhoto.includes("https://lh3.googleusercontent.com/")))
            {intern.profilePhoto=process.env.AWS_BUCKET_DOMAIN+intern.profilePhoto;
            console.log(intern.profilePhoto)}
        })
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

export const getTrainingDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const userPlan = await getTrainingPlan(userId);
        console.log(userPlan);
        const trainingPlan = await getPlanById(userPlan.planId);
        if (!trainingPlan) {
            logger.error("Training plan not found!!!");
            return sendResponse(res, 404, "Training plan not found!!!");
        }
        const milestones = trainingPlan.milestones;
        console.log(userId, milestones);
        if (!milestones) {
            logger.error("Milestones not found!!!");
            return sendResponse(res, 404, "Milestones not found!!!");
        }
        milestones.forEach((milestone) => {
            if (milestone.milestoneDays >= userPlan.daysWorked) {
                logger.info("Training plan fetched!!");
                return sendResponse(
                    res,
                    200,
                    "Training fetched successfully",
                    milestone
                );
            }
        });
    } catch (error) {
        logger.error(error.message);
    }
};

// cron.schedule('* 18 * ')
