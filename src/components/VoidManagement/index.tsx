import React, { useState, useMemo } from 'react';
import {
    Home, AlertTriangle, Clock, Calendar, Filter, Search,
    ChevronDown, TrendingDown, Building2, ArrowUpDown
} from 'lucide-react';
import { VoidRecord, VoidSource, VoidProgress } from '../../types';
import propertiesData from '../../data/properties.json';

// Generate void records with real rent calculations from property data
const generateVoidRecords = (): VoidRecord[] => {
    const properties = propertiesData.filter(p => p.type === 'Unit' && p.status === 'Void');
    const allProperties = propertiesData as any[];

    return properties.map(property => {
        const voidStartDate = property.statusDate || new Date().toISOString();
        const startDate = new Date(voidStartDate);
        const now = new Date();
        const daysVoid = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Mock void progress and sources
        const progressOptions: VoidProgress[] = ['Awaiting Keys', 'Keys In', 'Inspection Complete', 'Repairs Required', 'Ready to let', 'Offered', 'Let'];
        const sourceOptions: VoidSource[] = ['New Property', 'Tenant Left', 'Eviction', 'Property Maintenance', 'Transfer', 'Death'];

        const progress = progressOptions[Math.floor(Math.random() * progressOptions.length)];
        const source = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];

        // Calculate real daily rent loss from property data
        // Find parent property to get lease information
        const parentProperty = allProperties.find(p => p.id === property.parentId);
        let dailyCost = 25.00; // Default fallback if no rent data

        if (parentProperty && parentProperty.lease && parentProperty.lease.rentPW) {
            // Calculate per-unit weekly rent (total rent / total units)
            const weeklyRentPerUnit = parentProperty.lease.rentPW / (parentProperty.totalUnits || 1);
            // Convert to daily rate (weekly / 7)
            dailyCost = weeklyRentPerUnit / 7;
        }

        return {
            id: `void_${property.id}`,
            propertyId: property.parentId || property.id,
            unitId: property.id,
            propertyAddress: property.address,
            voidStartDate: voidStartDate,
            daysVoid: daysVoid,
            voidStatus: 'Current Void',
            voidSource: source,
            progress: progress,
            dailyCost: Math.round(dailyCost * 100) / 100, // Round to 2 decimal places
            totalCost: Math.round(daysVoid * dailyCost * 100) / 100, // Round to 2 decimal places
            createdAt: voidStartDate,
            updatedAt: new Date().toISOString()
        };
    });
};

type SortField = 'daysVoid' | 'propertyAddress' | 'voidStartDate' | 'totalCost';
type SortDirection = 'asc' | 'desc';

const VoidManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [progressFilter, setProgressFilter] = useState<VoidProgress | 'all'>('all');
    const [sourceFilter, setSourceFilter] = useState<VoidSource | 'all'>('all');
    const [sortField, setSortField] = useState<SortField>('daysVoid');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const voidRecords = useMemo(() => generateVoidRecords(), []);

    // Filter records
    const filteredRecords = useMemo(() => {
        let result = [...voidRecords];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(record =>
                record.propertyAddress.toLowerCase().includes(query)
            );
        }

        // Progress filter
        if (progressFilter !== 'all') {
            result = result.filter(record => record.progress === progressFilter);
        }

        // Source filter
        if (sourceFilter !== 'all') {
            result = result.filter(record => record.voidSource === sourceFilter);
        }

        // Sort
        result.sort((a, b) => {
            let aValue: any = a[sortField];
            let bValue: any = b[sortField];

            if (sortField === 'propertyAddress') {
                aValue = a.propertyAddress;
                bValue = b.propertyAddress;
            }

            if (typeof aValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === 'asc'
                ? (aValue > bValue ? 1 : -1)
                : (bValue > aValue ? 1 : -1);
        });

        return result;
    }, [voidRecords, searchQuery, progressFilter, sourceFilter, sortField, sortDirection]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalVoids = filteredRecords.length;
        const avgDaysVoid = totalVoids > 0
            ? Math.round(filteredRecords.reduce((sum, r) => sum + r.daysVoid, 0) / totalVoids)
            : 0;
        const totalCost = filteredRecords.reduce((sum, r) => sum + r.totalCost, 0);
        const longestVoid = totalVoids > 0
            ? Math.max(...filteredRecords.map(r => r.daysVoid))
            : 0;

        return { totalVoids, avgDaysVoid, totalCost, longestVoid };
    }, [filteredRecords]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50" />;
        return <ArrowUpDown size={14} className={sortDirection === 'desc' ? 'rotate-180' : ''} />;
    };

    const getProgressColor = (progress: VoidProgress): string => {
        switch (progress) {
            case 'Let':
            case 'Ready to let':
                return 'bg-green-100 text-green-700';
            case 'Offered':
                return 'bg-blue-100 text-blue-700';
            case 'Repairs Required':
            case 'Inspection Complete':
                return 'bg-amber-100 text-amber-700';
            case 'Awaiting Keys':
            case 'Keys In':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getDaysVoidColor = (days: number): string => {
        if (days > 60) return 'text-red-600 font-bold';
        if (days > 30) return 'text-amber-600 font-semibold';
        return 'text-gray-700';
    };

    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 md:px-8 py-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <AlertTriangle size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Void Management</h1>
                        <p className="text-white/80">Track and manage all vacant units across your portfolio</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-white/80 uppercase mb-1">Total Voids</p>
                                <p className="text-2xl font-bold text-white">{stats.totalVoids}</p>
                            </div>
                            <Home className="text-white/70" size={28} />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-white/80 uppercase mb-1">Avg Days Void</p>
                                <p className="text-2xl font-bold text-white">{stats.avgDaysVoid}</p>
                            </div>
                            <Clock className="text-white/70" size={28} />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-white/80 uppercase mb-1">Lost Income</p>
                                <p className="text-2xl font-bold text-white">£{stats.totalCost.toFixed(0)}</p>
                            </div>
                            <TrendingDown className="text-white/70" size={28} />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-white/80 uppercase mb-1">Longest Void</p>
                                <p className="text-2xl font-bold text-white">{stats.longestVoid}</p>
                            </div>
                            <AlertTriangle className="text-white/70" size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="p-6">

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by property address..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                            />
                        </div>
                    </div>

                    {/* Progress Filter */}
                    <div>
                        <div className="relative">
                            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={progressFilter}
                                onChange={e => setProgressFilter(e.target.value as VoidProgress | 'all')}
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid appearance-none bg-white"
                            >
                                <option value="all">All Progress</option>
                                <option value="Awaiting Keys">Awaiting Keys</option>
                                <option value="Keys In">Keys In</option>
                                <option value="Inspection Complete">Inspection Complete</option>
                                <option value="Repairs Required">Repairs Required</option>
                                <option value="Ready to let">Ready to let</option>
                                <option value="Offered">Offered</option>
                                <option value="Let">Let</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Source Filter */}
                    <div>
                        <div className="relative">
                            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={sourceFilter}
                                onChange={e => setSourceFilter(e.target.value as VoidSource | 'all')}
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid appearance-none bg-white"
                            >
                                <option value="all">All Sources</option>
                                <option value="New Property">New Property</option>
                                <option value="Tenant Left">Tenant Left</option>
                                <option value="Eviction">Eviction</option>
                                <option value="Property Maintenance">Property Maintenance</option>
                                <option value="Transfer">Transfer</option>
                                <option value="Death">Death</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Voids Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    <button
                                        onClick={() => handleSort('propertyAddress')}
                                        className="flex items-center gap-2 hover:text-ivolve-mid transition-colors group"
                                    >
                                        Property / Unit
                                        {getSortIcon('propertyAddress')}
                                    </button>
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    Source
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    <button
                                        onClick={() => handleSort('voidStartDate')}
                                        className="flex items-center gap-2 hover:text-ivolve-mid transition-colors group"
                                    >
                                        Void Since
                                        {getSortIcon('voidStartDate')}
                                    </button>
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    <button
                                        onClick={() => handleSort('daysVoid')}
                                        className="flex items-center gap-2 hover:text-ivolve-mid transition-colors group"
                                    >
                                        Days Void
                                        {getSortIcon('daysVoid')}
                                    </button>
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    Progress
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    <button
                                        onClick={() => handleSort('totalCost')}
                                        className="flex items-center gap-2 hover:text-ivolve-mid transition-colors group"
                                    >
                                        Lost Income
                                        {getSortIcon('totalCost')}
                                    </button>
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{record.propertyAddress}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{record.voidSource}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar size={14} />
                                                {new Date(record.voidStartDate).toLocaleDateString('en-GB')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className={`text-sm ${getDaysVoidColor(record.daysVoid)}`}>
                                                    {record.daysVoid} days
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getProgressColor(record.progress)}`}>
                                                {record.progress}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-red-600">£{record.totalCost.toFixed(0)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="px-3 py-1.5 text-xs font-medium text-ivolve-mid hover:bg-ivolve-mid/10 rounded-lg transition-colors">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <Home size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-lg font-medium text-gray-500">No voids found</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {searchQuery || progressFilter !== 'all' || sourceFilter !== 'all'
                                                ? 'Try adjusting your filters'
                                                : 'All units are currently occupied'}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
    );
};

export default VoidManagement;
