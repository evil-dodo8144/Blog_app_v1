// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  // Backend runs on port 8185 as configured in application.properties
  baseURL: 'http://localhost:8185/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally – clear token and redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
