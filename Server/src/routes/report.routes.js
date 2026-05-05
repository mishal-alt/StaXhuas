import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(authMiddleware);

// Only Admins can view the global overview
router.get(
  '/admin-overview',
  requireRole(ROLES.ADMIN),
  reportController.getAdminOverview
);

// Admins and Facilitators can view batch specific analytics
router.get(
  '/batch/:batchId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  reportController.getBatchAnalytics
);

export default router;
