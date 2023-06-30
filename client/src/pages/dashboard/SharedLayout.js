import React from 'react';
import SharedLayoutWrapper from '../../assets/wrappers/SharedLayoutWrapper';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar, MobileSidebar, Navbar } from '../../components';

const SharedLayout = () => {
  return (
    <SharedLayoutWrapper>
      <main className="dashboard">
        <MobileSidebar />
        <DesktopSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </SharedLayoutWrapper>
  );
};

export default SharedLayout;
