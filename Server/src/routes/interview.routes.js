import express from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { scheduleInterviewSchema, scoreInterviewSchema } from '../validators/interview.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(scheduleInterviewSchema),
  interviewController.schedule
);

router.post(
  '/:id/score',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(scoreInterviewSchema),
  interviewController.score
);

router.get(
  '/',
  interviewController.getMyInterviews
);

export default router;
