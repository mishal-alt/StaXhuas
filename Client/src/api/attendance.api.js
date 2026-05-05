import api from './axios';

export const markAttendance = async (data) => {
  return await api.post('/attendance', data);
};

export const getAttendance = async (batchId, dateStr) => {
  const query = dateStr ? `?date=${dateStr}` : '';
  return await api.get(`/attendance/batch/${batchId}${query}`);
};
