import api from './axios';

export const getFacilitators = async () => {
  return await api.get('/users?role=facilitator');
};

export const getInterviewers = async () => {
  return await api.get('/users?role=interviewer');
};
