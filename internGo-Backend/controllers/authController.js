import sendResponse from "../utils/response.js";
import {createIntern, findUserByEmail} from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSign } from "../services/jwtService.js";



export const signUpController = async(req,res)=>{
    try{
        const newUser =req.body;
        const userDetails=await findUserByEmail(newUser.email);
        if(userDetails)
        {
            if(!userDetails.password)
            {
                return sendResponse(res,409,"Already signed up with google. Please continue with google.");
            }
            return sendResponse(res,409,"Already signed up. Please login.");
        }
        const hashedPassword=await bcrypt.hash(newUser.password,10);
        newUser.password=hashedPassword;
        await createIntern(newUser);
        sendResponse(res,201,"Sign Up successful!!!");
    }
    catch(error){
        console.log(error);
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
        const token=await jwtSign(existingUser.name,existingUser.email);
        const response={name:existingUser.name,role:existingUser.role.roleName,permissions:existingUser.role.permissions,token:token}
        sendResponse(res,200,"Oauth Successful!!!",response);
    }
    catch(error)
    {
        console.log(error);
    }
}
export const signInController=async(req,res)=>{
    try{
        const user=req.body;
        const existingUser=await findUserByEmail(user.email);
        if(!existingUser)
        {
            return sendResponse(res,404,"User does not exist. Please sign up.");
        }
        if(existingUser.password==="Nil")
        {
            return sendResponse(res,409,"User signed in with google. Please continue with google.");
        }
        const passwordMatch=await bcrypt.compare(user.password,existingUser.password);
        if(!passwordMatch)
        {
            return sendResponse(res,401,"Invalid password");
        }
        const token=await jwtSign(existingUser.name,existingUser.email);
        const response={
            name:existingUser.name
            ,role:existingUser.role.roleName
            ,permissions:existingUser.role.permissions
            ,token:token};
        sendResponse(res,200,"Login successful!!!",response);

    }
    catch(error)
    {
        console.log(error)
    }
}

