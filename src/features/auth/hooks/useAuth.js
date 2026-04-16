import { useState, useCallback, useEffect } from 'react';
import { authApi, usersApi } from '../../../api';

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await usersApi.getMe();
          setUser(data);
        } catch {
          localStorage.clear();
        }
      }
    };
    void checkUserStatus();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      const payload = decodeJwtPayload(data.accessToken);
      if (payload?.sub) {
        localStorage.setItem('userId', payload.sub);
        localStorage.setItem('role', payload.role);
      }

      const me = await usersApi.getMe();
      setUser(me.data);
      return me.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } =
        userData.accountType === 'ORGANIZER'
          ? await authApi.registerOrganizerRequest(userData)
          : await authApi.registerStudent(userData);

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        const payload = decodeJwtPayload(data.accessToken);
        if (payload?.sub) {
          localStorage.setItem('userId', payload.sub);
          localStorage.setItem('role', payload.role);
        }
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.clear();
      setUser(null);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};

export default useAuth;