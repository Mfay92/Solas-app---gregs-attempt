import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, AlertTriangle,
    Flame, Zap, Droplet, FileText, ExternalLink
} from 'lucide-react';
import { PropertyAsset, ComplianceItem, ComplianceStatus } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

// Calculate days until expiry with validation
const getDaysUntil = (dateStr: string | undefined): number | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    // Validate date parsing succeeded
    if (isNaN(date.getTime())) return null;
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// Get icon for compliance type
const getTypeIcon = (type: string | undefined) => {
    const lower = (type ?? '').toLowerCase();
    if (lower.includes('gas')) return <Flame size={18} className="text-orange-500" />;
    if (lower.includes('eicr') || lower.includes('electric')) return <Zap size={18} className="text-yellow-500" />;
    if (lower.includes('legionella') || lower.includes('water')) return <Droplet size={18} className="text-blue-500" />;
    if (lower.includes('fire')) return <AlertTriangle size={18} className="text-red-500" />;
    if (lower.includes('pat')) return <Zap size={18} className="text-purple-500" />;
    return <ShieldCheck size={18} className="text-ivolve-mid" />;
};

// Status colors
const statusColors: Record<ComplianceStatus, { bg: string; text: string; border: string }> = {
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
    const status = statusColors[item.status];
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

                    {item.notes && (
                        <p className="text-sm text-gray-500 mt-2 border-t border-gray-50 pt-2">
                            {item.notes}
                        </p>
                    )}

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

const ComplianceTab: React.FC<TabProps> = ({ asset }) => {
    const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');
    const [showExpiredOnly, setShowExpiredOnly] = useState(false);
    const [showUnitSpecific, setShowUnitSpecific] = useState<'all' | 'property' | 'unit'>('all');

    const complianceItems = asset.complianceItems || [];

    // Calculate stats
    const stats = useMemo(() => {
        const compliant = complianceItems.filter(c => c.status === 'Compliant').length;
        const pending = complianceItems.filter(c => c.status === 'Pending').length;
        const nonCompliant = complianceItems.filter(c => c.status === 'Non-Compliant' || c.status === 'Expired').length;
        const dueSoon = complianceItems.filter(c => {
            const days = getDaysUntil(c.expiryDate);
            return days !== null && days > 0 && days <= 30;
        }).length;

        return { compliant, pending, nonCompliant, dueSoon, total: complianceItems.length };
    }, [complianceItems]);

    // Items expiring within 30 days
    const urgentItems = useMemo(() => {
        return complianceItems.filter(c => {
            const days = getDaysUntil(c.expiryDate);
            return days !== null && days <= 30;
        }).sort((a, b) => {
            const daysA = getDaysUntil(a.expiryDate) || 999;
            const daysB = getDaysUntil(b.expiryDate) || 999;
            return daysA - daysB;
        });
    }, [complianceItems]);

    // Filter items
    const filteredItems = useMemo(() => {
        let result = [...complianceItems];

        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

        if (showExpiredOnly) {
            result = result.filter(c => {
                const days = getDaysUntil(c.expiryDate);
                return days !== null && days <= 0;
            });
        }

        if (showUnitSpecific === 'property') {
            result = result.filter(c => !c.unitSpecific);
        } else if (showUnitSpecific === 'unit') {
            result = result.filter(c => c.unitSpecific);
        }

        // Sort by expiry date
        result.sort((a, b) => {
            const daysA = getDaysUntil(a.expiryDate) || 999;
            const daysB = getDaysUntil(b.expiryDate) || 999;
            return daysA - daysB;
        });

        return result;
    }, [complianceItems, statusFilter, showExpiredOnly, showUnitSpecific]);

    // Overall compliance status
    const overallStatus = useMemo(() => {
        if (stats.nonCompliant > 0) return 'Non-Compliant';
        if (stats.pending > 0) return 'Pending';
        if (stats.compliant === stats.total && stats.total > 0) return 'Compliant';
        return 'Unknown';
    }, [stats]);

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-ivolve-mid" />
                        Compliance Overview
                    </h2>
                    <StatusBadge status={overallStatus} size="md" />
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Compliance Progress</span>
                        <span className="font-medium text-gray-800">
                            {stats.compliant} of {stats.total} items compliant
                        </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                        {stats.compliant > 0 && (
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(stats.compliant / stats.total) * 100}%` }}
                            />
                        )}
                        {stats.pending > 0 && (
                            <div
                                className="h-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                            />
                        )}
                        {stats.nonCompliant > 0 && (
                            <div
                                className="h-full bg-red-500 transition-all duration-500"
                                style={{ width: `${(stats.nonCompliant / stats.total) * 100}%` }}
                            />
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                        <p className="text-xs text-green-600">Compliant</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${stats.pending > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${stats.pending > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                            {stats.pending}
                        </p>
                        <p className={`text-xs ${stats.pending > 0 ? 'text-amber-600' : 'text-gray-500'}`}>Pending</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${stats.nonCompliant > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${stats.nonCompliant > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {stats.nonCompliant}
                        </p>
                        <p className={`text-xs ${stats.nonCompliant > 0 ? 'text-red-600' : 'text-gray-500'}`}>Non-Compliant</p>
                    </div>
                    {stats.dueSoon > 0 && (
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{stats.dueSoon}</p>
                            <p className="text-xs text-orange-600">Due in 30 days</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Urgent Expiries Alert */}
            {urgentItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={20} className="text-red-600" />
                        <h3 className="font-semibold text-red-800">Urgent: Items Expiring Soon</h3>
                    </div>
                    <div className="space-y-2">
                        {urgentItems.slice(0, 3).map(item => {
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
                        {urgentItems.length > 3 && (
                            <p className="text-sm text-red-600">+{urgentItems.length - 3} more items</p>
                        )}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as ComplianceStatus | 'all')}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                >
                    <option value="all">All Statuses</option>
                    <option value="Compliant">Compliant</option>
                    <option value="Pending">Pending</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                    <option value="Expired">Expired</option>
                </select>

                <select
                    value={showUnitSpecific}
                    onChange={e => setShowUnitSpecific(e.target.value as 'all' | 'property' | 'unit')}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                >
                    <option value="all">All Items</option>
                    <option value="property">Property-wide</option>
                    <option value="unit">Unit-specific</option>
                </select>

                <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={showExpiredOnly}
                        onChange={e => setShowExpiredOnly(e.target.checked)}
                        className="rounded border-gray-300 text-ivolve-mid focus:ring-ivolve-mid"
                    />
                    <span>Show expired only</span>
                </label>

                <button
                    disabled
                    className="ml-auto px-3 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                    title="Coming soon"
                >
                    + Add Certificate
                </button>
            </div>

            {/* Compliance Items List */}
            {filteredItems.length > 0 ? (
                <div className="space-y-4">
                    {filteredItems.map(item => (
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
                            <p className="text-lg font-medium text-gray-500">No items match your filters</p>
                            <button
                                onClick={() => {
                                    setStatusFilter('all');
                                    setShowExpiredOnly(false);
                                    setShowUnitSpecific('all');
                                }}
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

export default ComplianceTab;
