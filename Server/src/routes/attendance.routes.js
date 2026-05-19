import express from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { 
  markSingleAttendanceSchema, 
  bulkMarkAttendanceSchema, 
  updateAttendanceSchema 
} from '../validators/attendance.validator.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/attendance/batch/:batchId/date/:date
router.get(
  '/batch/:batchId/date/:date',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  attendanceController.getAttendanceForDate
);

// POST /api/attendance/mark
router.post(
  '/mark',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(markSingleAttendanceSchema),
  attendanceController.markSingleAttendance
);

// POST /api/attendance/bulk
router.post(
  '/bulk',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(bulkMarkAttendanceSchema),
  attendanceController.bulkMarkAttendance
);

// PATCH /api/attendance/:id
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(updateAttendanceSchema),
  attendanceController.updateAttendance
);

// GET /api/attendance/student/:studentId
router.get(
  '/student/:studentId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT),
  attendanceController.getStudentAttendance
);

// GET /api/attendance/analytics/:batchId
router.get(
  '/analytics/:batchId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  attendanceController.getAttendanceAnalytics
);

export default router;
