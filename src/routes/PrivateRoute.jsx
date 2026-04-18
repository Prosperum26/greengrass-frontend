// Private Route Guard
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuthContext();
  
  if (!isInitialized) {
    // Show loading state while auth is initializing
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;
