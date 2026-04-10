// Events API
import apiClient from './client';

export const eventsApi = {
  getAll: (params) => apiClient.get('/events', { params }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.patch(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
  register: (eventId) => apiClient.post(`/events/${eventId}/register`),
  cancelRegistration: (eventId) => apiClient.delete(`/events/${eventId}/register`),
  getParticipants: (eventId) => apiClient.get(`/events/${eventId}/participants`),
  exportParticipants: (eventId) => apiClient.get(`/events/${eventId}/export`, { responseType: 'blob' }),
};
