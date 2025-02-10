import { createFeedback, getFeedbackByInteraction, getFeedbackByIntern, updateFeedback, deleteFeedback, calculateAvgRating } from "../models/feedbackModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";

export const addFeedback = async (req, res) => {
    try {
        const feedbackData = req.body;
        const avgRatings=calculateAvgRating(feedbackData.ratings);
        feedbackData.avg_rating=avgRatings;
        const createdFeedback = await createFeedback(feedbackData);
        logger.info("Feedback added successfully");
        sendResponse(res, 201, "Feedback added successfully", createdFeedback);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getFeedbacksByInteraction = async (req, res) => {
    try {
        const interactionId = parseInt(req.params.interactionId);
        const feedback = await getFeedbackByInteraction(interactionId);
        if (!feedback.length) {
            return sendResponse(res, 404, "No feedback found");
        }
        logger.info("Fetched feedback successfully");
        sendResponse(res, 200, "Fetched feedback successfully", feedback);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getFeedbacksByIntern = async (req, res) => {
    try {
        const internId = parseInt(req.params.internId);
        const feedback = await getFeedbackByIntern(internId);
        if (!feedback.length) {
            return sendResponse(res, 404, "No feedback found");
        }
        logger.info("Fetched feedback successfully");
        sendResponse(res, 200, "Fetched feedback successfully", feedback);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const modifyFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedData = req.body;
    
        const updatedFeedback = await updateFeedback(id, updatedData);
        logger.info("Feedback updated successfully");
        sendResponse(res, 200, "Feedback updated successfully", updatedFeedback);
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const removeFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteFeedback(id);
        logger.info("Feedback deleted successfully");
        sendResponse(res, 200, "Feedback deleted successfully");
    } catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};
