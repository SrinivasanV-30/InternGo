import transporter from "../config/nodemailerConfig.js";
import logger from "../utils/logger.js";

export const sendEmail=async(receiverEmail,subject,body)=>{
    try{
        const mail={
            from:process.env.EMAIL_ADDRESS,
            to:receiverEmail,
            subject:subject,
            html:body
        }

        transporter.sendMail(mail,(error,info)=>{
            if(error){
                logger.error(error);
            }
            else{
                logger.info('Email sent: '+info)
            }
        })
    }
    catch(error){
        logger.error(error.message)
    }

}
