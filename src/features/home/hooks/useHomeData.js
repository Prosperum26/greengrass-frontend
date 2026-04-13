import { useState, useEffect } from 'react';
import homeService from '../services/homeService';

export const useHomeData = () => {
  const [data, setData] = useState({
    events: [],
    leaderboard: [],
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all required data in parallel
        const [events, leaderboard, stats] = await Promise.all([
          homeService.getEvents(),
          homeService.getLeaderboard(),
          homeService.getStats()
        ]);

        setData({
          events,
          leaderboard,
          stats
        });
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu trang chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    ...data,
    loading,
    error
  };
};

export default useHomeData;
