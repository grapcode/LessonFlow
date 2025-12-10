import React from 'react';

import MyLoading from '../../../components/my-components/MyLoading';
import useRole from '../../../hooks/useRole';
import UserOverview from './UserOverview';
import AdminOverview from './AdminOverview';

const DashboardHome = () => {
  const { roleLoading } = useRole();
  const [role] = useRole();

  if (roleLoading) {
    return <MyLoading />;
  }

  if (role === 'admin') {
    return <AdminOverview />;
  } else {
    return <UserOverview />;
  }
};

export default DashboardHome;
