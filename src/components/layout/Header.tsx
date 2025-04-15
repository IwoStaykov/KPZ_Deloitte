import React from 'react';

interface HeaderProps {
  isSidebarVisible: boolean;
  handleLogoClick: () => void;
  searchFilters: {
    query: string;
    author: string;
    tag: string;
    date: string;
  };
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  isFilterPanelVisible: boolean;
  toggleFilterPanel: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  openCreatePrompt: () => void;
  toggleProfileMenu: (e: React.MouseEvent) => void;
  isProfileMenuOpen: boolean;
  handleSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isSidebarVisible,
  handleLogoClick,
  searchFilters,
  handleSearchInputChange,
  searchInputRef,
  isFilterPanelVisible,
  toggleFilterPanel,
  isDarkTheme,
  toggleTheme,
  openCreatePrompt,
  toggleProfileMenu,
  isProfileMenuOpen,
  handleSignOut
}) => {
  return (
    <div className="header">
      {!isSidebarVisible && (
        <div className="sidebar-logo" onClick={handleLogoClick}>
          BETA
        </div>
      )}
      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input
          type="text"
          className="form-control"
          placeholder="Search prompts..."
          value={searchFilters.query}
          onChange={handleSearchInputChange}
          ref={searchInputRef}
        />
        {isFilterPanelVisible !== undefined && (
          <button
            className={`btn filter-toggle-btn ${isFilterPanelVisible ? 'active' : ''}`}
            onClick={toggleFilterPanel}
            title="Pokaż/ukryj filtry"
          >
            <i className="bi bi-funnel"></i>
          </button>
        )}
      </div>
      <div className="header-actions">
        <div className="theme-toggle">
          <span className="theme-toggle-label">Light</span>
          <label className="theme-toggle-switch">
            <input
              type="checkbox"
              checked={isDarkTheme}
              onChange={toggleTheme}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="theme-toggle-label">Dark</span>
        </div>
        <button
          className="btn create-prompt-btn"
          onClick={openCreatePrompt}
        >
          <i className="bi bi-plus-lg"></i> Create New
        </button>
        <div className="profile-menu-container">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="profile-img"
            onClick={toggleProfileMenu}
          />
          {isProfileMenuOpen && (
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
      </div>
    </div>
  );
};

export default Header;
