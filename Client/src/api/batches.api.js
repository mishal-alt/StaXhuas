import api from './axios';

export const getBatches = async () => {
  return await api.get('/batches');
};

export const getBatch = async (id) => {
  return await api.get(`/batches/${id}`);
};

export const createBatch = async (data) => {
  return await api.post('/batches', data);
};

