import api from './axios';

export const getAttendanceForDate = async (batchId, dateStr) => {
  return await api.get(`/attendance/batch/${batchId}/date/${dateStr}`);
};

export const markSingleAttendance = async (data) => {
  return await api.post('/attendance/mark', data);
};

export const bulkMarkAttendance = async (data) => {
  return await api.post('/attendance/bulk', data);
};

export const updateAttendanceRecord = async (id, data) => {
  return await api.patch(`/attendance/${id}`, data);
};

export const getStudentAttendance = async (studentId) => {
  return await api.get(`/attendance/student/${studentId}`);
};

export const getAttendanceAnalytics = async (batchId) => {
  return await api.get(`/attendance/analytics/${batchId}`);
};
