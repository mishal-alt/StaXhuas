import api from './axios';

export const logScrum = async (data) => {
  return await api.post('/scrum-calls', data);
};

export const getScrums = async (batchId) => {
  return await api.get(`/scrum-calls/batch/${batchId}`);
};
