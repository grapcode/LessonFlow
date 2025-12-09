import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure(); // url →  http://localhost:3000

  const { data: role, isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ['role', user?.email],
    queryFn: async () => {
      const result = await axiosSecure.get(`/user/role`);
      return result.data.role;
    },
  });
  return [role, isRoleLoading];
  //   return { role, isRoleLoading };
};

export default useRole;
