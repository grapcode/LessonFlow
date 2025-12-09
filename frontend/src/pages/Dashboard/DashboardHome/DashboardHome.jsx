import React from 'react';

import MyLoading from '../../../components/my-components/MyLoading';
import useRole from '../../../hooks/useRole';

const DashboardHome = () => {
  const { roleLoading } = useRole();

  if (roleLoading) {
    return <MyLoading />;
  }

  // if (role === 'admin') {
  //   return <AdminDashboardHome />;
  // } else if (role === 'rider') {
  //   return <RiderDashboardHome />;
  // } else {
  //   return <UserDashboardHome />;
  // }
};

export default DashboardHome;
