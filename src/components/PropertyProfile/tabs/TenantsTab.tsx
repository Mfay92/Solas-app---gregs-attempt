import React, { useState, useMemo } from 'react';
import {
    Users, User, Phone, Mail, Calendar, Home, Heart,
    Clock, ChevronRight, X, AlertCircle, Search
} from 'lucide-react';
import { PropertyAsset, Tenant, TenancyStatus } from '../../../types';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
}

// Status colors for tenants
const statusColors: Record<TenancyStatus, string> = {
    'Current': 'bg-green-100 text-green-700',
    'Former': 'bg-gray-100 text-gray-500',
    'Pending': 'bg-amber-100 text-amber-700'
};

// Tenant card component
const TenantCard: React.FC<{
    tenant: Tenant;
    unitAddress?: string;
    onClick: () => void;
}> = ({ tenant, unitAddress, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-ivolve-mid/30 transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ivolve-light to-ivolve-mid flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {tenant.photo ? (
                        <img src={tenant.photo} alt={tenant.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        (tenant.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('').slice(0, 2).toUpperCase() || '?'
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-ivolve-mid transition-colors">
                                {tenant.name}
                            </h3>
                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[tenant.status]}`}>
                                {tenant.status}
                            </span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-ivolve-mid transition-colors flex-shrink-0" />
                    </div>

                    {/* Unit info */}
                    {unitAddress && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <Home size={14} />
                            <span className="truncate">{unitAddress}</span>
                        </div>
                    )}

                    {/* Key dates */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {tenant.moveInDate && (
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Moved in: {formatDate(tenant.moveInDate)}
                            </span>
                        )}
                        {tenant.status === 'Former' && tenant.moveOutDate && (
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Moved out: {formatDate(tenant.moveOutDate)}
                            </span>
                        )}
                    </div>

                    {/* Support info */}
                    {tenant.supportProvider && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-ivolve-mid">
                            <Heart size={12} />
                            {tenant.supportProvider}
                            {tenant.careHours && ` (${tenant.careHours}h/week)`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Tenant detail panel
const TenantDetailPanel: React.FC<{
    tenant: Tenant;
    unitAddress?: string;
    onClose: () => void;
}> = ({ tenant, unitAddress, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40" />
            <div
                className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ivolve-light to-ivolve-mid flex items-center justify-center text-white text-2xl font-bold">
                                {tenant.photo ? (
                                    <img src={tenant.photo} alt={tenant.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    (tenant.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('').slice(0, 2).toUpperCase() || '?'
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{tenant.name}</h2>
                                <span className={`inline-block mt-1 px-2.5 py-1 text-sm font-medium rounded-full ${statusColors[tenant.status]}`}>
                                    {tenant.status} Tenant
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Unit */}
                    {unitAddress && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <Home size={16} />
                                Unit
                            </div>
                            <p className="font-medium text-gray-800">{unitAddress}</p>
                        </div>
                    )}

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            {tenant.phone && (
                                <a
                                    href={`tel:${tenant.phone}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-ivolve-mid/10 transition-colors"
                                >
                                    <Phone size={18} className="text-ivolve-mid" />
                                    <span className="text-gray-800">{tenant.phone}</span>
                                </a>
                            )}
                            {tenant.email && (
                                <a
                                    href={`mailto:${tenant.email}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-ivolve-mid/10 transition-colors"
                                >
                                    <Mail size={18} className="text-ivolve-mid" />
                                    <span className="text-gray-800">{tenant.email}</span>
                                </a>
                            )}
                            {tenant.dateOfBirth && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar size={18} className="text-gray-400" />
                                    <div>
                                        <span className="text-xs text-gray-500">Date of Birth</span>
                                        <p className="text-gray-800">{formatDate(tenant.dateOfBirth)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tenancy Dates */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Tenancy Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {tenant.moveInDate && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500">Move In Date</span>
                                    <p className="font-medium text-gray-800">{formatDate(tenant.moveInDate)}</p>
                                </div>
                            )}
                            {tenant.moveOutDate && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500">Move Out Date</span>
                                    <p className="font-medium text-gray-800">{formatDate(tenant.moveOutDate)}</p>
                                </div>
                            )}
                            {tenant.rentAmount !== undefined && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500">Rent Amount</span>
                                    <p className="font-medium text-gray-800">£{tenant.rentAmount.toLocaleString()}/month</p>
                                </div>
                            )}
                            {tenant.housingBenefit !== undefined && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500">Housing Benefit</span>
                                    <p className="font-medium text-gray-800">{tenant.housingBenefit ? 'Yes' : 'No'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support Information */}
                    {(tenant.supportProvider || tenant.careHours) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Support Information
                            </h3>
                            <div className="bg-ivolve-mid/5 border border-ivolve-mid/20 rounded-xl p-4 space-y-3">
                                {tenant.supportProvider && (
                                    <div className="flex items-center gap-3">
                                        <Heart size={18} className="text-ivolve-mid" />
                                        <div>
                                            <span className="text-xs text-gray-500">Support Provider</span>
                                            <p className="font-medium text-gray-800">{tenant.supportProvider}</p>
                                        </div>
                                    </div>
                                )}
                                {tenant.careHours && (
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-ivolve-mid" />
                                        <div>
                                            <span className="text-xs text-gray-500">Care Hours</span>
                                            <p className="font-medium text-gray-800">{tenant.careHours} hours/week</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Emergency Contact */}
                    {tenant.emergencyContact && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Emergency Contact
                            </h3>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="font-medium text-gray-800">{tenant.emergencyContact.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{tenant.emergencyContact.relationship}</p>
                                <a
                                    href={`tel:${tenant.emergencyContact.phone}`}
                                    className="inline-flex items-center gap-2 text-red-600 hover:underline"
                                >
                                    <Phone size={14} />
                                    {tenant.emergencyContact.phone}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {tenant.notes && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Notes
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{tenant.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TenantsTab: React.FC<TabProps> = ({ asset, units = [] }) => {
    const [statusFilter, setStatusFilter] = useState<'all' | TenancyStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    // Collect all tenants from asset and units
    const allTenants = useMemo(() => {
        const tenants: Array<{ tenant: Tenant; unitAddress?: string }> = [];

        // Add tenants from main asset
        if (asset.tenants) {
            asset.tenants.forEach(t => {
                tenants.push({ tenant: t, unitAddress: asset.address });
            });
        }

        // Add tenants from units
        units.forEach(unit => {
            if (unit.tenants) {
                unit.tenants.forEach(t => {
                    tenants.push({ tenant: t, unitAddress: unit.address });
                });
            }
        });

        return tenants;
    }, [asset, units]);

    // Count by status
    const counts = useMemo(() => ({
        all: allTenants.length,
        Current: allTenants.filter(t => t.tenant.status === 'Current').length,
        Former: allTenants.filter(t => t.tenant.status === 'Former').length,
        Pending: allTenants.filter(t => t.tenant.status === 'Pending').length
    }), [allTenants]);

    // Filter tenants
    const filteredTenants = useMemo(() => {
        let result = [...allTenants];

        if (statusFilter !== 'all') {
            result = result.filter(t => t.tenant.status === statusFilter);
        }

        if (searchQuery) {
            const query = (searchQuery ?? '').toLowerCase();
            result = result.filter(t =>
                (t.tenant.name ?? '').toLowerCase().includes(query) ||
                (t.unitAddress ?? '').toLowerCase().includes(query)
            );
        }

        // Sort: Current first, then by name
        result.sort((a, b) => {
            const statusOrder = { 'Current': 0, 'Pending': 1, 'Former': 2 };
            const statusDiff = statusOrder[a.tenant.status] - statusOrder[b.tenant.status];
            if (statusDiff !== 0) return statusDiff;
            return a.tenant.name.localeCompare(b.tenant.name);
        });

        return result;
    }, [allTenants, statusFilter, searchQuery]);

    // Get unit address for selected tenant
    const selectedTenantUnit = selectedTenant
        ? allTenants.find(t => t.tenant.id === selectedTenant.id)?.unitAddress
        : undefined;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-ivolve-mid" />
                        Tenants & Residents
                        <span className="text-sm font-normal text-gray-500">({allTenants.length} total)</span>
                    </h2>
                </div>

                {/* Status filter tabs */}
                <div className="flex items-center gap-2">
                    {(['all', 'Current', 'Pending', 'Former'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                statusFilter === status
                                    ? 'bg-ivolve-mid text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'all' ? 'All' : status} ({counts[status]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search tenants by name or unit..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                />
            </div>

            {/* Tenant Grid */}
            {filteredTenants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTenants.map(({ tenant, unitAddress }) => (
                        <TenantCard
                            key={tenant.id}
                            tenant={tenant}
                            unitAddress={unitAddress}
                            onClick={() => setSelectedTenant(tenant)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <User size={48} className="mx-auto text-gray-300 mb-3" />
                    {allTenants.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No tenants recorded</p>
                            <p className="text-sm text-gray-400 mt-1">Tenant information will appear here once added</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No tenants match your search</p>
                            <button
                                onClick={() => {
                                    setStatusFilter('all');
                                    setSearchQuery('');
                                }}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Clear filters
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Tenant Detail Panel */}
            {selectedTenant && (
                <TenantDetailPanel
                    tenant={selectedTenant}
                    unitAddress={selectedTenantUnit}
                    onClose={() => setSelectedTenant(null)}
                />
            )}
        </div>
    );
};

export default TenantsTab;
