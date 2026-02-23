import React, { useState } from 'react';
import {
    User, Calendar, Phone, Mail, CreditCard, FileText, Shield,
    Edit2, Eye, EyeOff, Users, AlertCircle
} from 'lucide-react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../../../types/tabs';
import StatusBadge from '../../shared/StatusBadge';

interface PersonalDetailsTabProps {
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
    sensitive?: boolean;
}> = ({ label, value, icon, sensitive = false }) => {
    const [isRevealed, setIsRevealed] = useState(false);

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

    const displayValue = sensitive && !isRevealed ? '••••••••' : value;

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{displayValue}</span>
                {sensitive && (
                    <button
                        onClick={() => setIsRevealed(!isRevealed)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={isRevealed ? 'Hide' : 'Reveal'}
                    >
                        {isRevealed ? (
                            <EyeOff size={14} className="text-gray-400" />
                        ) : (
                            <Eye size={14} className="text-gray-400" />
                        )}
                    </button>
                )}
            </div>
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

// Emergency contact card component
const EmergencyContactCard: React.FC<{
    contact: { id: string; name: string; relationship: string; phone: string; email?: string; isPrimary?: boolean };
}> = ({ contact }) => (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-start justify-between mb-2">
            <div>
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.relationship}</p>
            </div>
            {contact.isPrimary && (
                <span className="px-2 py-1 bg-ivolve-mid/10 text-ivolve-mid text-xs font-medium rounded-full">
                    Primary
                </span>
            )}
        </div>
        <div className="space-y-1">
            <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-ivolve-mid transition-colors"
            >
                <Phone size={12} />
                {contact.phone}
            </a>
            {contact.email && (
                <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-ivolve-mid transition-colors"
                >
                    <Mail size={12} />
                    {contact.email}
                </a>
            )}
        </div>
    </div>
);

const PersonalDetailsTab: React.FC<PersonalDetailsTabProps> = ({ person, borderColor = 'border-gray-200' }) => {
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
    const formattedDob = person.personal.dateOfBirth
        ? new Date(person.personal.dateOfBirth).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : undefined;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage personal information for {person.personal.firstName} {person.personal.lastName}
                </p>
            </div>

            {/* Basic Information */}
            <SectionCard
                title="Basic Information"
                icon={<User size={16} className="text-ivolve-mid" />}
                borderColor={borderColor}
            >
                <div>
                    <DetailRow
                        label="Title"
                        value={person.personal.title}
                        icon={<User size={14} className="text-gray-400" />}
                    />
                    <DetailRow
                        label="First Name"
                        value={person.personal.firstName}
                    />
                    <DetailRow
                        label="Last Name"
                        value={person.personal.lastName}
                    />
                    <DetailRow
                        label="Preferred Name"
                        value={person.personal.preferredName}
                    />
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Occupant Type</span>
                        </div>
                        <StatusBadge status={person.personal.occupantType} size="sm" />
                    </div>
                </div>
            </SectionCard>

            {/* Date of Birth & Age */}
            <SectionCard
                title="Date of Birth & Age"
                icon={<Calendar size={16} className="text-ivolve-mid" />}
                borderColor={borderColor}
            >
                <div>
                    <DetailRow
                        label="Date of Birth"
                        value={formattedDob}
                        icon={<Calendar size={14} className="text-gray-400" />}
                    />
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Age</span>
                        </div>
                        <span className="text-sm text-gray-900">
                            {age !== null ? `${age} years old` : 'Not calculated'}
                        </span>
                    </div>
                </div>
            </SectionCard>

            {/* Contact Details */}
            <SectionCard
                title="Contact Details"
                icon={<Phone size={16} className="text-ivolve-mid" />}
                borderColor={borderColor}
            >
                <div>
                    <DetailRow
                        label="Phone"
                        value={person.personal.phone}
                        icon={<Phone size={14} className="text-gray-400" />}
                    />
                    <DetailRow
                        label="Mobile"
                        value={person.personal.mobile}
                        icon={<Phone size={14} className="text-gray-400" />}
                    />
                    <DetailRow
                        label="Email"
                        value={person.personal.email}
                        icon={<Mail size={14} className="text-gray-400" />}
                    />
                </div>
            </SectionCard>

            {/* National Insurance Number */}
            <SectionCard
                title="National Insurance Number"
                icon={<CreditCard size={16} className="text-ivolve-mid" />}
                borderColor={borderColor}
            >
                <div className="space-y-3">
                    <DetailRow
                        label="NI Number"
                        value={person.personal.niNumber}
                        icon={<Shield size={14} className="text-gray-400" />}
                        sensitive={true}
                    />
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle size={14} className="text-amber-600 mt-0.5" />
                        <p className="text-xs text-amber-800">
                            Sensitive information. This data should be encrypted at rest and in transit.
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Emergency Contacts */}
            <SectionCard
                title="Emergency Contacts"
                icon={<Users size={16} className="text-ivolve-mid" />}
                editButton={true}
                borderColor={borderColor}
            >
                {person.emergencyContacts && person.emergencyContacts.length > 0 ? (
                    <div className="space-y-3">
                        {person.emergencyContacts.map((contact) => (
                            <EmergencyContactCard key={contact.id} contact={contact} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Users size={32} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">No emergency contacts recorded</p>
                        <p className="text-xs mt-1">Add emergency contacts for this person</p>
                        <button className="mt-4 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors text-sm font-medium">
                            Add Emergency Contact
                        </button>
                    </div>
                )}
            </SectionCard>

            {/* Data Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Data Privacy Notice</h4>
                        <p className="text-xs text-blue-800">
                            All personal information is stored securely and handled in accordance with GDPR and
                            data protection regulations. Access to this information is logged and audited.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsTab;
