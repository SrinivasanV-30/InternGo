import e from "cors";
import { getFeedbackRatingsByIntern } from "../models/feedbackModel.js"
import logger from "./logger.js";

export const zoneCalculation=async(internId)=>{
    try{
        const internFeedbackRatings = await getFeedbackRatingsByIntern(internId);
        console.log(internFeedbackRatings,1);
        let avgRatings;
        internFeedbackRatings.forEach((rating) => {
            
        });
        

    }
    catch(error){
        logger.error(error.message)
    }
}