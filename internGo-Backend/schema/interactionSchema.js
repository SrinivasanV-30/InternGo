import Joi from 'joi';

export const interactionValidationSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    assignedIntern: Joi.string().min(3).max(255).required(),
    internEmail: Joi.string().email().required(),
    assignedMentor: Joi.string().min(3).max(255).required(),
    assignedInterviewer: Joi.string().min(3).max(255).required(),
    date: Joi.date().iso().required(), 
    time: Joi.string()
        .pattern(/^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i)
        .required()
        .messages({
            "string.pattern.base": "Time must be in the format HH:MM AM/PM",
        }),
    duration:Joi.string().required()
});
