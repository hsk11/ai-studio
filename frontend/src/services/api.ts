import axios from 'axios';

const API_BASE_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
  
  signup: (email: string, password: string) =>
    apiClient.post('/api/auth/signup', { email, password }),
};

export const generationsApi = {
  createGeneration: (formData: FormData, config?: any) =>
    apiClient.post('/api/generations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    }),
  
  getGenerations: (limit?: number) =>
    apiClient.get(`/api/generations${limit ? `?limit=${limit}` : ''}`),
};

export default apiClient;
