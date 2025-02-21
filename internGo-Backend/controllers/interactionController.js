import { createInteractions, getInteractions, interactionCount, getInteractionById, updateInteractions } from "../models/interactionModel.js";
import { findUserByEmail, findUserByName, findUserByUserId, getInteractionsAttended, getInteractionsTaken } from "../models/userModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { sendNotification } from "../services/notificationService.js";
import { convertTimeStringandDate } from "../helpers/dateTimeHelper.js";


export const scheduleInteraction = async (req, res) => {
    try {
        const interactionData = req.body;
        // console.log(interactionData)
        const internNameDetails = await findUserByName(interactionData.assignedIntern);
        const internEmailDetails = await findUserByEmail(interactionData.internEmail);
        const mentorDetails = await findUserByName(interactionData.assignedMentor);
        const interviewerDetails = await findUserByName(interactionData.assignedInterviewer);
        // console.log(internNameDetails,internEmailDetails)
        if (!(internEmailDetails && internNameDetails)) {
            logger.error("Intern not found");
            return sendResponse(res, 404, "Intern not found");
        }
        // console.log(internEmailDetails,internNameDetails)
        if (!(JSON.stringify(internEmailDetails) === JSON.stringify(internNameDetails))) {
            logger.error("Invalid name and email combination")
            return sendResponse(res, 400, "Invalid name and email combination")
        }
        if (!mentorDetails) {
            logger.error("Mentor not found");
            return sendResponse(res, 404, "Mentor not found");
        }
        if (!interviewerDetails) {
            logger.error("Interviewer not found");
            return sendResponse(res, 404, "Interviewer not found");
        }
        if (!(mentorDetails.role.roleName === 'Mentors')) {
            logger.error("The given mentor name must be of a mentor");
            return sendResponse(res, 403, "The given mentor name must be of a mentor");
        }
        if (!(interviewerDetails.role.roleName === 'Mentors')) {
            logger.error("The given interviewer name must be of a mentor");
            return sendResponse(res, 403, "The given interviewer name must be of a mentor");
        }
        interactionData.internId = internEmailDetails.id;
        interactionData.interviewerId = interviewerDetails.id;
        interactionData.interviewerEmail = interviewerDetails.email;
        interactionData.date = convertTimeStringandDate(interactionData.date, interactionData.time);
        console.log(new Date(interactionData.date))
        const createdInteraction = await createInteractions(interactionData);
        logger.info("Scheduled interaction successfully");
        sendNotification(interactionData.internId, "interaction-scheduled", createdInteraction.id, `Your ${createdInteraction.name} interaction with ${interactionData.assignedInterviewer} is scheduled on ${(new Date(interactionData.date)).toISOString().split("T")[0]} at ${interactionData.time}. Please be prepared.`);
        sendNotification(interactionData.interviewerId, "interaction-scheduled", createdInteraction.id, `${createdInteraction.name} interaction with ${interactionData.assignedIntern} is scheduled on ${(new Date(interactionData.date)).toISOString().split("T")[0]} at ${interactionData.time}. Please be available.`);
        sendResponse(res, 201, "Scheduled interaction successfully");

    }
    catch (error) {
        logger.error(error.message);
    }
}

export const updateInteraction = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const interactionData = req.body;
        console.log(req.body)
        const interactionDetails = await getInteractionById(id);
        if (!interactionDetails) {
            logger.error("Interaction not found");
            return sendResponse(res, 404, "Interaction not found")
        }
        if (interactionData.date) {
            if (interactionData.time) {
                interactionData.date = convertTimeStringandDate(interactionData.date, interactionData.time);
            }
            else {
                interactionData.date = convertTimeStringandDate(interactionData.date, interactionDetails.time);
            }
        }
        if (interactionData.assignedInterviewer) {
            const interviewerDetails = await findUserByName(interactionData.assignedInterviewer);
            if (!interviewerDetails) {
                logger.error("Interviewer not found");
                return sendResponse(res, 404, "Interviewer not found");
            }
            if (!(interviewerDetails.role.roleName === 'Mentors')) {
                logger.error("The given interviewer name must be of a mentor");
                return sendResponse(res, 403, "The given interviewer name must be of a mentor");
            }
            interactionData.interviewerId = interviewerDetails.id;
            interactionData.interviewerEmail = interviewerDetails.email;


        }
        if (interactionData.assignedIntern) {
            const interviewerDetails = await findUserByName(interactionData.assignedInterviewer);
            interactionData.interviewerId = interviewerDetails.id;
            interactionData.interviewerEmail = interviewerDetails.email;
        }

        const updatedInteraction = await updateInteractions(id, interactionData);
        sendNotification(updatedInteraction.internId, "interaction-updated-schedule", updatedInteraction.id, `Your ${updatedInteraction.name} interaction with ${updatedInteraction.assignedInterviewer} has been rescheduled to ${(new Date(updatedInteraction.date)).toISOString().split("T")[0]} at ${updatedInteraction.time}. Please be prepared.`);
        sendNotification(updatedInteraction.interviewerId, "interaction-updated-schedule", updatedInteraction.id, `Your ${updatedInteraction.name} interaction with ${updatedInteraction.assignedIntern} has been updated and is now scheduled for ${(new Date(updatedInteraction.date)).toISOString().split("T")[0]} at ${updatedInteraction.time}. Please ensure your availability.`);
        logger.info("Updated interaction details");
        sendResponse(res, 200, "Updated interaction details");

    }
    catch (error) {
        logger.error(error.message)
    }
}

export const getInteractionByDateAndFiltering = async (req, res) => {
    try {
        const interactionData = req.body;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        let whereCondition = { intern: {}, date: {} };
        if (interactionData.name && interactionData.name.trim != "") {
            whereCondition.assignedIntern = {
                contains: interactionData.name,
                mode: 'insensitive'
            };
        }
        if (interactionData.batch && interactionData.batch.length > 0) {
            whereCondition.intern.batch = { in: interactionData.batch }
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
        if (interactionData.date) {
            whereCondition.date = {
                gte: new Date(interactionData.date + "T00:00:00.000Z"),
                lte: new Date(interactionData.date + "T23:59:59.999Z")
            };

        }
        const interactions = await getInteractions(offset, limit, whereCondition);
        const total_items = await interactionCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
        logger.info("Fetched successfully")
        sendResponse(res, 200, "Fetched successfully", {
            data: interactions,
            total_pages
        });

    }
    catch (error) {
        logger.error(error.message);
    }
}

export const getInteractionsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const interactionData = req.body;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const userDetails = await findUserByUserId(userId);

        if (!userDetails) {
            logger.error("User not found");
            return sendResponse(res, 404, "User not found");
        }
        let whereCondition = {};
        if (userDetails.role.roleName === "Mentors") {
            whereCondition.assignedInterviewer = userDetails.name;
        }

        if (userDetails.role.roleName === "Interns") {
            whereCondition.assignedIntern = userDetails.name;
        }

        if (interactionData.name && !interactionData.name.trim() == "") {
            whereCondition.assignedIntern = {
                contains: interactionData.name,
                mode: 'insensitive'
            }
        }

        if (interactionData.interactionStatus && interactionData.interactionStatus.length > 0) {
            whereCondition.interactionStatus = { in: interactionData.interactionStatus };
        }

        if (interactionData.date) {
            whereCondition.date = {
                gte: new Date(interactionData.date + "T00:00:00.000Z"),
                lte: new Date(interactionData.date + "T23:59:59.999Z")
            };
        }

        const interactions = await getInteractions(offset, limit, whereCondition);
        const total_items = await interactionCount(whereCondition);
        const total_pages = total_items > 0 ? Math.ceil(total_items / limit) : 0;
        logger.info("Fetched successfully")
        sendResponse(res, 200, "Fetched successfully", {
            data: interactions,
            total_pages
        });


    }
    catch (error) {
        logger.error(error.message)
    }
}

export const getInteractionByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        const userDetails = await findUserByUserId(userId);
        if (!userDetails) {
            logger.error("User not found")
            return sendResponse(res, 404, "User not found")
        }
        if (userDetails.role.roleName === "Mentors") {
            return sendResponse(res, 200, "Fetched successfully", await getInteractionsTaken(userId));
        }
        if (userDetails.role.roleName === "Interns") {
            logger.info("Fetched successfully");
            return sendResponse(res, 200, "Fetched successfully", await getInteractionsAttended(userId));
        }
    }
    catch (error) {
        logger.error(error.message);
    }
}

export const toggleScheduleStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const isScheduled = req.query.isScheduled === 'true' ? true : false;


        const interactionDetails = await getInteractionById(id);

        if (!interactionDetails) {
            logger.error("Interaction not found");
            return sendResponse(res, 404, "Interaction not found");
        }


        await updateInteractions(id, { isScheduled: isScheduled });
        if (!isScheduled) {
            sendNotification(interactionDetails.internId, "interaction-cancelled", id, `Your interaction with ${interactionDetails.assignedInterviewer} is scheduled on ${(new Date(interactionDetails.date)).toISOString().split("T")[0]} at ${interactionDetails.time} has been cancelled.`);
            sendNotification(interactionDetails.interviewerId, "interaction-cancelled", id, `Interaction with ${interactionDetails.assignedIntern} is scheduled on ${(new Date(interactionDetails.date)).toISOString().split("T")[0]} at ${interactionDetails.time} has been cancelled.`);
        }
        else {
            sendNotification(interactionDetails.internId, "interaction-scheduled", id, `Your interaction with ${interactionDetails.assignedInterviewer} is scheduled on ${(new Date(interactionDetails.date)).toISOString().split("T")[0]} at ${interactionDetails.time}. Please be prepared.`);
            sendNotification(interactionDetails.interviewerId, "interaction-scheduled", id, `Interaction with ${interactionDetails.assignedIntern} is scheduled on ${(new Date(interactionDetails.date)).toISOString().split("T")[0]} at ${interactionDetails.time}. Please be available.`);
        }

        logger.info("Interaction schedule status updated");
        sendResponse(res, 200, "Schedule status updated successfully");
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};
