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

router.use(restrictTo(ROLES.ADMIN));

router.get('/', userController.getUsersByRole);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
