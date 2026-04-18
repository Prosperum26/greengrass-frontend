import apiClient from './client';

export const assistantApi = {
  chat: (payload) => apiClient.post('/assistant/chat', payload, { skipAuth: true }),
  getRecommendations: () => apiClient.get('/assistant/recommendations', { skipAuth: true }),
};

export default assistantApi;
