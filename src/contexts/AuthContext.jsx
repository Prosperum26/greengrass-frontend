import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authApi, usersApi, setTokenAccessors } from '../api';

export const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Retrieve tokens from secure storage (localStorage for now, migrate to cookies later)
  const getAccessToken = useCallback(() => localStorage.getItem('accessToken'), []);
  const getRefreshToken = useCallback(() => localStorage.getItem('refreshToken'), []);
  const getUserId = useCallback(() => localStorage.getItem('userId'), []);
  const getRole = useCallback(() => localStorage.getItem('role'), []);

  // Set tokens in storage
  const setTokens = useCallback((accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const payload = decodeJwtPayload(accessToken);
    if (payload?.sub) {
      localStorage.setItem('userId', payload.sub);
      localStorage.setItem('role', payload.role);
    }
  }, []);

  const normalizeErrorMessage = useCallback((err, fallback) => {
    const raw = err?.response?.data?.message;
    if (Array.isArray(raw)) return raw.join(' ');
    if (typeof raw === 'string' && raw.trim()) return raw;
    return fallback;
  }, []);

  // Clear all auth data
  const clearAuth = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setError(null);
  }, []);

  // Initialize API client token accessors
  useEffect(() => {
    setTokenAccessors({
      getAccessToken,
      getRefreshToken,
      getUserId,
    });
  }, [getAccessToken, getRefreshToken, getUserId]);

  // Check user on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const { data } = await usersApi.getMe();
          setUser(data);
        } catch {
          clearAuth();
        }
      }
      setIsInitialized(true);
    };

    void checkUserStatus();
  }, [getAccessToken, clearAuth]);

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await authApi.login(credentials);
        setTokens(data.accessToken, data.refreshToken);

        const me = await usersApi.getMe();
        setUser(me.data);
        return me.data;
      } catch (err) {
        const errorMsg = normalizeErrorMessage(err, 'Đăng nhập thất bại');
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setTokens, normalizeErrorMessage]
  );

  const register = useCallback(
    async (userData) => {
      setIsLoading(true);
      setError(null);
      try {
        const payload =
          userData.accountType === 'ORGANIZER'
            ? {
                email: userData.email,
                password: userData.password,
                fullName: userData.fullName,
                organizationName: userData.organizationName,
                description: userData.description,
              }
            : {
                email: userData.email,
                password: userData.password,
                fullName: userData.fullName,
              };

        const { data } =
          userData.accountType === 'ORGANIZER'
            ? await authApi.registerOrganizerRequest(payload)
            : await authApi.registerStudent(payload);

        if (data.accessToken && data.refreshToken) {
          setTokens(data.accessToken, data.refreshToken);
          // Keep auth UI in sync immediately after successful register
          const me = await usersApi.getMe();
          setUser(me.data);
        }

        return data;
      } catch (err) {
        const errorMsg = normalizeErrorMessage(err, 'Đăng ký thất bại');
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setTokens, normalizeErrorMessage]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = {
    // State
    user,
    isLoading,
    error,
    isInitialized,
    isAuthenticated: !!user,

    // Token accessors
    getAccessToken,
    getRefreshToken,
    getUserId,
    getRole,
    setTokens,
    clearAuth,

    // Actions
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
