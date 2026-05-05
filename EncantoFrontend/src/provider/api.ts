import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDev ? 'http://localhost:8080' : '/api', 
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('encanto_token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;