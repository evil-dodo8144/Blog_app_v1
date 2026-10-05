// src/api/commentApi.js
import axiosClient from './axiosClient';

export const commentApi = {
  getByPost: (postId, params = {}) =>
    axiosClient.get(`/posts/${postId}/comments`, { params }),
  add: (postId, data) =>
    axiosClient.post(`/posts/${postId}/comments`, data),
  remove: (postId, commentId) =>
    axiosClient.delete(`/posts/${postId}/comments/${commentId}`),
};
