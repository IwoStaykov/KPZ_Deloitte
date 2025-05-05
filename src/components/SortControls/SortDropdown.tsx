interface SortDropdownProps {
  onSortChange: (option: string) => void;
  currentSort: string;
}

export const SortDropdown = ({ onSortChange, currentSort }: SortDropdownProps) => (
  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <li>
      <button 
        className={`dropdown-item ${currentSort === 'title-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('title-asc')}
      >
        <i className="bi bi-sort-alpha-down me-2"></i>Tytuł A-Z
      </button>
    </li>
    <li>
      <button 
        className={`dropdown-item ${currentSort === 'title-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('title-desc')}
      >
        <i className="bi bi-sort-alpha-down-alt me-2"></i>Tytuł Z-A
      </button>
    </li>
    <li>
      <button 
        className={`dropdown-item ${currentSort === 'date-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('date-asc')}
      >
        <i className="bi bi-sort-numeric-down me-2"></i>Od najstarszych
      </button>
    </li>
    <li>
      <button 
        className={`dropdown-item ${currentSort === 'date-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('date-desc')}
      >
        <i className="bi bi-sort-numeric-down-alt me-2"></i>Od najnowszych
      </button>
    </li>
  </ul>
);