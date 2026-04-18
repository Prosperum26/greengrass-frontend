import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 10000,
});

// Token accessors - can be overridden by AuthContext
let tokenAccessors = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  getUserId: () => localStorage.getItem('userId'),
};

export const setTokenAccessors = (accessors) => {
  tokenAccessors = accessors;
};

const getAccessToken = () => tokenAccessors.getAccessToken();
const getRefreshToken = () => tokenAccessors.getRefreshToken();
const getUserId = () => tokenAccessors.getUserId();

const isProtectedPath = () => {
  const path = window.location.pathname;
  return (
    path.startsWith('/profile') ||
    path.startsWith('/organizer') ||
    path.startsWith('/checkin') ||
    path.startsWith('/admin')
  );
};

apiClient.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let waitingQueue = [];

const resolveQueue = (token) => {
  waitingQueue.forEach((callback) => callback(token));
  waitingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      const refreshToken = getRefreshToken();
      const userId = getUserId();

      if (!refreshToken || !userId) {
        localStorage.clear();
        if (isProtectedPath()) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          waitingQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          userId,
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        resolveQueue(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        if (isProtectedPath()) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
