import express from 'express';
import * as batchController from '../controllers/batch.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createBatchSchema, updateBatchConfigSchema } from '../validators/batch.validator.js';

const router = express.Router();

router.use(authMiddleware);

// Admins only
router.post('/', requireRole(ROLES.ADMIN), validate(createBatchSchema), batchController.createBatch);
router.patch('/:id/config', requireRole(ROLES.ADMIN), validate(updateBatchConfigSchema), batchController.updateConfig);

// Admins and Facilitators
router.get('/', requireRole(ROLES.ADMIN, ROLES.FACILITATOR), batchController.getBatches);
router.get('/:id', requireRole(ROLES.ADMIN, ROLES.FACILITATOR), batchController.getBatch);

export default router;
