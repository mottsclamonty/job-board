import React from 'react';
import DesktopSidebarWrapper from '../assets/wrappers/DesktopSidebarWrapper';
import { useAppContext } from '../context/appContext';
import Logo from './Logo';
import NavLinks from './NavLinks';
const DesktopSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
  return (
    <DesktopSidebarWrapper>
      <div className={`sidebar-container ${showSidebar ? 'show-sidebar' : ''}`}>
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </DesktopSidebarWrapper>
  );
};

export default DesktopSidebar;
