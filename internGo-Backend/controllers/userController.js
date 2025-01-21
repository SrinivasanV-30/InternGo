import sendResponse from "../utils/response.js";
import { getAllInterns } from "../models/userModel.js";


export const getAllIntern = async(req,res)=>{
    try{
        const allIntern=await getAllInterns();
        sendResponse(res,200,"Fetched successfully",allIntern);
    }
    catch(error){
        console.log(error);
    }
}