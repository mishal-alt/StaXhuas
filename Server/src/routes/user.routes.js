import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', (req, res) => userController.getUserById({ params: { id: req.user.id } }, res));
router.patch('/me', userController.updateMe);
router.post('/me/profile-pic', upload.single('profilePic'), userController.uploadProfilePic);

// Explicit route permissions
router.get('/', restrictTo(ROLES.ADMIN, ROLES.FACILITATOR), userController.getUsersByRole);
router.get('/:id', restrictTo(ROLES.ADMIN, ROLES.FACILITATOR), userController.getUserById);
router.patch('/:id', restrictTo(ROLES.ADMIN), userController.updateUser);
router.delete('/:id', restrictTo(ROLES.ADMIN), userController.deleteUser);

export default router;
