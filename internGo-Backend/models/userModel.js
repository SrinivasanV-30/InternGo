import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const findUserByName = async (name) => {
    try {
        const userDetails = await prisma.users.findFirst({
            where: {
                name: name,
            },
            include: {
                role: true,
            },
        });
        return userDetails;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

// export const findUserForDailyUpdate = async (whereCondition) => {
//     try {
//         const userDetails = await prisma.users.findMany({
//             where:whereCondition,
//             select:{
//                 dailyUpdates:{
//                     include:{
//                     tasks:true
//                     }
//                 }
//             }
//         });
//         return userDetails;
//     } catch (error) {
//         logger.error(error.message);
//         throw new Error(error);
//     }
// };



export const findUserByEmail = async (email) => {
    try {
        const userDetails = await prisma.users.findFirst({
            where: {
                email: email,
            },
            include: {
                role: true,
            },
        });
        return userDetails;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getTrainingPlan = async (userId) => {
    try {
        const trainingPlan = await prisma.users.findUnique({
            where: {
                id: userId,
            },
            select: {
                plan:{
                    select:{
                        milestones:{
                            orderBy:{
                                createdAt:'asc'
                            }
                        },
                        startDate:true,
                        endDate:true
                    }
                },
                daysWorked:true,
                planStartDate:true,
                zone:true,
                id:true
                
            },
        });
        return trainingPlan;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const findUserByRole = async (roleName) => {
    try {
        return await prisma.users.findMany({
            where: {
                role:{
                    roleName:{
                        in:roleName
                    }
                }
            },
            select: {
                id:true,
                name: true,
            },
        });
        
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const findUserByUserId = async (userId) => {
    try {
        const userDetails = await prisma.users.findUnique({
            where: {
                id: userId,
            },
            include: {
                assets: true,
                password: false,
                plan: true,
                role:true,
                notifications:{
                    orderBy:{
                        createdAt:"desc"
                    }
                }
            },
        });
        return userDetails;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createIntern = async (userDetails) => {
    try {
        const { name, email } = userDetails;
        const password = userDetails.password ? userDetails.password : "Nil";
        const profilePhoto = userDetails.profilePhoto
            ? userDetails.profilePhoto
            : null;
        
        const createdUser = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: password,
                profilePhoto: profilePhoto,
            },
            
        });

        return createdUser;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createUser = async (userDetails) => {
    try {
        return await prisma.users.create({
            data: userDetails,
            // select:{
            //     id:true
            // }
        });
    
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getUsersByStatus=async(status)=>{
    try{
        return await prisma.users.findMany({
            where:{
                status:status,
                role:{
                    roleName:"Interns"
                }
            },
            include:{
                role:true
            }
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error);
    }
} 

export const getAllInterns = async () => {
    try {
        const allInterns = await prisma.users.findMany({
            where: {
                role: {
                    roleName: "Interns",
                },
            },
            include: {
                password: false,
                gender: false,
                personalEmail: false,
                currentAddress: false,
                permanentAddress: false,
                dateOfBirth: false,
                dateOfJoining: false,
                bloodGroup: false,
                profilePercentage: false,
                resume: false,
                bankDetails: false,
                createdAt: false,
                updatedAt: false,
                roleId: false,
                education: false,
                certificates_submission_status: false,
                dailyUpdates: false,
                plan: false,
            },
        });
        return allInterns;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const updateUser = async (userId, data) => {
    try {
        return await prisma.users.update({
            where: {
                id: userId,
            },
            data: data,
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getInternBasedOnFilters = async (whereCondition, offset, limit) => {
    try {
        const internsBasedOnFilters = await prisma.users.findMany({
            skip: offset,
            take: limit,
            where: whereCondition,
            select: {
                id:true,
                name: true,
                profilePhoto: true,
                phone_no:true,
                email: true,
                batch: true,
                year: true,
                designation: true,
                status: true,
                employeeId: true,
                zone:true,
                plan:true
            },
        });
        return internsBasedOnFilters;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};
export const internsCount = async (whereCondition) => {
    try {
        const internsCount = await prisma.users.count({
            where: whereCondition,
        });
        return internsCount;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getInternBasedOnSearch = async (name, offset, limit) => {
    try {
        const internsBasedOnSearch = await prisma.users.findMany({
            skip: offset,
            take: limit,
            where: {
                name: {
                    search: name,
                },
            },
            select: {
                id:true,
                name: true,
                profilePhoto: true,
                phone_no:true,
                email: true,
                batch: true,
                year: true,
                designation: true,
                status: true,
                employeeId: true,
            },
        });
        return internsBasedOnSearch;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const getFilters = async()=>{
    try{
        const years = await prisma.users.findMany({
            select: { year: true },
            distinct: ['year']
        }).then(results => results.map(user => user.year));
        
        const statuses = await prisma.users.findMany({
            select: { status: true },
            distinct: ['status']
        }).then(results => results.map(user => user.status));
        
        const designations = await prisma.users.findMany({
            select: { designation: true },
            distinct: ['designation']
        }).then(results => results.map(user => user.designation));
        
        const batches = await prisma.users.findMany({
            select: { batch: true },
            distinct: ['batch']
        }).then(results => results.map(user => user.batch));
        
        return {
            years:years,
            statuses:statuses,
            designations:designations,
            batches:batches
        };

    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getInteractionsAttended=async(userId)=>{
    try{
        return await prisma.users.findUnique({
            where:{
                id:userId
            },
            select:{
                interactionsAttended:{
                    orderBy:{
                        createdAt:"desc"
                    }
                }
            }
        })
    }
    catch(error)
    {
        logger.error(error.message);
        throw new Error(error.message);
    }
}


export const getInteractionsTaken=async(userId)=>{
    try{
        return await prisma.users.findUnique({
            where:{
                id:userId
            },
            select:{
                interactionsTaken:{
                    orderBy:{
                        createdAt:'desc'
                    }
                }
            }
        })
    }
    catch(error)
    {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getUserByRole=async(role)=>{
    try{
        return await prisma.users.findMany({
            where:{
                role:{
                    roleName:role
                },
            },
            select:{
                role:true,
                id:true,
                name:true
            }
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getUserPlans=async()=>{
    try{
        return await prisma.users.findMany({
            where: {
                planId: { not: null },
                // planStartDate: { not: null },
            },
    
            include:{
                plan:{
                    include:{
                        milestones:{
                            include:{
                                objectives:true
                            }
                        }
                    }
                }
            }
        })
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}
export const countAll=async()=>{
    try{
        return await prisma.users.count();
    }
    catch(error)
    {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const countByStatus=async(status)=>{
    try{
        return await prisma.users.count({
            where:{
                status:{in : status}
            }
        });
    }
    catch(error)
    {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const getRatingsByUserId=async(id)=>{
    try{
        return await prisma.users.findUnique({
            where:{
                id:id
            },
            select:{
                feedbacksReceived:{
                    select:{
                        avg_rating:true
                    }
                }
            }
        }).then(result=>result.feedbacksReceived.map(feedback=>feedback.avg_rating))
    }
    catch(error){
        logger.error(error.message);
        throw new Error(error.message);
    }
}