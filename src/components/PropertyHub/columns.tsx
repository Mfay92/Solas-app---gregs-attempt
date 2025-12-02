import { ColumnDefinition, QuickFilter } from './types';
import StatusBadge from '../shared/StatusBadge';
import { FileText, AlertCircle, MapPin, Building2, Users, PoundSterling, Calendar, Shield } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Helper to format date
const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// All available columns for the Property Hub
export const columnDefinitions: ColumnDefinition[] = [
    // CORE COLUMNS
    {
        id: 'address',
        label: 'Address / Unit',
        accessor: (asset) => asset.address,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'min-w-[280px]',
        align: 'left',
        filterType: 'text',
        group: 'core',
    },
    {
        id: 'serviceType',
        label: 'Service Type',
        shortLabel: 'Service',
        accessor: (asset) => asset.serviceType,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[140px]',
        align: 'left',
        filterType: 'select',
        filterOptions: ['Supported Living', 'Nursing Home', 'Residential'],
        group: 'core',
        renderCell: (asset) => asset.type === 'Master' ? <StatusBadge status={asset.serviceType} /> : null,
    },
    {
        id: 'status',
        label: 'Status',
        accessor: (asset) => asset.status,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[120px]',
        align: 'left',
        filterType: 'select',
        filterOptions: ['In Management', 'Out of Management', 'Occupied', 'Void'],
        group: 'core',
        renderCell: (asset) => asset.type === 'Unit' ? <StatusBadge status={asset.status} size="sm" /> : null,
    },
    {
        id: 'region',
        label: 'Region',
        accessor: (asset) => asset.region,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[100px]',
        align: 'left',
        filterType: 'select',
        filterOptions: ['South', 'North', 'Midlands', 'Wales', 'Southeast', 'West Wales'],
        group: 'core',
        renderCell: (asset) => (
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                {asset.region || '-'}
            </span>
        ),
    },
    {
        id: 'registeredProvider',
        label: 'Registered Provider',
        shortLabel: 'RP',
        accessor: (asset) => asset.registeredProvider,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[160px]',
        align: 'left',
        filterType: 'text',
        group: 'core',
        renderCell: (asset) => (
            <span className="text-sm text-gray-700 font-medium truncate max-w-[150px] block" title={asset.registeredProvider}>
                {asset.registeredProvider || '-'}
            </span>
        ),
    },
    {
        id: 'totalUnits',
        label: 'Units',
        accessor: (asset) => asset.totalUnits,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[80px]',
        align: 'center',
        filterType: 'number',
        group: 'core',
        renderCell: (asset) => asset.type === 'Master' ? (
            <span className="text-sm font-bold text-gray-700">{asset.totalUnits}</span>
        ) : null,
    },
    {
        id: 'occupancy',
        label: 'Occupancy',
        accessor: (asset) => asset.occupiedUnits,
        sortable: true,
        filterable: false,
        defaultVisible: false,
        width: 'w-[120px]',
        align: 'center',
        group: 'core',
        renderCell: (asset) => {
            if (asset.type !== 'Master' || !asset.totalUnits) return null;
            const rate = ((asset.occupiedUnits || 0) / asset.totalUnits) * 100;
            const color = rate === 100 ? 'bg-green-500' : rate >= 75 ? 'bg-green-400' : rate >= 50 ? 'bg-amber-400' : 'bg-red-400';
            return (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{Math.round(rate)}%</span>
                </div>
            );
        },
    },

    // COMPLIANCE COLUMNS
    {
        id: 'complianceStatus',
        label: 'Compliance',
        accessor: (asset) => asset.complianceStatus,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[120px]',
        align: 'center',
        filterType: 'select',
        filterOptions: ['Compliant', 'Non-Compliant', 'Pending', 'Expired'],
        group: 'compliance',
        renderCell: (asset) => asset.type === 'Master' && asset.complianceStatus ? (
            <StatusBadge status={asset.complianceStatus} size="sm" />
        ) : <span className="text-gray-400">-</span>,
    },
    {
        id: 'documents',
        label: 'Docs',
        accessor: (asset) => asset.documents?.length || 0,
        sortable: true,
        filterable: false,
        defaultVisible: true,
        width: 'w-[70px]',
        align: 'center',
        group: 'compliance',
        renderCell: (asset) => {
            const count = asset.documents?.length || 0;
            return (
                <div className={`flex items-center justify-center gap-1 ${count > 0 ? 'text-gray-600' : 'text-red-400'}`}>
                    {count > 0 ? <FileText size={16} /> : <AlertCircle size={16} />}
                    <span className="text-sm font-medium">{count}</span>
                </div>
            );
        },
    },

    // CONTACT COLUMNS
    {
        id: 'housingManager',
        label: 'Manager',
        accessor: (asset) => asset.housingManager,
        sortable: true,
        filterable: true,
        defaultVisible: true,
        width: 'w-[140px]',
        align: 'left',
        filterType: 'text',
        group: 'contacts',
        renderCell: (asset) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-700">{asset.housingManager || 'Unassigned'}</span>
                {asset.areaManager && (
                    <span className="text-xs text-gray-500">AM: {asset.areaManager}</span>
                )}
            </div>
        ),
    },
    {
        id: 'areaManager',
        label: 'Area Manager',
        shortLabel: 'AM',
        accessor: (asset) => asset.areaManager,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[140px]',
        align: 'left',
        filterType: 'text',
        group: 'contacts',
    },
    {
        id: 'opsDirector',
        label: 'Ops Director',
        accessor: (asset) => asset.opsDirector,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[140px]',
        align: 'left',
        filterType: 'text',
        group: 'contacts',
    },
    {
        id: 'landlord',
        label: 'Landlord',
        accessor: (asset) => asset.landlord,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[160px]',
        align: 'left',
        filterType: 'text',
        group: 'contacts',
    },

    // FINANCIAL COLUMNS
    {
        id: 'rentPA',
        label: 'Rent (PA)',
        accessor: (asset) => asset.lease?.rentPA || asset.sla?.annualRate,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[110px]',
        align: 'right',
        filterType: 'number',
        group: 'financial',
        renderCell: (asset) => {
            const rent = asset.lease?.rentPA || asset.sla?.annualRate;
            return (
                <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(rent)}
                </span>
            );
        },
    },
    {
        id: 'rentPW',
        label: 'Rent (PW)',
        accessor: (asset) => asset.lease?.rentPW || asset.sla?.weeklyRate,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[100px]',
        align: 'right',
        filterType: 'number',
        group: 'financial',
        renderCell: (asset) => {
            const rent = asset.lease?.rentPW || asset.sla?.weeklyRate;
            return (
                <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(rent)}
                </span>
            );
        },
    },

    // DATE COLUMNS
    {
        id: 'leaseEnd',
        label: 'Lease End',
        accessor: (asset) => asset.leaseEnd,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[110px]',
        align: 'left',
        filterType: 'date',
        group: 'dates',
        renderCell: (asset) => {
            if (!asset.leaseEnd) return <span className="text-gray-400 text-sm">-</span>;
            const endDate = new Date(asset.leaseEnd);
            const now = new Date();
            const monthsUntil = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
            const isExpiringSoon = monthsUntil <= 6 && monthsUntil > 0;
            const isExpired = monthsUntil <= 0;
            return (
                <span className={`text-sm ${isExpired ? 'text-red-600 font-medium' : isExpiringSoon ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                    {formatDate(asset.leaseEnd)}
                </span>
            );
        },
    },
    {
        id: 'rentReviewDate',
        label: 'Rent Review',
        accessor: (asset) => asset.lease?.rentReviewDate,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[110px]',
        align: 'left',
        filterType: 'date',
        group: 'dates',
        renderCell: (asset) => (
            <span className="text-sm text-gray-600">
                {formatDate(asset.lease?.rentReviewDate)}
            </span>
        ),
    },
    {
        id: 'slaStart',
        label: 'SLA Start',
        accessor: (asset) => asset.sla?.slaStart,
        sortable: true,
        filterable: true,
        defaultVisible: false,
        width: 'w-[110px]',
        align: 'left',
        filterType: 'date',
        group: 'dates',
        renderCell: (asset) => (
            <span className="text-sm text-gray-600">
                {formatDate(asset.sla?.slaStart)}
            </span>
        ),
    },
];

// Quick filter presets
export const quickFilters: QuickFilter[] = [
    {
        id: 'all',
        label: 'All Properties',
        filters: [],
        color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    {
        id: 'voids',
        label: 'Voids',
        filters: [{ columnId: 'status', operator: 'equals', value: 'Void' }],
        color: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    },
    {
        id: 'non-compliant',
        label: 'Non-Compliant',
        filters: [{ columnId: 'complianceStatus', operator: 'in', value: ['Non-Compliant', 'Expired'] }],
        color: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
    {
        id: 'compliance-pending',
        label: 'Compliance Pending',
        filters: [{ columnId: 'complianceStatus', operator: 'equals', value: 'Pending' }],
        color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    },
    {
        id: 'supported-living',
        label: 'Supported Living',
        filters: [{ columnId: 'serviceType', operator: 'equals', value: 'Supported Living' }],
        color: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
        id: 'nursing-residential',
        label: 'Nursing/Residential',
        filters: [{ columnId: 'serviceType', operator: 'in', value: ['Nursing Home', 'Residential'] }],
        color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
        id: 'missing-docs',
        label: 'Missing Docs',
        filters: [{ columnId: 'documents', operator: 'equals', value: 0 }],
        color: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
];

// Default visible columns
export const defaultVisibleColumns = columnDefinitions
    .filter(col => col.defaultVisible)
    .map(col => col.id);

// Column groups for the column selector
export const columnGroups = [
    { id: 'core', label: 'Core Information', icon: Building2 },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'financial', label: 'Financial', icon: PoundSterling },
    { id: 'dates', label: 'Key Dates', icon: Calendar },
];

// Get column by ID
export const getColumnById = (id: string): ColumnDefinition | undefined => {
    return columnDefinitions.find(col => col.id === id);
};
