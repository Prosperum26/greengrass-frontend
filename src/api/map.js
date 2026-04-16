import apiClient from './client';

export const mapApi = {
  getEcoPoints: () => apiClient.get('/map/eco-points'),
};
