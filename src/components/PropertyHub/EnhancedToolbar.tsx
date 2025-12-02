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
    Building2,
    Bookmark,
    Sliders,
    Grid3X3,
    Layers,
    Keyboard,
    Pin,
    PinOff,
    SlidersHorizontal,
    Sparkles,
    Command,
    Table2
} from 'lucide-react';
import { FilterConfig, RowDensity, SavedView } from './types';
import { columnDefinitions, quickFilters, defaultVisibleColumns, columnGroups } from './columns';

interface EnhancedToolbarProps {
    // Search
    searchQuery: string;
    onSearchChange: (query: string) => void;
    // Filters
    filters: FilterConfig[];
    onFiltersChange: (filters: FilterConfig[]) => void;
    activeQuickFilter: string | null;
    onQuickFilterChange: (filterId: string | null) => void;
    onOpenAdvancedFilters: () => void;
    // Columns
    visibleColumns: string[];
    onVisibleColumnsChange: (columns: string[]) => void;
    pinnedColumns: string[];
    onPinnedColumnsChange: (columns: string[]) => void;
    // View
    viewMode: 'table' | 'card';
    onViewModeChange: (mode: 'table' | 'card') => void;
    // Density
    density: RowDensity;
    onDensityChange: (density: RowDensity) => void;
    // Grouping
    groupBy: string | null;
    onGroupByChange: (columnId: string | null) => void;
    // Saved Views
    savedViews: SavedView[];
    activeViewId: string | null;
    onOpenSavedViews: () => void;
    onViewSelect: (view: SavedView) => void;
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
    // Keyboard shortcuts
    onOpenKeyboardShortcuts: () => void;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    activeQuickFilter,
    onQuickFilterChange,
    onOpenAdvancedFilters,
    visibleColumns,
    onVisibleColumnsChange,
    pinnedColumns,
    onPinnedColumnsChange,
    viewMode,
    onViewModeChange,
    density,
    onDensityChange,
    groupBy,
    onGroupByChange,
    savedViews,
    activeViewId,
    onOpenSavedViews,
    onViewSelect,
    totalProperties,
    filteredProperties,
    totalUnits,
    occupancyRate,
    voidCount,
    totalRent,
    compliantCount,
    pendingCount,
    nonCompliantCount,
    onOpenKeyboardShortcuts,
}) => {
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [densityDropdownOpen, setDensityDropdownOpen] = useState(false);
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const filterRef = useRef<HTMLDivElement>(null);
    const columnRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);
    const densityRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterDropdownOpen(false);
            }
            if (columnRef.current && !columnRef.current.contains(event.target as Node)) {
                setColumnDropdownOpen(false);
            }
            if (viewRef.current && !viewRef.current.contains(event.target as Node)) {
                setViewDropdownOpen(false);
            }
            if (densityRef.current && !densityRef.current.contains(event.target as Node)) {
                setDensityDropdownOpen(false);
            }
            if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
                setGroupDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder="Search properties..."]') as HTMLInputElement;
                searchInput?.focus();
            }
            // Cmd/Ctrl + / for shortcuts help
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                onOpenKeyboardShortcuts();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onOpenKeyboardShortcuts]);

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
            // Also remove from pinned if hidden
            if (pinnedColumns.includes(columnId)) {
                onPinnedColumnsChange(pinnedColumns.filter(id => id !== columnId));
            }
        } else {
            onVisibleColumnsChange([...visibleColumns, columnId]);
        }
    };

    const togglePinColumn = (columnId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pinnedColumns.includes(columnId)) {
            onPinnedColumnsChange(pinnedColumns.filter(id => id !== columnId));
        } else {
            onPinnedColumnsChange([...pinnedColumns, columnId]);
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

    const groupableColumns = columnDefinitions.filter(col =>
        col.filterType === 'select' || col.id === 'region' || col.id === 'serviceType' || col.id === 'complianceStatus'
    );

    const densityOptions: { value: RowDensity; label: string; icon: React.ReactNode }[] = [
        { value: 'compact', label: 'Compact', icon: <Grid3X3 size={14} /> },
        { value: 'normal', label: 'Normal', icon: <Table2 size={14} /> },
        { value: 'spacious', label: 'Spacious', icon: <Layers size={14} /> },
    ];

    const viewModeOptions = [
        { value: 'table' as const, label: 'Table', icon: <List size={16} /> },
        { value: 'card' as const, label: 'Cards', icon: <LayoutGrid size={16} /> },
    ];

    const activeView = savedViews.find(v => v.id === activeViewId);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main Toolbar Row */}
            <div className="p-3 flex flex-wrap items-center gap-2">
                {/* Search with keyboard hint */}
                <div className={`relative flex-1 min-w-[200px] max-w-[320px] transition-all ${searchFocused ? 'ring-2 ring-ivolve-mid/20 rounded-lg' : ''}`}>
                    <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${searchFocused ? 'text-ivolve-mid' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full pl-9 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white transition-all"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    ) : (
                        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-gray-400 bg-gray-100 border border-gray-200 rounded">
                            <Command size={10} />K
                        </kbd>
                    )}
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                {/* Saved Views Quick Access */}
                {savedViews.length > 0 && (
                    <div className="relative" ref={viewRef}>
                        <button
                            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                                activeView
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <Bookmark size={16} />
                            <span className="hidden sm:inline max-w-[100px] truncate">
                                {activeView?.name || 'Views'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform ${viewDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {viewDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                                <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved Views</span>
                                    <button
                                        onClick={() => {
                                            onOpenSavedViews();
                                            setViewDropdownOpen(false);
                                        }}
                                        className="text-xs text-ivolve-mid hover:underline"
                                    >
                                        Manage
                                    </button>
                                </div>
                                <div className="p-2 space-y-1 max-h-[250px] overflow-y-auto">
                                    {savedViews.slice(0, 5).map((view) => (
                                        <button
                                            key={view.id}
                                            onClick={() => {
                                                onViewSelect(view);
                                                setViewDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                                                activeViewId === view.id
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-lg">{view.icon || '📊'}</span>
                                            <span className="flex-1 text-left truncate">{view.name}</span>
                                            {activeViewId === view.id && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            onOpenSavedViews();
                                            setViewDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-ivolve-mid hover:bg-ivolve-mid/5 rounded-lg transition-colors"
                                    >
                                        <Sparkles size={14} />
                                        Save current view
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
                        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
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
                            <div className="p-2 border-t border-gray-100 space-y-1">
                                <button
                                    onClick={() => {
                                        onOpenAdvancedFilters();
                                        setFilterDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ivolve-mid hover:bg-ivolve-mid/5 rounded-lg transition-colors"
                                >
                                    <Sliders size={14} />
                                    Advanced filters...
                                </button>
                                {(activeQuickFilter || filters.length > 0) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={14} />
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Group By Dropdown */}
                <div className="relative" ref={groupRef}>
                    <button
                        onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                            groupBy
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Layers size={16} />
                        <span className="hidden sm:inline">
                            {groupBy ? columnDefinitions.find(c => c.id === groupBy)?.label : 'Group'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${groupDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {groupDropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group By</span>
                            </div>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => {
                                        onGroupByChange(null);
                                        setGroupDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                                        !groupBy ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>No grouping</span>
                                    {!groupBy && <Check size={16} />}
                                </button>
                                {groupableColumns.map((col) => (
                                    <button
                                        key={col.id}
                                        onClick={() => {
                                            onGroupByChange(col.id);
                                            setGroupDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                                            groupBy === col.id ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{col.label}</span>
                                        {groupBy === col.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
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
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Columns</span>
                                <button
                                    onClick={() => {
                                        onVisibleColumnsChange(defaultVisibleColumns);
                                        onPinnedColumnsChange([]);
                                    }}
                                    className="text-xs text-gray-500 hover:text-ivolve-mid flex items-center gap-1"
                                >
                                    <RotateCcw size={12} />
                                    Reset
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
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
                                                const isPinned = pinnedColumns.includes(column.id);
                                                const isRequired = column.id === 'address';

                                                return (
                                                    <div
                                                        key={column.id}
                                                        className={`flex items-center justify-between px-3 py-2 transition-all ${
                                                            isRequired
                                                                ? 'opacity-50'
                                                                : 'hover:bg-gray-50 cursor-pointer'
                                                        }`}
                                                        onClick={() => !isRequired && toggleColumn(column.id)}
                                                    >
                                                        <span className="flex items-center gap-2 text-sm">
                                                            {isVisible ? <Eye size={14} className="text-ivolve-mid" /> : <EyeOff size={14} className="text-gray-400" />}
                                                            <span className={isVisible ? 'text-gray-900' : 'text-gray-500'}>{column.label}</span>
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {isVisible && !isRequired && (
                                                                <button
                                                                    onClick={(e) => togglePinColumn(column.id, e)}
                                                                    className={`p-1 rounded transition-colors ${
                                                                        isPinned ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'
                                                                    }`}
                                                                    title={isPinned ? 'Unpin column' : 'Pin column'}
                                                                >
                                                                    {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
                                                                </button>
                                                            )}
                                                            {isRequired && (
                                                                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Required</span>
                                                            )}
                                                        </div>
                                                    </div>
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

                {/* Density Toggle */}
                <div className="relative" ref={densityRef}>
                    <button
                        onClick={() => setDensityDropdownOpen(!densityDropdownOpen)}
                        className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all"
                        title="Row density"
                    >
                        <SlidersHorizontal size={16} />
                        <ChevronDown size={14} className={`hidden sm:block transition-transform ${densityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {densityDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Row Density</span>
                            </div>
                            <div className="p-2 space-y-1">
                                {densityOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onDensityChange(option.value);
                                            setDensityDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                                            density === option.value
                                                ? 'bg-ivolve-mid/10 text-ivolve-mid'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {option.icon}
                                        <span>{option.label}</span>
                                        {density === option.value && <Check size={14} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {viewModeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onViewModeChange(option.value)}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === option.value
                                    ? 'bg-white shadow-sm text-ivolve-dark'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            aria-label={`${option.label} view`}
                            title={`${option.label} view`}
                        >
                            {option.icon}
                        </button>
                    ))}
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

                {/* Keyboard Shortcut Button */}
                <button
                    onClick={onOpenKeyboardShortcuts}
                    className="hidden xl:flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Keyboard shortcuts"
                >
                    <Keyboard size={14} />
                    <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px]">?</kbd>
                </button>
            </div>

            {/* Active Filters Bar (if any custom filters) */}
            {filters.length > 0 && !activeQuickFilter && (
                <div className="px-3 pb-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">Active:</span>
                    {filters.slice(0, 3).map((filter, index) => {
                        const column = columnDefinitions.find(c => c.id === filter.columnId);
                        return (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-ivolve-mid/10 text-ivolve-mid rounded-full"
                            >
                                {column?.label}: {filter.operator} "{String(filter.value)}"
                                <button
                                    onClick={() => {
                                        const newFilters = filters.filter((_, i) => i !== index);
                                        onFiltersChange(newFilters);
                                    }}
                                    className="p-0.5 hover:bg-ivolve-mid/20 rounded-full"
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        );
                    })}
                    {filters.length > 3 && (
                        <button
                            onClick={onOpenAdvancedFilters}
                            className="text-xs text-ivolve-mid hover:underline"
                        >
                            +{filters.length - 3} more
                        </button>
                    )}
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-red-500 hover:underline ml-auto"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnhancedToolbar;
