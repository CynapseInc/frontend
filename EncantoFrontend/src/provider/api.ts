import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDev ? 'http://localhost:8080' : '/api', 
});

api.interceptors.request.use((config) => {
  // Agora procura no localStorage primeiro, com fallback para o sessionStorage
  const token = localStorage.getItem('encanto_token') || sessionStorage.getItem('encanto_token') || sessionStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;