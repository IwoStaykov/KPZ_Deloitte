import React from 'react';

interface FilterPanelProps {
    filters: {
        query: string;
        author: string;
        tag: string;
        dateFrom: string;
        dateTo: string;
    };
    onReset: () => void;
    onApply: () => void;
    isVisible: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onReset, onApply, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h4>Filtry wyszukiwania</h4>
                <button className="btn reset-btn" onClick={onReset}>
                    <i className="bi bi-x-circle"></i> Resetuj
                </button>
            </div>
            <div className="filter-body">
                <div className="filter-group">
                    <label htmlFor="filter-query">Query:</label>
                    <input
                        type="text"
                        id="filter-query"
                        name="query"
                        className="form-control"
                        defaultValue={filters.query}
                        placeholder="Wyszukaj po query..."
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-author">Author:</label>
                    <input
                        type="text"
                        id="filter-author"
                        name="author"
                        className="form-control"
                        defaultValue={filters.author}
                        placeholder="Wyszukaj po autorze..."
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-tag">Tag:</label>
                    <input
                        type="text"
                        id="filter-tag"
                        name="tag"
                        className="form-control"
                        defaultValue={filters.tag}
                        placeholder="Wyszukaj po tagu..."
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-dateFrom">Data od:</label>
                    <input
                        type="date"
                        id="filter-dateFrom"
                        name="dateFrom"
                        className="form-control"
                        defaultValue={filters.dateFrom}
                        max={filters.dateTo || undefined} // Ogranicza dateFrom do dateTo jeśli istnieje
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-dateTo">Data do:</label>
                    <input
                        type="date"
                        id="filter-dateTo"
                        name="dateTo"
                        className="form-control"
                        defaultValue={filters.dateTo}
                        min={filters.dateFrom || undefined} // Ogranicza dateTo do dateFrom jeśli istnieje
                    />
                </div>
            </div>
            <div className="filter-footer">
                <button className="btn apply-btn" onClick={onApply}>
                    <i className="bi bi-check-circle"></i> Zastosuj filtry
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;