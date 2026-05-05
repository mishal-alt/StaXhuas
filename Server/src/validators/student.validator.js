import Joi from 'joi';
import { STUDENT_STATUS } from '../utils/constants.js';

export const changeStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(STUDENT_STATUS))
    .required(),
  remark: Joi.string().min(5).required(),
});
