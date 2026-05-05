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

export const updateBatch = async (id, data) => {
  return await api.put(`/batches/${id}`, data);
};

export const deleteBatch = async (id) => {
  return await api.delete(`/batches/${id}`);
};
