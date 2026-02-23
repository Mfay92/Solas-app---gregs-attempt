import React from 'react';
import { Filter, X, Plus, Trash2 } from 'lucide-react';
import { FilterConfig } from './types';
import { columnDefinitions, quickFilters } from './columns';

interface FilterPanelProps {
    filters: FilterConfig[];
    onFiltersChange: (filters: FilterConfig[]) => void;
    activeQuickFilter: string | null;
    onQuickFilterChange: (filterId: string | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    onFiltersChange,
    activeQuickFilter,
    onQuickFilterChange,
}) => {
    const filterableColumns = columnDefinitions.filter(col => col.filterable);

    const addFilter = () => {
        const newFilter: FilterConfig = {
            columnId: filterableColumns[0]?.id || 'address',
            operator: 'contains',
            value: '',
        };
        onFiltersChange([...filters, newFilter]);
    };

    const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], ...updates };
        onFiltersChange(newFilters);
        // Clear quick filter when manually editing
        if (activeQuickFilter) onQuickFilterChange(null);
    };

    const removeFilter = (index: number) => {
        onFiltersChange(filters.filter((_, i) => i !== index));
    };

    const clearAllFilters = () => {
        onFiltersChange([]);
        onQuickFilterChange(null);
    };

    const handleQuickFilter = (filterId: string) => {
        if (activeQuickFilter === filterId) {
            onQuickFilterChange(null);
            onFiltersChange([]);
        } else {
            const quickFilter = quickFilters.find(qf => qf.id === filterId);
            if (quickFilter) {
                onQuickFilterChange(filterId);
                onFiltersChange(quickFilter.filters);
            }
        }
    };

    const getOperatorOptions = (filterType?: string) => {
        switch (filterType) {
            case 'select':
            case 'multiselect':
                return [
                    { value: 'equals', label: 'is' },
                    { value: 'in', label: 'is any of' },
                    { value: 'isEmpty', label: 'is empty' },
                    { value: 'isNotEmpty', label: 'is not empty' },
                ];
            case 'number':
                return [
                    { value: 'equals', label: 'equals' },
                    { value: 'greaterThan', label: 'greater than' },
                    { value: 'lessThan', label: 'less than' },
                    { value: 'between', label: 'between' },
                ];
            case 'date':
                return [
                    { value: 'equals', label: 'is' },
                    { value: 'greaterThan', label: 'after' },
                    { value: 'lessThan', label: 'before' },
                    { value: 'between', label: 'between' },
                ];
            default:
                return [
                    { value: 'contains', label: 'contains' },
                    { value: 'equals', label: 'is exactly' },
                    { value: 'startsWith', label: 'starts with' },
                    { value: 'endsWith', label: 'ends with' },
                    { value: 'isEmpty', label: 'is empty' },
                    { value: 'isNotEmpty', label: 'is not empty' },
                ];
        }
    };

    const hasActiveFilters = filters.length > 0 || activeQuickFilter;

    return (
        <div className="space-y-3">
            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600 mr-1">Quick filters:</span>
                {quickFilters.map((qf) => (
                    <button
                        key={qf.id}
                        onClick={() => handleQuickFilter(qf.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                            activeQuickFilter === qf.id
                                ? 'ring-2 ring-offset-1 ring-ivolve-mid ' + qf.color
                                : qf.color
                        }`}
                    >
                        {qf.label}
                    </button>
                ))}

                {/* Add Filter Button */}
                <button
                    onClick={addFilter}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-dashed border-gray-300 rounded-full hover:border-ivolve-mid hover:text-ivolve-mid transition-all"
                >
                    <Plus size={14} />
                    Add Filter
                </button>

                {/* Clear All */}
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                    >
                        <X size={14} />
                        Clear all
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {filters.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Filter size={14} />
                            Active Filters ({filters.length})
                        </span>
                    </div>

                    {filters.map((filter, index) => {
                        const column = columnDefinitions.find(col => col.id === filter.columnId);
                        const operators = getOperatorOptions(column?.filterType);

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200"
                            >
                                {index > 0 && (
                                    <span className="text-xs font-medium text-gray-500 px-2">AND</span>
                                )}

                                {/* Column Select */}
                                <select
                                    value={filter.columnId}
                                    onChange={(e) => updateFilter(index, { columnId: e.target.value, value: '' })}
                                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                                >
                                    {filterableColumns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Operator Select */}
                                <select
                                    value={filter.operator}
                                    onChange={(e) => updateFilter(index, { operator: e.target.value as FilterConfig['operator'] })}
                                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                                >
                                    {operators.map((op) => (
                                        <option key={op.value} value={op.value}>
                                            {op.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Value Input */}
                                {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
                                    column?.filterType === 'select' ? (
                                        <select
                                            value={filter.value as string || ''}
                                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                                            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid min-w-[140px]"
                                        >
                                            <option value="">Select...</option>
                                            {column.filterOptions?.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={column?.filterType === 'number' ? 'number' : column?.filterType === 'date' ? 'date' : 'text'}
                                            value={filter.value as string || ''}
                                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                                            placeholder="Enter value..."
                                            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid min-w-[140px]"
                                        />
                                    )
                                )}

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFilter(index)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
