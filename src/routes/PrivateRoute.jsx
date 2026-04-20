// Private Route Guard
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const location = useLocation();
  
  if (!isInitialized) {
    // Show loading state while auth is initializing
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }
  
  if (!isAuthenticated) {
    // Preserve current URL to redirect back after login
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }
  
  return children;
};

export default PrivateRoute;
