import api from './axios';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const acceptInvite = async (token, data) => {
  return await api.post('/auth/accept-invite', { token, ...data });
};

export const getProfile = async () => {
  return await api.get('/auth/me');
};

export const logout = async () => {
  return await api.post('/auth/logout');
};
