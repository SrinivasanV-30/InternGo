import logger from "../utils/logger.js"

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
            "primary_skill",
            "secondary_skills",
            "permanentAddress",
            "profilePhoto",
            "phone_no",
            "education",
            "bankDetails",
            "dateOfBirth",
            "bloodGroup"
        ];
        const totalFields=fields.length;
        let notNullCount=0;
        for(let [key,value] of Object.entries(data)){
            if(value && fields.includes(key))
            {
                console.log(key,value)
                notNullCount+=1;
            }
            // console.log(key,value)
        }
        const percentage=(notNullCount/totalFields)*100;
        console.log(notNullCount,totalFields,percentage)
        return percentage;
    }
    catch(error){
        logger.error(error.message);
    }
}