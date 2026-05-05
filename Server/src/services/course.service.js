import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Task from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { logAction } from './audit.service.js';

export const createCourse = async (user, data) => {
  const existing = await Course.findOne({ name: data.name });
  if (existing) throw new ApiError(400, 'Course with this name already exists');

  const course = new Course(data);
  await course.save();

  await logAction({
    action: 'COURSE_CREATED',
    performedBy: user._id,
    entityType: 'Course',
    entityId: course._id,
    details: data,
  });

  return course;
};

export const getAllCourses = async () => {
  return await Course.find();
};

export const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');
  
  // Also fetch modules
  const modules = await Module.find({ course: courseId }).sort('orderIndex');
  return { ...course.toObject(), modules };
};

export const createModule = async (user, courseId, data) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const module = new Module({ ...data, course: courseId });
  await module.save();

  await logAction({
    action: 'MODULE_CREATED',
    performedBy: user._id,
    entityType: 'Module',
    entityId: module._id,
    details: { courseId, ...data },
  });

  return module;
};

export const getModulesWithTasks = async (courseId) => {
  const modules = await Module.find({ course: courseId }).sort('orderIndex').lean();
  
  for (let mod of modules) {
    mod.tasks = await Task.find({ module: mod._id });
  }
  
  return modules;
};

export const createTask = async (user, moduleId, data) => {
  const mod = await Module.findById(moduleId);
  if (!mod) throw new ApiError(404, 'Module not found');

  const task = new Task({ ...data, module: moduleId });
  await task.save();

  await logAction({
    action: 'TASK_CREATED',
    performedBy: user._id,
    entityType: 'Task',
    entityId: task._id,
    details: { moduleId, ...data },
  });

  return task;
};
