import { useState } from 'react';
import {
    Building2, Phone, AlertTriangle, Calendar,
    Wrench, ShieldCheck, Users, Home, Zap, Car, TreePine, Thermometer
} from 'lucide-react';
import { PropertyAsset, ComplianceItem, Repair } from '../../../types';
import { CollapsibleCard } from '../shared/CollapsibleCard';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';
import { TabId } from '../TabNavigation';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
    onJumpToTab?: (tabId: TabId) => void;
}

// Circular progress component for occupancy
const OccupancyRing: React.FC<{ occupied: number; total: number }> = ({ occupied, total }) => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage === 0) return '#ef4444'; // red
        if (percentage < 50) return '#f59e0b'; // amber
        if (percentage < 100) return '#22c55e'; // green
        return '#008c67'; // ivolve-mid
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke={getColor()}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">{occupied}/{total}</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500">Units Occupied</p>
                <p className="text-lg font-semibold text-gray-800">{Math.round(percentage)}%</p>
            </div>
        </div>
    );
};

// Compact occupancy indicator for collapsed state
const CompactOccupancy: React.FC<{ occupied: number; total: number }> = ({ occupied, total }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{occupied}/{total}</span>
            <div className="flex gap-0.5">
                {Array.from({ length: Math.min(total, 10) }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                            i < occupied ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    />
                ))}
                {total > 10 && <span className="text-xs text-gray-400">...</span>}
            </div>
        </div>
    );
};

// Priority badge for repairs
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const colors: Record<string, string> = {
        'Emergency': 'bg-red-100 text-red-700',
        'Urgent': 'bg-amber-100 text-amber-700',
        'Routine': 'bg-blue-100 text-blue-700',
        'Planned': 'bg-gray-100 text-gray-600'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority] || colors['Planned']}`}>
            {priority}
        </span>
    );
};

// Contact quick view item
const ContactItem: React.FC<{
    role: string;
    name: string | undefined;
    phone?: string;
}> = ({ role, name, phone }) => {
    if (!name) return null;
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-ivolve-mid/10 flex items-center justify-center">
                <Users size={18} className="text-ivolve-mid" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{role}</p>
                <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
            </div>
            {phone && (
                <a
                    href={`tel:${phone}`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={`Call ${phone}`}
                >
                    <Phone size={16} className="text-gray-400 hover:text-ivolve-mid" />
                </a>
            )}
        </div>
    );
};

const OverviewTab: React.FC<TabProps> = ({ asset, units, onJumpToTab }) => {
    // Paired section expanded states - cards in same row expand together
    const [expandedPairs, setExpandedPairs] = useState({
        row1: true,   // Property Details + Key Contacts
        row2: false,  // Occupancy + Lease Overview
        row3: false,  // Compliance + Repairs
        row4: false   // Property Features (standalone)
    });

    const togglePair = (pair: keyof typeof expandedPairs) => {
        setExpandedPairs(prev => ({
            ...prev,
            [pair]: !prev[pair]
        }));
    };

    const totalUnits = asset.totalUnits || units.length || 0;
    const occupiedUnits = asset.occupiedUnits || units.filter(u => u.status === 'Occupied').length || 0;

    // Get compliance summary
    const complianceItems = asset.complianceItems || [];
    const compliantCount = complianceItems.filter(c => c.status === 'Compliant').length;
    const upcomingExpiries = complianceItems
        .filter(c => {
            if (!c.expiryDate) return false;
            const expiry = new Date(c.expiryDate);
            const now = new Date();
            const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntil > 0 && daysUntil <= 90;
        })
        .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
        .slice(0, 3);

    // Get recent repairs
    const repairs = asset.repairs || [];
    const openRepairsCount = repairs.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
    const recentRepairs = [...repairs]
        .sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime())
        .slice(0, 3);

    // Calculate days until lease end
    const getDaysUntilLeaseEnd = () => {
        if (!asset.leaseEnd) return null;
        const end = new Date(asset.leaseEnd);
        const now = new Date();
        return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };
    const daysUntilLeaseEnd = getDaysUntilLeaseEnd();

    // Compact compliance summary for collapsed state
    const CompactCompliance = () => (
        <div className="flex items-center gap-2">
            {asset.complianceStatus && <StatusBadge status={asset.complianceStatus} size="sm" />}
            {complianceItems.length > 0 && (
                <span className="text-sm text-gray-500">
                    {compliantCount}/{complianceItems.length} compliant
                </span>
            )}
        </div>
    );

    // Compact repairs summary for collapsed state
    const CompactRepairs = () => (
        <div className="flex items-center gap-2">
            {openRepairsCount > 0 ? (
                <span className="text-sm text-amber-600 font-medium">
                    {openRepairsCount} open
                </span>
            ) : (
                <span className="text-sm text-gray-500">No open repairs</span>
            )}
        </div>
    );

    // Compact lease summary for collapsed state
    const CompactLease = () => (
        <div className="flex items-center gap-2">
            {asset.lease?.leaseType && <StatusBadge status={asset.lease.leaseType} size="sm" />}
            {asset.lease?.rentPA && (
                <span className="text-sm text-gray-600">
                    £{asset.lease.rentPA.toLocaleString()} PA
                </span>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Row 1: Property Details + Key Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CollapsibleCard
                    title="Property Details"
                    icon={<Building2 size={20} />}
                    isExpanded={expandedPairs.row1}
                    onToggle={() => togglePair('row1')}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.address}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Postcode</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.postcode}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Region</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.region}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.serviceType}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Property Type</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.propertyType || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.unitType || 'Not specified'}</p>
                        </div>
                        {asset.features?.yearBuilt && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Year Built</p>
                                <p className="text-sm text-gray-700 mt-1">{asset.features.yearBuilt}</p>
                            </div>
                        )}
                        {asset.features?.epcRating && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">EPC Rating</p>
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold mt-1 ${
                                    ['A', 'B'].includes(asset.features.epcRating) ? 'bg-green-100 text-green-700' :
                                    ['C', 'D'].includes(asset.features.epcRating) ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {asset.features.epcRating}
                                </span>
                            </div>
                        )}
                        {asset.buildingPhone && (
                            <div className="col-span-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Building Phone</p>
                                <a href={`tel:${asset.buildingPhone}`} className="text-sm text-ivolve-mid hover:underline mt-1 flex items-center gap-1">
                                    <Phone size={14} />
                                    {asset.buildingPhone}
                                </a>
                            </div>
                        )}
                    </div>
                </CollapsibleCard>

                <CollapsibleCard
                    title="Key Contacts"
                    icon={<Users size={20} />}
                    isExpanded={expandedPairs.row1}
                    onToggle={() => togglePair('row1')}
                >
                    <div className="divide-y divide-gray-50">
                        <ContactItem
                            role="Housing Manager"
                            name={asset.housingManager}
                        />
                        <ContactItem
                            role="Area Manager"
                            name={asset.areaManager}
                        />
                        {asset.landlordContact && (
                            <ContactItem
                                role="Landlord"
                                name={asset.landlordContact.name}
                                phone={asset.landlordContact.phone}
                            />
                        )}
                        {asset.rpContact && (
                            <ContactItem
                                role="RP Contact"
                                name={asset.rpContact.name}
                                phone={asset.rpContact.phone}
                            />
                        )}
                    </div>

                    {!asset.housingManager && !asset.areaManager && !asset.landlordContact && !asset.rpContact && (
                        <div className="text-center py-8 text-gray-400">
                            <Users size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No contacts assigned</p>
                        </div>
                    )}
                </CollapsibleCard>
            </div>

            {/* Row 2: Occupancy + Lease Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CollapsibleCard
                    title="Occupancy"
                    icon={<Building2 size={20} />}
                    isExpanded={expandedPairs.row2}
                    onToggle={() => togglePair('row2')}
                    jumpToTab="units-occupancy"
                    onJumpToTab={onJumpToTab}
                    collapsedContent={<CompactOccupancy occupied={occupiedUnits} total={totalUnits} />}
                >
                    <OccupancyRing occupied={occupiedUnits} total={totalUnits} />

                    {units.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Unit Status</p>
                            <div className="flex flex-wrap gap-2">
                                {units.slice(0, 6).map((unit, idx) => (
                                    <StatusBadge key={unit.id || idx} status={unit.status} size="sm" />
                                ))}
                                {units.length > 6 && (
                                    <span className="text-xs text-gray-500">+{units.length - 6} more</span>
                                )}
                            </div>
                        </div>
                    )}
                </CollapsibleCard>

                <CollapsibleCard
                    title="Lease Overview"
                    icon={<Calendar size={20} />}
                    isExpanded={expandedPairs.row2}
                    onToggle={() => togglePair('row2')}
                    jumpToTab="legal"
                    onJumpToTab={onJumpToTab}
                    collapsedContent={<CompactLease />}
                >
                    {asset.lease || asset.leaseStart ? (
                        <div className="space-y-4">
                            {asset.lease?.leaseType && (
                                <div>
                                    <StatusBadge status={asset.lease.leaseType} size="sm" />
                                </div>
                            )}

                            {asset.lease?.rentPA && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-500">Rent</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        £{asset.lease.rentPA.toLocaleString()} PA
                                        {asset.lease.rentPW && (
                                            <span className="text-gray-400 font-normal"> (£{asset.lease.rentPW}/wk)</span>
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Lease Start</span>
                                    <span className="text-gray-700">{formatDate(asset.leaseStart)}</span>
                                </div>
                                {asset.lease?.rentReviewDate && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Rent Review</span>
                                        <span className="text-gray-700">{formatDate(asset.lease.rentReviewDate)}</span>
                                    </div>
                                )}
                                {asset.lease?.breakClauseDate && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Break Clause</span>
                                        <span className="text-gray-700">{formatDate(asset.lease.breakClauseDate)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Lease End</span>
                                    <span className={`font-medium ${
                                        daysUntilLeaseEnd !== null && daysUntilLeaseEnd <= 90
                                            ? 'text-amber-600'
                                            : 'text-gray-700'
                                    }`}>
                                        {formatDate(asset.leaseEnd)}
                                        {daysUntilLeaseEnd !== null && daysUntilLeaseEnd <= 365 && (
                                            <span className="ml-2 text-xs">
                                                ({daysUntilLeaseEnd > 0 ? `${daysUntilLeaseEnd} days` : 'Expired'})
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {daysUntilLeaseEnd !== null && daysUntilLeaseEnd <= 90 && daysUntilLeaseEnd > 0 && (
                                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700">
                                    <AlertTriangle size={16} />
                                    <span className="text-sm">Lease expires in {daysUntilLeaseEnd} days</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No lease information available</p>
                        </div>
                    )}
                </CollapsibleCard>
            </div>

            {/* Row 3: Compliance + Repairs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CollapsibleCard
                    title="Compliance Status"
                    icon={<ShieldCheck size={20} />}
                    isExpanded={expandedPairs.row3}
                    onToggle={() => togglePair('row3')}
                    jumpToTab="repairs-compliance"
                    onJumpToTab={onJumpToTab}
                    collapsedContent={<CompactCompliance />}
                >
                    {complianceItems.length > 0 ? (
                        <div className="space-y-4">
                            {/* Overall status badge */}
                            <div className="flex items-center justify-between">
                                {asset.complianceStatus && (
                                    <StatusBadge status={asset.complianceStatus} />
                                )}
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Compliant Items</span>
                                    <span className="font-medium text-gray-700">{compliantCount} of {complianceItems.length}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(compliantCount / complianceItems.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Upcoming expiries */}
                            {upcomingExpiries.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Upcoming Expiries
                                    </p>
                                    <div className="space-y-2">
                                        {upcomingExpiries.map((item: ComplianceItem) => (
                                            <div key={item.id} className="flex items-center gap-2 text-sm">
                                                <AlertTriangle size={14} className="text-amber-500" />
                                                <span className="text-gray-700">{item.type}</span>
                                                <span className="text-gray-400">·</span>
                                                <span className="text-amber-600">{formatDate(item.expiryDate)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <ShieldCheck size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No compliance data available</p>
                        </div>
                    )}
                </CollapsibleCard>

                <CollapsibleCard
                    title="Recent Repairs"
                    icon={<Wrench size={20} />}
                    isExpanded={expandedPairs.row3}
                    onToggle={() => togglePair('row3')}
                    jumpToTab="repairs-compliance"
                    onJumpToTab={onJumpToTab}
                    collapsedContent={<CompactRepairs />}
                >
                    {recentRepairs.length > 0 ? (
                        <div className="space-y-3">
                            {recentRepairs.map((repair: Repair) => (
                                <div key={repair.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className={`w-1 h-full self-stretch rounded-full ${
                                        repair.priority === 'Emergency' ? 'bg-red-500' :
                                        repair.priority === 'Urgent' ? 'bg-amber-500' :
                                        repair.priority === 'Routine' ? 'bg-blue-500' :
                                        'bg-gray-300'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <PriorityBadge priority={repair.priority} />
                                            <StatusBadge status={repair.status} size="sm" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 truncate">{repair.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Reported {formatDate(repair.reportedDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Wrench size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No repairs recorded</p>
                        </div>
                    )}
                </CollapsibleCard>
            </div>

            {/* Row 4: Property Features */}
            {asset.features && (
                <CollapsibleCard
                    title="Property Features"
                    icon={<Home size={20} />}
                    isExpanded={expandedPairs.row4}
                    onToggle={() => togglePair('row4')}
                    jumpToTab="property-details"
                    onJumpToTab={onJumpToTab}
                    collapsedContent={
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            {asset.features.bedrooms && <span>{asset.features.bedrooms} beds</span>}
                            {asset.features.bathrooms && <span>{asset.features.bathrooms} baths</span>}
                            {asset.features.epcRating && <span>EPC: {asset.features.epcRating}</span>}
                        </div>
                    }
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {asset.features.bedrooms !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg bg-ivolve-mid/10 flex items-center justify-center">
                                    <Home size={18} className="text-ivolve-mid" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Bedrooms</p>
                                    <p className="font-semibold text-gray-800">{asset.features.bedrooms}</p>
                                </div>
                            </div>
                        )}
                        {asset.features.bathrooms !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Home size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Bathrooms</p>
                                    <p className="font-semibold text-gray-800">{asset.features.bathrooms}</p>
                                </div>
                            </div>
                        )}
                        {asset.features.parking && asset.features.parking !== 'None' && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Car size={18} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Parking</p>
                                    <p className="font-semibold text-gray-800">{asset.features.parking}</p>
                                </div>
                            </div>
                        )}
                        {asset.features.garden && asset.features.garden !== 'None' && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <TreePine size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Garden</p>
                                    <p className="font-semibold text-gray-800">{asset.features.garden}</p>
                                </div>
                            </div>
                        )}
                        {asset.features.heating && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <Thermometer size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Heating</p>
                                    <p className="font-semibold text-gray-800">{asset.features.heating}</p>
                                </div>
                            </div>
                        )}
                        {asset.features.epcRating && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    ['A', 'B'].includes(asset.features.epcRating) ? 'bg-green-100' :
                                    ['C', 'D'].includes(asset.features.epcRating) ? 'bg-amber-100' : 'bg-red-100'
                                }`}>
                                    <Zap size={18} className={
                                        ['A', 'B'].includes(asset.features.epcRating) ? 'text-green-600' :
                                        ['C', 'D'].includes(asset.features.epcRating) ? 'text-amber-600' : 'text-red-600'
                                    } />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">EPC Rating</p>
                                    <p className="font-semibold text-gray-800">{asset.features.epcRating}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Adaptations */}
                    {asset.features.adaptations && asset.features.adaptations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Adaptations</p>
                            <div className="flex flex-wrap gap-2">
                                {asset.features.adaptations.map((adaptation, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-ivolve-mid/10 text-ivolve-mid text-xs rounded-lg">
                                        {adaptation}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amenities */}
                    {asset.features.amenities && asset.features.amenities.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Amenities</p>
                            <div className="flex flex-wrap gap-2">
                                {asset.features.amenities.map((amenity, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CollapsibleCard>
            )}
        </div>
    );
};

export default OverviewTab;
