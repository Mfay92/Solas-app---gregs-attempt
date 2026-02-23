import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Filter,
    Settings2,
    List,
    LayoutGrid,
    ChevronDown,
    X,
    Check,
    Eye,
    EyeOff,
    RotateCcw,
    Home,
    TrendingUp,
    PoundSterling,
    CheckCircle,
    AlertTriangle,
    Building2
} from 'lucide-react';
import { FilterConfig } from './types';
import { columnDefinitions, quickFilters, defaultVisibleColumns, columnGroups } from './columns';

interface ToolbarProps {
    // Search
    searchQuery: string;
    onSearchChange: (query: string) => void;
    // Filters
    filters: FilterConfig[];
    onFiltersChange: (filters: FilterConfig[]) => void;
    activeQuickFilter: string | null;
    onQuickFilterChange: (filterId: string | null) => void;
    // Columns
    visibleColumns: string[];
    onVisibleColumnsChange: (columns: string[]) => void;
    // View
    viewMode: 'table' | 'card';
    onViewModeChange: (mode: 'table' | 'card') => void;
    // Stats
    totalProperties: number;
    filteredProperties: number;
    totalUnits: number;
    occupancyRate: number;
    voidCount: number;
    totalRent: number;
    compliantCount: number;
    pendingCount: number;
    nonCompliantCount: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    activeQuickFilter,
    onQuickFilterChange,
    visibleColumns,
    onVisibleColumnsChange,
    viewMode,
    onViewModeChange,
    totalProperties,
    filteredProperties,
    totalUnits,
    occupancyRate,
    voidCount,
    totalRent,
    compliantCount,
    pendingCount,
    nonCompliantCount,
}) => {
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const columnRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterDropdownOpen(false);
            }
            if (columnRef.current && !columnRef.current.contains(event.target as Node)) {
                setColumnDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        setFilterDropdownOpen(false);
    };

    const clearAllFilters = () => {
        onFiltersChange([]);
        onQuickFilterChange(null);
    };

    const toggleColumn = (columnId: string) => {
        if (columnId === 'address') return;
        if (visibleColumns.includes(columnId)) {
            onVisibleColumnsChange(visibleColumns.filter(id => id !== columnId));
        } else {
            onVisibleColumnsChange([...visibleColumns, columnId]);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `£${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `£${(amount / 1000).toFixed(0)}K`;
        return `£${amount}`;
    };

    const activeFilterLabel = activeQuickFilter
        ? quickFilters.find(qf => qf.id === activeQuickFilter)?.label || 'Filtered'
        : filters.length > 0
        ? `${filters.length} filter${filters.length > 1 ? 's' : ''}`
        : 'All Properties';

    const hiddenColumnCount = columnDefinitions.length - visibleColumns.length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Main Toolbar Row */}
            <div className="p-3 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-[320px]">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid focus:bg-white transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                {/* Filter Dropdown */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                            activeQuickFilter || filters.length > 0
                                ? 'bg-ivolve-mid/10 text-ivolve-mid border-ivolve-mid/30'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Filter size={16} />
                        <span className="hidden sm:inline">{activeFilterLabel}</span>
                        <ChevronDown size={14} className={`transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {filterDropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Filters</span>
                            </div>
                            <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                                {quickFilters.map((qf) => (
                                    <button
                                        key={qf.id}
                                        onClick={() => handleQuickFilter(qf.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                                            activeQuickFilter === qf.id
                                                ? 'bg-ivolve-mid/10 text-ivolve-mid font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{qf.label}</span>
                                        {activeQuickFilter === qf.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                            {(activeQuickFilter || filters.length > 0) && (
                                <div className="p-2 border-t border-gray-100">
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={14} />
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Columns Dropdown */}
                <div className="relative" ref={columnRef}>
                    <button
                        onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                            columnDropdownOpen
                                ? 'bg-ivolve-mid text-white border-ivolve-mid'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Settings2 size={16} />
                        <span className="hidden sm:inline">Columns</span>
                        {hiddenColumnCount > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${columnDropdownOpen ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>
                                {hiddenColumnCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform ${columnDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {columnDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Columns</span>
                                <button
                                    onClick={() => onVisibleColumnsChange(defaultVisibleColumns)}
                                    className="text-xs text-gray-500 hover:text-ivolve-mid flex items-center gap-1"
                                >
                                    <RotateCcw size={12} />
                                    Reset
                                </button>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {columnGroups.map((group) => {
                                    const groupColumns = columnDefinitions.filter(col => col.group === group.id);
                                    const GroupIcon = group.icon;

                                    return (
                                        <div key={group.id} className="py-2">
                                            <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                <GroupIcon size={12} />
                                                {group.label}
                                            </div>
                                            {groupColumns.map((column) => {
                                                const isVisible = visibleColumns.includes(column.id);
                                                const isRequired = column.id === 'address';

                                                return (
                                                    <button
                                                        key={column.id}
                                                        onClick={() => toggleColumn(column.id)}
                                                        disabled={isRequired}
                                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-all ${
                                                            isRequired
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : isVisible
                                                                ? 'text-gray-900 hover:bg-gray-50'
                                                                : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {isVisible ? <Eye size={14} className="text-ivolve-mid" /> : <EyeOff size={14} />}
                                                            {column.label}
                                                        </span>
                                                        {isRequired && (
                                                            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Required</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                        onClick={() => onViewModeChange('table')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-ivolve-dark' : 'text-gray-500 hover:text-gray-700'}`}
                        aria-label="Table view"
                        title="Table view"
                    >
                        <List size={16} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('card')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-ivolve-dark' : 'text-gray-500 hover:text-gray-700'}`}
                        aria-label="Card view"
                        title="Card view"
                    >
                        <LayoutGrid size={16} />
                    </button>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Quick Stats - Right Side */}
                <div className="hidden lg:flex items-center gap-4 text-sm">
                    {/* Properties Count */}
                    <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                            <span className="font-bold text-ivolve-mid">{filteredProperties}</span>
                            {filteredProperties !== totalProperties && (
                                <span className="text-gray-400">/{totalProperties}</span>
                            )}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-gray-200" />

                    {/* Units */}
                    <div className="flex items-center gap-1.5" title="Total Units">
                        <Home size={14} className="text-blue-500" />
                        <span className="font-semibold text-gray-700">{totalUnits}</span>
                    </div>

                    {/* Occupancy */}
                    <div className="flex items-center gap-1.5" title={`${voidCount} void units`}>
                        <TrendingUp size={14} className="text-green-500" />
                        <span className="font-semibold text-gray-700">{occupancyRate}%</span>
                        {voidCount > 0 && (
                            <span className="text-xs text-amber-600">({voidCount})</span>
                        )}
                    </div>

                    {/* Rent */}
                    <div className="flex items-center gap-1.5" title="Annual Rent">
                        <PoundSterling size={14} className="text-emerald-500" />
                        <span className="font-semibold text-gray-700">{formatCurrency(totalRent)}</span>
                    </div>

                    <div className="h-4 w-px bg-gray-200" />

                    {/* Compliance */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1" title="Compliant">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="font-medium text-green-700">{compliantCount}</span>
                        </div>
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1" title="Pending">
                                <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <span className="text-[8px] text-white font-bold">!</span>
                                </div>
                                <span className="font-medium text-orange-700">{pendingCount}</span>
                            </div>
                        )}
                        {nonCompliantCount > 0 && (
                            <div className="flex items-center gap-1" title="Non-Compliant">
                                <AlertTriangle size={14} className="text-red-500" />
                                <span className="font-medium text-red-700">{nonCompliantCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
