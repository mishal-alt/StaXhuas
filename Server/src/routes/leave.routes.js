import express from 'express';
import * as leaveController from '../controllers/leave.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as leaveValidator from '../validators/leave.validator.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    validate(leaveValidator.getLeavesSchema, 'query'),
    leaveController.getLeaveRequests
  )
  .post(
    restrictTo(ROLES.STUDENT, ROLES.FACILITATOR, ROLES.ADMIN),
    validate(leaveValidator.createLeaveSchema),
    leaveController.createLeaveRequest
  );

router.get('/student/:studentId', leaveController.getStudentLeaveHistory);
router.get('/analytics/:batchId', leaveController.getLeaveAnalytics);

// Approval workflows (Facilitators & Admins)
router.use(restrictTo(ROLES.FACILITATOR, ROLES.ADMIN));

router.patch(
  '/:id/approve',
  validate(leaveValidator.reviewLeaveSchema),
  leaveController.approveLeaveRequest
);

router.patch(
  '/:id/reject',
  validate(leaveValidator.reviewLeaveSchema),
  leaveController.rejectLeaveRequest
);

router.patch(
  '/:id/cancel',
  validate(leaveValidator.reviewLeaveSchema),
  leaveController.cancelLeaveRequest
);

export default router;
