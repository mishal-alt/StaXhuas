import Joi from 'joi';

export const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  durationMonths: Joi.number().min(1).required(),
});

export const updateCourseSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  durationMonths: Joi.number().min(1),
  isActive: Joi.boolean(),
}).min(1);

export const createModuleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  orderIndex: Joi.number().min(0).required(),
  durationWeeks: Joi.number().min(1).required(),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('personal', 'technical').required(),
});
