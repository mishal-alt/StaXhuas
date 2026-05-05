import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const acceptInviteSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
