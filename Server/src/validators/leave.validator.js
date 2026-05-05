import Joi from 'joi';
import { LEAVE_STATUS } from '../utils/constants.js';

export const createLeaveSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  reason: Joi.string().min(5).required(),
});

export const reviewLeaveSchema = Joi.object({
  status: Joi.string().valid(LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED).required(),
  remark: Joi.string().allow('', null),
});
