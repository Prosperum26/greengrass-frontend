// Check-in API
import apiClient from './client';

export const checkinApi = {
  getQrCode: (eventId) => apiClient.get(`/events/${eventId}/qr`),
  checkIn: (eventId, qrToken) => apiClient.post(`/events/${eventId}/check-in`, { qrToken }),
  getCheckedInUsers: (eventId) => apiClient.get(`/events/${eventId}/checked-in`),
  getCheckInStats: (eventId) => apiClient.get(`/events/${eventId}/check-in-stats`),
};
