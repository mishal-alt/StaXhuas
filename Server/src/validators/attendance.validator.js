import Joi from 'joi';
import { ATTENDANCE_STATUS } from '../utils/constants.js';

export const markAttendanceSchema = Joi.object({
  batch: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  records: Joi.array()
    .items(
      Joi.object({
        student: Joi.string().hex().length(24).required(),
        status: Joi.string()
          .valid(...Object.values(ATTENDANCE_STATUS))
          .required(),
      })
    )
    .min(1)
    .required(),
});
