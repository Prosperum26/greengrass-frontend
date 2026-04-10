// useCheckIn Hook
import { useState, useCallback } from 'react';
import { checkinApi } from '../../../api';

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);

  const getQRCode = useCallback(async (eventId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await checkinApi.getQRCode(eventId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lấy mã QR');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateCheckIn = useCallback(async (eventId, checkInData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Validate QR
      if (checkInData.qrData) {
        await checkinApi.validateQR(eventId, checkInData.qrData);
      }
      
      // Step 2: Validate GPS
      if (checkInData.gpsLocation) {
        await checkinApi.validateGPS(eventId, checkInData.gpsLocation);
      }
      
      // Step 3: Upload proof
      if (checkInData.proof) {
        await checkinApi.uploadProof(eventId, checkInData.proof);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStatus = useCallback(async (eventId) => {
    try {
      const { data } = await checkinApi.getCheckInStatus(eventId);
      setCheckInStatus(data);
      return data;
    } catch (err) {
      console.error('Failed to get check-in status:', err);
    }
  }, []);

  return {
    isLoading,
    error,
    checkInStatus,
    getQRCode,
    validateCheckIn,
    getStatus,
  };
};

export default useCheckIn;
