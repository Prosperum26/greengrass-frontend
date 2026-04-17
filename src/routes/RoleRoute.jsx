import { Navigate } from 'react-router-dom';

export const RoleRoute = ({ children, allowedRoles = [], redirectTo = '/' }) => {
  const role = localStorage.getItem('role');
  const hasRole = allowedRoles.includes(role);

  if (!hasRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleRoute;
