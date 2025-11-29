import React from 'react';
import {
    Users, Phone, Mail, Star, AlertTriangle,
    User, Building, Wrench, Zap, Droplet, Shield
} from 'lucide-react';
import { PropertyAsset, ExternalContact, ContactType } from '../../../types';

interface TabProps {
    asset: PropertyAsset;
}

// Get initials from name - safely handles empty/null names
const getInitials = (name: string | undefined | null): string => {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';
};

// Contact type badge colors
const contactTypeColors: Record<ContactType, string> = {
    'Landlord': 'bg-purple-100 text-purple-700',
    'RP Contact': 'bg-blue-100 text-blue-700',
    'Local Authority': 'bg-green-100 text-green-700',
    'Emergency': 'bg-red-100 text-red-700',
    'Utility': 'bg-amber-100 text-amber-700',
    'Contractor': 'bg-gray-100 text-gray-600'
};

// Contact type icons
const getContactIcon = (type: ContactType) => {
    switch (type) {
        case 'Landlord': return <Building size={14} />;
        case 'RP Contact': return <Users size={14} />;
        case 'Local Authority': return <Shield size={14} />;
        case 'Emergency': return <AlertTriangle size={14} />;
        case 'Utility': return <Zap size={14} />;
        case 'Contractor': return <Wrench size={14} />;
        default: return <User size={14} />;
    }
};

// Person card component for ivolve staff
const PersonCard: React.FC<{
    name: string;
    role: string;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
}> = ({ name, role, phone, email, isPrimary }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-ivolve-mid/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-ivolve-mid">
                        {getInitials(name)}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                        {isPrimary && (
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{role}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-xs text-gray-600 hover:bg-ivolve-mid/10 hover:text-ivolve-mid transition-colors"
                            >
                                <Phone size={12} />
                                <span className="truncate max-w-[100px]">{phone}</span>
                            </a>
                        )}
                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-xs text-gray-600 hover:bg-ivolve-mid/10 hover:text-ivolve-mid transition-colors"
                            >
                                <Mail size={12} />
                                <span className="truncate max-w-[120px]">{email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// External contact row component
const ExternalContactRow: React.FC<{
    contact: ExternalContact;
}> = ({ contact }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    contact.type === 'Emergency' ? 'bg-red-100' : 'bg-ivolve-mid/10'
                }`}>
                    <span className={`text-xs font-bold ${
                        contact.type === 'Emergency' ? 'text-red-600' : 'text-ivolve-mid'
                    }`}>
                        {getInitials(contact.name)}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                    {contact.isPrimary && (
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        contactTypeColors[contact.type]
                    }`}>
                        {getContactIcon(contact.type)}
                        {contact.type}
                    </span>
                </div>
                {(contact.company || contact.role) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                        {[contact.role, contact.company].filter(Boolean).join(' · ')}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {contact.phone && (
                    <a
                        href={`tel:${contact.phone}`}
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:border-ivolve-mid hover:bg-ivolve-mid/5 transition-colors"
                        title={`Call ${contact.phone}`}
                    >
                        <Phone size={16} className="text-gray-500" />
                    </a>
                )}
                {contact.email && (
                    <a
                        href={`mailto:${contact.email}`}
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:border-ivolve-mid hover:bg-ivolve-mid/5 transition-colors"
                        title={`Email ${contact.email}`}
                    >
                        <Mail size={16} className="text-gray-500" />
                    </a>
                )}
            </div>
        </div>
    );
};

const PeopleTab: React.FC<TabProps> = ({ asset }) => {
    // Collect all staff members
    const staffMembers = [
        { name: asset.housingManager, role: 'Housing Manager' },
        { name: asset.areaManager, role: 'Area Manager' },
        { name: asset.opsDirector, role: 'Ops Director' },
        { name: asset.responsibleIndividual, role: 'Responsible Individual' },
        { name: asset.regionalFacilitiesManager, role: 'Regional Facilities Manager' },
        { name: asset.facilitiesCoordinator, role: 'Facilities Coordinator' },
    ].filter(s => s.name);

    // Collect all external contacts
    const allExternalContacts: ExternalContact[] = [
        ...(asset.externalContacts || []),
        ...(asset.landlordContact ? [asset.landlordContact] : []),
        ...(asset.rpContact ? [asset.rpContact] : []),
    ];

    // Separate emergency contacts
    const emergencyContacts = allExternalContacts.filter(c => c.type === 'Emergency');
    const otherContacts = allExternalContacts.filter(c => c.type !== 'Emergency');

    // Group other contacts by type
    const contactsByType = otherContacts.reduce((acc, contact) => {
        if (!acc[contact.type]) acc[contact.type] = [];
        acc[contact.type].push(contact);
        return acc;
    }, {} as Record<ContactType, ExternalContact[]>);

    return (
        <div className="space-y-6">
            {/* Emergency Contacts - Show First if Any */}
            {emergencyContacts.length > 0 && (
                <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                    <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-red-600" />
                        Emergency Contacts
                    </h2>
                    <div className="space-y-3">
                        {emergencyContacts.map(contact => (
                            <ExternalContactRow key={contact.id} contact={contact} />
                        ))}
                    </div>
                </div>
            )}

            {/* ivolve Staff */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-ivolve-mid" />
                    ivolve Team
                </h2>

                {staffMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staffMembers.map((staff, idx) => (
                            <PersonCard
                                key={idx}
                                name={staff.name!}
                                role={staff.role}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No ivolve staff assigned</p>
                    </div>
                )}

                {/* Responsibilities */}
                {(asset.maintenanceResponsibility || asset.gardeningResponsibility) && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                            Responsibilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {asset.maintenanceResponsibility && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Wrench size={18} className="text-ivolve-mid" />
                                    <div>
                                        <p className="text-xs text-gray-500">Maintenance</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {asset.maintenanceResponsibility}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {asset.gardeningResponsibility && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Droplet size={18} className="text-ivolve-mid" />
                                    <div>
                                        <p className="text-xs text-gray-500">Gardening</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {asset.gardeningResponsibility}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* External Contacts */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Building size={20} className="text-ivolve-mid" />
                        External Contacts
                    </h2>
                    <button
                        disabled
                        className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                        title="Coming soon"
                    >
                        + Add Contact
                    </button>
                </div>

                {otherContacts.length > 0 ? (
                    <div className="space-y-6">
                        {Object.entries(contactsByType).map(([type, contacts]) => (
                            <div key={type}>
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                    {type}s
                                </h3>
                                <div className="space-y-2">
                                    {contacts.map(contact => (
                                        <ExternalContactRow key={contact.id} contact={contact} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Building size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No external contacts added yet</p>
                        <p className="text-xs mt-1">Add your first contact to keep track of landlords, contractors, and more</p>
                    </div>
                )}
            </div>

            {/* Responsible Individual Details (if CQC registered) */}
            {asset.responsibleIndividual && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-ivolve-mid" />
                        Responsible Individual (CQC)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                            <p className="text-sm text-gray-700 mt-1">{asset.responsibleIndividual}</p>
                        </div>
                        {asset.riaEntity && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">RIA Entity</p>
                                <p className="text-sm text-gray-700 mt-1">{asset.riaEntity}</p>
                            </div>
                        )}
                        {asset.ivolveEntity && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ivolve Entity</p>
                                <p className="text-sm text-gray-700 mt-1">{asset.ivolveEntity}</p>
                            </div>
                        )}
                        {asset.fieldplay && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fieldplay</p>
                                <p className="text-sm text-gray-700 mt-1">{asset.fieldplay}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeopleTab;
