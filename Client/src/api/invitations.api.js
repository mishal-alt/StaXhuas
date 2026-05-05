import api from './axios';

export const inviteStudent = async (data) => {
  return await api.post('/invitations/create', data);
};

export const getInvitations = async (status = 'pending') => {
  return await api.get(`/invitations?status=${status}`);
};
