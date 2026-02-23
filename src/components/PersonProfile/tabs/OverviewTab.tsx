import React from 'react';
import {
    User, Calendar, MapPin, Home, Heart, Users, PoundSterling,
    Phone, Mail, Clock, AlertCircle, ArrowRight, TrendingUp
} from 'lucide-react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../../../types/tabs';
import StatusBadge from '../../shared/StatusBadge';

interface OverviewTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Quick stat card component
const QuickStat: React.FC<{
    label: string;
    value: string | number;
    subtext?: string;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void;
}> = ({ label, value, subtext, icon, color = 'bg-gray-50', onClick }) => (
    <div
        className={`p-4 rounded-xl ${color} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-ivolve-mid/20 transition-all' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

// Info row component
const InfoRow: React.FC<{
    label: string;
    value: string | undefined;
    icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{value}</span>
        </div>
    );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ person, onJumpToTab, borderColor = 'border-gray-200' }) => {
    // Calculate age
    const calculateAge = (dob?: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(person.personal.dateOfBirth);
    const displayName = `${person.personal.firstName} ${person.personal.lastName}`;

    // Calculate tenancy duration
    const getTenancyDuration = () => {
        if (!person.tenancy.moveInDate) return null;
        const moveIn = new Date(person.tenancy.moveInDate);
        const today = new Date();
        const months = (today.getFullYear() - moveIn.getFullYear()) * 12 + (today.getMonth() - moveIn.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
        }
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    const tenancyDuration = getTenancyDuration();

    // Format currency
    const formatCurrency = (amount?: number) => {
        if (amount === undefined) return 'Not set';
        return `£${amount.toFixed(2)}`;
    };

    // Calculate arrears status
    const currentBalance = person.finance.currentBalance || 0;
    const hasArrears = currentBalance < 0;
    const arrearsAmount = hasArrears ? Math.abs(currentBalance) : 0;

    return (
        <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat
                    label="Tenancy Status"
                    value={person.tenancy.tenancyStatus}
                    icon={<Home size={18} className="text-ivolve-mid" />}
                    color="bg-ivolve-mid/5"
                    onClick={() => onJumpToTab('tenancy')}
                />

                <QuickStat
                    label="Support Level"
                    value={person.support.supportLevel || 'Not set'}
                    subtext={person.support.careHours ? `${person.support.careHours} hrs/week` : undefined}
                    icon={<Heart size={18} className="text-rose-500" />}
                    color="bg-rose-50"
                    onClick={() => onJumpToTab('support')}
                />

                <QuickStat
                    label="Rent Status"
                    value={hasArrears ? `£${arrearsAmount.toFixed(2)} arrears` : 'Up to date'}
                    subtext={person.finance.rentAmount ? `£${person.finance.rentAmount}/week` : undefined}
                    icon={<PoundSterling size={18} className={hasArrears ? 'text-amber-500' : 'text-green-500'} />}
                    color={hasArrears ? 'bg-amber-50' : 'bg-green-50'}
                    onClick={() => onJumpToTab('finance')}
                />

                <QuickStat
                    label="Tenancy Length"
                    value={tenancyDuration || 'N/A'}
                    icon={<Clock size={18} className="text-gray-500" />}
                    color="bg-gray-50"
                    onClick={() => onJumpToTab('tenancy')}
                />
            </div>

            {/* Personal Summary & Current Tenancy Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Personal Summary */}
                <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-4`}>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={16} className="text-ivolve-mid" />
                        Personal Summary
                    </h3>

                    <div className="space-y-3">
                        <InfoRow
                            label="Full Name"
                            value={displayName}
                            icon={<User size={14} className="text-gray-400" />}
                        />
                        {person.personal.preferredName && (
                            <InfoRow
                                label="Preferred Name"
                                value={person.personal.preferredName}
                            />
                        )}
                        <InfoRow
                            label="Age"
                            value={age ? `${age} years old` : undefined}
                            icon={<Calendar size={14} className="text-gray-400" />}
                        />
                        <InfoRow
                            label="Date of Birth"
                            value={person.personal.dateOfBirth ? new Date(person.personal.dateOfBirth).toLocaleDateString('en-GB') : undefined}
                        />
                        <InfoRow
                            label="Phone"
                            value={person.personal.phone || person.personal.mobile}
                            icon={<Phone size={14} className="text-gray-400" />}
                        />
                        <InfoRow
                            label="Email"
                            value={person.personal.email}
                            icon={<Mail size={14} className="text-gray-400" />}
                        />
                    </div>

                    <button
                        onClick={() => onJumpToTab('personal-details')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        View Full Details
                        <ArrowRight size={14} />
                    </button>
                </div>

                {/* Current Tenancy */}
                <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-4`}>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Home size={16} className="text-ivolve-mid" />
                        Current Tenancy
                    </h3>

                    <div className="space-y-3">
                        <InfoRow
                            label="Property"
                            value={person.tenancy.propertyAddress}
                            icon={<MapPin size={14} className="text-gray-400" />}
                        />
                        {person.tenancy.room && (
                            <InfoRow
                                label="Room"
                                value={person.tenancy.room}
                            />
                        )}
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Tenancy Type</span>
                            <StatusBadge status={person.tenancy.tenancyType} size="sm" />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Status</span>
                            <StatusBadge status={person.tenancy.tenancyStatus} size="sm" />
                        </div>
                        <InfoRow
                            label="Move In Date"
                            value={person.tenancy.moveInDate ? new Date(person.tenancy.moveInDate).toLocaleDateString('en-GB') : undefined}
                        />
                        {person.tenancy.moveOutDate && (
                            <InfoRow
                                label="Move Out Date"
                                value={new Date(person.tenancy.moveOutDate).toLocaleDateString('en-GB')}
                            />
                        )}
                    </div>

                    <button
                        onClick={() => onJumpToTab('tenancy')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        View Tenancy Details
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Support Overview & Finance Snapshot Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Support Overview */}
                <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-4`}>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Heart size={16} className="text-ivolve-mid" />
                        Support Overview
                    </h3>

                    <div className="space-y-3">
                        <InfoRow
                            label="Care Provider"
                            value={person.support.careProvider}
                            icon={<Heart size={14} className="text-gray-400" />}
                        />
                        <InfoRow
                            label="Social Worker"
                            value={person.support.socialWorker}
                            icon={<Users size={14} className="text-gray-400" />}
                        />
                        <InfoRow
                            label="Key Worker"
                            value={person.support.keyWorker}
                        />
                        <InfoRow
                            label="Support Level"
                            value={person.support.supportLevel}
                        />
                        <InfoRow
                            label="Care Hours"
                            value={person.support.careHours ? `${person.support.careHours} hours/week` : undefined}
                        />
                    </div>

                    {!person.support.careProvider && !person.support.socialWorker && (
                        <div className="text-center py-6 text-gray-400">
                            <Heart size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No support information recorded</p>
                        </div>
                    )}

                    <button
                        onClick={() => onJumpToTab('support')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        View Support Details
                        <ArrowRight size={14} />
                    </button>
                </div>

                {/* Finance Snapshot */}
                <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-4`}>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <PoundSterling size={16} className="text-ivolve-mid" />
                        Finance Snapshot
                    </h3>

                    <div className="space-y-3">
                        <InfoRow
                            label="Rent Amount"
                            value={formatCurrency(person.finance.rentAmount)}
                        />
                        <InfoRow
                            label="Service Charge"
                            value={formatCurrency(person.finance.serviceCharge)}
                        />
                        <InfoRow
                            label="Support Charge"
                            value={formatCurrency(person.finance.supportCharge)}
                        />
                        <div className="flex items-center justify-between py-2 border-b border-gray-50 font-semibold">
                            <span className="text-sm text-gray-700">Total Charges</span>
                            <span className="text-sm text-gray-900">{formatCurrency(person.finance.totalCharges)}</span>
                        </div>
                        <div className={`flex items-center justify-between py-2 border-b border-gray-50 font-semibold ${hasArrears ? 'text-amber-600' : 'text-green-600'}`}>
                            <span className="text-sm">Current Balance</span>
                            <span className="text-sm">{formatCurrency(person.finance.currentBalance)}</span>
                        </div>
                        <InfoRow
                            label="Housing Benefit"
                            value={person.finance.housingBenefit ? `Yes - ${formatCurrency(person.finance.housingBenefitAmount)}` : 'No'}
                        />
                        <InfoRow
                            label="Payment Method"
                            value={person.finance.paymentMethod}
                        />
                    </div>

                    {hasArrears && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-800">Arrears</p>
                                    <p className="text-xs text-amber-700">£{arrearsAmount.toFixed(2)} outstanding</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => onJumpToTab('finance')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                    >
                        View Finance Details
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Recent Activity Timeline - Placeholder */}
            <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-5`}>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-ivolve-mid" />
                    Recent Activity
                </h3>

                <div className="text-center py-8 text-gray-400">
                    <Clock size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Activity timeline coming soon</p>
                    <p className="text-xs mt-1">Recent notes, support plans, and key events will appear here</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-ivolve-mid to-ivolve-teal rounded-xl p-6 text-white">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => onJumpToTab('safeguarding')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <AlertCircle size={20} />
                        <span className="text-xs font-medium">Safeguarding</span>
                    </button>
                    <button
                        onClick={() => onJumpToTab('support-plans')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Users size={20} />
                        <span className="text-xs font-medium">Support Plans</span>
                    </button>
                    <button
                        onClick={() => onJumpToTab('documents')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        <span className="text-xs font-medium">Documents</span>
                    </button>
                    <button
                        onClick={() => onJumpToTab('notes')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Mail size={20} />
                        <span className="text-xs font-medium">Notes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
