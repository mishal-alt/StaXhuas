import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import * as interviewController from '../controllers/interview.controller.js';

const router = express.Router();

router.use(protect);
// Assuming only admin/facilitator can access
router.use(restrictTo('admin', 'facilitator'));

router.route('/')
  .post(interviewController.createInterview)
  .get(interviewController.getInterviews);

router.route('/stats/:batchId')
  .get(interviewController.getInterviewStats);

router.route('/:id')
  .get(interviewController.getInterviewById)
  .patch(interviewController.updateInterview)
  .delete(interviewController.deleteInterview);

router.post('/:id/score', interviewController.recordScore);
router.post('/:id/re-interview', interviewController.createReInterview);

export default router;
