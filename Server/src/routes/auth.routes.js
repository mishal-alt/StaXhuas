import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, acceptInviteSchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/accept-invite', validate(acceptInviteSchema), authController.acceptInvite);
router.get('/me', protect, authController.me);


export default router;
