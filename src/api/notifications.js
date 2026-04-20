import apiClient from './client';

/**
 * Lấy danh sách thông báo của user
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

/**
 * Lấy số lượng thông báo chưa đọc
 * @returns {Promise<{success: boolean, data: {count: number}, message?: string}>}
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data;
};

/**
 * Đánh dấu thông báo đã đọc
 * @param {string} notificationId - ID của thông báo
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const markAsRead = async (notificationId) => {
  const response = await apiClient.post(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const markAllAsRead = async () => {
  const response = await apiClient.post('/notifications/read-all');
  return response.data;
};

/**
 * Xóa thông báo
 * @param {string} notificationId - ID của thông báo
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const deleteNotification = async (notificationId) => {
  const response = await apiClient.delete(`/notifications/${notificationId}`);
  return response.data;
};
