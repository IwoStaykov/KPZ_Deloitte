import React, { useState, useRef, useEffect } from 'react';
import { SortDropdownProps } from '../types/interfaces';

const SortMenu: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
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

  const getSortLabel = (option: string) => {
    switch (option) {
      case 'title-asc': return 'Tytuł A-Z';
      case 'title-desc': return 'Tytuł Z-A';
      case 'date-asc': return 'Od najstarszych';
      case 'date-desc': return 'Od najnowszych';
      default: return 'Sortuj';
    }
  };

  const handleSelect = (option: string) => {
    onSortChange(option);
    setOpen(false);
  };

  return (
    <div className="sort-menu" ref={menuRef}>
      <button className="sort-button" onClick={toggleMenu}>
        <i className="bi bi-sort-down-alt me-1"></i>
        {getSortLabel(currentSort)}
      </button>
      {open && (
        <ul className="sort-dropdown">
          <li onClick={() => handleSelect('title-asc')}>
            <i className="bi bi-sort-alpha-down me-2"></i>Tytuł A-Z
          </li>
          <li onClick={() => handleSelect('title-desc')}>
            <i className="bi bi-sort-alpha-down-alt me-2"></i>Tytuł Z-A
          </li>
          <li onClick={() => handleSelect('date-asc')}>
            <i className="bi bi-sort-numeric-down me-2"></i>Od najstarszych
          </li>
          <li onClick={() => handleSelect('date-desc')}>
            <i className="bi bi-sort-numeric-down-alt me-2"></i>Od najnowszych
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortMenu;
