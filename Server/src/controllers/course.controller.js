import * as courseService from '../services/course.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.user, req.body);
  return apiResponse(res, 201, 'Course created successfully', course);
});

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getAllCourses();
  return apiResponse(res, 200, 'Courses retrieved successfully', courses);
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  return apiResponse(res, 200, 'Course retrieved successfully', course);
});

export const createModule = asyncHandler(async (req, res) => {
  const mod = await courseService.createModule(req.user, req.params.id, req.body);
  return apiResponse(res, 201, 'Module created successfully', mod);
});

export const getModules = asyncHandler(async (req, res) => {
  const modules = await courseService.getModulesWithTasks(req.params.id);
  return apiResponse(res, 200, 'Modules retrieved successfully', modules);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await courseService.createTask(req.user, req.params.moduleId, req.body);
  return apiResponse(res, 201, 'Task created successfully', task);
});
