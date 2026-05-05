import api from './axios';

export const getAdminOverview = async () => {
  return await api.get('/reports/admin-overview');
};

export const getBatchAnalytics = async (batchId) => {
  return await api.get(`/reports/batch/${batchId}`);
};
