import React from 'react';
import { NavLink } from 'react-router-dom';
import links from '../utils/links';

const NavLinks = ({ toggleSidebar }) => {
  return (
    <div className="nav-links">
      {links.map((link) => (
        <NavLink
          key={link.id}
          to={link.path}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          <span className="icon">{link.icon}</span>
          {link.text}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;
