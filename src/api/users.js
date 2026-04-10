// Users API
import apiClient from './client';

export const usersApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.patch('/users/profile', data),
  getPoints: () => apiClient.get('/users/points'),
  getBadges: () => apiClient.get('/users/badges'),
  getHistory: () => apiClient.get('/users/history'),
  getLeaderboard: (params) => apiClient.get('/users/leaderboard', { params }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
