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

// --- Update & Delete logic ---

export const updateModule = async (user, moduleId, data) => {
  const mod = await Module.findByIdAndUpdate(moduleId, data, { new: true });
  if (!mod) throw new ApiError(404, 'Module not found');

  await logAction({
    action: 'MODULE_UPDATED',
    performedBy: user._id,
    entityType: 'Module',
    entityId: moduleId,
    details: data,
  });
  return mod;
};

export const deleteModule = async (user, moduleId) => {
  const mod = await Module.findByIdAndDelete(moduleId);
  if (!mod) throw new ApiError(404, 'Module not found');

  // Also delete associated tasks
  await Task.deleteMany({ module: moduleId });

  await logAction({
    action: 'MODULE_DELETED',
    performedBy: user._id,
    entityType: 'Module',
    entityId: moduleId,
  });
  return mod;
};

export const updateTask = async (user, taskId, data) => {
  const task = await Task.findByIdAndUpdate(taskId, data, { new: true });
  if (!task) throw new ApiError(404, 'Task not found');

  await logAction({
    action: 'TASK_UPDATED',
    performedBy: user._id,
    entityType: 'Task',
    entityId: taskId,
    details: data,
  });
  return task;
};

export const deleteTask = async (user, taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  await logAction({
    action: 'TASK_DELETED',
    performedBy: user._id,
    entityType: 'Task',
    entityId: taskId,
  });
  return task;
};

export const updateCourse = async (user, courseId, data) => {
  const course = await Course.findByIdAndUpdate(courseId, data, { new: true });
  if (!course) throw new ApiError(404, 'Course not found');

  await logAction({
    action: 'COURSE_UPDATED',
    performedBy: user._id,
    entityType: 'Course',
    entityId: courseId,
    details: data,
  });
  return course;
};

export const deleteCourse = async (user, courseId) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  // Also delete associated modules and tasks
  const modules = await Module.find({ course: courseId });
  for (const mod of modules) {
    await Task.deleteMany({ module: mod._id });
  }
  await Module.deleteMany({ course: courseId });

  await logAction({
    action: 'COURSE_DELETED',
    performedBy: user._id,
    entityType: 'Course',
    entityId: courseId,
  });
  return course;
};
