import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoading: false,
      error: null,
      isInitialized: true,
      isAuthenticated: false,
      getAccessToken: () => null,
      getRefreshToken: () => null,
      getUserId: () => null,
      getRole: () => null,
      setTokens: () => {},
      clearAuth: () => {},
      login: async () => null,
      register: async () => null,
      logout: async () => null,
    };
  }
  return context;
};

export default useAuthContext;
