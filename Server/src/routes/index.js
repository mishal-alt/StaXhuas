import express from 'express';
import authRoutes from './auth.routes.js';
import invitationRoutes from './invitation.routes.js';
import courseRoutes from './course.routes.js';
import batchRoutes from './batch.routes.js';
import studentRoutes from './student.routes.js';
import attendanceRoutes from './attendance.routes.js';
import leaveRoutes from './leave.routes.js';
import scrumRoutes from './scrum.routes.js';
import interviewRoutes from './interview.routes.js';
import reportRoutes from './report.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/invitations', invitationRoutes);
router.use('/courses', courseRoutes);
router.use('/batches', batchRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/scrum-calls', scrumRoutes);
router.use('/interviews', interviewRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);


router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

export default router;







