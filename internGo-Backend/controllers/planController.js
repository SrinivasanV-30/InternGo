import { createObjectives} from "../models/objectiveModel.js";
import { createPlans } from "../models/planModel.js";
import sendResponse from "../utils/response";


export const createPlan=async(req,res)=>{
    try{
        const data=req.body;
        if(data.plan && data.objectives){
            logger.error("Invaild plan data!!")
            return sendResponse(res,400,"Invaild plan data!!");
        }
        const planData=data.plan;
        const objectivesData=data.objectives;
        const createdPlan=await createPlans(planData);
        objectivesData.planId=createdPlan.id;
        await createObjectives(objectivesData)
        logger.info("Plan created successfully!!");
        sendResponse(res,201,"Plan created successfully!!")
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updatePlans=async(req,res)=>{
    try{
        const planId=parseInt(req.params.id);
        const planData=req.body;
        
    }
    catch(error){
        logger.error()
    }
}