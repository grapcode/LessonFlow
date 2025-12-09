import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MyContainer from '../components/my-components/MyContainer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <MyContainer className={'flex-1'}>
        <Outlet />
      </MyContainer>
      <Footer />
    </div>
  );
};

export default MainLayout;
