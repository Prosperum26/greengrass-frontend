import { useState, useCallback } from 'react';
import { adminApi } from '../api';

export const useAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getOrganizerRequests(params);
      setRequests(response.data.items || []);
      setPagination(response.data.pagination || { total: 0, page: params.page || 1, limit: params.limit || 10 });
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveRequest = async (id) => {
    try {
      await adminApi.approveOrganizerRequest(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Duyệt thất bại' };
    }
  };

  const rejectRequest = async (id, reason) => {
    try {
      await adminApi.rejectOrganizerRequest(id, reason);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Từ chối thất bại' };
    }
  };

  const deleteOrganizer = async (id) => {
    try {
      await adminApi.deleteOrganizerRequest(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Xóa thất bại' };
    }
  };

  return {
    requests,
    pagination,
    isLoading,
    error,
    fetchRequests,
    approveRequest,
    rejectRequest,
    deleteOrganizer,
  };
};

export default useAdmin;
