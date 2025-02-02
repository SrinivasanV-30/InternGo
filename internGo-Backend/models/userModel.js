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

export const findUserByEmail = async (email) => {
    try {
        const userDetails = await prisma.users.findUnique({
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
                planId: true,
                daysWorked: true,
            },
        });
        return trainingPlan;
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
        console.log({
            name: name,
            email: email,
            password: password,
            profilePhoto: profilePhoto,
        });
        const createdUser = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: password,
                profilePhoto: profilePhoto,
            },
            // select:{
            //     id:true
            // }
        });

        return createdUser;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

export const createUser = async (userDetails) => {
    try {
        const createdUser = await prisma.users.create({
            data: userDetails,
            // select:{
            //     id:true
            // }
        });
        return createdUser;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error);
    }
};

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
        const updatedInternProfile = await prisma.users.update({
            where: {
                id: userId,
            },
            data: data,
        });
        console.log(updatedInternProfile);
        return updatedInternProfile;
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
                email: true,
                batch: true,
                year: true,
                designation: true,
                status: true,
                employeeId: true,
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
