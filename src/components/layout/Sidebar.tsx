import React from 'react';

interface SubmenuItem {
  label: string;
  path: string;
}

interface SidebarCategory {
  icon: string;
  label: string;
  items?: SubmenuItem[];
  path?: string;
}

interface SidebarProps {
  categories: SidebarCategory[];
  isVisible: boolean;
  openCategoryIndex: number | null;
  toggleSidebar: () => void;
  handleSidebarItemClick: (index: number) => void;
  handleSubmenuItemClick: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  isVisible,
  openCategoryIndex,
  toggleSidebar,
  handleSidebarItemClick,
  handleSubmenuItemClick
}) => {
  const sidebarClasses = `sidebar ${isVisible ? 'visible' : ''}`;
  
  return (
    <div className={sidebarClasses}>
      <div className="sidebar-header">
        <h3>BETA</h3>
        <div className="toggle-sidebar" onClick={toggleSidebar}>
          <i className="bi bi-chevron-left"></i>
        </div>
      </div>
      <div className="sidebar-menu">
        {categories.map((category, index) => (
          category.items ? (
            <div className={`sidebar-category ${openCategoryIndex === index ? 'open' : ''}`} key={index}>
              <div className="sidebar-item" onClick={() => handleSidebarItemClick(index)}>
                <i className={`bi ${category.icon}`}></i>
                <span>{category.label}</span>
                <i className="bi bi-chevron-right dropdown-icon"></i>
              </div>
              <div className={`submenu ${openCategoryIndex === index ? 'open' : ''}`}>
                {category.items.map((item, itemIndex) => (
                  <div 
                    className="submenu-item" 
                    key={itemIndex} 
                    onClick={() => handleSubmenuItemClick(item.path)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sidebar-item" key={index}>
              <i className={`bi ${category.icon}`}></i>
              <span>{category.label}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
