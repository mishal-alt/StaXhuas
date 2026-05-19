import Joi from 'joi';
import { ATTENDANCE_STATUS } from '../utils/constants.js';

export const markSingleAttendanceSchema = Joi.object({
  batchId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid(...Object.values(ATTENDANCE_STATUS)).required(),
  remarks: Joi.string().allow('', null).optional()
});

export const bulkMarkAttendanceSchema = Joi.object({
  batchId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  attendanceRecords: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        status: Joi.string().valid(...Object.values(ATTENDANCE_STATUS)).required(),
        remarks: Joi.string().allow('', null).optional()
      })
    )
    .min(1)
    .required(),
});

export const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid(...Object.values(ATTENDANCE_STATUS)).optional(),
  remarks: Joi.string().allow('', null).optional()
}).min(1);
