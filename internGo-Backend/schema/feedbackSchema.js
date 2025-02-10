import Joi from 'joi'

export const feedbackValidationSchema = Joi.object({
    interactionId: Joi.number().required(),
    internId: Joi.string().required(),
    interviewerId: Joi.string().required(),
    ratings: Joi.object().pattern(Joi.string(), Joi.number()).required(),
    descriptive_feedback: Joi.string()
});

