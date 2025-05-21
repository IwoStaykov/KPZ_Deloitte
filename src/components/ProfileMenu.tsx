import React, { useState, useRef, useEffect } from 'react';

interface ProfileMenuProps {
  signOut: () => void;
  isDarkTheme?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ signOut, isDarkTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(prev => !prev);

  // Handle clicks outside the menu
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  // New function to handle scroll events
  const handleScroll = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listeners when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll); // Add scroll listener
    }

    // Remove event listeners when menu is closed or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll); // Remove scroll listener
    };
  }, [isOpen]); // Dependency on isOpen ensures listeners are updated when menu state changes

  return (
      <div className="profile-menu-container" ref={menuRef}>
        <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="profile-img"
            onClick={toggleMenu}
        />
        {isOpen && (
            <div className={`profile-dropdown ${isDarkTheme ? 'dark-theme-dropdown' : ''}`}>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#profile">
                  <i className="bi bi-person"></i> Profile
                </a>
                <a className="dropdown-item" href="#preferences">
                  <i className="bi bi-sliders"></i> Preferences
                </a>
                <button
                    className="dropdown-item logout-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                    type="button"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProfileMenu;