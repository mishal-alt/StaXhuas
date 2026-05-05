import express from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { markAttendanceSchema } from '../validators/attendance.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(markAttendanceSchema),
  attendanceController.markAttendance
);

router.get(
  '/batch/:batchId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  attendanceController.getAttendance
);

export default router;
