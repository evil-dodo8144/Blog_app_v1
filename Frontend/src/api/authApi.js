// src/api/authApi.js
import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  getMe: () => axiosClient.get('/users/me'),
  updateMe: (data) => axiosClient.put('/users/me', data),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
};
