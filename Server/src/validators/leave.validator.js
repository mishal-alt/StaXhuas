import Joi from 'joi';
import { LEAVE_STATUS, LEAVE_TYPES } from '../utils/constants.js';

export const createLeaveSchema = Joi.object({
  studentId: Joi.string().required(),
  batchId: Joi.string().required(),
  leaveType: Joi.string().valid(...Object.values(LEAVE_TYPES)).required(),
  reason: Joi.string().min(5).required(),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')).required(),
  supportingDocument: Joi.string().optional().allow(''),
});

export const getLeavesSchema = Joi.object({
  batch: Joi.string().optional(),
  status: Joi.string().valid(...Object.values(LEAVE_STATUS)).optional(),
  leaveType: Joi.string().valid(...Object.values(LEAVE_TYPES)).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
});

export const reviewLeaveSchema = Joi.object({
  remarks: Joi.string().optional().allow(''),
});
