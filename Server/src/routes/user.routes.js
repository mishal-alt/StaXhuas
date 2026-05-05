import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo(ROLES.ADMIN));

router.get('/', userController.getUsersByRole);

export default router;
