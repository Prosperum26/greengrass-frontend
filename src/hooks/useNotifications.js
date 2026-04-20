import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../api/notifications';
import { useAuthContext } from './useAuthContext';

/**
 * Hook quản lý thông báo
 * @returns {Object} Các hàm và state liên quan đến thông báo
 */
export const useNotifications = () => {
  const { isAuthenticated } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch danh sách thông báo
   */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError(response.message || 'Không thể tải thông báo');
      }
    } catch (err) {
      setError(err.message || 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch số lượng thông báo chưa đọc
   */
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data?.count || 0);
      }
    } catch (err) {
      // Không set error để không hiển thị lỗi khi chỉ fetch count
      console.error('Lỗi khi lấy số thông báo chưa đọc:', err);
    }
  }, [isAuthenticated]);

  /**
   * Đánh dấu một thông báo đã đọc
   * @param {string} notificationId
   */
  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      const response = await markAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return response.success;
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
      return false;
    }
  }, []);

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await markAllAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
      return response.success;
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
      return false;
    }
  }, []);

  /**
   * Xóa thông báo
   * @param {string} notificationId
   */
  const handleDelete = useCallback(async (notificationId) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.success) {
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId)
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
      return response.success;
    } catch (err) {
      console.error('Lỗi khi xóa thông báo:', err);
      return false;
    }
  }, [notifications]);

  // Polling để cập nhật số thông báo chưa đọc mỗi 30 giây (chỉ khi đã đăng nhập)
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount, isAuthenticated]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
  };
};

export default useNotifications;
