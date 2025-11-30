import React from 'react';
import {
    Building2, Phone, AlertTriangle, Calendar, FileText,
    Wrench, ShieldCheck, Users, ExternalLink, Leaf, Sparkles,
    MapPin, Home as HomeIcon
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';
import { TabId } from '../TabNavigation';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
    onJumpToTab?: (tabId: TabId) => void;
}

// Responsibility badge component
const ResponsibilityBadge: React.FC<{ value?: string }> = ({ value }) => {
    if (!value) return <span className="text-gray-400">Not set</span>;

    const colors: Record<string, string> = {
        'ivolve': 'bg-ivolve-mid/10 text-ivolve-mid',
        'RP': 'bg-blue-100 text-blue-700',
        'Landlord': 'bg-purple-100 text-purple-700',
        'Tenant': 'bg-amber-100 text-amber-700',
        'Contractor': 'bg-gray-100 text-gray-700'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
            {value}
        </span>
    );
};

// Quick stat card component
const QuickStat: React.FC<{
    label: string;
    value: string | number;
    subtext?: string;
    icon: React.ReactNode;
    color?: string;
    warning?: boolean;
    onClick?: () => void;
}> = ({ label, value, subtext, icon, color = 'bg-gray-50', warning, onClick }) => (
    <div
        className={`p-4 rounded-xl ${color} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-ivolve-mid/20 transition-all' : ''} ${warning ? 'ring-2 ring-amber-300' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <p className={`text-xl font-bold ${warning ? 'text-amber-600' : 'text-gray-900'}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

// Contact row component
const ContactRow: React.FC<{
    role: string;
    name: string | undefined;
    phone?: string;
}> = ({ role, name, phone }) => {
    if (!name) return null;
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ivolve-mid/10 flex items-center justify-center">
                    <Users size={14} className="text-ivolve-mid" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">{role}</p>
                    <p className="text-sm font-medium text-gray-800">{name}</p>
                </div>
            </div>
            {phone && (
                <a
                    href={`tel:${phone}`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Phone size={14} className="text-gray-400 hover:text-ivolve-mid" />
                </a>
            )}
        </div>
    );
};

const ServiceOverviewTab: React.FC<TabProps> = ({ asset, units, onJumpToTab }) => {
    const totalUnits = asset.totalUnits || units.length || 0;
    const occupiedUnits = asset.occupiedUnits || units.filter(u => u.status === 'Occupied').length || 0;
    const occupancyPercent = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    // Calculate days until lease/SLA end
    const getDaysUntil = (dateStr?: string) => {
        if (!dateStr) return null;
        const end = new Date(dateStr);
        const now = new Date();
        return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const leaseEndDays = getDaysUntil(asset.leaseEnd);
    const slaEndDays = asset.sla?.slaEnd ? getDaysUntil(asset.sla.slaEnd) : null;
    const contractEndDays = leaseEndDays ?? slaEndDays;
    const isContractExpiring = contractEndDays !== null && contractEndDays <= 90 && contractEndDays > 0;

    // Compliance summary
    const complianceItems = asset.complianceItems || [];
    const compliantCount = complianceItems.filter(c => c.status === 'Compliant').length;
    const hasComplianceIssues = complianceItems.length > 0 && compliantCount < complianceItems.length;

    // Repairs summary
    const repairs = asset.repairs || [];
    const openRepairsCount = repairs.filter(r => r.status === 'Open' || r.status === 'In Progress').length;

    // Contract info display
    const getContractInfo = () => {
        if (asset.sla?.isRolling) {
            return { type: 'Rolling SLA', endDate: null, daysLeft: null };
        }
        if (asset.sla?.slaEnd) {
            return { type: 'SLA', endDate: asset.sla.slaEnd, daysLeft: slaEndDays };
        }
        if (asset.leaseEnd) {
            return { type: asset.lease?.leaseType || 'Lease', endDate: asset.leaseEnd, daysLeft: leaseEndDays };
        }
        return null;
    };

    const contractInfo = getContractInfo();

    return (
        <div className="space-y-6">
            {/* Row 1: Quick Stats - Snappy at-a-glance info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat
                    label="Occupancy"
                    value={`${occupiedUnits}/${totalUnits}`}
                    subtext={`${occupancyPercent}% occupied`}
                    icon={<Building2 size={18} className="text-ivolve-mid" />}
                    color="bg-ivolve-mid/5"
                    onClick={() => onJumpToTab?.('units-occupancy')}
                />

                <QuickStat
                    label="Compliance"
                    value={complianceItems.length > 0 ? `${compliantCount}/${complianceItems.length}` : 'N/A'}
                    subtext={hasComplianceIssues ? 'Issues found' : 'All compliant'}
                    icon={<ShieldCheck size={18} className={hasComplianceIssues ? 'text-amber-500' : 'text-green-500'} />}
                    color={hasComplianceIssues ? 'bg-amber-50' : 'bg-green-50'}
                    warning={hasComplianceIssues}
                    onClick={() => onJumpToTab?.('repairs-compliance')}
                />

                <QuickStat
                    label="Open Repairs"
                    value={openRepairsCount}
                    subtext={openRepairsCount > 0 ? 'Require attention' : 'All clear'}
                    icon={<Wrench size={18} className={openRepairsCount > 0 ? 'text-amber-500' : 'text-gray-400'} />}
                    color={openRepairsCount > 0 ? 'bg-amber-50' : 'bg-gray-50'}
                    warning={openRepairsCount > 0}
                    onClick={() => onJumpToTab?.('repairs-compliance')}
                />

                <QuickStat
                    label="Contract"
                    value={contractInfo?.type || 'Not set'}
                    subtext={contractInfo?.daysLeft !== null && contractInfo?.daysLeft !== undefined ? `${contractInfo.daysLeft} days left` : (contractInfo?.endDate ? formatDate(contractInfo.endDate) : undefined)}
                    icon={<Calendar size={18} className={isContractExpiring ? 'text-amber-500' : 'text-gray-500'} />}
                    color={isContractExpiring ? 'bg-amber-50' : 'bg-gray-50'}
                    warning={isContractExpiring}
                    onClick={() => onJumpToTab?.('legal')}
                />
            </div>

            {/* Row 2: Service Info + Key Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Service Information */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <HomeIcon size={16} className="text-ivolve-mid" />
                        Service Information
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Service Type</span>
                            <StatusBadge status={asset.serviceType} />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Registered Provider</span>
                            <span className="text-sm font-medium text-gray-800">{asset.registeredProvider}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Region</span>
                            <span className="text-sm font-medium text-gray-800">{asset.region}</span>
                        </div>
                        {asset.unitType && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Unit Type</span>
                                <StatusBadge status={asset.unitType} size="sm" />
                            </div>
                        )}
                        {asset.buildingPhone && (
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-500">Building Phone</span>
                                <a href={`tel:${asset.buildingPhone}`} className="text-sm text-ivolve-mid hover:underline flex items-center gap-1">
                                    <Phone size={12} />
                                    {asset.buildingPhone}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Legal/Contract link */}
                    <button
                        onClick={() => onJumpToTab?.('legal')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        <FileText size={14} />
                        View Lease & SLA Details
                        <ExternalLink size={12} />
                    </button>
                </div>

                {/* Key Contacts */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Users size={16} className="text-ivolve-mid" />
                        Key Contacts
                    </h3>

                    <div className="space-y-1 divide-y divide-gray-50">
                        <ContactRow role="Housing Manager" name={asset.housingManager} />
                        <ContactRow role="Area Manager" name={asset.areaManager} />
                        <ContactRow
                            role="Landlord"
                            name={asset.landlordContact?.name || asset.landlord}
                            phone={asset.landlordContact?.phone}
                        />
                        <ContactRow
                            role="RP Contact"
                            name={asset.rpContact?.name}
                            phone={asset.rpContact?.phone}
                        />
                        {asset.regionalFacilitiesManager && (
                            <ContactRow role="Facilities Manager" name={asset.regionalFacilitiesManager} />
                        )}
                    </div>

                    {!asset.housingManager && !asset.areaManager && !asset.landlordContact && !asset.rpContact && (
                        <div className="text-center py-6 text-gray-400">
                            <Users size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No contacts assigned</p>
                        </div>
                    )}

                    <button
                        onClick={() => onJumpToTab?.('rps-landlords')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        <Users size={14} />
                        View All Contacts
                        <ExternalLink size={12} />
                    </button>
                </div>
            </div>

            {/* Row 3: Key Responsibilities */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wrench size={16} className="text-ivolve-mid" />
                    Key Responsibilities
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Wrench size={20} className="mx-auto mb-2 text-gray-500" />
                        <p className="text-xs text-gray-500 mb-1">General Maintenance</p>
                        <ResponsibilityBadge value={asset.maintenance?.general || asset.maintenanceResponsibility} />
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Leaf size={20} className="mx-auto mb-2 text-green-500" />
                        <p className="text-xs text-gray-500 mb-1">Gardening</p>
                        <ResponsibilityBadge value={asset.maintenance?.gardening || asset.gardeningResponsibility} />
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Sparkles size={20} className="mx-auto mb-2 text-blue-500" />
                        <p className="text-xs text-gray-500 mb-1">Window Cleaning</p>
                        <ResponsibilityBadge value={asset.maintenance?.windowCleaning} />
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <HomeIcon size={20} className="mx-auto mb-2 text-amber-500" />
                        <p className="text-xs text-gray-500 mb-1">Decorating</p>
                        <ResponsibilityBadge value={asset.maintenance?.decorating || asset.features?.decoratingResponsibility} />
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Building2 size={20} className="mx-auto mb-2 text-purple-500" />
                        <p className="text-xs text-gray-500 mb-1">White Goods</p>
                        <ResponsibilityBadge value={asset.maintenance?.whiteGoods} />
                    </div>
                </div>

                <button
                    onClick={() => onJumpToTab?.('property-details')}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                >
                    <Building2 size={14} />
                    View Property Details
                    <ExternalLink size={12} />
                </button>
            </div>

            {/* Row 4: Alerts/Action Items (if any) */}
            {(isContractExpiring || hasComplianceIssues || openRepairsCount > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Action Required
                    </h3>

                    <div className="space-y-2">
                        {isContractExpiring && (
                            <div
                                className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors"
                                onClick={() => onJumpToTab?.('legal')}
                            >
                                <Calendar size={18} className="text-amber-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        {contractInfo?.type} expires in {contractEndDays} days
                                    </p>
                                    <p className="text-xs text-gray-500">Review and renew before {contractInfo?.endDate ? formatDate(contractInfo.endDate) : 'N/A'}</p>
                                </div>
                                <ExternalLink size={14} className="text-gray-400" />
                            </div>
                        )}

                        {hasComplianceIssues && (
                            <div
                                className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors"
                                onClick={() => onJumpToTab?.('repairs-compliance')}
                            >
                                <ShieldCheck size={18} className="text-amber-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        {complianceItems.length - compliantCount} compliance item(s) need attention
                                    </p>
                                    <p className="text-xs text-gray-500">Review and update compliance records</p>
                                </div>
                                <ExternalLink size={14} className="text-gray-400" />
                            </div>
                        )}

                        {openRepairsCount > 0 && (
                            <div
                                className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors"
                                onClick={() => onJumpToTab?.('repairs-compliance')}
                            >
                                <Wrench size={18} className="text-amber-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                        {openRepairsCount} open repair(s)
                                    </p>
                                    <p className="text-xs text-gray-500">Track progress and update status</p>
                                </div>
                                <ExternalLink size={14} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Location info */}
            {asset.coordinates && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin size={16} className="text-ivolve-mid" />
                        Location
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{asset.address}, {asset.postcode}</span>
                    </div>
                    {asset.coordinates && (
                        <p className="text-xs text-gray-400 mt-1">
                            {asset.coordinates.lat.toFixed(6)}, {asset.coordinates.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceOverviewTab;
