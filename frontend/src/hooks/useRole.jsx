import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = [], isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ['role', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/user/role');
      return res.data?.role || []; // ✅ always array
    },
  });

  // ✅ backward compatible return
  return [role, isRoleLoading];
};

export default useRole;
