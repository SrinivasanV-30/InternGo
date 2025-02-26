import Joi from 'joi';

export const interactionValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    assignedIntern: Joi.string().min(3).max(255).required(),
    internEmail: Joi.string().email().required(),
    assignedMentor: Joi.string().min(3).max(255).required(),
    assignedInterviewer: Joi.string().min(3).max(255).required(),
    date: Joi.date().iso().required(), 
    time: Joi.string()
        .required(),
    duration:Joi.string().required(),
    interactionStatus: Joi.string().valid("COMPLETED","PENDING")
});
