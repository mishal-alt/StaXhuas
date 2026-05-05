import api from './axios';

export const getStudentsByBatch = async (batchId) => {
  return await api.get(`/students/batch/${batchId}`);
};

export const changeStudentStatus = async (studentId, data) => {
  return await api.patch(`/students/${studentId}/status`, data);
};
