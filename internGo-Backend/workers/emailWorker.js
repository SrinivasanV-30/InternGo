import {parentPort,workerData} from 'worker_threads';
import transporter from "../config/nodemailerConfig.js";

transporter.sendMail(workerData,(error,info)=>{
    if(error){
        parentPort.postMessage({success:false,message:error.message})
    }
    else{
        parentPort.postMessage({success:true,message:info})
    }
})