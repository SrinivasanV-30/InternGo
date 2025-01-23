import Joi from 'joi';

export const signUpValidationSchema= Joi.object({
    name:Joi.string().max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().required()
})
export const userCreateValidationSchema= Joi.object({
    name:Joi.string().max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().required(),
    role:Joi.string().required()
})
export const signInValidationSchema= Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
})