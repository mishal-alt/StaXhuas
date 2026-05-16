import api from './axios';

export const createInterview = async (data) => {
  const response = await api.post('/interviews', data);
  return response.data;
};

export const getInterviews = async (filters) => {
  const response = await api.get('/interviews', { params: filters });
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await api.patch(`/interviews/${id}`, data);
  return response.data;
};

export const recordScore = async (id, data) => {
  const response = await api.post(`/interviews/${id}/score`, data);
  return response.data;
};

export const createReInterview = async (id, data) => {
  const response = await api.post(`/interviews/${id}/re-interview`, data);
  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};

export const getInterviewStats = async (batchId) => {
  const response = await api.get(`/interviews/stats/${batchId}`);
  return response.data;
};
