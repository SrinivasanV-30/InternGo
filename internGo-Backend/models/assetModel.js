import { PrismaClient } from "@prisma/client";
import handleError from "../utils/handleError.js";

const prisma=new PrismaClient();

export const createAsset=async(data)=>{
    try{    
        const newAsset = await prisma.assets.create({
            data:data
        });
        return newAsset;
    }
    catch(error){
        handleError(error,"Database")
    }
}

export const getAssetById=async(id)=>{
    try{    
        const asset = await prisma.assets.findUnique({
            where:{
                id:id
            }
        });
        return asset;
    }
    catch(error){
        handleError(error,"Database")
    }
}
export const getAssetByUserId=async(userId)=>{
    try{    
        const assets = await prisma.assets.findMany({
            where:{
                userId:userId
            }
        });
        return assets;
    }
    catch(error){
        handleError(error,"Database")
    }
}

export const updateAsset=async(id,returnedDate)=>{
    try{    
        const updateAsset = await prisma.assets.update({
            where:{
                id:id
            },
            data:{
                returnOn:returnedDate
            }

        });
        return asset;
    }
    catch(error){
        handleError(error,"Database")
    }
}
