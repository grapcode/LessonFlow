import React from 'react';
import MyLoading from '../../../components/my-components/MyLoading';
import useRole from '../../../hooks/useRole';
import UserOverview from './UserOverview';
import AdminOverview from './AdminOverview';

const DashboardHome = () => {
  const [role, roleLoading] = useRole();

  if (roleLoading) {
    return <MyLoading />;
  }

  // ✅ role হচ্ছে = array → includes ব্যবহার করতে হবে
  if (role?.includes('admin')) {
    return <AdminOverview />;
  }

  return <UserOverview />;
};

export default DashboardHome;
