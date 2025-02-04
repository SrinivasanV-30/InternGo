import Joi from 'joi';

export const taskSchema = Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    tasks:Joi.array().items({
    taskId: Joi.number().integer(), 
    taskData:{
        taskName: Joi.string().min(3).max(255).required(),
        activitiesPlanned: Joi.string().min(3).max(1000).required(),
        activitiesCompleted: Joi.string().allow("").max(1000),
        estimatedTime: Joi.number().integer().min(1).required(),
        actualTime: Joi.number().integer().min(0),
        taskProgress: Joi.string().valid("PENDING", "COMPLETED").required()
    }
    })
});


