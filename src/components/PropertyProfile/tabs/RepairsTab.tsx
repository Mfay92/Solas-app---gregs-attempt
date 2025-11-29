import React, { useState, useMemo } from 'react';
import {
    Wrench, Search, ChevronDown, ChevronUp, Calendar,
    AlertTriangle, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { PropertyAsset, Repair, RepairStatus, RepairPriority } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

// Priority colors
const priorityColors: Record<RepairPriority, { bg: string; text: string; border: string }> = {
    'Emergency': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
    'Urgent': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
    'Routine': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-500' },
    'Planned': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-l-gray-400' }
};

// Status icons
const getStatusIcon = (status: RepairStatus) => {
    switch (status) {
        case 'Open': return <AlertTriangle size={14} className="text-red-500" />;
        case 'In Progress': return <Clock size={14} className="text-amber-500" />;
        case 'Completed': return <CheckCircle size={14} className="text-green-500" />;
        case 'Cancelled': return <XCircle size={14} className="text-gray-400" />;
    }
};

// Repair card with expandable details
const RepairCard: React.FC<{
    repair: Repair;
    units: PropertyAsset[];
}> = ({ repair, units }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const priority = priorityColors[repair.priority];
    const unitAddress = repair.unitId ? units.find(u => u.id === repair.unitId)?.address : null;

    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden border-l-4 ${priority.border}`}>
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
                                {repair.priority}
                            </span>
                            <div className="flex items-center gap-1">
                                {getStatusIcon(repair.status)}
                                <StatusBadge status={repair.status} size="sm" />
                            </div>
                            {repair.category && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    {repair.category}
                                </span>
                            )}
                        </div>
                        <h3 className="font-medium text-gray-800 mb-1">{repair.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{repair.description}</p>
                    </div>
                    <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                        )}
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Reported: {formatDate(repair.reportedDate)}</span>
                    </div>
                    {repair.targetDate && (
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Target: {formatDate(repair.targetDate)}</span>
                        </div>
                    )}
                    {repair.jobNumber && (
                        <span className="text-gray-400">#{repair.jobNumber}</span>
                    )}
                    {unitAddress && (
                        <span className="px-2 py-0.5 bg-ivolve-mid/10 text-ivolve-mid rounded text-xs">
                            {unitAddress}
                        </span>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50 space-y-4">
                    {/* Full Description */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-700">{repair.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {repair.reportedBy && (
                            <div>
                                <p className="text-xs text-gray-500">Reported By</p>
                                <p className="text-sm font-medium text-gray-700">{repair.reportedBy}</p>
                            </div>
                        )}
                        {repair.contractor && (
                            <div>
                                <p className="text-xs text-gray-500">Contractor</p>
                                <p className="text-sm font-medium text-gray-700">{repair.contractor}</p>
                            </div>
                        )}
                        {repair.cost !== undefined && (
                            <div>
                                <p className="text-xs text-gray-500">Cost</p>
                                <p className="text-sm font-medium text-gray-700">£{repair.cost.toLocaleString()}</p>
                            </div>
                        )}
                        {repair.completedDate && (
                            <div>
                                <p className="text-xs text-gray-500">Completed</p>
                                <p className="text-sm font-medium text-gray-700">{formatDate(repair.completedDate)}</p>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {repair.notes && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{repair.notes}</p>
                        </div>
                    )}

                    {/* Photos */}
                    {repair.photos && repair.photos.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Photos</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {repair.photos.map(photo => (
                                    <div
                                        key={photo.id}
                                        className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden"
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.caption || 'Repair photo'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline (visual) */}
                    <div className="flex items-center gap-2 pt-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            repair.status !== 'Cancelled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                            <CheckCircle size={12} />
                            Reported
                        </div>
                        <div className="w-8 h-0.5 bg-gray-200" />
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            repair.status === 'In Progress' || repair.status === 'Completed'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                            <Clock size={12} />
                            In Progress
                        </div>
                        <div className="w-8 h-0.5 bg-gray-200" />
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            repair.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : repair.status === 'Cancelled'
                                    ? 'bg-gray-100 text-gray-500'
                                    : 'bg-gray-100 text-gray-400'
                        }`}>
                            {repair.status === 'Cancelled' ? (
                                <><XCircle size={12} /> Cancelled</>
                            ) : (
                                <><CheckCircle size={12} /> Completed</>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RepairsTab: React.FC<TabProps> = ({ asset, units }) => {
    const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<RepairPriority | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');

    const repairs = asset.repairs || [];

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        repairs.forEach(r => {
            if (r.category) cats.add(r.category);
        });
        return Array.from(cats);
    }, [repairs]);

    // Stats
    const stats = useMemo(() => ({
        open: repairs.filter(r => r.status === 'Open').length,
        inProgress: repairs.filter(r => r.status === 'In Progress').length,
        completed: repairs.filter(r => r.status === 'Completed').length,
        emergency: repairs.filter(r => r.priority === 'Emergency' && (r.status === 'Open' || r.status === 'In Progress')).length,
    }), [repairs]);

    // Filter and sort repairs
    const filteredRepairs = useMemo(() => {
        let result = [...repairs];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(r => r.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            result = result.filter(r => r.priority === priorityFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            result = result.filter(r => r.category === categoryFilter);
        }

        // Search
        if (searchQuery) {
            const query = (searchQuery ?? '').toLowerCase();
            result = result.filter(r =>
                (r.title ?? '').toLowerCase().includes(query) ||
                (r.description ?? '').toLowerCase().includes(query) ||
                (r.jobNumber ?? '').toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
            }
            if (sortBy === 'priority') {
                const priorityOrder: Record<RepairPriority, number> = { 'Emergency': 0, 'Urgent': 1, 'Routine': 2, 'Planned': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            if (sortBy === 'status') {
                const statusOrder: Record<RepairStatus, number> = { 'Open': 0, 'In Progress': 1, 'Completed': 2, 'Cancelled': 3 };
                return statusOrder[a.status] - statusOrder[b.status];
            }
            return 0;
        });

        return result;
    }, [repairs, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

    const clearFilters = () => {
        setStatusFilter('all');
        setPriorityFilter('all');
        setCategoryFilter('all');
        setSearchQuery('');
    };

    const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || searchQuery;

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Wrench size={20} className="text-ivolve-mid" />
                        Repairs
                        <span className="text-sm font-normal text-gray-500">({repairs.length} total)</span>
                    </h2>
                    <button
                        disabled
                        className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                        title="Coming soon"
                    >
                        + Report Repair
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`text-center p-3 rounded-lg ${stats.open > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${stats.open > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {stats.open}
                        </p>
                        <p className={`text-xs ${stats.open > 0 ? 'text-red-600' : 'text-gray-500'}`}>Open</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${stats.inProgress > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${stats.inProgress > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                            {stats.inProgress}
                        </p>
                        <p className={`text-xs ${stats.inProgress > 0 ? 'text-amber-600' : 'text-gray-500'}`}>In Progress</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-xs text-green-600">Completed</p>
                    </div>
                    {stats.emergency > 0 && (
                        <div className="text-center p-3 bg-red-100 rounded-lg animate-pulse">
                            <p className="text-2xl font-bold text-red-700">{stats.emergency}</p>
                            <p className="text-xs text-red-700 font-medium">Emergency</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search repairs..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                            />
                        </div>
                    </div>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as RepairStatus | 'all')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Priority filter */}
                    <select
                        value={priorityFilter}
                        onChange={e => setPriorityFilter(e.target.value as RepairPriority | 'all')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                    >
                        <option value="all">All Priorities</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Routine">Routine</option>
                        <option value="Planned">Planned</option>
                    </select>

                    {/* Category filter */}
                    {categories.length > 0 && (
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    )}

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as 'date' | 'priority' | 'status')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="status">Sort by Status</option>
                    </select>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-sm text-ivolve-mid hover:text-ivolve-dark"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Repairs List */}
            {filteredRepairs.length > 0 ? (
                <div className="space-y-4">
                    {filteredRepairs.map(repair => (
                        <RepairCard key={repair.id} repair={repair} units={units} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
                    {repairs.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No repairs recorded</p>
                            <p className="text-sm text-gray-400 mt-1">Report a repair to start tracking</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No repairs match your filters</p>
                            <button
                                onClick={clearFilters}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Clear filters
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default RepairsTab;
