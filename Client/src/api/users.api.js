import api from './axios';

export const getFacilitators = async () => {
  return await api.get('/users?role=facilitator');
};

export const getInterviewers = async () => {
  return await api.get('/users?role=interviewer');
};
export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

export const updateUser = async (id, data) => {
  return await api.patch(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};
