// src/api/postApi.js
import axiosClient from './axiosClient';

export const postApi = {
  getAll: (params = {}) => axiosClient.get('/posts', { params }),
  getById: (id) => axiosClient.get(`/posts/${id}`),
  getBySlug: (slug) => axiosClient.get(`/posts/slug/${slug}`),
  create: (data) => axiosClient.post('/posts', data),
  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
  remove: (id) => axiosClient.delete(`/posts/${id}`),
  toggleLike: (postId) => axiosClient.post(`/posts/${postId}/like`),
};
