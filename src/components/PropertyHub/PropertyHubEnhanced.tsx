import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronRight, Home, BedDouble, FileQuestion, ArrowUpDown, ArrowUp, ArrowDown, Square, CheckSquare } from 'lucide-react';
import propertiesData from '../../data/properties.json';
import { PropertyAsset } from '../../types';
import PropertyProfile from '../PropertyProfile';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatusBadge from '../shared/StatusBadge';
import { UI_CONSTANTS } from '../../constants';
import { SortConfig, FilterConfig, RowDensity, SavedView, ExportFormat } from './types';
import { columnDefinitions, defaultVisibleColumns, getColumnById } from './columns';
import EnhancedToolbar from './EnhancedToolbar';
import AdvancedFilterBuilder from './AdvancedFilterBuilder';
import SavedViewsPanel from './SavedViewsPanel';
import BulkActionsBar from './BulkActionsBar';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { exportData } from './exportUtils';

// Type guard to validate property asset structure from JSON
function isValidPropertyData(obj: unknown): obj is Record<string, unknown> {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'address' in obj &&
        'type' in obj
    );
}

// Safely cast JSON import with validation
const properties: PropertyAsset[] = Array.isArray(propertiesData)
    ? (propertiesData.filter(isValidPropertyData) as PropertyAsset[])
    : [];

// Default saved views
const defaultSavedViews: SavedView[] = [
    {
        id: 'default-all',
        name: 'All Properties',
        icon: '📊',
        color: 'gray',
        visibleColumns: defaultVisibleColumns,
        columnOrder: defaultVisibleColumns,
        pinnedColumns: [],
        sortConfig: null,
        filters: [],
        groupBy: null,
        density: 'normal',
        isDefault: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'default-voids',
        name: 'Void Units',
        description: 'Properties with void units',
        icon: '⚠️',
        color: 'amber',
        visibleColumns: ['address', 'serviceType', 'totalUnits', 'occupancy', 'region', 'housingManager'],
        columnOrder: ['address', 'serviceType', 'totalUnits', 'occupancy', 'region', 'housingManager'],
        pinnedColumns: [],
        sortConfig: { columnId: 'occupancy', direction: 'asc' },
        filters: [{ columnId: 'status', operator: 'equals', value: 'Void' }],
        groupBy: null,
        density: 'normal',
        isPinned: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'default-compliance',
        name: 'Compliance Issues',
        description: 'Non-compliant properties',
        icon: '🔴',
        color: 'red',
        visibleColumns: ['address', 'serviceType', 'complianceStatus', 'documents', 'housingManager'],
        columnOrder: ['address', 'serviceType', 'complianceStatus', 'documents', 'housingManager'],
        pinnedColumns: [],
        sortConfig: null,
        filters: [{ columnId: 'complianceStatus', operator: 'in', value: ['Non-Compliant', 'Expired'] }],
        groupBy: null,
        density: 'normal',
        isPinned: true,
        createdAt: new Date().toISOString(),
    },
];

const PropertyHubEnhanced: React.FC = () => {
    // View state
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [isLoading, setIsLoading] = useState(false);

    // Column visibility, order, and pinning
    const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);
    const [columnOrder, setColumnOrder] = useState<string[]>(defaultVisibleColumns);
    const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // Search & Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>('all');

    // Sorting
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    // Grouping
    const [groupBy, setGroupBy] = useState<string | null>(null);

    // Density
    const [density, setDensity] = useState<RowDensity>('normal');

    // Row expansion
    const [expandedMasters, setExpandedMasters] = useState<Set<string>>(new Set());
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    // Selection
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    // Saved Views
    const [savedViews, setSavedViews] = useState<SavedView[]>(defaultSavedViews);
    const [activeViewId, setActiveViewId] = useState<string | null>('default-all');

    // Modal states
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showSavedViews, setShowSavedViews] = useState(false);
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

    // Property profile view
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ? for keyboard shortcuts
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setShowKeyboardShortcuts(true);
            }
            // Escape to close modals
            if (e.key === 'Escape') {
                if (showAdvancedFilters) setShowAdvancedFilters(false);
                if (showSavedViews) setShowSavedViews(false);
                if (selectedRows.size > 0) setSelectedRows(new Set());
            }
            // Cmd/Ctrl + A to select all
            if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !showAdvancedFilters && !showSavedViews) {
                e.preventDefault();
                const masterIds = filteredAssets.filter(a => a.type === 'Master').map(a => a.id);
                setSelectedRows(new Set(masterIds));
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showAdvancedFilters, showSavedViews, selectedRows.size]);

    // Toggle master expansion
    const toggleMaster = useCallback((id: string) => {
        setExpandedMasters(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            } else {
                newExpanded.add(id);
            }
            return newExpanded;
        });
    }, []);

    // Toggle row selection
    const toggleRowSelection = useCallback((id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedRows(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    // Select all / Deselect all
    const selectAll = useCallback(() => {
        const masterIds = filteredAssets.filter(a => a.type === 'Master').map(a => a.id);
        setSelectedRows(new Set(masterIds));
    }, []);

    const deselectAll = useCallback(() => {
        setSelectedRows(new Set());
    }, []);

    // Handle view mode change
    const handleViewModeChange = useCallback((mode: 'table' | 'card') => {
        if (mode === viewMode) return;
        setIsLoading(true);
        setTimeout(() => {
            setViewMode(mode);
            setIsLoading(false);
        }, UI_CONSTANTS.VIEW_TRANSITION_DELAY);
    }, [viewMode]);

    // Handle column sort
    const handleSort = useCallback((columnId: string) => {
        setSortConfig(prev => {
            if (prev?.columnId === columnId) {
                if (prev.direction === 'asc') {
                    return { columnId, direction: 'desc' };
                }
                return null;
            }
            return { columnId, direction: 'asc' };
        });
    }, []);

    // Column drag-and-drop handlers
    const handleColumnDragStart = useCallback((columnId: string) => {
        setDraggedColumn(columnId);
    }, []);

    const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== columnId) {
            setDragOverColumn(columnId);
        }
    }, [draggedColumn]);

    const handleColumnDragEnd = useCallback(() => {
        if (draggedColumn && dragOverColumn && draggedColumn !== dragOverColumn) {
            const newOrder = [...columnOrder];
            const draggedIndex = newOrder.indexOf(draggedColumn);
            const targetIndex = newOrder.indexOf(dragOverColumn);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                newOrder.splice(draggedIndex, 1);
                newOrder.splice(targetIndex, 0, draggedColumn);
                setColumnOrder(newOrder);
                // Also update visibleColumns to reflect new order
                setVisibleColumns(newOrder.filter(id => visibleColumns.includes(id)));
            }
        }
        setDraggedColumn(null);
        setDragOverColumn(null);
    }, [draggedColumn, dragOverColumn, columnOrder, visibleColumns]);

    // Apply view
    const applyView = useCallback((view: SavedView) => {
        setVisibleColumns(view.visibleColumns);
        setColumnOrder(view.columnOrder || view.visibleColumns);
        setPinnedColumns(view.pinnedColumns);
        setFilters(view.filters);
        setSortConfig(view.sortConfig);
        setGroupBy(view.groupBy);
        setDensity(view.density);
        setActiveViewId(view.id);
        setActiveQuickFilter(null);
    }, []);

    // Save new view
    const saveNewView = useCallback((viewData: Omit<SavedView, 'id' | 'createdAt'>) => {
        const newView: SavedView = {
            ...viewData,
            id: `view-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setSavedViews(prev => [...prev, newView]);
        setActiveViewId(newView.id);
    }, []);

    // Update view
    const updateView = useCallback((id: string, updates: Partial<SavedView>) => {
        setSavedViews(prev => prev.map(v =>
            v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
        ));
    }, []);

    // Delete view
    const deleteView = useCallback((id: string) => {
        setSavedViews(prev => prev.filter(v => v.id !== id));
        if (activeViewId === id) {
            setActiveViewId('default-all');
        }
    }, [activeViewId]);

    // Handle bulk action
    const handleBulkAction = useCallback((actionId: string) => {
        console.log(`Bulk action: ${actionId} on ${selectedRows.size} items`);
        // Implement actual actions here
        if (actionId === 'delete') {
            // In a real app, this would call an API
            setSelectedRows(new Set());
        }
    }, [selectedRows]);

    // Handle export
    const handleExport = useCallback((format: ExportFormat) => {
        const dataToExport = selectedRows.size > 0
            ? filteredAssets.filter(a => selectedRows.has(a.id))
            : filteredAssets.filter(a => a.type === 'Master');

        const columnsToExport = columnDefinitions.filter(c => visibleColumns.includes(c.id));

        exportData(format, dataToExport, columnsToExport);
    }, [selectedRows, visibleColumns]);

    // Apply filters to data
    const applyFilters = useCallback((data: PropertyAsset[]): PropertyAsset[] => {
        return data.filter(asset => {
            // Search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchableFields = [
                    asset.address,
                    asset.registeredProvider,
                    asset.housingManager,
                    asset.areaManager,
                    asset.postcode,
                    asset.region,
                ].filter(Boolean);

                if (!searchableFields.some(field => field?.toLowerCase().includes(query))) {
                    return false;
                }
            }

            // Column filters
            for (const filter of filters) {
                const column = getColumnById(filter.columnId);
                if (!column) continue;

                const value = column.accessor(asset);
                const filterValue = filter.value;

                switch (filter.operator) {
                    case 'equals':
                        if (String(value).toLowerCase() !== String(filterValue).toLowerCase()) return false;
                        break;
                    case 'notEquals':
                        if (String(value).toLowerCase() === String(filterValue).toLowerCase()) return false;
                        break;
                    case 'contains':
                        if (!String(value || '').toLowerCase().includes(String(filterValue).toLowerCase())) return false;
                        break;
                    case 'notContains':
                        if (String(value || '').toLowerCase().includes(String(filterValue).toLowerCase())) return false;
                        break;
                    case 'startsWith':
                        if (!String(value || '').toLowerCase().startsWith(String(filterValue).toLowerCase())) return false;
                        break;
                    case 'endsWith':
                        if (!String(value || '').toLowerCase().endsWith(String(filterValue).toLowerCase())) return false;
                        break;
                    case 'greaterThan':
                        if (Number(value) <= Number(filterValue)) return false;
                        break;
                    case 'greaterThanOrEqual':
                        if (Number(value) < Number(filterValue)) return false;
                        break;
                    case 'lessThan':
                        if (Number(value) >= Number(filterValue)) return false;
                        break;
                    case 'lessThanOrEqual':
                        if (Number(value) > Number(filterValue)) return false;
                        break;
                    case 'in':
                        if (Array.isArray(filterValue)) {
                            const stringValue = String(value);
                            if (!filterValue.some(fv => String(fv) === stringValue)) return false;
                        }
                        break;
                    case 'notIn':
                        if (Array.isArray(filterValue)) {
                            const stringValue = String(value);
                            if (filterValue.some(fv => String(fv) === stringValue)) return false;
                        }
                        break;
                    case 'isEmpty':
                        if (value !== null && value !== undefined && value !== '') return false;
                        break;
                    case 'isNotEmpty':
                        if (value === null || value === undefined || value === '') return false;
                        break;
                    case 'isToday': {
                        const today = new Date().toISOString().split('T')[0];
                        if (String(value).split('T')[0] !== today) return false;
                        break;
                    }
                    case 'isPast': {
                        const now = new Date();
                        if (new Date(String(value)) >= now) return false;
                        break;
                    }
                    case 'isFuture': {
                        const now = new Date();
                        if (new Date(String(value)) <= now) return false;
                        break;
                    }
                }
            }

            return true;
        });
    }, [searchQuery, filters]);

    // Apply sorting to data
    const applySorting = useCallback((data: PropertyAsset[]): PropertyAsset[] => {
        if (!sortConfig) return data;

        const column = getColumnById(sortConfig.columnId);
        if (!column) return data;

        return [...data].sort((a, b) => {
            const aValue = column.accessor(a);
            const bValue = column.accessor(b);

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
            if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

            let comparison = 0;
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [sortConfig]);

    // Filtered and sorted assets
    const filteredAssets = useMemo(() => {
        const filtered = applyFilters(properties);
        return applySorting(filtered);
    }, [applyFilters, applySorting]);

    // Grouped data (if grouping is enabled)
    const groupedData = useMemo(() => {
        if (!groupBy) return null;

        const column = getColumnById(groupBy);
        if (!column) return null;

        const masters = filteredAssets.filter(a => a.type === 'Master');
        const groups = new Map<string, PropertyAsset[]>();

        masters.forEach(asset => {
            const value = String(column.accessor(asset) || 'Unknown');
            if (!groups.has(value)) {
                groups.set(value, []);
            }
            groups.get(value)!.push(asset);
        });

        return Array.from(groups.entries()).map(([value, items]) => ({
            value,
            items,
            count: items.length,
            isExpanded: expandedGroups.has(value),
        }));
    }, [groupBy, filteredAssets, expandedGroups]);

    // Toggle group expansion
    const toggleGroup = useCallback((groupValue: string) => {
        setExpandedGroups(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(groupValue)) {
                newExpanded.delete(groupValue);
            } else {
                newExpanded.add(groupValue);
            }
            return newExpanded;
        });
    }, []);

    // Table data with expanded units
    const tableData = useMemo(() => {
        const masters = filteredAssets.filter(a => a.type === 'Master');
        const units = filteredAssets.filter(a => a.type === 'Unit');

        let rows: PropertyAsset[] = [];

        masters.forEach(master => {
            rows.push(master);
            if (expandedMasters.has(master.id)) {
                const masterUnits = units.filter(u => u.parentId === master.id);
                rows = [...rows, ...masterUnits];
            }
        });

        return rows;
    }, [filteredAssets, expandedMasters]);

    // Selected property for profile view
    const selectedProperty = useMemo(() => {
        return properties.find(p => p.id === selectedPropertyId);
    }, [selectedPropertyId]);

    const selectedPropertyUnits = useMemo(() => {
        if (!selectedPropertyId) return [];
        return properties.filter(p => p.parentId === selectedPropertyId);
    }, [selectedPropertyId]);

    // Stats calculations - MUST be called before any early returns (React hooks rule)
    const toolbarStats = useMemo(() => {
        const masterProperties = filteredAssets.filter(p => p.type === 'Master');
        const totalUnits = masterProperties.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
        const occupiedUnits = masterProperties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);
        const voidCount = totalUnits - occupiedUnits;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        const totalRent = masterProperties.reduce((sum, p) => {
            const rent = p.lease?.rentPA || p.sla?.annualRate || 0;
            return sum + rent;
        }, 0);
        const compliantCount = masterProperties.filter(p => p.complianceStatus === 'Compliant').length;
        const pendingCount = masterProperties.filter(p => p.complianceStatus === 'Pending').length;
        const nonCompliantCount = masterProperties.filter(p => p.complianceStatus === 'Non-Compliant' || p.complianceStatus === 'Expired').length;

        return {
            totalUnits,
            occupancyRate,
            voidCount,
            totalRent,
            compliantCount,
            pendingCount,
            nonCompliantCount,
        };
    }, [filteredAssets]);

    // Show property profile if selected
    if (selectedProperty) {
        return (
            <PropertyProfile
                asset={selectedProperty}
                units={selectedPropertyUnits}
                onBack={() => setSelectedPropertyId(null)}
            />
        );
    }

    // Get visible column definitions in order (respecting columnOrder)
    const orderedVisibleColumns = columnOrder.filter(id => visibleColumns.includes(id));
    const visibleColumnDefs = orderedVisibleColumns
        .map(id => columnDefinitions.find(col => col.id === id))
        .filter(Boolean) as typeof columnDefinitions;

    // Stats calculations
    const masterCount = properties.filter(p => p.type === 'Master').length;
    const filteredMasterCount = filteredAssets.filter(p => p.type === 'Master').length;

    // Cell padding based on density
    const cellPadding = density === 'compact' ? 'p-2' : density === 'spacious' ? 'p-5' : 'p-4';

    const isAllSelected = selectedRows.size === filteredAssets.filter(a => a.type === 'Master').length && selectedRows.size > 0;

    return (
        <div className="p-6 md:p-8 space-y-4 bg-ivolve-paper min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-ivolve-dark font-rounded">Property Hub</h1>
                    <p className="text-sm text-ivolve-slate">Manage your portfolio, units, and assets</p>
                </div>
            </div>

            {/* Enhanced Toolbar */}
            <EnhancedToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFiltersChange={setFilters}
                activeQuickFilter={activeQuickFilter}
                onQuickFilterChange={setActiveQuickFilter}
                onOpenAdvancedFilters={() => setShowAdvancedFilters(true)}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
                pinnedColumns={pinnedColumns}
                onPinnedColumnsChange={setPinnedColumns}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                density={density}
                onDensityChange={setDensity}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                savedViews={savedViews}
                activeViewId={activeViewId}
                onOpenSavedViews={() => setShowSavedViews(true)}
                onViewSelect={applyView}
                totalProperties={masterCount}
                filteredProperties={filteredMasterCount}
                totalUnits={toolbarStats.totalUnits}
                occupancyRate={toolbarStats.occupancyRate}
                voidCount={toolbarStats.voidCount}
                totalRent={toolbarStats.totalRent}
                compliantCount={toolbarStats.compliantCount}
                pendingCount={toolbarStats.pendingCount}
                nonCompliantCount={toolbarStats.nonCompliantCount}
                onOpenKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
            />

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FileQuestion size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilters([]);
                            setActiveQuickFilter('all');
                        }}
                        className="px-6 py-2.5 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse" role="table">
                            <thead className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid sticky top-0 z-10">
                                <tr>
                                    {/* Selection Column */}
                                    <th scope="col" className="p-3 w-10">
                                        <button
                                            onClick={isAllSelected ? deselectAll : selectAll}
                                            className="p-1 text-white/70 hover:text-white rounded transition-colors"
                                        >
                                            {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                    </th>
                                    {visibleColumnDefs.map((column) => {
                                        const isSorted = sortConfig?.columnId === column.id;
                                        const sortDirection = isSorted ? sortConfig.direction : null;
                                        const isPinned = pinnedColumns.includes(column.id);
                                        const isDragging = draggedColumn === column.id;
                                        const isDragOver = dragOverColumn === column.id;
                                        const isAddressColumn = column.id === 'address';

                                        return (
                                            <th
                                                key={column.id}
                                                scope="col"
                                                draggable={!isAddressColumn}
                                                onDragStart={() => !isAddressColumn && handleColumnDragStart(column.id)}
                                                onDragOver={(e) => !isAddressColumn && handleColumnDragOver(e, column.id)}
                                                onDragEnd={handleColumnDragEnd}
                                                onDragLeave={() => setDragOverColumn(null)}
                                                className={`${cellPadding} text-white font-bold text-xs uppercase tracking-wider ${column.width || ''} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${isPinned ? 'bg-ivolve-dark/50' : ''} ${!isAddressColumn ? 'cursor-grab' : ''} ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'bg-white/20 border-l-2 border-white' : ''} transition-all`}
                                            >
                                                {column.sortable ? (
                                                    <button
                                                        onClick={() => handleSort(column.id)}
                                                        className="flex items-center gap-1.5 hover:text-white/80 transition-colors group"
                                                    >
                                                        <span>{column.shortLabel || column.label}</span>
                                                        <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                            {sortDirection === 'asc' ? (
                                                                <ArrowUp size={14} />
                                                            ) : sortDirection === 'desc' ? (
                                                                <ArrowDown size={14} />
                                                            ) : (
                                                                <ArrowUpDown size={14} />
                                                            )}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <span>{column.shortLabel || column.label}</span>
                                                )}
                                            </th>
                                        );
                                    })}
                                    <th scope="col" className={`${cellPadding} text-white font-bold text-xs uppercase tracking-wider text-right w-[80px]`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groupBy && groupedData ? (
                                    // Grouped view
                                    groupedData.map((group) => (
                                        <React.Fragment key={group.value}>
                                            {/* Group Header */}
                                            <tr
                                                className="bg-gray-100 cursor-pointer hover:bg-gray-150"
                                                onClick={() => toggleGroup(group.value)}
                                            >
                                                <td colSpan={visibleColumnDefs.length + 2} className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <ChevronRight
                                                            size={18}
                                                            className={`text-gray-500 transition-transform ${group.isExpanded ? 'rotate-90' : ''}`}
                                                        />
                                                        <span className="font-semibold text-gray-900">{group.value}</span>
                                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                                                            {group.count}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Group Items */}
                                            {group.isExpanded && group.items.map((asset) => renderTableRow(asset))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    // Non-grouped view
                                    tableData.map((asset) => renderTableRow(asset))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.filter(a => a.type === 'Master').map((asset, index) => {
                        const occupancyRate = (asset.totalUnits || 0) > 0 ? ((asset.occupiedUnits || 0) / (asset.totalUnits || 1)) * 100 : 0;
                        let progressColor = 'bg-red-500';
                        if (occupancyRate === 100) progressColor = 'bg-green-500';
                        else if (occupancyRate > 50) progressColor = 'bg-green-400';
                        else if (occupancyRate > 0) progressColor = 'bg-amber-500';

                        const isRegisteredSite = asset.serviceType === 'Nursing Home' || asset.serviceType === 'Residential';
                        const cardHoverBorder = isRegisteredSite ? 'hover:border-ivolve-blue' : 'hover:border-ivolve-mid';
                        const cardHeaderBg = isRegisteredSite ? 'bg-ivolve-blue' : 'bg-ivolve-mid';
                        const isSelected = selectedRows.has(asset.id);

                        return (
                            <div
                                key={asset.id}
                                onClick={() => setSelectedPropertyId(asset.id)}
                                className={`bg-white rounded-2xl shadow-sm border-2 ${isSelected ? 'border-ivolve-mid ring-2 ring-ivolve-mid/20' : 'border-transparent'} ${cardHoverBorder} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in-up relative`}
                                style={{ animationDelay: `${(index % 6) * 50}ms` }}
                            >
                                {/* Selection checkbox */}
                                <button
                                    onClick={(e) => toggleRowSelection(asset.id, e)}
                                    className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white transition-colors"
                                >
                                    {isSelected ? (
                                        <CheckSquare size={18} className="text-ivolve-mid" />
                                    ) : (
                                        <Square size={18} className="text-gray-400" />
                                    )}
                                </button>

                                <div className={`p-4 flex justify-between items-start ${cardHeaderBg}`}>
                                    <div className="min-w-0 flex-1 pr-8">
                                        <h3 className="text-white font-bold text-lg truncate">{asset.address}</h3>
                                        <p className="text-white/80 text-sm">{asset.postcode}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        <StatusBadge status={asset.serviceType} size="sm" className="!bg-white/20 !text-white" />
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block text-xs mb-0.5">Region</span>
                                            <span className="font-medium text-gray-900">{asset.region || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs mb-0.5">Units</span>
                                            <span className="font-bold text-gray-900">{asset.totalUnits}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Occupancy</span>
                                            <span className={`font-medium ${occupancyRate === 100 ? 'text-green-600' : 'text-gray-700'}`}>
                                                {asset.occupiedUnits} / {asset.totalUnits}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                                                style={{ width: `${occupancyRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Compliance</span>
                                        {asset.complianceStatus ? (
                                            <StatusBadge status={asset.complianceStatus} size="sm" />
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <span className="truncate">{asset.housingManager || 'No manager'}</span>
                                        <span>{asset.registeredProvider || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bulk Actions Bar */}
            <BulkActionsBar
                selectedCount={selectedRows.size}
                totalCount={filteredAssets.filter(a => a.type === 'Master').length}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onBulkAction={handleBulkAction}
                onExport={handleExport}
                isAllSelected={isAllSelected}
            />

            {/* Advanced Filter Modal */}
            {showAdvancedFilters && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <AdvancedFilterBuilder
                        filters={filters}
                        onFiltersChange={(newFilters) => {
                            setFilters(newFilters);
                            setActiveQuickFilter(null);
                        }}
                        onClose={() => setShowAdvancedFilters(false)}
                    />
                </div>
            )}

            {/* Saved Views Modal */}
            {showSavedViews && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <SavedViewsPanel
                        views={savedViews}
                        activeViewId={activeViewId}
                        onViewSelect={(view) => {
                            applyView(view);
                            setShowSavedViews(false);
                        }}
                        onViewCreate={saveNewView}
                        onViewUpdate={updateView}
                        onViewDelete={deleteView}
                        onClose={() => setShowSavedViews(false)}
                        currentState={{
                            visibleColumns,
                            filters,
                            sortConfig,
                            groupBy,
                            density,
                        }}
                    />
                </div>
            )}

            {/* Keyboard Shortcuts Modal */}
            {showKeyboardShortcuts && (
                <KeyboardShortcutsModal onClose={() => setShowKeyboardShortcuts(false)} />
            )}
        </div>
    );

    // Helper function to render table row
    function renderTableRow(asset: PropertyAsset) {
        const isDecommissioned = asset.status === 'Out of Management' && asset.type === 'Unit';
        const rowOpacity = isDecommissioned ? 'opacity-50 grayscale' : 'opacity-100';
        const isMaster = asset.type === 'Master';
        const isUnit = asset.type === 'Unit';
        const isExpanded = expandedMasters.has(asset.id);
        const isSelected = selectedRows.has(asset.id);

        const isRegisteredSite = asset.serviceType === 'Nursing Home' || asset.serviceType === 'Residential';
        const borderColor = isRegisteredSite ? 'border-ivolve-blue' : 'border-ivolve-mid';
        const hoverBg = isRegisteredSite ? 'hover:bg-ivolve-blue/5' : 'hover:bg-ivolve-mid/5';

        let rowClasses = "transition-all duration-200 hover:shadow-md cursor-pointer";
        if (isMaster) {
            rowClasses += ` border-l-4 ${borderColor} ${isSelected ? 'bg-ivolve-mid/5' : 'bg-white'} ${hoverBg}`;
        } else if (isUnit) {
            rowClasses += " bg-gray-50/50 border-l-4 border-transparent";
        }
        rowClasses += ` ${rowOpacity}`;

        return (
            <tr
                key={asset.id}
                className={rowClasses}
                onClick={() => setSelectedPropertyId(isMaster ? asset.id : asset.parentId || asset.id)}
            >
                {/* Selection Column */}
                <td className="p-3 w-10">
                    {isMaster && (
                        <button
                            onClick={(e) => toggleRowSelection(asset.id, e)}
                            className="p-1 text-gray-400 hover:text-ivolve-mid rounded transition-colors"
                        >
                            {isSelected ? <CheckSquare size={18} className="text-ivolve-mid" /> : <Square size={18} />}
                        </button>
                    )}
                </td>
                {visibleColumnDefs.map((column) => {
                    if (column.id === 'address') {
                        return (
                            <td key={column.id} className={cellPadding}>
                                <div className={`flex items-center ${isUnit ? 'pl-8' : ''}`}>
                                    {isMaster && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMaster(asset.id);
                                            }}
                                            className="mr-2 p-1 text-gray-400 hover:text-ivolve-mid hover:bg-gray-100 rounded transition-all"
                                            aria-expanded={isExpanded}
                                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${asset.address}`}
                                        >
                                            <ChevronRight
                                                size={16}
                                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                            />
                                        </button>
                                    )}
                                    {isUnit && <div className="w-7 mr-2" />}

                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            isMaster
                                                ? (isRegisteredSite ? 'bg-blue-100 text-ivolve-blue' : 'bg-green-100 text-ivolve-mid')
                                                : (asset.status === 'Occupied' ? 'bg-green-50 text-green-600' :
                                                    asset.status === 'Void' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-gray-100 text-gray-500')
                                        }`}>
                                            {isMaster ? <Home size={18} /> : <BedDouble size={18} />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className={`font-medium truncate ${isMaster ? 'text-base font-bold text-gray-900' : 'text-gray-600 text-sm'}`}>
                                                {asset.address}
                                            </span>
                                            {isMaster && asset.buildingPhone && (
                                                <span className="text-xs text-gray-500">{asset.buildingPhone}</span>
                                            )}
                                            {isUnit && asset.unitType && (
                                                <span className="text-xs text-gray-400">{asset.unitType}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        );
                    }

                    if (column.renderCell) {
                        return (
                            <td
                                key={column.id}
                                className={`${cellPadding} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                            >
                                {column.renderCell(asset)}
                            </td>
                        );
                    }

                    const value = column.accessor(asset);
                    return (
                        <td
                            key={column.id}
                            className={`${cellPadding} text-sm text-gray-600 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                        >
                            {value ?? '-'}
                        </td>
                    );
                })}

                <td className={`${cellPadding} text-right`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPropertyId(isMaster ? asset.id : asset.parentId || asset.id);
                        }}
                        className="text-ivolve-mid hover:text-ivolve-dark font-medium text-sm hover:underline"
                    >
                        View
                    </button>
                </td>
            </tr>
        );
    }
};

export default PropertyHubEnhanced;
