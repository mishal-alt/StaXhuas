import express from 'express';
import * as courseController from '../controllers/course.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createCourseSchema, createModuleSchema, createTaskSchema } from '../validators/course.validator.js';

const router = express.Router();

router.use(authMiddleware);

// Only Admins can manage courses
router.post('/', requireRole(ROLES.ADMIN), validate(createCourseSchema), courseController.createCourse);
router.get('/', courseController.getCourses); // Any logged in user can view courses
router.get('/:id', courseController.getCourse);

router.post('/:id/modules', requireRole(ROLES.ADMIN), validate(createModuleSchema), courseController.createModule);
router.get('/:id/modules', courseController.getModules);

router.post('/modules/:moduleId/tasks', requireRole(ROLES.ADMIN), validate(createTaskSchema), courseController.createTask);

export default router;
