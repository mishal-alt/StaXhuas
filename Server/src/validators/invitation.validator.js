import Joi from 'joi';
import { ROLES } from '../utils/constants.js';

export const inviteSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required(),
  batch: Joi.string().hex().length(24).optional().allow(null),
});
