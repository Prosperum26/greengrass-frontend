import apiClient from './client';

export const mapApi = {
  getMarkers: () => apiClient.get('/map/markers', { skipAuth: true }),
  getMarkerById: (id) => apiClient.get(`/map/markers/${id}`, { skipAuth: true }),
  getNearby: ({ lat, lng, radius = 10 }) =>
    apiClient.get('/map/nearby', {
      params: { lat, lng, radius },
      skipAuth: true,
    }),
  // Backward-compatible alias
  getEcoPoints: () => apiClient.get('/map/markers', { skipAuth: true }),
};
