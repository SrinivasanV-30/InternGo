import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const findUserByEmail=async(email)=>{
    try{
        const userDetails=await prisma.users.findUnique({
            where:{
                email:email
            },
            include:{
                role:true
            }
        })
        return userDetails;        
    }
    catch(error){
        logger.error(error.message);
    }
}

export const createIntern=async(userDetails)=>{
    try{
        const {name,email}=userDetails;
        const password=userDetails.password?userDetails.password:"Nil";
        const profilePhoto=userDetails.profilePhoto?userDetails.profilePhoto:null;
        console.log({
            name:name,
            email:email,
            password:password,
            profilePhoto:profilePhoto
        })
        const createdUser=await prisma.users.create({
            data:{
                name:name,
                email:email,
                password:password,
                profilePhoto:profilePhoto
            }
        })

        return createdUser;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const getAllInterns=async()=>{
    try{
        const allInterns=await prisma.users.findMany({
            where:{
                role:{
                    roleName:"Interns"
                }
            }
        })
        return allInterns;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateInternProfile=async()=>{
    
}