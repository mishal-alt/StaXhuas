import express from 'express';
import * as invitationController from '../controllers/invitation.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { inviteSchema } from '../validators/invitation.validator.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  validate(inviteSchema),
  invitationController.create
);

router.get(
  '/',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  invitationController.list
);

router.post(
  '/:id/revoke',
  requireRole(ROLES.ADMIN, ROLES.FACILITATOR),
  invitationController.revoke
);

export default router;
