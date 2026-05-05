// Check-in API
import apiClient from './client';

export const checkinApi = {
  getQrCode: (eventId) => apiClient.get(`/events/${eventId}/qr`),
  checkIn: (eventId, checkInData) => apiClient.post(`/events/${eventId}/check-in`, checkInData),
  getCheckedInUsers: (eventId) => apiClient.get(`/events/${eventId}/checked-in`),
  getCheckInStats: (eventId) => apiClient.get(`/events/${eventId}/check-in-stats`),
};
