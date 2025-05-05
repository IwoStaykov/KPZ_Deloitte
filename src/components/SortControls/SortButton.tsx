interface SortButtonProps {
  currentSort: string;
  onClick: () => void;
}

export const SortButton = ({ currentSort, onClick }: SortButtonProps) => {
  const getSortLabel = (option: string) => {
    switch (option) {
      case 'title-asc': return 'Tytuł A-Z';
      case 'title-desc': return 'Tytuł Z-A';
      case 'date-asc': return 'Od najstarszych';
      case 'date-desc': return 'Od najnowszych';
      default: return 'Sortuj';
    }
  };

  return (
    <button
      className="btn btn-outline-secondary dropdown-toggle"
      onClick={onClick}
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i className="bi bi-sort-down-alt me-1"></i>
      {getSortLabel(currentSort)}
    </button>
  );
};