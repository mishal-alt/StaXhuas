import express from 'express';
import * as leaveController from '../controllers/leave.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createLeaveSchema, reviewLeaveSchema } from '../validators/leave.validator.js';

const router = express.Router();

router.use(authMiddleware);

// Students can raise leaves
router.post(
  '/',
  requireRole(ROLES.STUDENT),
  validate(createLeaveSchema),
  leaveController.createLeave
);

// Facilitators/Admins can review
router.patch(
  '/:id/review',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(reviewLeaveSchema),
  leaveController.reviewLeave
);

// Everyone can view leaves (Service handles filtering by role)
router.get(
  '/',
  leaveController.getLeaves
);

export default router;
