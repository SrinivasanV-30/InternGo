import { getFeedbackRatingsByIntern } from "../models/feedbackModel.js"
import { updateUser } from "../models/userModel.js";
import logger from "../utils/logger.js";

export const zoneCalculation=async(internId)=>{
    try{
        const internFeedbackRatings = await getFeedbackRatingsByIntern(internId);
        // console.log(internFeedbackRatings,1);
        let overallRatings=0,count=0,zone={zone:""};
        internFeedbackRatings.forEach((rating) => {
            overallRatings+=rating
            count+=1
        });
        overallRatings*=(overallRatings/count)*2;
        if(overallRatings>7.5){
            zone.zone="GREEN ZONE"
        }
        else if(overallRatings>5 && overallRatings<7.5){
            zone.zone="YELLOW ZONE"
        }
        else{
            zone.zone="RED ZONE"
        }
        await updateUser(internId,zone);
    }
    catch(error){
        logger.error(error.message)
    }
}