// Events API
import apiClient from './client';

export const eventsApi = {
  getAll: (params, options = {}) => apiClient.get('/events', { params, ...options }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (payload) =>
    apiClient.post('/events', payload, payload instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined),
  register: (eventId) => apiClient.post(`/events/${eventId}/register`),
  getParticipants: (eventId) => apiClient.get(`/events/${eventId}/participants`),
  getCheckedIn: (eventId) => apiClient.get(`/events/${eventId}/checked-in`),
  getCheckInStats: (eventId) => apiClient.get(`/events/${eventId}/check-in-stats`),
  getQrCode: (eventId) => apiClient.get(`/events/${eventId}/qr`),
  checkIn: (eventId, payload) => apiClient.post(`/events/${eventId}/check-in`, payload),
  exportParticipants: (eventId) => apiClient.get(`/events/${eventId}/export`, { responseType: 'blob' }),
  addGalleryImage: (eventId, formData) => apiClient.post(`/events/${eventId}/gallery`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (eventId, payload) =>
    apiClient.put(`/events/${eventId}`, payload, payload instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined),
  cancelRegister: (eventId) => apiClient.delete(`/events/${eventId}/register`),
  checkRegistration: (eventId) => apiClient.get(`/events/${eventId}/registration`),
  delete: (eventId) => apiClient.delete(`/events/${eventId}`),
};
