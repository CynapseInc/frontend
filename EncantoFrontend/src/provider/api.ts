import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API || 'http://localhost:8080/',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
