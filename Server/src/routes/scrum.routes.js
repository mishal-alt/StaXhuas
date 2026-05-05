import express from 'express';
import * as scrumController from '../controllers/scrum.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createScrumCallSchema } from '../validators/scrum.validator.js';

const router = express.Router();

router.use(authMiddleware);

// Only Facilitators run scrum calls
router.post(
  '/',
  requireRole(ROLES.FACILITATOR),
  validate(createScrumCallSchema),
  scrumController.logScrum
);

// Admins and Facilitators can view scrum histories
router.get(
  '/batch/:batchId',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  scrumController.getScrums
);

export default router;
