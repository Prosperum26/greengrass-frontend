// Check-in API
import apiClient from './client';

export const checkinApi = {
  getQRCode: (eventId) => apiClient.get(`/events/${eventId}/qr`),
  validateQR: (eventId, qrData) => apiClient.post(`/events/${eventId}/checkin/qr`, { qrData }),
  validateGPS: (eventId, coordinates) => apiClient.post(`/events/${eventId}/checkin/gps`, coordinates),
  uploadProof: (eventId, file) => {
    const formData = new FormData();
    formData.append('proof', file);
    return apiClient.post(`/events/${eventId}/checkin/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getCheckInStatus: (eventId) => apiClient.get(`/events/${eventId}/checkin/status`),
};
