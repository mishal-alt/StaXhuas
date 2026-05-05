import api from './axios';

export const scheduleInterview = async (data) => {
  return await api.post('/interviews', data);
};

export const scoreInterview = async (interviewId, data) => {
  return await api.post(`/interviews/${interviewId}/score`, data);
};

export const getInterviews = async (batchId = '') => {
  const query = batchId ? `?batchId=${batchId}` : '';
  return await api.get(`/interviews${query}`);
};

export const getInterviewById = async (id) => {
  return await api.get(`/interviews/${id}`);
};

