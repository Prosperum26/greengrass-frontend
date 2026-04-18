// useEvents Hook
import { useState, useCallback } from 'react';
import { eventsApi } from '../../../api';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await eventsApi.getAll(params);
      setEvents(data.events);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải sự kiện');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await eventsApi.getById(id);
      setSelectedEvent(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết sự kiện');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerEvent = useCallback(async (eventId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await eventsApi.register(eventId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelRegistration = useCallback(async (eventId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await eventsApi.cancelRegistration(eventId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Hủy đăng ký thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await eventsApi.create(eventData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo sự kiện');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    events,
    selectedEvent,
    isLoading,
    error,
    fetchEvents,
    fetchEventById,
    registerEvent,
    cancelRegistration,
    createEvent,
  };
};

export default useEvents;
