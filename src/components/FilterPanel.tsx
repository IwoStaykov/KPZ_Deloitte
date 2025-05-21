import React, { useState, useEffect } from 'react';

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
    const [localFilters, setLocalFilters] = useState({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
    });

    useEffect(() => {
        setLocalFilters({
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo
        });
    }, [filters]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApply = () => {
        // Aktualizuj główne filtry przed zastosowaniem
        const queryInput = document.getElementById('filter-query') as HTMLInputElement;
        const authorInput = document.getElementById('filter-author') as HTMLInputElement;
        const tagInput = document.getElementById('filter-tag') as HTMLInputElement;
        
        if (queryInput) queryInput.value = queryInput.value || '';
        if (authorInput) authorInput.value = authorInput.value || '';
        if (tagInput) tagInput.value = tagInput.value || '';
        
        onApply();
    };

    if (!isVisible) return null;

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h4>Search Filters</h4>
                <button className="btn reset-btn" onClick={onReset}>
                    <i className="bi bi-x-circle"></i> Reset
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
                        placeholder="Search by query..."
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
                        placeholder="Search by author..."
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
                        placeholder="Search by tag..."
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-dateFrom">Date from:</label>
                    <input
                        type="date"
                        id="filter-dateFrom"
                        name="dateFrom"
                        className="form-control"
                        value={localFilters.dateFrom}
                        onChange={handleDateChange}
                        max={localFilters.dateTo || undefined}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter-dateTo">Date to:</label>
                    <input
                        type="date"
                        id="filter-dateTo"
                        name="dateTo"
                        className="form-control"
                        value={localFilters.dateTo}
                        onChange={handleDateChange}
                        min={localFilters.dateFrom || undefined}
                    />
                </div>
            </div>
            <div className="filter-footer">
                <button className="btn apply-btn" onClick={handleApply}>
                    <i className="bi bi-check-circle"></i> Apply Filters
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;