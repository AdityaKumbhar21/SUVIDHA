import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach the JWT token and language header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Send language preference to backend
  const lang = localStorage.getItem('language') || 'en';
  config.headers['x-language'] = lang;
  
  return config;
});

export default api;