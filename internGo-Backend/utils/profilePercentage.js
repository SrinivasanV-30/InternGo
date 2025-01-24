import logger from "./logger.js"

export const profilePercentage=async(userData)=>{
    try{
        const data=userData;
        const fields=[
            "name",
            "password",
            "email",
            "gender",
            "personalEmail",
            "currentAddress",
            "permanentAddress",
            "profilePhoto",
            "resume",
            "year",
            "phone_no",
            "education",
            "bankDetails",
            "dateOfBirth",
            "dateOfJoining",
            "bloodGroup"
        ];
        const totalFields=fields.length;
        let notNullCount=0;
        for(let [key,value] of Object.entries(data)){
            if(value && fields.includes(key))
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