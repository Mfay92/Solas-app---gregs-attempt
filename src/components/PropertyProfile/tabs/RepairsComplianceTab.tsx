import React, { useState, useMemo } from 'react';
import {
    Wrench, ShieldCheck, Search, ChevronDown, ChevronUp, Calendar,
    AlertTriangle, Clock, CheckCircle, XCircle,
    Flame, Zap, Droplet, FileText, ExternalLink, Leaf, Sparkles,
    PaintBucket, Refrigerator
} from 'lucide-react';
import { PropertyAsset, Repair, RepairStatus, RepairPriority, ComplianceItem, ComplianceStatus } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

type ViewMode = 'repairs' | 'compliance';

// ============================================
// RESPONSIBILITY COMPONENTS
// ============================================

// Responsibility badge
const ResponsibilityBadge: React.FC<{ value?: string }> = ({ value }) => {
    if (!value) return <span className="text-gray-400 text-xs">Not set</span>;

    const colors: Record<string, string> = {
        'ivolve': 'bg-ivolve-mid/10 text-ivolve-mid',
        'RP': 'bg-blue-100 text-blue-700',
        'Landlord': 'bg-purple-100 text-purple-700',
        'Tenant': 'bg-amber-100 text-amber-700',
        'Contractor': 'bg-gray-100 text-gray-700'
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
            {value}
        </span>
    );
};

// Compact responsibility row
const ResponsibilityItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: string;
}> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs text-gray-600">{label}</span>
        </div>
        <ResponsibilityBadge value={value} />
    </div>
);

// ============================================
// REPAIRS COMPONENTS
// ============================================

// Priority colors
const priorityColors: Record<RepairPriority, { bg: string; text: string; border: string }> = {
    'Emergency': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
    'Urgent': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
    'Routine': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-500' },
    'Planned': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-l-gray-400' }
};

// Status icons
const getRepairStatusIcon = (status: RepairStatus) => {
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
                                {getRepairStatusIcon(repair.status)}
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
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-700">{repair.description}</p>
                    </div>

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

                    {repair.notes && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{repair.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
// COMPLIANCE COMPONENTS
// ============================================

// Calculate days until expiry
const getDaysUntil = (dateStr: string | undefined): number | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// Get icon for compliance type
const getTypeIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('gas')) return <Flame size={18} className="text-orange-500" />;
    if (lower.includes('eicr') || lower.includes('electric')) return <Zap size={18} className="text-yellow-500" />;
    if (lower.includes('legionella') || lower.includes('water')) return <Droplet size={18} className="text-blue-500" />;
    if (lower.includes('fire')) return <AlertTriangle size={18} className="text-red-500" />;
    if (lower.includes('pat')) return <Zap size={18} className="text-purple-500" />;
    return <ShieldCheck size={18} className="text-ivolve-mid" />;
};

// Status colors
const complianceStatusColors: Record<ComplianceStatus, { bg: string; text: string; border: string }> = {
    'Compliant': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-l-green-500' },
    'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
    'Non-Compliant': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
    'Expired': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-600' }
};

// Expiry countdown badge
const ExpiryBadge: React.FC<{ expiryDate: string | undefined }> = ({ expiryDate }) => {
    const daysUntil = getDaysUntil(expiryDate);

    if (daysUntil === null) return null;

    if (daysUntil <= 0) {
        return (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded animate-pulse">
                EXPIRED {Math.abs(daysUntil)} days ago
            </span>
        );
    }

    if (daysUntil <= 30) {
        return (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                {daysUntil} days left
            </span>
        );
    }

    if (daysUntil <= 90) {
        return (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                {daysUntil} days left
            </span>
        );
    }

    return (
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
            {daysUntil} days left
        </span>
    );
};

// Compliance card
const ComplianceCard: React.FC<{
    item: ComplianceItem;
}> = ({ item }) => {
    const status = complianceStatusColors[item.status];
    const daysUntil = getDaysUntil(item.expiryDate);

    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 border-l-4 ${status.border}`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bg}`}>
                    {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{item.type}</h3>
                        {item.unitSpecific && (
                            <span className="px-2 py-0.5 bg-ivolve-mid/10 text-ivolve-mid text-xs rounded">
                                Unit-specific
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <StatusBadge status={item.status} size="sm" />
                        <ExpiryBadge expiryDate={item.expiryDate} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {item.certificateNumber && (
                            <div>
                                <p className="text-xs text-gray-500">Certificate #</p>
                                <p className="font-medium text-gray-700">{item.certificateNumber}</p>
                            </div>
                        )}
                        {item.issuedDate && (
                            <div>
                                <p className="text-xs text-gray-500">Issued</p>
                                <p className="font-medium text-gray-700">{formatDate(item.issuedDate)}</p>
                            </div>
                        )}
                        {item.expiryDate && (
                            <div>
                                <p className="text-xs text-gray-500">Expires</p>
                                <p className={`font-medium ${
                                    daysUntil !== null && daysUntil <= 30 ? 'text-red-600' :
                                    daysUntil !== null && daysUntil <= 90 ? 'text-amber-600' : 'text-gray-700'
                                }`}>
                                    {formatDate(item.expiryDate)}
                                </p>
                            </div>
                        )}
                        {item.contractor && (
                            <div>
                                <p className="text-xs text-gray-500">Contractor</p>
                                <p className="font-medium text-gray-700">{item.contractor}</p>
                            </div>
                        )}
                    </div>

                    {item.documentUrl && (
                        <a
                            href={item.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm text-ivolve-mid hover:underline"
                        >
                            <FileText size={14} />
                            View Certificate
                            <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const RepairsComplianceTab: React.FC<TabProps> = ({ asset, units }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('repairs');

    // Repairs state
    const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<RepairPriority | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Compliance state
    const [complianceStatusFilter, setComplianceStatusFilter] = useState<ComplianceStatus | 'all'>('all');

    const repairs = asset.repairs || [];
    const complianceItems = asset.complianceItems || [];

    // Repairs stats
    const repairStats = useMemo(() => ({
        open: repairs.filter(r => r.status === 'Open').length,
        inProgress: repairs.filter(r => r.status === 'In Progress').length,
        completed: repairs.filter(r => r.status === 'Completed').length,
        emergency: repairs.filter(r => r.priority === 'Emergency' && (r.status === 'Open' || r.status === 'In Progress')).length,
    }), [repairs]);

    // Compliance stats
    const complianceStats = useMemo(() => {
        const compliant = complianceItems.filter(c => c.status === 'Compliant').length;
        const pending = complianceItems.filter(c => c.status === 'Pending').length;
        const nonCompliant = complianceItems.filter(c => c.status === 'Non-Compliant' || c.status === 'Expired').length;
        const dueSoon = complianceItems.filter(c => {
            const days = getDaysUntil(c.expiryDate);
            return days !== null && days > 0 && days <= 30;
        }).length;

        return { compliant, pending, nonCompliant, dueSoon, total: complianceItems.length };
    }, [complianceItems]);

    // Filter repairs
    const filteredRepairs = useMemo(() => {
        let result = [...repairs];

        if (statusFilter !== 'all') {
            result = result.filter(r => r.status === statusFilter);
        }

        if (priorityFilter !== 'all') {
            result = result.filter(r => r.priority === priorityFilter);
        }

        if (searchQuery) {
            const query = (searchQuery ?? '').toLowerCase();
            result = result.filter(r =>
                (r.title ?? '').toLowerCase().includes(query) ||
                (r.description ?? '').toLowerCase().includes(query) ||
                (r.jobNumber ?? '').toLowerCase().includes(query)
            );
        }

        // Sort by date
        result.sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime());

        return result;
    }, [repairs, statusFilter, priorityFilter, searchQuery]);

    // Filter compliance items
    const filteredCompliance = useMemo(() => {
        let result = [...complianceItems];

        if (complianceStatusFilter !== 'all') {
            result = result.filter(c => c.status === complianceStatusFilter);
        }

        // Sort by expiry date
        result.sort((a, b) => {
            const daysA = getDaysUntil(a.expiryDate) || 999;
            const daysB = getDaysUntil(b.expiryDate) || 999;
            return daysA - daysB;
        });

        return result;
    }, [complianceItems, complianceStatusFilter]);

    // Items expiring within 30 days
    const urgentComplianceItems = useMemo(() => {
        return complianceItems.filter(c => {
            const days = getDaysUntil(c.expiryDate);
            return days !== null && days <= 30;
        }).sort((a, b) => {
            const daysA = getDaysUntil(a.expiryDate) || 999;
            const daysB = getDaysUntil(b.expiryDate) || 999;
            return daysA - daysB;
        });
    }, [complianceItems]);

    const clearRepairFilters = () => {
        setStatusFilter('all');
        setPriorityFilter('all');
        setSearchQuery('');
    };

    const hasActiveRepairFilters = statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery;

    const maintenance = asset.maintenance || {};

    return (
        <div className="space-y-6">
            {/* Key Responsibilities Quick Reference */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Wrench size={14} />
                    Key Responsibilities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <ResponsibilityItem
                        icon={<Wrench size={14} className="text-gray-500" />}
                        label="General"
                        value={maintenance.general || asset.maintenanceResponsibility}
                    />
                    <ResponsibilityItem
                        icon={<Leaf size={14} className="text-green-500" />}
                        label="Gardening"
                        value={maintenance.gardening || asset.gardeningResponsibility}
                    />
                    <ResponsibilityItem
                        icon={<Sparkles size={14} className="text-blue-500" />}
                        label="Windows"
                        value={maintenance.windowCleaning}
                    />
                    <ResponsibilityItem
                        icon={<Refrigerator size={14} className="text-cyan-500" />}
                        label="White Goods"
                        value={maintenance.whiteGoods}
                    />
                    <ResponsibilityItem
                        icon={<PaintBucket size={14} className="text-amber-500" />}
                        label="Decorating"
                        value={maintenance.decorating}
                    />
                </div>
            </div>

            {/* Toggle Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('repairs')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                            viewMode === 'repairs'
                                ? 'bg-ivolve-mid text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Wrench size={18} />
                        Repairs
                        {repairStats.open > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                viewMode === 'repairs' ? 'bg-white/20' : 'bg-red-100 text-red-600'
                            }`}>
                                {repairStats.open} open
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setViewMode('compliance')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                            viewMode === 'compliance'
                                ? 'bg-ivolve-mid text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <ShieldCheck size={18} />
                        Compliance
                        {complianceStats.dueSoon > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                viewMode === 'compliance' ? 'bg-white/20' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {complianceStats.dueSoon} due
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* REPAIRS VIEW */}
            {viewMode === 'repairs' && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`text-center p-4 rounded-xl ${repairStats.open > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${repairStats.open > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                {repairStats.open}
                            </p>
                            <p className={`text-xs ${repairStats.open > 0 ? 'text-red-600' : 'text-gray-500'}`}>Open</p>
                        </div>
                        <div className={`text-center p-4 rounded-xl ${repairStats.inProgress > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${repairStats.inProgress > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                {repairStats.inProgress}
                            </p>
                            <p className={`text-xs ${repairStats.inProgress > 0 ? 'text-amber-600' : 'text-gray-500'}`}>In Progress</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <p className="text-2xl font-bold text-green-600">{repairStats.completed}</p>
                            <p className="text-xs text-green-600">Completed</p>
                        </div>
                        {repairStats.emergency > 0 && (
                            <div className="text-center p-4 bg-red-100 rounded-xl animate-pulse">
                                <p className="text-2xl font-bold text-red-700">{repairStats.emergency}</p>
                                <p className="text-xs text-red-700 font-medium">Emergency</p>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <div className="flex flex-wrap gap-4">
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

                            {hasActiveRepairFilters && (
                                <button
                                    onClick={clearRepairFilters}
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
                                        onClick={clearRepairFilters}
                                        className="mt-3 text-sm text-ivolve-mid hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* COMPLIANCE VIEW */}
            {viewMode === 'compliance' && (
                <>
                    {/* Progress Bar */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Compliance Progress</span>
                            <span className="font-medium text-gray-800">
                                {complianceStats.compliant} of {complianceStats.total} items compliant
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                            {complianceStats.compliant > 0 && (
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{ width: `${(complianceStats.compliant / complianceStats.total) * 100}%` }}
                                />
                            )}
                            {complianceStats.pending > 0 && (
                                <div
                                    className="h-full bg-amber-500 transition-all duration-500"
                                    style={{ width: `${(complianceStats.pending / complianceStats.total) * 100}%` }}
                                />
                            )}
                            {complianceStats.nonCompliant > 0 && (
                                <div
                                    className="h-full bg-red-500 transition-all duration-500"
                                    style={{ width: `${(complianceStats.nonCompliant / complianceStats.total) * 100}%` }}
                                />
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-xl font-bold text-green-600">{complianceStats.compliant}</p>
                                <p className="text-xs text-green-600">Compliant</p>
                            </div>
                            <div className={`text-center p-3 rounded-lg ${complianceStats.pending > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                <p className={`text-xl font-bold ${complianceStats.pending > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                    {complianceStats.pending}
                                </p>
                                <p className={`text-xs ${complianceStats.pending > 0 ? 'text-amber-600' : 'text-gray-500'}`}>Pending</p>
                            </div>
                            <div className={`text-center p-3 rounded-lg ${complianceStats.nonCompliant > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                                <p className={`text-xl font-bold ${complianceStats.nonCompliant > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                    {complianceStats.nonCompliant}
                                </p>
                                <p className={`text-xs ${complianceStats.nonCompliant > 0 ? 'text-red-600' : 'text-gray-500'}`}>Non-Compliant</p>
                            </div>
                            {complianceStats.dueSoon > 0 && (
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <p className="text-xl font-bold text-orange-600">{complianceStats.dueSoon}</p>
                                    <p className="text-xs text-orange-600">Due in 30 days</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Urgent Expiries Alert */}
                    {urgentComplianceItems.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle size={20} className="text-red-600" />
                                <h3 className="font-semibold text-red-800">Urgent: Items Expiring Soon</h3>
                            </div>
                            <div className="space-y-2">
                                {urgentComplianceItems.slice(0, 3).map(item => {
                                    const days = getDaysUntil(item.expiryDate);
                                    return (
                                        <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(item.type)}
                                                <span className="font-medium text-gray-800">{item.type}</span>
                                            </div>
                                            <span className={`text-sm font-medium ${
                                                days !== null && days <= 0 ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                                {days !== null && days <= 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days left`}
                                            </span>
                                        </div>
                                    );
                                })}
                                {urgentComplianceItems.length > 3 && (
                                    <p className="text-sm text-red-600">+{urgentComplianceItems.length - 3} more items</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={complianceStatusFilter}
                            onChange={e => setComplianceStatusFilter(e.target.value as ComplianceStatus | 'all')}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Compliant">Compliant</option>
                            <option value="Pending">Pending</option>
                            <option value="Non-Compliant">Non-Compliant</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>

                    {/* Compliance Items List */}
                    {filteredCompliance.length > 0 ? (
                        <div className="space-y-4">
                            {filteredCompliance.map(item => (
                                <ComplianceCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                            <ShieldCheck size={48} className="mx-auto text-gray-300 mb-3" />
                            {complianceItems.length === 0 ? (
                                <>
                                    <p className="text-lg font-medium text-gray-500">No compliance items recorded</p>
                                    <p className="text-sm text-gray-400 mt-1">Add compliance certificates to track expiry dates</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-medium text-gray-500">No items match your filter</p>
                                    <button
                                        onClick={() => setComplianceStatusFilter('all')}
                                        className="mt-3 text-sm text-ivolve-mid hover:underline"
                                    >
                                        Clear filter
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RepairsComplianceTab;
