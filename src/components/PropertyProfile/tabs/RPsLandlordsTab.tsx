import React from 'react';
import {
    FileText, Phone, Mail, Building,
    ExternalLink, MapPin, Users
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';
import { TabId } from '../TabNavigation';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
    onJumpToTab?: (tabId: TabId) => void;
}

// Contact card component
const ContactCard: React.FC<{
    title: string;
    name: string | undefined;
    company?: string;
    role?: string;
    phone?: string;
    email?: string;
    address?: string;
}> = ({ title, name, company, role, phone, email, address }) => {
    if (!name) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <div className="text-center py-6 text-gray-400">
                    <Building size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No {title.toLowerCase()} information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                <div>
                    <p className="text-lg font-medium text-gray-800">{name}</p>
                    {company && <p className="text-sm text-gray-500">{company}</p>}
                    {role && <p className="text-sm text-gray-500">{role}</p>}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-ivolve-mid transition-colors"
                        >
                            <Phone size={16} className="text-gray-400" />
                            {phone}
                        </a>
                    )}
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-ivolve-mid transition-colors"
                        >
                            <Mail size={16} className="text-gray-400" />
                            {email}
                        </a>
                    )}
                    {address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-gray-400 mt-0.5" />
                            <span>{address}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RPsLandlordsTab: React.FC<TabProps> = ({ asset, onJumpToTab }) => {
    return (
        <div className="space-y-6">
            {/* Registered Provider Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Users size={20} className="text-ivolve-mid" />
                    Registered Provider (RP)
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-lg font-bold text-gray-800">{asset.registeredProvider}</p>
                            {asset.contractType && (
                                <StatusBadge status={asset.contractType} className="mt-2" />
                            )}
                        </div>
                    </div>

                    {asset.rpContact && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RP Contact
                            </p>
                            <p className="text-sm font-medium text-gray-800">{asset.rpContact.name}</p>
                            {asset.rpContact.role && (
                                <p className="text-sm text-gray-500">{asset.rpContact.role}</p>
                            )}
                            {asset.rpContact.company && (
                                <p className="text-sm text-gray-500">{asset.rpContact.company}</p>
                            )}

                            <div className="flex flex-wrap gap-4 pt-2">
                                {asset.rpContact.phone && (
                                    <a
                                        href={`tel:${asset.rpContact.phone}`}
                                        className="flex items-center gap-2 text-sm text-ivolve-mid hover:underline"
                                    >
                                        <Phone size={14} />
                                        {asset.rpContact.phone}
                                    </a>
                                )}
                                {asset.rpContact.email && (
                                    <a
                                        href={`mailto:${asset.rpContact.email}`}
                                        className="flex items-center gap-2 text-sm text-ivolve-mid hover:underline"
                                    >
                                        <Mail size={14} />
                                        {asset.rpContact.email}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {asset.referralProcess && (
                        <div className="mt-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Referral Process
                            </p>
                            <p className="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg">
                                {asset.referralProcess}
                            </p>
                        </div>
                    )}

                    {!asset.rpContact && !asset.referralProcess && (
                        <div className="text-center py-6 text-gray-400">
                            <p className="text-sm">No additional RP details available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Service Level Agreement Quick Info */}
            {asset.sla && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FileText size={20} className="text-ivolve-mid" />
                            SLA Overview
                        </h2>
                        <button
                            onClick={() => onJumpToTab?.('legal')}
                            className="text-sm text-ivolve-mid hover:underline flex items-center gap-1"
                        >
                            View Full Details
                            <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">RP Name</p>
                            <p className="text-sm font-medium text-gray-800 mt-1">{asset.sla.rpName}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Contract Type</p>
                            <p className="text-sm font-medium text-gray-800 mt-1">
                                {asset.sla.isRolling ? 'Rolling' : 'Fixed Term'}
                            </p>
                        </div>
                        {asset.sla.weeklyRate && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Rate</p>
                                <p className="text-sm font-bold text-ivolve-mid mt-1">
                                    £{asset.sla.weeklyRate.toLocaleString()}
                                </p>
                            </div>
                        )}
                        {asset.sla.reviewDate && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Next Review</p>
                                <p className="text-sm font-medium text-gray-800 mt-1">
                                    {formatDate(asset.sla.reviewDate)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Landlord and Superior Landlord */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ContactCard
                    title="Landlord"
                    name={asset.landlordContact?.name || asset.landlord}
                    company={asset.landlordContact?.company}
                    role={asset.landlordContact?.role}
                    phone={asset.landlordContact?.phone}
                    email={asset.landlordContact?.email}
                    address={asset.landlordContact?.address}
                />

                <ContactCard
                    title="Superior Landlord"
                    name={asset.superiorLandlord?.name}
                    company={asset.superiorLandlord?.company}
                    phone={asset.superiorLandlord?.phone}
                    email={asset.superiorLandlord?.email}
                    address={asset.superiorLandlord?.address}
                />
            </div>

            {/* Ownership Structure */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Building size={20} className="text-ivolve-mid" />
                    Ownership Structure
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {asset.owner && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">Property Owner</span>
                            <span className="text-sm font-medium text-gray-700">{asset.owner}</span>
                        </div>
                    )}
                    {asset.ivolveEntity && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">ivolve Entity</span>
                            <span className="text-sm font-medium text-gray-700">{asset.ivolveEntity}</span>
                        </div>
                    )}
                    {asset.riaEntity && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">RIA Entity</span>
                            <span className="text-sm font-medium text-gray-700">{asset.riaEntity}</span>
                        </div>
                    )}
                    {asset.responsibleIndividual && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">Responsible Individual</span>
                            <span className="text-sm font-medium text-gray-700">{asset.responsibleIndividual}</span>
                        </div>
                    )}
                    {asset.fieldplay && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">Fieldplay</span>
                            <span className="text-sm font-medium text-gray-700">{asset.fieldplay}</span>
                        </div>
                    )}

                    {!asset.owner && !asset.ivolveEntity && !asset.riaEntity && !asset.responsibleIndividual && (
                        <div className="col-span-2 text-center py-6 text-gray-400">
                            <Building size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No ownership details available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* External Contacts */}
            {asset.externalContacts && asset.externalContacts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-ivolve-mid" />
                        Other External Contacts
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {asset.externalContacts.map((contact) => (
                            <div key={contact.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <StatusBadge status={contact.type} size="sm" />
                                    {contact.isPrimary && (
                                        <span className="text-xs bg-ivolve-mid/10 text-ivolve-mid px-2 py-0.5 rounded">
                                            Primary
                                        </span>
                                    )}
                                </div>
                                <p className="font-medium text-gray-800">{contact.name}</p>
                                {contact.company && (
                                    <p className="text-sm text-gray-500">{contact.company}</p>
                                )}
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {contact.phone && (
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="flex items-center gap-1 text-sm text-ivolve-mid hover:underline"
                                        >
                                            <Phone size={12} />
                                            {contact.phone}
                                        </a>
                                    )}
                                    {contact.email && (
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="flex items-center gap-1 text-sm text-ivolve-mid hover:underline"
                                        >
                                            <Mail size={12} />
                                            {contact.email}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RPsLandlordsTab;
