import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { changeStatusSchema } from '../validators/student.validator.js';

const router = express.Router();

router.use(authMiddleware);

// Only Admins and Facilitators can manage student statuses and view batch rosters
router.patch(
  '/:id/status',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(changeStatusSchema),
  studentController.changeStatus
);

router.get(
  '/batch/:batchId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  studentController.getByBatch
);

export default router;
