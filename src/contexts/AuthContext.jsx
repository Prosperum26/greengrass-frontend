import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
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

  // Retrieve tokens from secure storage - useRef for stable references
  const tokenAccessorsRef = useRef({
    getAccessToken: () => localStorage.getItem('accessToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    getUserId: () => localStorage.getItem('userId'),
    getRole: () => localStorage.getItem('role'),
  });

  // Stable accessor functions
  const getAccessToken = useCallback(() => tokenAccessorsRef.current.getAccessToken(), []);
  const getRefreshToken = useCallback(() => tokenAccessorsRef.current.getRefreshToken(), []);
  const getUserId = useCallback(() => tokenAccessorsRef.current.getUserId(), []);
  const getRole = useCallback(() => tokenAccessorsRef.current.getRole(), []);

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

  // Initialize API client token accessors - only once on mount
  useEffect(() => {
    setTokenAccessors(tokenAccessorsRef.current);
  }, []);

  // Check user on mount - run only once
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = tokenAccessorsRef.current.getAccessToken();
      if (token) {
        try {
          const { data } = await usersApi.getMe();
          setUser(data);
        } catch {
          // Clear auth on error but don't call clearAuth to avoid dependency issues
          localStorage.clear();
          setUser(null);
        }
      }
      setIsInitialized(true);
    };

    checkUserStatus();
  }, []);

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
