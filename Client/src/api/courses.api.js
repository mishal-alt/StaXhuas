import api from './axios';

export const getCourses = async () => {
  return await api.get('/courses');
};

export const getCourse = async (id) => {
  return await api.get(`/courses/${id}`);
};

export const createCourse = async (data) => {
  return await api.post('/courses', data);
};

export const updateCourse = async (id, data) => {
  return await api.put(`/courses/${id}`, data);
};

export const deleteCourse = async (id) => {
  return await api.delete(`/courses/${id}`);
};

export const createModule = async (courseId, data) => {
  return await api.post(`/courses/${courseId}/modules`, data);
};

export const getModules = async (courseId) => {
  return await api.get(`/courses/${courseId}/modules`);
};

export const createTask = async (moduleId, data) => {
  return await api.post(`/courses/modules/${moduleId}/tasks`, data);
};

export const deleteModule = async (id) => {
  return await api.delete(`/courses/modules/${id}`);
};

export const updateModule = async (id, data) => {
  return await api.put(`/courses/modules/${id}`, data);
};

export const deleteTask = async (taskId) => {
  return await api.delete(`/courses/tasks/${taskId}`);
};

export const updateTask = async (taskId, data) => {
  return await api.put(`/courses/tasks/${taskId}`, data);
};
