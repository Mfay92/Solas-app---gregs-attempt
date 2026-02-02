import React from 'react';
import {
    Home, MapPin, Calendar, Clock, FileText, Edit2,
    ArrowRight, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';
import StatusBadge from '../../shared/StatusBadge';

interface TenancyTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Detail row component
const DetailRow: React.FC<{
    label: string;
    value: string | undefined;
    icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
    if (!value) {
        return (
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <span className="text-sm text-gray-400 italic">Not provided</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <span className="text-sm text-gray-900">{value}</span>
        </div>
    );
};

// Section card component
const SectionCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    editButton?: boolean;
    borderColor?: string;
}> = ({ title, icon, children, editButton = true, borderColor = 'border-gray-200' }) => (
    <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-5`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                {icon}
                {title}
            </h3>
            {editButton && (
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 size={14} className="text-gray-400" />
                </button>
            )}
        </div>
        {children}
    </div>
);

// Timeline event component
const TimelineEvent: React.FC<{
    date: string;
    title: string;
    description?: string;
    icon: React.ReactNode;
    iconColor: string;
    isLast?: boolean;
}> = ({ date, title, description, icon, iconColor, isLast = false }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center text-white`}>
                {icon}
            </div>
            {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>}
        </div>
        <div className="flex-1 pb-8">
            <p className="text-xs text-gray-500 mb-1">{new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
        </div>
    </div>
);

const TenancyTab: React.FC<TenancyTabProps> = ({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }) => {
    // Calculate tenancy duration
    const getTenancyDuration = () => {
        if (!person.tenancy.moveInDate) return null;
        const moveIn = new Date(person.tenancy.moveInDate);
        const endDate = person.tenancy.moveOutDate ? new Date(person.tenancy.moveOutDate) : new Date();
        const months = (endDate.getFullYear() - moveIn.getFullYear()) * 12 + (endDate.getMonth() - moveIn.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
        }
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    const tenancyDuration = getTenancyDuration();

    // Format dates
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return undefined;
        return new Date(dateStr).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Determine tenancy status color
    const getStatusIcon = () => {
        switch (person.tenancy.tenancyStatus) {
            case 'Current':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'Former':
                return <XCircle size={16} className="text-gray-600" />;
            case 'Pending':
                return <AlertCircle size={16} className="text-amber-600" />;
            default:
                return <AlertCircle size={16} className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Tenancy Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Current and historical tenancy details for {person.personal.firstName} {person.personal.lastName}
                </p>
            </div>

            {/* Tenancy Status Banner */}
            <div className={`rounded-xl p-5 ${
                person.tenancy.tenancyStatus === 'Current' ? 'bg-green-50 border border-green-200' :
                person.tenancy.tenancyStatus === 'Former' ? 'bg-gray-50 border border-gray-200' :
                'bg-amber-50 border border-amber-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Tenancy Status</p>
                            <StatusBadge status={person.tenancy.tenancyStatus} />
                        </div>
                    </div>
                    {tenancyDuration && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">{tenancyDuration}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Property Information & Unit Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Information */}
                <SectionCard
                    title="Property Information"
                    icon={<Home size={16} className="text-ivolve-mid" />}
                    editButton={false}
                    borderColor={borderColor}
                >
                    <div>
                        <DetailRow
                            label="Address"
                            value={person.tenancy.propertyAddress}
                            icon={<MapPin size={14} className="text-gray-400" />}
                        />
                        {person.tenancy.room && (
                            <DetailRow
                                label="Room/Unit"
                                value={person.tenancy.room}
                                icon={<Home size={14} className="text-gray-400" />}
                            />
                        )}
                        <div className="pt-3">
                            <button
                                onClick={() => {
                                    // This would typically navigate to the property profile
                                    console.log('Navigate to property:', person.tenancy.propertyId);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-ivolve-mid/5 hover:bg-ivolve-mid/10 rounded-lg text-sm text-ivolve-mid font-medium transition-colors"
                            >
                                View Property Profile
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </SectionCard>

                {/* Unit Details */}
                <SectionCard
                    title="Unit Details"
                    icon={<FileText size={16} className="text-ivolve-mid" />}
                    editButton={false}
                    borderColor={borderColor}
                >
                    <div>
                        <DetailRow
                            label="Unit ID"
                            value={person.tenancy.unitId}
                        />
                        <DetailRow
                            label="Room"
                            value={person.tenancy.room}
                        />
                        {!person.tenancy.unitId && !person.tenancy.room && (
                            <div className="text-center py-6 text-gray-400">
                                <Home size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No unit-specific details recorded</p>
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Tenancy Details */}
            <SectionCard
                title="Tenancy Details"
                icon={<FileText size={16} className="text-ivolve-mid" />}
                borderColor={borderColor}
            >
                <div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Tenancy Type</span>
                        </div>
                        <StatusBadge status={person.tenancy.tenancyType} size="sm" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Status</span>
                        </div>
                        <StatusBadge status={person.tenancy.tenancyStatus} size="sm" />
                    </div>
                    <DetailRow
                        label="Move In Date"
                        value={formatDate(person.tenancy.moveInDate)}
                        icon={<Calendar size={14} className="text-gray-400" />}
                    />
                    {person.tenancy.moveOutDate && (
                        <DetailRow
                            label="Move Out Date"
                            value={formatDate(person.tenancy.moveOutDate)}
                            icon={<Calendar size={14} className="text-gray-400" />}
                        />
                    )}
                    {tenancyDuration && (
                        <DetailRow
                            label="Total Duration"
                            value={tenancyDuration}
                            icon={<Clock size={14} className="text-gray-400" />}
                        />
                    )}
                </div>
            </SectionCard>

            {/* Tenancy Timeline */}
            <SectionCard
                title="Tenancy Timeline"
                icon={<Clock size={16} className="text-ivolve-mid" />}
                editButton={false}
                borderColor={borderColor}
            >
                <div className="mt-4">
                    {person.tenancy.moveInDate ? (
                        <div>
                            {person.tenancy.moveOutDate ? (
                                <>
                                    <TimelineEvent
                                        date={person.tenancy.moveInDate}
                                        title="Tenancy Started"
                                        description={`Moved into ${person.tenancy.propertyAddress}`}
                                        icon={<Home size={18} />}
                                        iconColor="bg-green-500"
                                    />
                                    <TimelineEvent
                                        date={person.tenancy.moveOutDate}
                                        title="Tenancy Ended"
                                        description="Moved out of property"
                                        icon={<XCircle size={18} />}
                                        iconColor="bg-gray-500"
                                        isLast={true}
                                    />
                                </>
                            ) : (
                                <TimelineEvent
                                    date={person.tenancy.moveInDate}
                                    title="Tenancy Started"
                                    description={`Currently residing at ${person.tenancy.propertyAddress}`}
                                    icon={<Home size={18} />}
                                    iconColor="bg-green-500"
                                    isLast={true}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Clock size={32} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium">No tenancy events recorded</p>
                            <p className="text-xs mt-1">Tenancy timeline will appear here once dates are added</p>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => onJumpToTab('finance')}
                    className={`flex items-center justify-between p-4 bg-white border-2 ${borderColor} rounded-xl hover:border-ivolve-mid hover:shadow-md transition-all`}
                >
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">View Finance</p>
                        <p className="text-xs text-gray-500">Rent & payments</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-400" />
                </button>

                <button
                    onClick={() => onJumpToTab('documents')}
                    className={`flex items-center justify-between p-4 bg-white border-2 ${borderColor} rounded-xl hover:border-ivolve-mid hover:shadow-md transition-all`}
                >
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Documents</p>
                        <p className="text-xs text-gray-500">Tenancy agreement</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-400" />
                </button>

                <button
                    onClick={() => onJumpToTab('notes')}
                    className={`flex items-center justify-between p-4 bg-white border-2 ${borderColor} rounded-xl hover:border-ivolve-mid hover:shadow-md transition-all`}
                >
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Notes</p>
                        <p className="text-xs text-gray-500">Tenancy notes</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-400" />
                </button>
            </div>

            {/* Info Notice */}
            {person.tenancy.tenancyStatus === 'Current' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Current Tenancy</h4>
                            <p className="text-xs text-blue-800">
                                This person is currently a tenant. To end the tenancy, add a move-out date and update the status.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenancyTab;
