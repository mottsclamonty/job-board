import React from 'react';
import MobileSidebarWrapper from '../assets/wrappers/MobileSidebarWrapper';
import { FaTimes } from 'react-icons/fa';
import Logo from './Logo';
import { useAppContext } from '../context/appContext';
import NavLinks from './NavLinks';
const MobileSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
  return (
    <MobileSidebarWrapper>
      <div className={`sidebar-container ${showSidebar ? 'show-sidebar' : ''}`}>
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </MobileSidebarWrapper>
  );
};

export default MobileSidebar;
