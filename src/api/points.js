import apiClient from './client';

export const pointsApi = {
  getMe: () => apiClient.get('/points/me'),
  getLeaderboard: (params) => apiClient.get('/points/leaderboard', { params }),
  getBadges: () => apiClient.get('/points/badges'),
  getMyBadges: () => apiClient.get('/points/badges/me'),
  getHistory: (params) => apiClient.get('/points/history', { params }),
  getMyRank: () => apiClient.get('/points/rank'),
};
