import Joi from 'joi';

export const scheduleInterviewSchema = Joi.object({
  student: Joi.string().hex().length(24).required(),
  module: Joi.string().hex().length(24).required(),
  interviewer: Joi.string().hex().length(24).required(),
  scheduledDate: Joi.date().iso().required(),
});

export const scoreInterviewSchema = Joi.object({
  score: Joi.number().min(0).max(100).required(),
  isPass: Joi.boolean().required(),
  interviewerFeedback: Joi.string().min(5).required(),
});
