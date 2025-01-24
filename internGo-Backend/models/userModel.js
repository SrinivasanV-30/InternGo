import { PrismaClient } from "@prisma/client";
import handleError from "../utils/handleError.js";
import { profilePercentage } from "../utils/profilePercentage.js";

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
        handleError(error,"Database");
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
        handleError(error,"Database");
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
        handleError(error,"Database");
    }
}

export const createUser=async(userDetails)=>{
    try{
        const createdUser=await prisma.users.create({
            data:userDetails
        })
        return createdUser;
    }
    catch(error){
        handleError(error,"Database");
    }
}

export const getAllInterns=async()=>{
    try{
        const allInterns=await prisma.users.findMany({
            where:{
                role:{
                    roleName:"Interns"
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
            }
        })
        return allInterns;
    }
    catch(error){
        handleError(error,"Database");
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
        handleError(error,"Database");
    }

}

