import {createHelpDesk,updateHelpDesk,deleteHelpDesk, getHelpDeskByClause} from "../models/helpDeskModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { findUserByName, findUserByUserId } from "../models/userModel.js";
import { sendNotification, sendToAdmins } from "../services/notificationService.js";

export const addHelpDesk = async (req, res) => {
    try {
        const helpDeskData = req.body;
        const userDetails=await findUserByUserId(helpDeskData.userId);
        if(helpDeskData.recepient=="Mentors"){
            const mentorDetails=await findUserByName(helpDeskData.recepientId);
            if(!mentorDetails){
                logger.error("Mentor not found!!!");
                return sendResponse(res,404,"Mentor not found!!!");
            }
            helpDeskData.recepientId=mentorDetails.id;
        }
        const createdHelpDesk = await createHelpDesk(helpDeskData);
        if(helpDeskData.recepient=="Admins"){
            sendToAdmins('helpdesk-ticket',createdHelpDesk.id,`A new HelpDesk request has been submitted by ${userDetails.name}. Subject: ${helpDeskData.subject}.`);
            logger.info("HelpDesk ticket created successfully");
            return sendResponse(res, 201, "HelpDesk ticket created successfully", createdHelpDesk);
        }
        sendNotification(helpDeskData.recepientId,'helpdesk-ticket',createdHelpDesk.id,`A new HelpDesk request has been submitted by ${userDetails.name}. Subject: ${helpDeskData.subject}.`);
        logger.info("HelpDesk ticket created successfully");
        sendResponse(res, 201, "HelpDesk ticket created successfully", createdHelpDesk);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getHelpDeskDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const userDetails=await findUserByUserId(id);
        let whereClause={};
        if(!userDetails){
            logger.error("User not found!!!");
            return sendResponse(res, 404, "User not found!!!");
        }
        console.log(userDetails)
        if(userDetails.role.roleName=='Admins'){
            whereClause.recepient='Admins'
        }
        else if(userDetails.role.roleName=='Mentors'){
            whereClause.recepientId=id
        }
        else{
            whereClause.userId=id
        }
        const helpDesk = await getHelpDeskByClause(whereClause);
        
        helpDesk.forEach(async(req) => {
            if(req.recepientId){
                const recepient=await findUserByUserId(req.recepientId)
                req.recepientName=recepient.name;
            }
        });
    
        if (!helpDesk) {
            return sendResponse(res, 404, "HelpDesk ticket not found");
        }
        logger.info("Fetched HelpDesk details successfully");
        sendResponse(res, 200, "Fetched HelpDesk details successfully", helpDesk);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};



export const modifyHelpDesk = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const updatedHelpDesk = await updateHelpDesk(id, updatedData);
        logger.info("HelpDesk ticket updated successfully");
        sendResponse(res, 200, "HelpDesk ticket updated successfully", updatedHelpDesk);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const removeHelpDesk = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteHelpDesk(id);
        logger.info("HelpDesk ticket deleted successfully");
        sendResponse(res, 200, "HelpDesk ticket deleted successfully");
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};
