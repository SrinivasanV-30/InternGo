import Joi from 'joi';

export const planCreateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).required(),
    planDays: Joi.number().integer().min(1).required(),
    startDate:Joi.string().required(),
    endDate:Joi.string().required()
});
export const planUpdateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(1000),
    planDays: Joi.number().integer().min(1),
    startDate:Joi.string(),
    endDate:Joi.string()
    
});

export const milestoneCreateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    mentorName: Joi.string().min(3).max(255).required(),
    milestoneDays: Joi.number().integer().min(1),
    
})
export const milestoneUpdateValidationSchema = Joi.object({
    milestoneId:Joi.number().integer().min(1).required(),
    milestoneData:Joi.object({
        name: Joi.string().min(3).max(255),
        mentorName: Joi.string().min(3).max(255),
        milestoneDays: Joi.number().integer().min(1),
        
    })
});

export const objectiveCreateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    milestoneId:Joi.number().integer().min(1).required(),
    description: Joi.string().max(1000).required(),
    objectiveDays: Joi.number().integer().min(1).required(),
    noOfInteractions: Joi.number().integer().min(1).required(),
    roadmapType: Joi.string().valid("CUSTOM","DEFAULT"),
});


export const objectiveUpdateValidationSchema = Joi.object({
    objectiveId:Joi.number().integer().min(1).required(),
    objectiveData:Joi.object({
        name: Joi.string().min(3).max(255),
        description: Joi.string().max(1000),
        objectiveDays: Joi.number().integer().min(1),
        noOfInteractions: Joi.number().integer().min(1),
        roadmapType: Joi.string().valid("CUSTOM","DEFAULT"),
    })
});

export const objectivesCreateValidationSchema = Joi.object({
    objectiveDatas:Joi.array().items(objectiveCreateValidationSchema)
})
export const objectivesUpdateValidationSchema = Joi.object({
    objectiveDatas:Joi.array().items(objectiveUpdateValidationSchema)
})
export const usersPlanValidationSchema=Joi.object({
    userIds:Joi.array().items(Joi.string())
})


