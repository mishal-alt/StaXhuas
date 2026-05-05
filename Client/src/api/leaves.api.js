import api from './axios';

export const createLeave = async (data) => {
  return await api.post('/leaves', data);
};

export const reviewLeave = async (leaveId, data) => {
  return await api.patch(`/leaves/${leaveId}/review`, data);
};

export const getLeaves = async (batchId = '') => {
  const query = batchId ? `?batchId=${batchId}` : '';
  return await api.get(`/leaves${query}`);
};
