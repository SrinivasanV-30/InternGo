import Joi from 'joi';

const helpDeskSchema = Joi.object({
  subject: Joi.string().required(),
  description: Joi.string().required(),
  userId: Joi.string().required(),
  resolvedStatus: Joi.string().valid('PENDING', 'RESOLVED').required(),
  priority: Joi.string().valid('HIGH', 'MEDIUM', 'LOW').required(),
  recepient: Joi.string().valid('Mentors', 'Admins').required(),
  recepientId: Joi.string(),
});

export default helpDeskSchema;
