import Joi from 'joi';

export const taskSchema = Joi.object({
    date: Joi.date().iso(),
    tasks:Joi.array().items({
        taskId: Joi.number().integer(), 
        taskData:{
            taskName: Joi.string().min(3).max(255),
            activitiesPlanned: Joi.string().max(1000),
            activitiesCompleted: Joi.string().allow("").max(1000),
            estimatedTime: Joi.number().min(0),
            actualTime: Joi.number().min(0),
            taskProgress: Joi.string().valid("PENDING", "COMPLETED")
        }
    })
});


