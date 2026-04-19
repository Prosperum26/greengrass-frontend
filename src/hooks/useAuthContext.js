import { useContext } from 'react';
import { AuthContext } from '../contexts/auth.context';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider. ' +
      'Please wrap your component tree with <AuthProvider>.'
    );
  }
  return context;
};

export default useAuthContext;
