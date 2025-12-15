import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from './useAuth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // ✅ Request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        }
      );

      // ✅ Response interceptor (FIXED)
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (res) => res,
        async (err) => {
          const status = err?.response?.status;

          // 🔐 Token invalid → logout
          if (status === 401) {
            await logOut();
            navigate('/login', { replace: true });
          }

          // 🚫 Permission issue → DO NOT logout
          if (status === 403) {
            console.warn('Access denied (403)');
            // optional: toast / redirect handled by UI
          }

          return Promise.reject(err);
        }
      );

      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
