import React, { useState } from 'react';
import {
    Building2, Bed, User, Phone, Mail,
    ShieldCheck, Wrench, X, ChevronRight, Grid, List,
    AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { PropertyAsset, Tenant } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
    onSelectUnit?: (unit: PropertyAsset) => void;
}

// Get unit identifier from address (e.g., "Room 1", "Flat A")
const getUnitIdentifier = (unit: PropertyAsset, parent: PropertyAsset): string => {
    // Try to extract the unit part from the address
    const unitAddress = (unit.address ?? '').toLowerCase();

    if (unitAddress.includes('room')) {
        const match = unit.address.match(/room\s*\d+/i);
        if (match?.[0]) return match[0];
    }
    if (unitAddress.includes('flat')) {
        const match = unit.address.match(/flat\s*[a-z0-9]+/i);
        if (match?.[0]) return match[0];
    }
    if (unitAddress.includes('unit')) {
        const match = unit.address.match(/unit\s*\d+/i);
        if (match?.[0]) return match[0];
    }
    if (unitAddress.includes('bed')) {
        const match = unit.address.match(/bed\s*\d+/i);
        if (match?.[0]) return match[0];
    }

    // Fallback: return the difference or full address
    return (unit.address ?? '').replace(parent.address ?? '', '').trim() || unit.address || 'Unknown';
};

// Calculate void duration in days
const getVoidDays = (unit: PropertyAsset): number | null => {
    if (unit.status !== 'Void' || !unit.statusDate) return null;
    const statusDate = new Date(unit.statusDate);
    const now = new Date();
    return Math.ceil((now.getTime() - statusDate.getTime()) / (1000 * 60 * 60 * 24));
};

// Get tenant for a unit
const getTenantForUnit = (unit: PropertyAsset, tenants: Tenant[]): Tenant | undefined => {
    return tenants.find(t => t.unitId === unit.id && t.status === 'Current');
};

// Occupancy progress bar
const OccupancyBar: React.FC<{ occupied: number; total: number }> = ({ occupied, total }) => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Occupancy</span>
                <span className="font-medium text-gray-800">{occupied} of {total} occupied</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        percentage === 0 ? 'bg-red-500' :
                        percentage < 50 ? 'bg-amber-500' :
                        percentage < 100 ? 'bg-green-500' :
                        'bg-ivolve-mid'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// Unit card component
const UnitCard: React.FC<{
    unit: PropertyAsset;
    parent: PropertyAsset;
    tenant?: Tenant;
    onClick: () => void;
}> = ({ unit, parent, tenant, onClick }) => {
    const voidDays = getVoidDays(unit);
    const unitName = getUnitIdentifier(unit, parent);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-ivolve-mid/30 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        unit.status === 'Occupied' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                        <Bed size={20} className={
                            unit.status === 'Occupied' ? 'text-green-600' : 'text-amber-600'
                        } />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{unitName}</p>
                        <StatusBadge status={unit.status} size="sm" />
                    </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
            </div>

            {unit.unitType && (
                <div className="mb-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {unit.unitType}
                    </span>
                </div>
            )}

            {unit.status === 'Void' && voidDays !== null && (
                <div className={`text-xs mb-3 ${
                    voidDays > 60 ? 'text-red-600' : voidDays > 30 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                    <Clock size={12} className="inline mr-1" />
                    Void for {voidDays} days
                </div>
            )}

            {tenant && (
                <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-ivolve-mid/10 flex items-center justify-center">
                            <User size={14} className="text-ivolve-mid" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{tenant.name}</p>
                            {tenant.moveInDate && (
                                <p className="text-xs text-gray-500">
                                    Since {formatDate(tenant.moveInDate)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick compliance indicator */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                    {unit.complianceStatus === 'Compliant' ? (
                        <>
                            <CheckCircle size={12} className="text-green-500" />
                            <span className="text-green-600">Compliant</span>
                        </>
                    ) : unit.complianceStatus === 'Pending' ? (
                        <>
                            <Clock size={12} className="text-amber-500" />
                            <span className="text-amber-600">Pending</span>
                        </>
                    ) : unit.complianceStatus ? (
                        <>
                            <AlertCircle size={12} className="text-red-500" />
                            <span className="text-red-600">Issues</span>
                        </>
                    ) : (
                        <span className="text-gray-400">No data</span>
                    )}
                </div>

                {unit.repairs && unit.repairs.filter(r => r.status === 'Open' || r.status === 'In Progress').length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Wrench size={12} />
                        <span>{unit.repairs.filter(r => r.status === 'Open' || r.status === 'In Progress').length} repairs</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Unit detail modal/panel
const UnitDetailPanel: React.FC<{
    unit: PropertyAsset;
    parent: PropertyAsset;
    tenant?: Tenant;
    onClose: () => void;
    onViewProfile?: () => void;
}> = ({ unit, parent, tenant, onClose, onViewProfile }) => {
    const voidDays = getVoidDays(unit);
    const unitName = getUnitIdentifier(unit, parent);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl animate-slide-in-right"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{unitName}</h2>
                        <p className="text-sm text-gray-500">{unit.address}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Status Section */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <StatusBadge status={unit.status} size="md" />
                            {unit.unitType && (
                                <span className="text-xs px-2 py-1 bg-white text-gray-600 rounded border">
                                    {unit.unitType}
                                </span>
                            )}
                        </div>
                        {unit.status === 'Void' && voidDays !== null && (
                            <div className={`text-sm ${
                                voidDays > 60 ? 'text-red-600' : voidDays > 30 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                                Void since {formatDate(unit.statusDate)} ({voidDays} days)
                            </div>
                        )}
                    </div>

                    {/* Tenant Details */}
                    {tenant ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                Current Tenant
                            </h3>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-ivolve-mid/10 flex items-center justify-center">
                                    <User size={20} className="text-ivolve-mid" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{tenant.name}</p>
                                    {tenant.moveInDate && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Move-in: {formatDate(tenant.moveInDate)}
                                        </p>
                                    )}
                                    {tenant.supportProvider && (
                                        <p className="text-sm text-gray-500">
                                            Support: {tenant.supportProvider}
                                        </p>
                                    )}
                                    {tenant.careHours && (
                                        <p className="text-sm text-gray-500">
                                            Care hours: {tenant.careHours}/week
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                {tenant.phone && (
                                    <a
                                        href={`tel:${tenant.phone}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-ivolve-mid"
                                    >
                                        <Phone size={14} />
                                        {tenant.phone}
                                    </a>
                                )}
                                {tenant.email && (
                                    <a
                                        href={`mailto:${tenant.email}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-ivolve-mid"
                                    >
                                        <Mail size={14} />
                                        {tenant.email}
                                    </a>
                                )}
                            </div>

                            {/* Emergency contact */}
                            {tenant.emergencyContact && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Emergency Contact
                                    </p>
                                    <p className="text-sm text-gray-700">{tenant.emergencyContact.name}</p>
                                    <p className="text-xs text-gray-500">{tenant.emergencyContact.relationship}</p>
                                    <a
                                        href={`tel:${tenant.emergencyContact.phone}`}
                                        className="flex items-center gap-1 text-sm text-ivolve-mid mt-1"
                                    >
                                        <Phone size={12} />
                                        {tenant.emergencyContact.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <User size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No current tenant</p>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck size={16} className="text-ivolve-mid" />
                                <span className="text-xs font-medium text-gray-500">Compliance</span>
                            </div>
                            {unit.complianceItems?.length ? (
                                <p className="text-sm font-semibold text-gray-800">
                                    {unit.complianceItems.filter(c => c.status === 'Compliant').length} of {unit.complianceItems.length} items
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400">No data</p>
                            )}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Wrench size={16} className="text-ivolve-mid" />
                                <span className="text-xs font-medium text-gray-500">Repairs</span>
                            </div>
                            {unit.repairs?.length ? (
                                <p className="text-sm font-semibold text-gray-800">
                                    {unit.repairs.filter(r => r.status === 'Open' || r.status === 'In Progress').length} open
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400">None</p>
                            )}
                        </div>
                    </div>

                    {/* View Full Profile Button */}
                    {onViewProfile && (
                        <button
                            onClick={onViewProfile}
                            className="w-full py-3 bg-ivolve-mid text-white rounded-lg font-medium hover:bg-ivolve-dark transition-colors"
                        >
                            View Full Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const UnitsTab: React.FC<TabProps> = ({ asset, units, onSelectUnit }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Occupied' | 'Void'>('all');
    const [selectedUnit, setSelectedUnit] = useState<PropertyAsset | null>(null);

    // Get all tenants from the asset
    const allTenants = asset.tenants || [];

    // Filter units
    const filteredUnits = units.filter(unit => {
        if (statusFilter === 'all') return true;
        return unit.status === statusFilter;
    });

    // Stats
    const occupiedCount = units.filter(u => u.status === 'Occupied').length;
    const voidCount = units.filter(u => u.status === 'Void').length;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Building2 size={20} className="text-ivolve-mid" />
                        Units at {asset.address}
                    </h2>
                    <button
                        disabled
                        className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                        title="Coming soon"
                    >
                        + Add Unit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{units.length}</p>
                        <p className="text-xs text-gray-500">Total Units</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{occupiedCount}</p>
                        <p className="text-xs text-green-600">Occupied</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{voidCount}</p>
                        <p className="text-xs text-amber-600">Void</p>
                    </div>
                </div>

                <OccupancyBar occupied={occupiedCount} total={units.length} />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            statusFilter === 'all'
                                ? 'bg-ivolve-mid text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All ({units.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('Occupied')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            statusFilter === 'Occupied'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Occupied ({occupiedCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('Void')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            statusFilter === 'Void'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Void ({voidCount})
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Grid size={16} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                    >
                        <List size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Units Grid/List */}
            {filteredUnits.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUnits.map(unit => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                parent={asset}
                                tenant={getTenantForUnit(unit, allTenants)}
                                onClick={() => setSelectedUnit(unit)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Unit</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tenant</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Move-in</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Compliance</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUnits.map(unit => {
                                    const tenant = getTenantForUnit(unit, allTenants);
                                    const voidDays = getVoidDays(unit);
                                    return (
                                        <tr
                                            key={unit.id}
                                            onClick={() => setSelectedUnit(unit)}
                                            className="hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Bed size={16} className={
                                                        unit.status === 'Occupied' ? 'text-green-500' : 'text-amber-500'
                                                    } />
                                                    <span className="font-medium text-gray-800">
                                                        {getUnitIdentifier(unit, asset)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={unit.status} size="sm" />
                                                {voidDays !== null && (
                                                    <span className="ml-2 text-xs text-gray-500">({voidDays}d)</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {tenant?.name || <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {tenant?.moveInDate ? formatDate(tenant.moveInDate) : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {unit.complianceStatus === 'Compliant' ? (
                                                    <CheckCircle size={16} className="text-green-500" />
                                                ) : unit.complianceStatus ? (
                                                    <AlertCircle size={16} className="text-amber-500" />
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
                    {units.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No units configured</p>
                            <p className="text-sm text-gray-400 mt-1">This is a standalone property without units</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No units match your filter</p>
                            <button
                                onClick={() => setStatusFilter('all')}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Show all units
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Unit Detail Panel */}
            {selectedUnit && (
                <UnitDetailPanel
                    unit={selectedUnit}
                    parent={asset}
                    tenant={getTenantForUnit(selectedUnit, allTenants)}
                    onClose={() => setSelectedUnit(null)}
                    onViewProfile={onSelectUnit ? () => {
                        onSelectUnit(selectedUnit);
                        setSelectedUnit(null);
                    } : undefined}
                />
            )}
        </div>
    );
};

export default UnitsTab;
