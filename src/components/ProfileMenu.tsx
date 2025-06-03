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
        <button
    type="button"
    className="btn profile-btn" // Możesz dodać własne style dla tego przycisku
    onClick={toggleMenu}
    aria-label="Open profile menu"
    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} // Przykładowe style, aby wyglądał jak ikona
>
    <i className="bi bi-person-circle" style={{ fontSize: '24px', color: 'var(--text-color)' }}></i> {/* Stylizuj ikonę według potrzeb */}
</button>
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