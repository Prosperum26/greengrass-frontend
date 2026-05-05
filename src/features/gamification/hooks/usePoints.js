// usePoints Hook
import { useState, useCallback } from 'react';
import { pointsApi } from '../../../api';

export const usePoints = () => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await pointsApi.getMe();
      setPoints(data.totalPoints ?? 0);
      setHistory(data.history ?? []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải điểm');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBadges = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await pointsApi.getMyBadges();
      setBadges(data ?? []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải huy hiệu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const { data } = await pointsApi.getLeaderboard(params);
      setLeaderboard(data ?? []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải bảng xếp hạng');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    points,
    badges,
    history,
    leaderboard,
    isLoading,
    error,
    fetchPoints,
    fetchBadges,
    fetchLeaderboard,
  };
};

export default usePoints;
