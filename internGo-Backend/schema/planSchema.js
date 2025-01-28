import Joi from 'joi';

export const planCreateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).required(),
    noOfDays: Joi.number().integer().min(1).required(),
});

export const objectiveCreateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).required(),
    noOfDays: Joi.number().integer().min(1).required(),
    noOfInteractions: Joi.number().integer().min(1).required(),
    mentorName: Joi.string().min(3).max(255).required(),
    roadmapType: Joi.string().valid("Custom","Default").required(),
});

export const planUpdateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(1000),
    noOfDays: Joi.number().integer().min(1),
});

export const objectiveUpdateValidationSchema = Joi.object({
    objectiveId:Joi.number().integer().min(1).required(),
    objectiveData:Joi.object({
        name: Joi.string().min(3).max(255),
        description: Joi.string().max(1000),
        noOfDays: Joi.number().integer().min(1),
        noOfInteractions: Joi.number().integer().min(1),
        mentorName: Joi.string().min(3).max(255),
        roadmapType: Joi.string().valid("Custom","Default"),
    })
});


