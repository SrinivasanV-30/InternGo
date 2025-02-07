import { createInteractions, getInteractions, interactionCount, getInteractionById, updateInteractions } from "../models/interactionModel.js";
import { findUserByEmail, findUserByName, findUserByUserId, getInteractionsAttended, getInteractionsTaken } from "../models/userModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { sendNotification } from "../services/notificationService.js";
import { convertTimeStringandDate } from "../services/dateTimeService.js";


export const scheduleInteraction=async(req,res)=>{
    try{
        const interactionData=req.body;
        // console.log(interactionData)
        const internNameDetails = await findUserByName(interactionData.assignedIntern);
        const internEmailDetails = await findUserByEmail(interactionData.internEmail);
        const mentorDetails= await findUserByName(interactionData.assignedMentor);
        const interviewerDetails= await findUserByName(interactionData.assignedInterviewer);
        // console.log(internNameDetails,internEmailDetails)
        if(!(internEmailDetails && internNameDetails) )
        {
            logger.error("Intern not found");
            return sendResponse(res,404,"Intern not found");
        }
        // console.log(internEmailDetails,internNameDetails)
        if(!(JSON.stringify(internEmailDetails)===JSON.stringify(internNameDetails)))
        {
            logger.error("Invalid name and email combination")
            return sendResponse(res,400,"Invalid name and email combination")
        }
        if(!mentorDetails)
        {
            logger.error("Mentor not found");
            return sendResponse(res,404,"Mentor not found");
        }
        if(!interviewerDetails)
        {
            logger.error("Interviewer not found");
            return sendResponse(res,404,"Interviewer not found");
        }
        if(!(mentorDetails.role.roleName==='Mentors')){
            logger.error("The given mentor name must be of a mentor");
            return sendResponse(res,403,"The given mentor name must be of a mentor");
        }
        if(!(interviewerDetails.role.roleName==='Mentors')){
            logger.error("The given interviewer name must be of a mentor");
            return sendResponse(res,403,"The given interviewer name must be of a mentor");
        }
        interactionData.internId=internEmailDetails.id;
        interactionData.interviewerId=interviewerDetails.id;
        interactionData.interviewerEmail=interviewerDetails.email;
        interactionData.date=convertTimeStringandDate(interactionData.date,interactionData.time);
        const createdInteraction=await createInteractions(interactionData);
        logger.info("Scheduled interaction successfully");
        sendNotification(interactionData.internId,"interaction-scheduled",createdInteraction.id,`Your interaction with ${interactionData.assignedInterviewer} is scheduled on ${interactionData.date} at ${interactionData.time}. Please be prepared.`)
        sendResponse(res,201,"Scheduled interaction successfully");

    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateInteraction=async(req,res)=>{
    try{
        const id=parseInt(req.params.id);
        const data=req.body;
        const interactionDetails=await getInteractionById(id);
        if(!interactionDetails){
            logger.error("Interaction not found");
            sendResponse(res,404,"Interaction not found")
        }
        await updateInteractions(id,data);
        logger.info("Updated interaction details");
        sendResponse(res,200,"Updated interaction details");

    }
    catch(error){
        logger.error(error.message)
    }
}

export const getInteractionByDateAndFiltering=async(req,res)=>{
    try{
        const interactionData=req.body;
        const limit=parseInt(req.query.limit)||10;
        const offset=parseInt(req.query.offset)||0;
    
        let whereCondition={intern:{},date:{}};
        if(interactionData.name && interactionData.name.trim!=""){
            whereCondition.assignedIntern={
                contains: interactionData.name,
                mode:'insensitive'
            };
        }
        if(interactionData.batch && interactionData.batch.length>0)
        {
            whereCondition.intern.batch={in:interactionData.batch}
        }
        if (interactionData.year && interactionData.year.length > 0) {
            whereCondition.intern.year = { in: interactionData.year };
        }
        if (interactionData.interactionStatus && interactionData.interactionStatus.length > 0) {
            whereCondition.interactionStatus = { in: interactionData.interactionStatus };
        }
        if (interactionData.designation && interactionData.designation.length > 0) {
            whereCondition.intern.designation = { in: interactionData.designation };
        }
        if(interactionData.date)
        {   
            whereCondition.date={
                gte: new Date(interactionData.date + "T00:00:00.000Z"),
                lte: new Date(interactionData.date + "T23:59:59.999Z")
            };
  
        }
        const interactions= await getInteractions(offset,limit,whereCondition);
        const total_items = await interactionCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
        logger.info("Fetched successfully")
        sendResponse(res,200,"Fetched successfully",{
            data:interactions,
            total_pages
        });
        
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getInteractionByUserId=async(req,res)=>{
    try{
        const userId=req.params.id;
        
        const userDetails=await findUserByUserId(userId);
        if(!userDetails){
            logger.error("User not found")
            return sendResponse(res,404,"User not found")
        }
        if(userDetails.role.roleName === "Mentors"){
            return sendResponse(res,200,"Fetched successfully",await getInteractionsTaken(userId));
        }
        if(userDetails.role.roleName === "Interns"){
            logger.info("Fetched successfully");
            return sendResponse(res,200,"Fetched successfully",await getInteractionsAttended(userId));
        }
    }
    catch(error){
        logger.error(error.message);
    }
}

export const toggleScheduleStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const interactionDetails = await getInteractionById(id);

        if (!interactionDetails) {
            logger.error("Interaction not found");
            return sendResponse(res, 404, "Interaction not found");
        }

        const newStatus = interactionDetails.isScheduled ? false : true;
        await updateInteractions(id, { isScheduled: newStatus });

        logger.info("Interaction schedule status updated");
        sendResponse(res, 200, "Schedule status updated successfully");
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

