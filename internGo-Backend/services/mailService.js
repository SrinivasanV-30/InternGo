
import logger from "../utils/logger.js";
import {Worker} from 'worker_threads';

export const sendEmail=async(receiverEmail,subject,body)=>{
    try{
        const mail={
            from:process.env.EMAIL_ADDRESS,
            to:receiverEmail,
            subject:subject,
            html:body
        }
        const emailWorker=new Worker('../workers/emailWorker.js',{workerData:mail})

        emailWorker.on("message",(result)=>{
            console.log(result)
        });
        emailWorker.on("error",(error)=>{
            console.log(error)
        });
        emailWorker.on("exit",(code) => {
            if (code !== 0) {
              reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
        
    }
    catch(error){
        logger.error(error.message)
    }

}
