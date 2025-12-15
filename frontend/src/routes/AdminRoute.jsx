import { Navigate } from 'react-router';
import LoadingSpinner from '../components/my-components/LoadingSpinner';
import useRole from '../hooks/useRole';

const AdminRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) return <LoadingSpinner />;

  if (role?.includes('admin')) return children;

  return <Navigate to="/" replace />;
};

export default AdminRoute;
