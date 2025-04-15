import React, { useEffect, useRef } from 'react';

interface ProfileMenuProps {
  isOpen: boolean;
  toggleMenu: (e: React.MouseEvent) => void;
  handleSignOut: () => void;
  userAvatar?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  toggleMenu,
  handleSignOut,
  userAvatar = 'https://via.placeholder.com/40'
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isOpen && menuRef.current && !menuRef.current.contains(target)) {
        // Zamykamy menu jeśli kliknięcie było poza menu
        const menuEvent = new MouseEvent('mousedown');
        toggleMenu(menuEvent as unknown as React.MouseEvent);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <img
        src={userAvatar}
        alt="Profile"
        className="profile-img"
        onClick={toggleMenu}
      />
      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-menu">
            <a href="#" className="dropdown-item">
              <i className="bi bi-person me-2"></i> Profil
            </a>
            <a href="#" className="dropdown-item">
              <i className="bi bi-sliders me-2"></i> Preferencje
            </a>
            <button
              onClick={handleSignOut}
              className="dropdown-item logout-btn"
              aria-label="Wyloguj"
              title="Wyloguj"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Wyloguj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
