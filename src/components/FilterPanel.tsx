import React from 'react';

interface FilterPanelProps {
    filters: {
        query: string;
        author: string;
        tag: string;
        date: string;
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
                {['query', 'author', 'tag', 'date'].map((field) => (
                    <div className="filter-group" key={field}>
                        <label htmlFor={`filter-${field}`}>{field[0].toUpperCase() + field.slice(1)}:</label>
                        <input
                            type="text"
                            id={`filter-${field}`}
                            name={field}
                            className="form-control"
                            defaultValue={filters[field as keyof typeof filters]}
                            placeholder={`Wyszukaj po ${field}...`}
                        />
                    </div>
                ))}
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