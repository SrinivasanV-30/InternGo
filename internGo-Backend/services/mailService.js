import logger from "../utils/logger.js";
import {Worker} from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const sendEmail=async(receiverEmail,subject,body)=>{
    try{
        const mail={
            from:`Intern Go ${process.env.EMAIL_ADDRESS}`,
            to:receiverEmail,
            subject:subject,
            html:body
        }
        const workerPath = path.resolve(__dirname, '../workers/emailWorker.js');
        const emailWorker=new Worker(workerPath,{workerData:mail})

        emailWorker.on("message",(result)=>{
            console.log(result)
        });
        emailWorker.on("error",(error)=>{
            console.log(error)
        });
        emailWorker.on("exit",(code) => {
            if (code !== 0) {
              console.log(`Worker stopped with exit code ${code}`);
            }
        });
        
    }
    catch(error){
        logger.error(error.message)
    }

}
