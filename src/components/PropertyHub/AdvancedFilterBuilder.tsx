import React, { useState } from 'react';
import {
    Filter,
    Plus,
    Trash2,
    X,
    ChevronDown,
    Calendar,
    Hash,
    Type,
    ToggleLeft,
    List,
    Copy,
    Layers
} from 'lucide-react';
import { FilterConfig, FilterOperator, AdvancedFilterConfig } from './types';
import { columnDefinitions } from './columns';

interface AdvancedFilterBuilderProps {
    filters: FilterConfig[];
    onFiltersChange: (filters: FilterConfig[]) => void;
    advancedConfig?: AdvancedFilterConfig;
    onAdvancedConfigChange?: (config: AdvancedFilterConfig) => void;
    onClose: () => void;
}

const operatorsByType: Record<string, { value: FilterOperator; label: string }[]> = {
    text: [
        { value: 'contains', label: 'Contains' },
        { value: 'notContains', label: 'Does not contain' },
        { value: 'equals', label: 'Is exactly' },
        { value: 'notEquals', label: 'Is not' },
        { value: 'startsWith', label: 'Starts with' },
        { value: 'endsWith', label: 'Ends with' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' },
    ],
    select: [
        { value: 'equals', label: 'Is' },
        { value: 'notEquals', label: 'Is not' },
        { value: 'in', label: 'Is any of' },
        { value: 'notIn', label: 'Is none of' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' },
    ],
    multiselect: [
        { value: 'in', label: 'Includes any of' },
        { value: 'notIn', label: 'Excludes all of' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' },
    ],
    number: [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Does not equal' },
        { value: 'greaterThan', label: 'Greater than' },
        { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
        { value: 'lessThan', label: 'Less than' },
        { value: 'lessThanOrEqual', label: 'Less than or equal' },
        { value: 'between', label: 'Between' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' },
    ],
    date: [
        { value: 'equals', label: 'Is' },
        { value: 'notEquals', label: 'Is not' },
        { value: 'greaterThan', label: 'Is after' },
        { value: 'lessThan', label: 'Is before' },
        { value: 'between', label: 'Is between' },
        { value: 'isToday', label: 'Is today' },
        { value: 'isThisWeek', label: 'Is this week' },
        { value: 'isThisMonth', label: 'Is this month' },
        { value: 'isThisQuarter', label: 'Is this quarter' },
        { value: 'isThisYear', label: 'Is this year' },
        { value: 'isPast', label: 'Is in the past' },
        { value: 'isFuture', label: 'Is in the future' },
        { value: 'isOverdue', label: 'Is overdue' },
        { value: 'isDueWithin', label: 'Is due within' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' },
    ],
    boolean: [
        { value: 'isTrue', label: 'Is true' },
        { value: 'isFalse', label: 'Is false' },
    ],
};

const getTypeIcon = (type?: string) => {
    switch (type) {
        case 'number': return <Hash size={14} />;
        case 'date': return <Calendar size={14} />;
        case 'boolean': return <ToggleLeft size={14} />;
        case 'select':
        case 'multiselect': return <List size={14} />;
        default: return <Type size={14} />;
    }
};

const noValueOperators = ['isEmpty', 'isNotEmpty', 'isToday', 'isThisWeek', 'isThisMonth', 'isThisQuarter', 'isThisYear', 'isPast', 'isFuture', 'isOverdue', 'isTrue', 'isFalse'];

const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
    filters,
    onFiltersChange,
    onClose,
}) => {
    const [groupLogic, setGroupLogic] = useState<'AND' | 'OR'>('AND');
    const filterableColumns = columnDefinitions.filter(col => col.filterable);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addFilter = () => {
        const newFilter: FilterConfig = {
            id: generateId(),
            columnId: filterableColumns[0]?.id || 'address',
            operator: 'contains',
            value: '',
        };
        onFiltersChange([...filters, newFilter]);
    };

    const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], ...updates };

        // Reset value when column changes
        if (updates.columnId) {
            const column = columnDefinitions.find(col => col.id === updates.columnId);
            const operators = operatorsByType[column?.filterType || 'text'];
            newFilters[index].operator = operators[0].value;
            newFilters[index].value = '';
        }

        // Reset value when operator changes to no-value operator
        if (updates.operator && noValueOperators.includes(updates.operator)) {
            newFilters[index].value = null;
        }

        onFiltersChange(newFilters);
    };

    const removeFilter = (index: number) => {
        onFiltersChange(filters.filter((_, i) => i !== index));
    };

    const duplicateFilter = (index: number) => {
        const filterToCopy = { ...filters[index], id: generateId() };
        const newFilters = [...filters];
        newFilters.splice(index + 1, 0, filterToCopy);
        onFiltersChange(newFilters);
    };

    const clearAllFilters = () => {
        onFiltersChange([]);
    };

    const renderValueInput = (filter: FilterConfig, index: number) => {
        const column = columnDefinitions.find(col => col.id === filter.columnId);
        const filterType = column?.filterType || 'text';

        // No input needed for these operators
        if (noValueOperators.includes(filter.operator)) {
            return null;
        }

        // Between operator needs two inputs
        if (filter.operator === 'between') {
            const values = Array.isArray(filter.value) ? filter.value : ['', ''];
            return (
                <div className="flex items-center gap-2">
                    <input
                        type={filterType === 'date' ? 'date' : 'number'}
                        value={values[0] || ''}
                        onChange={(e) => updateFilter(index, { value: [e.target.value, values[1] || ''] as [string, string] })}
                        className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                        placeholder="From"
                    />
                    <span className="text-gray-400 text-sm">and</span>
                    <input
                        type={filterType === 'date' ? 'date' : 'number'}
                        value={values[1] || ''}
                        onChange={(e) => updateFilter(index, { value: [values[0] || '', e.target.value] as [string, string] })}
                        className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                        placeholder="To"
                    />
                </div>
            );
        }

        // Multi-select for 'in' operators
        if (filter.operator === 'in' || filter.operator === 'notIn') {
            if (column?.filterOptions) {
                const selectedValues: string[] = Array.isArray(filter.value) ? (filter.value as string[]) : [];
                return (
                    <div className="flex flex-wrap gap-1 min-w-[200px]">
                        {column.filterOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    const newValues: string[] = selectedValues.includes(option)
                                        ? selectedValues.filter(v => v !== option)
                                        : [...selectedValues, option];
                                    updateFilter(index, { value: newValues });
                                }}
                                className={`px-2 py-1 text-xs rounded-full transition-all ${
                                    selectedValues.includes(option)
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );
            }
        }

        // Select dropdown
        if (filterType === 'select' && column?.filterOptions) {
            return (
                <select
                    value={filter.value as string || ''}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="min-w-[140px] px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid bg-white"
                >
                    <option value="">Select...</option>
                    {column.filterOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        }

        // Date input
        if (filterType === 'date') {
            if (filter.operator === 'isDueWithin') {
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={filter.value as number || ''}
                            onChange={(e) => updateFilter(index, { value: parseInt(e.target.value) || 0 })}
                            className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                            placeholder="30"
                        />
                        <span className="text-gray-500 text-sm">days</span>
                    </div>
                );
            }
            return (
                <input
                    type="date"
                    value={filter.value as string || ''}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                />
            );
        }

        // Number input
        if (filterType === 'number') {
            return (
                <input
                    type="number"
                    value={filter.value as number || ''}
                    onChange={(e) => updateFilter(index, { value: parseFloat(e.target.value) || 0 })}
                    className="w-32 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                    placeholder="Enter value..."
                />
            );
        }

        // Default text input
        return (
            <input
                type="text"
                value={filter.value as string || ''}
                onChange={(e) => updateFilter(index, { value: e.target.value })}
                className="min-w-[140px] px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                placeholder="Enter value..."
            />
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-ivolve-dark to-ivolve-mid flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Filter size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Advanced Filters</h2>
                        <p className="text-white/70 text-sm">Build complex filter conditions</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Logic Toggle */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Match</span>
                    <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
                        <button
                            onClick={() => setGroupLogic('AND')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                groupLogic === 'AND'
                                    ? 'bg-ivolve-mid text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            All conditions (AND)
                        </button>
                        <button
                            onClick={() => setGroupLogic('OR')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                groupLogic === 'OR'
                                    ? 'bg-ivolve-mid text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Any condition (OR)
                        </button>
                    </div>
                    <span className="text-sm text-gray-500">
                        {filters.length} filter{filters.length !== 1 ? 's' : ''} active
                    </span>
                </div>
            </div>

            {/* Filter List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {filters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <Layers size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No filters applied</h3>
                        <p className="text-gray-500 mb-4">Add filters to narrow down your property list</p>
                        <button
                            onClick={addFilter}
                            className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                        >
                            <Plus size={16} />
                            Add your first filter
                        </button>
                    </div>
                ) : (
                    filters.map((filter, index) => {
                        const column = columnDefinitions.find(col => col.id === filter.columnId);
                        const filterType = column?.filterType || 'text';
                        const operators = operatorsByType[filterType] || operatorsByType.text;

                        return (
                            <div
                                key={filter.id || index}
                                className="group flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                {/* Logic connector */}
                                {index > 0 && (
                                    <div className="flex items-center justify-center w-12 h-8">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                            groupLogic === 'AND' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {groupLogic}
                                        </span>
                                    </div>
                                )}
                                {index === 0 && <div className="w-12" />}

                                {/* Filter content */}
                                <div className="flex-1 flex flex-wrap items-center gap-2">
                                    {/* Column Select */}
                                    <div className="relative">
                                        <select
                                            value={filter.columnId}
                                            onChange={(e) => updateFilter(index, { columnId: e.target.value })}
                                            className="pl-8 pr-8 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid appearance-none cursor-pointer"
                                        >
                                            {filterableColumns.map((col) => (
                                                <option key={col.id} value={col.id}>
                                                    {col.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            {getTypeIcon(filterType)}
                                        </div>
                                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Operator Select */}
                                    <select
                                        value={filter.operator}
                                        onChange={(e) => updateFilter(index, { operator: e.target.value as FilterOperator })}
                                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                                    >
                                        {operators.map((op) => (
                                            <option key={op.value} value={op.value}>
                                                {op.label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Value Input */}
                                    {renderValueInput(filter, index)}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => duplicateFilter(index)}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Duplicate filter"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={() => removeFilter(index)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove filter"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Add Filter Button */}
                {filters.length > 0 && (
                    <button
                        onClick={addFilter}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-ivolve-mid hover:text-ivolve-mid hover:bg-ivolve-mid/5 transition-all"
                    >
                        <Plus size={16} />
                        Add another filter
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <button
                    onClick={clearAllFilters}
                    disabled={filters.length === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 size={16} />
                    Clear all
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-white bg-ivolve-mid hover:bg-ivolve-dark rounded-lg transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilterBuilder;
