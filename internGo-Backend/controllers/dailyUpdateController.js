import { findRoleByName } from "../models/roleModel.js";
import { findUserForDailyUpdate } from "../models/userModel.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/response.js";


export const getDailyUpdateByDate=async(req,res)=>{
    try{
        const dailyUpdateData=req.body;
        let whereCondition={};
        if(dailyUpdateData.batch && dailyUpdateData.batch.length>0)
        {
            whereCondition.batch={in:dailyUpdateData.batch}
        }
        if(dailyUpdateData.date)
        {   
            let updatedDate=new Date(dailyUpdateData.date);
            updatedDate.setUTCHours(0, 0, 0, 0);
            whereCondition.dailyUpdates={
                some:{
                    date:updatedDate
                }
            }
            
        }
        console.log(dailyUpdateData.date)
        const userWithDailyUpdates= await findUserForDailyUpdate(whereCondition);
        sendResponse(res,200,"Success",userWithDailyUpdates)
        console.log(userWithDailyUpdates);
    

    }
    catch(error){
        logger.error(error.message);
    }
}