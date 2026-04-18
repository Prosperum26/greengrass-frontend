import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export const RoleRoute = ({ children, allowedRoles = [], redirectTo = '/' }) => {
  const { getRole } = useAuthContext();
  const role = getRole();
  const hasRole = allowedRoles.includes(role);

  if (!hasRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleRoute;
