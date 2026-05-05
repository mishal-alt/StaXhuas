import Joi from 'joi';

export const createBatchSchema = Joi.object({
  name: Joi.string().required(),
  course: Joi.string().hex().length(24).required(),
  facilitator: Joi.string().hex().length(24).required(),
  startDate: Joi.date().iso().required(),
  config: Joi.object({
    leaveLimit: Joi.number().min(0),
    leaveLimitPeriod: Joi.string().valid('per_module', 'per_course'),
    reinterviewLimit: Joi.number().min(0),
    scrumCallTime: Joi.string(),
    workingDays: Joi.array().items(Joi.string().valid('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')),
  }).optional(),
});

export const updateBatchConfigSchema = Joi.object({
  leaveLimit: Joi.number().min(0),
  leaveLimitPeriod: Joi.string().valid('per_module', 'per_course'),
  reinterviewLimit: Joi.number().min(0),
  scrumCallTime: Joi.string(),
  workingDays: Joi.array().items(Joi.string().valid('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')),
}).min(1);
