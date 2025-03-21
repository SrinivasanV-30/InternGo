import Joi from 'joi';

export const profileUpdateValidationSchema = Joi.object({
    name: Joi.string().max(30),
    email:Joi.string().email(),
    password:Joi.string(),
    gender: Joi.string().valid("Male", "Female", "Other"),
    employeeId: Joi.string().max(20),
    personalEmail: Joi.string().email(),
    currentAddress: Joi.string().max(255),
    permanentAddress: Joi.string().max(255),
    profilePhoto: Joi.string(),
    resume: Joi.string(),
    batch: Joi.string().max(50),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    primary_skill:Joi.string(),
    secondary_skills:Joi.array(),
    bankDetails: Joi.object({
        accountNumber: Joi.number().integer(),
        branch: Joi.string().max(50),
        IFSC: Joi.string().max(11),
        bankName: Joi.string().max(50)
    }),
    education: Joi.object({
            degree: Joi.string().max(50),
            college: Joi.string().max(100),
            batch: Joi.string().max(50)
    }),
    designation: Joi.string().max(50),
    phone_no: Joi.string().pattern(/^\d{10}$/),
    certificates_submission_status: Joi.boolean(),
    status: Joi.string().valid("ACTIVE","NOT_ACTIVE","EXAMINATION","SHADOWING","DEPLOYED","TERMINATED","LEAVE"),
    dateOfBirth: Joi.date().iso(),
    dateOfJoining: Joi.date().iso(),
    phase: Joi.string().max(50),
    daysWorked:Joi.number().integer(),
    bloodGroup: Joi.string().valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
});

export const assetValidationSchema = Joi.object({
    userId: Joi.string().required(),
    assetType: Joi.string().max(50).required(),
    assetName: Joi.string().max(100).required(),
    givenOn:Joi.date().iso() 
    
});

export const assetUpdateValidationSchema = Joi.object({
    assetType: Joi.string().max(50),
    assetName: Joi.string().max(100),
    givenOn:Joi.date().iso(),
    returnedOn:Joi.date().iso(),
    
});
