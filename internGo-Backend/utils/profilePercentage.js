import logger from "./logger.js"

export const profilePercentage=async(userData)=>{
    try{
        const data=userData;
        const totalFields=Object.keys(data).length-2;
        let notNullCount=0;
        for(let [key,value] of Object.entries(data)){
            if(value && !(["createdAt","updatedAt"].includes(key)))
            {
                notNullCount+=1;
            }
        }
        const percentage=(notNullCount/totalFields)*100;
        console.log(notNullCount,totalFields,percentage)
        return percentage;
    }
    catch(error){
        logger.error(error.message);
    }
}