import React, { useState, useEffect } from 'react';
import { FilterOptions } from '../../types/interfaces';

interface FilterPanelProps {
  isVisible: boolean;
  currentFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClose: () => void;
  availableTags: string[];
  availableAuthors: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isVisible,
  currentFilters,
  onFilterChange,
  onClose,
  availableTags,
  availableAuthors
}) => {
  // Lokalne stany dla filtrów
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    query: '',
    author: '',
    tag: '',
    date: '',
    category: ''
  });

  // Aktualizacja lokalnych filtrów gdy zmienią się filtry zewnętrzne
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Obsługa zmiany filtrów
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Zastosowanie filtrów
  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  // Resetowanie filtrów
  const resetFilters = () => {
    const resetFilters: FilterOptions = {
      query: currentFilters.query, // Zachowujemy query z paska wyszukiwania
      author: '',
      tag: '',
      date: '',
      category: currentFilters.category // Zachowujemy aktualną kategorię
    };
    
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  if (!isVisible) return null;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h4>Filtry</h4>
        <button className="btn close-btn" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div className="filter-body">
        <div className="filter-group">
          <label htmlFor="author-filter">Autor</label>
          <select
            id="author-filter"
            name="author"
            className="form-select"
            value={localFilters.author}
            onChange={handleFilterChange}
          >
            <option value="">Wszyscy autorzy</option>
            {availableAuthors.map((author, index) => (
              <option key={index} value={author}>{author}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="tag-filter">Tag</label>
          <select
            id="tag-filter"
            name="tag"
            className="form-select"
            value={localFilters.tag}
            onChange={handleFilterChange}
          >
            <option value="">Wszystkie tagi</option>
            {availableTags.map((tag, index) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="date-filter">Data</label>
          <select
            id="date-filter"
            name="date"
            className="form-select"
            value={localFilters.date}
            onChange={handleFilterChange}
          >
            <option value="">Dowolna data</option>
            <option value="today">Dzisiaj</option>
            <option value="week">Ostatni tydzień</option>
            <option value="month">Ostatni miesiąc</option>
            <option value="year">Ostatni rok</option>
          </select>
        </div>
      </div>
      
      <div className="filter-footer">
        <button className="btn reset-btn" onClick={resetFilters}>
          Resetuj
        </button>
        <button className="btn apply-btn" onClick={applyFilters}>
          Zastosuj
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
