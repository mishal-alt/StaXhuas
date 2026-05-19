import api from './axios';

// Classic methods (aliased to backend-compatible queries)
export const getLeaves = async (batchId = '') => {
  const params = batchId ? { batch: batchId } : {};
  const response = await api.get('/leaves', { params });
  return response;
};

export const reviewLeave = async (leaveId, { status, remarks = '' }) => {
  let action = status;
  if (status === 'approved') action = 'approve';
  if (status === 'rejected') action = 'reject';
  const endpoint = `/leaves/${leaveId}/${action}`;
  const response = await api.patch(endpoint, { remarks });
  return response;
};

export const createLeave = async (data) => {
  const response = await api.post('/leaves', data);
  return response;
};

// New MERN integrated endpoints
export const getLeaveRequests = async (params) => {
  const response = await api.get('/leaves', { params });
  return response;
};

export const createLeaveRequest = async (data) => {
  const response = await api.post('/leaves', data);
  return response;
};

export const approveLeaveRequest = async ({ id, remarks }) => {
  const response = await api.patch(`/leaves/${id}/approve`, { remarks });
  return response;
};

export const rejectLeaveRequest = async ({ id, remarks }) => {
  const response = await api.patch(`/leaves/${id}/reject`, { remarks });
  return response;
};

export const cancelLeaveRequest = async ({ id, remarks }) => {
  const response = await api.patch(`/leaves/${id}/cancel`, { remarks });
  return response;
};

export const getStudentLeaveHistory = async (studentId) => {
  const response = await api.get(`/leaves/student/${studentId}`);
  return response;
};

export const getLeaveAnalytics = async (batchId) => {
  const response = await api.get(`/leaves/analytics/${batchId}`);
  return response;
};
