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
                role:true,
            }
        })
        return userDetails;        
    }
    catch(error){
        logger.error(error.message);
    }
}
export const findUserByUserId=async(userId)=>{
    try{
        const userDetails=await prisma.users.findUnique({
            where:{
                id:userId
            },
            include:{
                assets:true,
                password:false,
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
            },
            // select:{
            //     id:true
            // }
        })

        return createdUser;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const createUser=async(userDetails)=>{
    try{
        const createdUser=await prisma.users.create({
            data:userDetails,
                // select:{
                //     id:true
                // }
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
                },
            },
            include:{
                password:false,
                gender:false,
                personalEmail:false,
                currentAddress:false,
                permanentAddress:false,
                dateOfBirth:false,
                dateOfJoining:false,
                bloodGroup:false,
                profilePercentage:false,
                resume:false,
                bankDetails:false,
                createdAt:false,
                updatedAt:false,
                roleId:false,
                education:false,
                certificates_submission_status:false,


            }
        })
        return allInterns;
    }
    catch(error){
        logger.error(error.message);
    }
}

export const updateUser=async(userId,data)=>{
    try{
        const updatedInternProfile=await prisma.users.update({
            where:{
                id:userId
            },
            data:data
        })
        console.log(updatedInternProfile)
        return updatedInternProfile;
    }
    catch(error){
        logger.error(error.message);
    }

}

export const getInternBasedOnFilters=async(whereCondition,offset,limit)=>{
    try{
        
        const internsBasedOnFilters=await prisma.users.findMany({
            skip:offset,
            take:limit,
            where:whereCondition
        })
        return internsBasedOnFilters; 
    }
    catch(error)
    {
        logger.error(error.message);
    }
}
export const internsCount = async(whereCondition)=>{
    try{
        const internsCount=await prisma.users.count({
            where:whereCondition
          })
        return internsCount;

    }
    catch(error){
        logger.error(error.message);
    }
}

export const getInternBasedOnSearch=async(name,offset,limit)=>{
    try{
        const internsBasedOnSearch=await prisma.users.findMany({
            skip:offset,
            take:limit,
            where:{
                name:{
                    search:name
                    
                }
            }
        })
        return internsBasedOnSearch; 
    }
    catch(error)
    {
        logger.error(error.message);
    }
}