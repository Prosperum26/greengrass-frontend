// useCheckIn Hook
import { useCallback, useState } from 'react';
import { checkinApi } from '../../../api';

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getQrCode = useCallback(async (eventId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await checkinApi.getQrCode(eventId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lấy mã QR');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkIn = useCallback(async (eventId, qrToken) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await checkinApi.checkIn(eventId, qrToken);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCheckInStats = useCallback(async (eventId) => {
    const { data } = await checkinApi.getCheckInStats(eventId);
    return data;
  }, []);

  return {
    isLoading,
    error,
    getQrCode,
    checkIn,
    getCheckInStats,
  };
};

export default useCheckIn;
