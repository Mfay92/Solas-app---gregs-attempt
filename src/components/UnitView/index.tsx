import React, { useState } from 'react';
import {
    X, Bed, User, Phone, Mail, Calendar, Home, Clock, CheckCircle,
    AlertCircle, Wrench, PoundSterling, ShieldCheck, History, FileText
} from 'lucide-react';
import { PropertyAsset, Tenant } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { formatDate } from '../../utils';

interface UnitViewProps {
    unit: PropertyAsset;
    parentProperty: PropertyAsset;
    tenant?: Tenant;
    onClose: () => void;
}

type TabId = 'overview' | 'occupant' | 'history' | 'maintenance' | 'finance';

const UnitView: React.FC<UnitViewProps> = ({ unit, parentProperty, tenant, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    // Calculate void duration
    const getVoidDays = (): number | null => {
        if (unit.status !== 'Void' || !unit.statusDate) return null;
        const statusDate = new Date(unit.statusDate);
        const now = new Date();
        return Math.ceil((now.getTime() - statusDate.getTime()) / (1000 * 60 * 60 * 24));
    };

    const voidDays = getVoidDays();

    // Get unit identifier
    const getUnitIdentifier = (): string => {
        const unitAddress = (unit.address ?? '').toLowerCase();

        if (unitAddress.includes('room')) {
            const match = unit.address.match(/room\s*\d+/i);
            if (match?.[0]) return match[0];
        }
        if (unitAddress.includes('bedroom')) {
            const match = unit.address.match(/bedroom\s*\d+/i);
            if (match?.[0]) return match[0];
        }
        if (unitAddress.includes('flat')) {
            const match = unit.address.match(/flat\s*[a-z0-9]+/i);
            if (match?.[0]) return match[0];
        }

        return (unit.address ?? '').replace(parentProperty.address ?? '', '').trim() || unit.address || 'Unknown';
    };

    const unitName = getUnitIdentifier();

    // Mock occupancy history
    const occupancyHistory = [
        ...(tenant ? [{
            id: tenant.id,
            name: tenant.name,
            moveInDate: tenant.moveInDate,
            moveOutDate: null,
            status: 'Current' as const
        }] : []),
        {
            id: 'hist_1',
            name: 'Sarah Thompson',
            moveInDate: '2023-01-15',
            moveOutDate: '2024-02-28',
            status: 'Former' as const
        },
        {
            id: 'hist_2',
            name: 'Michael Davies',
            moveInDate: '2021-06-01',
            moveOutDate: '2022-12-31',
            status: 'Former' as const
        }
    ];

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: Home },
        { id: 'occupant' as const, label: 'Occupant', icon: User },
        { id: 'history' as const, label: 'History', icon: History },
        { id: 'maintenance' as const, label: 'Maintenance', icon: Wrench },
        { id: 'finance' as const, label: 'Finance', icon: PoundSterling }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid text-white p-6 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Bed size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{unitName}</h2>
                            <p className="text-white/80 text-sm mb-2">{parentProperty.address}</p>
                            <StatusBadge status={unit.status} size="md" />
                            {unit.status === 'Void' && voidDays !== null && (
                                <div className="mt-2 text-sm bg-white/20 rounded px-2 py-1 inline-flex items-center gap-1">
                                    <Clock size={14} />
                                    Void for {voidDays} day{voidDays !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 px-6">
                    <div className="flex gap-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                                        activeTab === tab.id
                                            ? 'border-ivolve-mid text-ivolve-mid bg-white'
                                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Status Card */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Home size={18} className="text-ivolve-mid" />
                                        <span className="text-sm font-semibold text-gray-600">Unit Status</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">{unit.status}</p>
                                    {unit.statusDate && (
                                        <p className="text-xs text-gray-500 mt-1">Since {formatDate(unit.statusDate)}</p>
                                    )}
                                </div>

                                {/* Unit Type */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Bed size={18} className="text-ivolve-mid" />
                                        <span className="text-sm font-semibold text-gray-600">Unit Type</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">{unit.unitType || 'Not specified'}</p>
                                </div>

                                {/* Compliance Status */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck size={18} className="text-ivolve-mid" />
                                        <span className="text-sm font-semibold text-gray-600">Compliance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {unit.complianceStatus === 'Compliant' ? (
                                            <>
                                                <CheckCircle size={18} className="text-green-500" />
                                                <span className="text-lg font-bold text-green-600">Compliant</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={18} className="text-amber-500" />
                                                <span className="text-lg font-bold text-amber-600">{unit.complianceStatus || 'Unknown'}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Unit Details */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Unit Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Address</span>
                                        <p className="font-medium text-gray-800">{unit.address}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Postcode</span>
                                        <p className="font-medium text-gray-800">{unit.postcode}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Service Type</span>
                                        <p className="font-medium text-gray-800">{unit.serviceType}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Housing Manager</span>
                                        <p className="font-medium text-gray-800">{unit.housingManager}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <button className="px-4 py-3 bg-ivolve-mid text-white rounded-lg font-medium hover:bg-ivolve-dark transition-colors">
                                        {tenant ? 'Change Occupant' : 'Assign Occupant'}
                                    </button>
                                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                        Record Void
                                    </button>
                                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                        Add Maintenance
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Occupant Tab */}
                    {activeTab === 'occupant' && (
                        <div className="space-y-6">
                            {tenant ? (
                                <>
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ivolve-light to-ivolve-mid flex items-center justify-center text-white text-2xl font-bold">
                                                {tenant.photo ? (
                                                    <img src={tenant.photo} alt={tenant.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    (tenant.name || '').split(' ').filter(Boolean).map(n => n[0] || '').join('').slice(0, 2).toUpperCase() || '?'
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-800">{tenant.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Current Occupant</p>
                                                {tenant.moveInDate && (
                                                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Moved in: {formatDate(tenant.moveInDate)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Contact Information */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Contact</h4>
                                                <div className="space-y-3">
                                                    {tenant.phone && (
                                                        <a href={`tel:${tenant.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-ivolve-mid/10 transition-colors">
                                                            <Phone size={18} className="text-ivolve-mid" />
                                                            <span className="text-gray-800">{tenant.phone}</span>
                                                        </a>
                                                    )}
                                                    {tenant.email && (
                                                        <a href={`mailto:${tenant.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-ivolve-mid/10 transition-colors">
                                                            <Mail size={18} className="text-ivolve-mid" />
                                                            <span className="text-gray-800">{tenant.email}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Support Information */}
                                            {(tenant.supportProvider || tenant.careHours) && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Support</h4>
                                                    <div className="bg-ivolve-mid/5 border border-ivolve-mid/20 rounded-lg p-4 space-y-2">
                                                        {tenant.supportProvider && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">Provider</span>
                                                                <p className="font-medium text-gray-800">{tenant.supportProvider}</p>
                                                            </div>
                                                        )}
                                                        {tenant.careHours && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">Care Hours</span>
                                                                <p className="font-medium text-gray-800">{tenant.careHours} hours/week</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Emergency Contact */}
                                        {tenant.emergencyContact && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Emergency Contact</h4>
                                                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertCircle size={16} className="text-red-500" />
                                                        <span className="font-medium text-gray-800">{tenant.emergencyContact.name}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{tenant.emergencyContact.relationship}</p>
                                                    <a href={`tel:${tenant.emergencyContact.phone}`} className="inline-flex items-center gap-2 text-red-600 hover:underline">
                                                        <Phone size={14} />
                                                        {tenant.emergencyContact.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-12 text-center">
                                    <User size={64} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Current Occupant</h3>
                                    <p className="text-gray-500 mb-6">This unit is currently vacant</p>
                                    <button className="px-6 py-3 bg-ivolve-mid text-white rounded-lg font-medium hover:bg-ivolve-dark transition-colors">
                                        Assign Occupant
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">Occupancy History</h3>
                            {occupancyHistory.map(record => (
                                <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ivolve-light to-ivolve-mid flex items-center justify-center text-white text-sm font-bold">
                                                {record.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{record.name}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                    {record.moveInDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={13} />
                                                            In: {formatDate(record.moveInDate)}
                                                        </span>
                                                    )}
                                                    {record.moveOutDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={13} />
                                                            Out: {formatDate(record.moveOutDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                            record.status === 'Current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Maintenance Tab */}
                    {activeTab === 'maintenance' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Maintenance Log</h3>
                                <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg font-medium hover:bg-ivolve-dark transition-colors text-sm">
                                    Add Maintenance
                                </button>
                            </div>

                            {unit.repairs && unit.repairs.length > 0 ? (
                                <div className="space-y-3">
                                    {unit.repairs.map(repair => (
                                        <div key={repair.id} className="bg-white border border-gray-200 rounded-xl p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800">{repair.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{repair.description}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-3 ${
                                                    repair.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    repair.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {repair.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Reported: {formatDate(repair.reportedDate)}</span>
                                                {repair.category && <span>Category: {repair.category}</span>}
                                                {repair.priority && (
                                                    <span className={`font-medium ${
                                                        repair.priority === 'Emergency' ? 'text-red-600' :
                                                        repair.priority === 'Urgent' ? 'text-amber-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {repair.priority}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-12 text-center">
                                    <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">No maintenance records</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Finance Tab */}
                    {activeTab === 'finance' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800">Financial Information</h3>

                            {tenant && tenant.rentAmount ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <PoundSterling size={18} className="text-ivolve-mid" />
                                            <span className="text-sm font-semibold text-gray-600">Rent</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">£{tenant.rentAmount}</p>
                                        <p className="text-xs text-gray-500 mt-1">per week</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={18} className="text-ivolve-mid" />
                                            <span className="text-sm font-semibold text-gray-600">Housing Benefit</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{tenant.housingBenefit ? 'Yes' : 'No'}</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={18} className="text-green-500" />
                                            <span className="text-sm font-semibold text-gray-600">Balance</span>
                                        </div>
                                        <p className="text-lg font-bold text-green-600">£0.00</p>
                                        <p className="text-xs text-gray-500 mt-1">No arrears</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-12 text-center">
                                    <PoundSterling size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">No financial data available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnitView;
