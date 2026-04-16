// Authentication API
import apiClient from './client';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  registerStudent: (data) => apiClient.post('/auth/register', data),
  registerOrganizerRequest: (data) => apiClient.post('/auth/organizer/request', data),
  refresh: (payload) => apiClient.post('/auth/refresh', payload),
  logout: () => apiClient.post('/auth/logout'),
};
