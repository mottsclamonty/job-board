import React from 'react';
import SharedLayoutWrapper from '../../assets/wrappers/SharedLayoutWrapper';
import { Link, Outlet } from 'react-router-dom';
import DesktopSidebar from '../../components/DesktopSidebar';
import Navbar from '../../components/Navbar';
import MobileSidebar from '../../components/MobileSidebar';
const SharedLayout = () => {
  return (
    <SharedLayoutWrapper>
      <nav>
        <Link to="all-jobs">All jobs</Link>
        <Link to="add-job">Add job</Link>
      </nav>
      <Outlet />
    </SharedLayoutWrapper>
  );
};

export default SharedLayout;
