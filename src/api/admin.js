import apiClient from './client';

export const adminApi = {
  getOrganizerRequests: (params) => {
    // params expected: { page, limit, status }
    return apiClient.get('/admin/organizer-requests', { params });
  },
  getOrganizerRequestById: (id) => {
    return apiClient.get(`/admin/organizer-requests/${id}`);
  },
  approveOrganizerRequest: (id) => {
    return apiClient.post(`/admin/organizer-requests/${id}/approve`);
  },
  rejectOrganizerRequest: (id, reason) => {
    return apiClient.post(`/admin/organizer-requests/${id}/reject`, { reason });
  },
};
