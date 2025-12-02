import { PropertyAsset } from '../../types';

// Column definition for the Property Hub table
export interface ColumnDefinition {
    id: string;
    label: string;
    shortLabel?: string; // For mobile/compact view
    accessor: (asset: PropertyAsset) => string | number | null | undefined;
    sortable: boolean;
    filterable: boolean;
    defaultVisible: boolean;
    width?: string; // Tailwind width class
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
    renderCell?: (asset: PropertyAsset) => React.ReactNode;
    filterType?: 'text' | 'select' | 'multiselect' | 'date' | 'number' | 'boolean';
    filterOptions?: string[]; // For select/multiselect filters
    group?: 'core' | 'financial' | 'compliance' | 'contacts' | 'dates';
    pinnable?: boolean;
    aggregatable?: boolean;
    aggregateFunction?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

// Sort configuration
export interface SortConfig {
    columnId: string;
    direction: 'asc' | 'desc';
}

// Filter operators
export type FilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'between'
    | 'in'
    | 'notIn'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'isTrue'
    | 'isFalse'
    // Date-specific operators
    | 'isToday'
    | 'isThisWeek'
    | 'isThisMonth'
    | 'isThisQuarter'
    | 'isThisYear'
    | 'isPast'
    | 'isFuture'
    | 'isOverdue'
    | 'isDueWithin';

// Filter configuration with advanced options
export interface FilterConfig {
    id?: string; // Unique ID for tracking
    columnId: string;
    operator: FilterOperator;
    value: string | number | string[] | [number, number] | null;
}

// Filter group for AND/OR logic
export interface FilterGroup {
    id: string;
    logic: 'AND' | 'OR';
    filters: FilterConfig[];
}

// Advanced filter configuration
export interface AdvancedFilterConfig {
    logic: 'AND' | 'OR';
    groups: FilterGroup[];
}

// Quick filter preset
export interface QuickFilter {
    id: string;
    label: string;
    icon?: string;
    filters: FilterConfig[];
    color?: string;
    description?: string;
    badge?: string; // e.g., "3 items"
}

// Date range preset
export interface DateRangePreset {
    id: string;
    label: string;
    getValue: () => { start: Date; end: Date };
}

// Saved view configuration
export interface SavedView {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    visibleColumns: string[];
    columnOrder: string[];
    pinnedColumns: string[];
    sortConfig: SortConfig | null;
    filters: FilterConfig[];
    advancedFilters?: AdvancedFilterConfig;
    groupBy: string | null;
    density: RowDensity;
    isDefault?: boolean;
    isShared?: boolean;
    isPinned?: boolean;
    createdAt: string;
    updatedAt?: string;
    createdBy?: string;
}

// View mode type
export type ViewMode = 'table' | 'card' | 'kanban' | 'map' | 'timeline';

// Row density options
export type RowDensity = 'compact' | 'normal' | 'spacious';

// Group configuration
export interface GroupConfig {
    columnId: string;
    collapsed: Set<string>;
    showAggregates?: boolean;
}

// Bulk action definition
export interface BulkAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    confirmMessage?: string;
    action: (selectedIds: string[]) => Promise<void> | void;
    isDisabled?: (selectedIds: string[], data: PropertyAsset[]) => boolean;
}

// Export format options
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

// Export configuration
export interface ExportConfig {
    format: ExportFormat;
    includeHeaders: boolean;
    onlyVisible: boolean;
    onlyFiltered: boolean;
    onlySelected: boolean;
    columns?: string[];
    fileName?: string;
}

// Keyboard shortcut definition
export interface KeyboardShortcut {
    key: string;
    modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
    description: string;
    action: () => void;
    category: 'navigation' | 'selection' | 'actions' | 'view';
}

// Column pin position
export type PinPosition = 'left' | 'right' | null;

// Column state for pinning and ordering
export interface ColumnState {
    id: string;
    visible: boolean;
    pinned: PinPosition;
    order: number;
    width?: number;
}

// Property Hub state
export interface PropertyHubState {
    viewMode: ViewMode;
    visibleColumns: string[];
    columnOrder: string[];
    columnStates: Record<string, ColumnState>;
    pinnedColumns: { left: string[]; right: string[] };
    sortConfig: SortConfig | null;
    multiSort?: SortConfig[];
    filters: FilterConfig[];
    advancedFilters?: AdvancedFilterConfig;
    searchQuery: string;
    groupBy: string | null;
    selectedRows: Set<string>;
    expandedMasters: Set<string>;
    expandedGroups: Set<string>;
    density: RowDensity;
    activeView?: string;
    isFilterPanelOpen: boolean;
    isColumnPanelOpen: boolean;
}

// Aggregate result
export interface AggregateResult {
    columnId: string;
    function: 'sum' | 'avg' | 'count' | 'min' | 'max';
    value: number;
    label: string;
}

// Group with aggregates
export interface PropertyGroup {
    id: string;
    value: string;
    label: string;
    items: PropertyAsset[];
    aggregates: AggregateResult[];
    isExpanded: boolean;
}

// Search suggestion
export interface SearchSuggestion {
    type: 'property' | 'filter' | 'action' | 'recent';
    label: string;
    value: string;
    icon?: React.ReactNode;
    description?: string;
}

// Toast/notification for actions
export interface ActionNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    duration?: number;
}
