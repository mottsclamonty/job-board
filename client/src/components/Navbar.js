import { useState } from 'react';
import NavbarWrapper from '../assets/wrappers/NavbarWrapper';
import { FaAlignLeft, FaCaretDown, FaUserCircle } from 'react-icons/fa';
import { Logo } from '../components';
import { useAppContext } from '../context/appContext';

const Navbar = () => {
  const { user, toggleSidebar, logoutUser } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);
  return (
    <NavbarWrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>

        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>

        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>

          <div className={`dropdown ${showLogout ? 'show-dropdown' : ''}`}>
            <button type="button" className="dropdown-btn" onClick={logoutUser}>
              logout
            </button>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
