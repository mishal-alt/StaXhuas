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

export const createModule = async (courseId, data) => {
  return await api.post(`/courses/${courseId}/modules`, data);
};

export const getModules = async (courseId) => {
  return await api.get(`/courses/${courseId}/modules`);
};

export const createTask = async (moduleId, data) => {
  return await api.post(`/courses/modules/${moduleId}/tasks`, data);
};
