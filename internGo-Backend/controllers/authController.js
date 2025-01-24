import sendResponse from "../utils/response.js";
import {createIntern, findUserByEmail,createUser} from "../models/userModel.js";
import bcrypt from 'bcrypt';
import logger from "../utils/logger.js";
import { jwtSign } from "../services/jwtService.js";
import { findRoleByName } from "../models/roleModel.js";



export const signUpController = async(req,res)=>{
    try{
        const newUser =req.body;
        const userDetails=await findUserByEmail(newUser.email);
        if(userDetails)
        {
            if(!userDetails.password)
            {
                logger.error("Already signed up with google. Please continue with google.");
                return sendResponse(res,409,"Already signed up with google. Please continue with google.");
            }
            logger.error("Already signed up. Please login.");
            return sendResponse(res,409,"Already signed up. Please login.");
        }
        const hashedPassword=await bcrypt.hash(newUser.password,10);
        newUser.password=hashedPassword;
        await createIntern(newUser);
        sendResponse(res,201,"Sign Up successful!!!");
        logger.info("Sign Up successful!!!");
    }
    catch(error){
        logger.error(error.message);
    }
}

export const oauthController = async(req,res)=>{
    try{
        const user=req.body;
        console.log(user);
        let existingUser=await findUserByEmail(user.email);
        if(!existingUser){
            const newUser={
                name:user.name,
                email:user.email,
                profilePhoto:user.picture,
                password:null
            }
            existingUser=await createIntern(newUser);  
        }
        existingUser=await findUserByEmail(user.email);
        const token=await jwtSign(existingUser.id,existingUser.role.roleName,existingUser.name,existingUser.email);
        const response={userId:existingUser.id,name:existingUser.name,role:existingUser.role.roleName,permissions:existingUser.role.permissions,token:token}
        sendResponse(res,200,"Oauth Successful!!!",response);
        logger.info("Oauth successful!!!");
    }
    catch(error)
    {
        logger.error(error.message);
    }
}
export const signInController=async(req,res)=>{
    try{
        const user=req.body;
        const existingUser=await findUserByEmail(user.email);
        if(!existingUser)
        {
            logger.error("User does not exist. Please sign up.");
            return sendResponse(res,404,"User does not exist. Please sign up.");
        }
        if(existingUser.password==="Nil")
        {
            logger.error("User signed in with google. Please continue with google.");
            return sendResponse(res,409,"User signed in with google. Please continue with google.");
        }
        const passwordMatch=await bcrypt.compare(user.password,existingUser.password);
        if(!passwordMatch)
        {
            logger.error("Invalid password");
            return sendResponse(res,401,"Invalid password");
        }
        const token=await jwtSign(existingUser.id,existingUser.role.roleName,existingUser.name,existingUser.email);
        const response={
             userId:existingUser.id
            ,name:existingUser.name
            ,role:existingUser.role.roleName
            ,permissions:existingUser.role.permissions
            ,token:token}

        sendResponse(res,200,"Login successful!!!",response);
        logger.info("Login successful!!!");
    }
    catch(error)
    {
        logger.error(error.message);
    }
}
export const createUserController = async(req,res)=>{
    try{
        const userDetails=await findUserByEmail(req.body.email);
        const roleName=req.body.role;
        console.log(roleName)
        const role=await findRoleByName(roleName);
        if(userDetails)
        {
            logger.error("Already signed up. Please login.");
            return sendResponse(res,409,"Already signed up. Please login.");
        }
        if(!role){
            logger.error("Invalid role.");
            return sendResponse(res,409,"Invalid role.");
        }
        const password=req.body.password;
        const hashedPassword=await bcrypt.hash(password,10);
    
        const newUser={
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            roleId:role.id
        }
        await createUser(newUser);
        sendResponse(res,201,`${role.roleName} created successfully!!!`);
        logger.info(`${role.roleName} created successfully!!!`);
    }
    catch(error){
        logger.error(error.message);
    }
}

