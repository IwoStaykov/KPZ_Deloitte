import React, { useState, useRef, useEffect } from 'react';

interface ProfileMenuProps {
  signOut: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ signOut }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(prev => !prev);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <img
        src="https://via.placeholder.com/40"
        alt="Profile"
        className="profile-img"
        onClick={toggleMenu}
        role="button"
        style={{ cursor: 'pointer' }}
      />
      {open && (
        <ul className="dropdown-menu dropdown-menu-end show" style={{ display: 'block', position: 'absolute' }}>
          <li>
            <a className="dropdown-item" href="#">
              <i className="bi bi-person me-2"></i> Profil
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              <i className="bi bi-sliders me-2"></i> Preferencje
            </a>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={signOut}
              aria-label="Wyloguj"
              title="Wyloguj"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Wyloguj
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
