import logger from "../utils/logger.js"
import { GoogleAuth } from "google-auth-library";
import { serviceAccount } from "../config/firebaseConfig.js";

export const getAccessToken = async()=>{
    try{
        const auth =new GoogleAuth({
            credentials:serviceAccount,
            scopes:["https://www.googleapis.com/auth/firebase.messaging"]
        })
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken.token;
    }
    catch(error){
        logger.error(error.message)
    }
}