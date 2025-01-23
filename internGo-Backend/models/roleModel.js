import { PrismaClient } from "@prisma/client";
import handleError from "../utils/handleError.js";

const prisma = new PrismaClient();

export const findRoleById = async (roleId) => {
    try {
        const roleDetails = await prisma.roles.findUnique({
            where: { id: roleId },
        });
        return roleDetails;
    } 
    catch (error) {
        handleError(error,"Database");
    }
};

export const findRoleByName = async (roleName) => {
    try {
        const roleDetails = await prisma.roles.findFirst({
            where: { 
                roleName:roleName 
            },
        });
        return roleDetails;
    } 
    catch (error) {
        handleError(error,"Database");
    }
};

export const createRole = async (roleDetails) => {
    try {
        const { roleName, description, permissions } = roleDetails;

        const createdRole = await prisma.roles.create({
            data: {
                roleName,
                description,
                permissions,
            },
        });

        return createdRole;
    } 
    catch (error) {
        handleError(error,"Database");
    }
};

export const getAllRoles = async () => {
    try {
        const allRoles = await prisma.roles.findMany();
        return allRoles;
    } 
    catch (error) {
        handleError(error,"Database");
    }
};

export const updateRole = async (roleId, data) => {
    try {
        const updatedRole = await prisma.roles.update({
            where: { id: roleId },
            data,
        });
        return updatedRole;
    } 
    catch (error) {
        handleError(error,"Database");
    }
};
