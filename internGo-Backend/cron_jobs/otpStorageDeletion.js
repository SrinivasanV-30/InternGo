import { deleteOtpRecord, getOtpStorage } from "../models/otpStorageModel.js";
import logger from "../utils/logger.js";

export const otpStorageDeletion=async()=>{
    try{
        const otps=await getOtpStorage();
        const now=new Date();
        otps.forEach(async(otp) => {
            if (new Date(otp.expires_at) < now) {
                logger.error("OTP has expired.");
                await deleteOtpRecord(otp.email);
            }
        });
    }
    catch(error){
        logger.error(error.message)
    }
}


