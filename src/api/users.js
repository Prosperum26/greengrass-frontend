// Users API
import apiClient from './client';

export const usersApi = {
  getMe: () => apiClient.get('/users/me'),
  updateMe: (data) => apiClient.patch('/users/me', data),
  getPublicProfile: (id) => apiClient.get(`/users/${id}/profile`),
  getMyEvents: () => apiClient.get('/users/me/events'),
  getMyPoints: () => apiClient.get('/users/me/points'),
  uploadAvatar: (formData) => apiClient.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
