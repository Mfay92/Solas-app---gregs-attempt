import React, { useState } from 'react';
import {
    FileText, Calendar, Phone, Mail, Building,
    ChevronDown, ChevronUp, ExternalLink, MapPin, Landmark
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import StatusBadge from '../../shared/StatusBadge';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
}

// Helper to calculate days until a date
const getDaysUntil = (dateStr: string | undefined): number | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// Date item with warning styling
const DateRow: React.FC<{
    label: string;
    date: string | undefined;
    warnDays?: number;
}> = ({ label, date, warnDays = 180 }) => {
    const daysUntil = getDaysUntil(date);
    const isWarning = daysUntil !== null && daysUntil <= warnDays && daysUntil > 0;
    const isExpired = daysUntil !== null && daysUntil <= 0;

    return (
        <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
            isExpired ? 'bg-red-50' : isWarning ? 'bg-amber-50' : 'bg-gray-50'
        }`}>
            <div className="flex items-center gap-3">
                <Calendar size={16} className={`${
                    isExpired ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-gray-400'
                }`} />
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                    isExpired ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-700'
                }`}>
                    {formatDate(date)}
                </span>
                {isExpired && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                        EXPIRED
                    </span>
                )}
                {isWarning && (
                    <span className="text-xs text-amber-600">
                        ({daysUntil} days)
                    </span>
                )}
            </div>
        </div>
    );
};

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
                    <p className="text-sm">No {(title ?? '').toLowerCase()} information</p>
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

const LeaseRPTab: React.FC<TabProps> = ({ asset }) => {
    const [showSpecialTerms, setShowSpecialTerms] = useState(false);
    const lease = asset.lease;

    // Calculate weekly rent if not provided
    const weeklyRent = lease?.rentPW || (lease?.rentPA ? Math.round(lease.rentPA / 52) : null);

    return (
        <div className="space-y-6">
            {/* Lease Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-ivolve-mid" />
                    Lease Information
                </h2>

                {lease || asset.leaseStart ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Core Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Core Details
                            </h3>

                            {lease?.leaseType && (
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-gray-600">Lease Type</span>
                                    <StatusBadge status={lease.leaseType} />
                                </div>
                            )}

                            {lease?.rentPA && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Rent per Annum</span>
                                    <span className="text-lg font-bold text-gray-800">
                                        £{lease.rentPA.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {weeklyRent && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Rent per Week</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        £{weeklyRent.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {lease?.depositAmount && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Deposit Amount</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        £{lease.depositAmount.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {lease?.depositScheme && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Deposit Scheme</span>
                                    <span className="text-sm text-gray-700">{lease.depositScheme}</span>
                                </div>
                            )}

                            {lease?.noticePeriod && (
                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Notice Period</span>
                                    <span className="text-sm text-gray-700">{lease.noticePeriod}</span>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Key Dates */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Key Dates
                            </h3>

                            <div className="space-y-2">
                                <DateRow label="Lease Start" date={asset.leaseStart} warnDays={0} />
                                {lease?.rentReviewDate && (
                                    <DateRow label="Rent Review" date={lease.rentReviewDate} warnDays={180} />
                                )}
                                {lease?.breakClauseDate && (
                                    <DateRow label="Break Clause" date={lease.breakClauseDate} warnDays={180} />
                                )}
                                <DateRow label="Lease End" date={asset.leaseEnd} warnDays={365} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <FileText size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium text-gray-500">No lease details available</p>
                        <p className="text-sm mt-1">Add lease information to track key dates and terms</p>
                    </div>
                )}

                {/* Special Terms */}
                {lease?.specialTerms && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setShowSpecialTerms(!showSpecialTerms)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Special Terms
                            </h3>
                            {showSpecialTerms ? (
                                <ChevronUp size={18} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={18} className="text-gray-400" />
                            )}
                        </button>
                        {showSpecialTerms && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {lease.specialTerms}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Land Registry */}
                {lease?.registeredAtLandRegistry && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-4 bg-ivolve-mid/5 rounded-lg">
                            <Landmark size={20} className="text-ivolve-mid" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Registered at Land Registry</p>
                                {lease.landRegistryTitle && (
                                    <p className="text-sm text-gray-500">Title: {lease.landRegistryTitle}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* View Lease Document button */}
                {asset.documents?.some(d => d.type === 'Lease') && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors">
                            <FileText size={16} />
                            View Lease Document
                            <ExternalLink size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Registered Provider Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Building size={20} className="text-ivolve-mid" />
                    Registered Provider
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

            {/* Landlord and Ownership */}
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

                {/* Ownership Structure */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ownership Structure</h3>

                    <div className="space-y-3">
                        {asset.owner && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Property Owner</span>
                                <span className="text-sm font-medium text-gray-700">{asset.owner}</span>
                            </div>
                        )}
                        {asset.ivolveEntity && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">ivolve Entity</span>
                                <span className="text-sm font-medium text-gray-700">{asset.ivolveEntity}</span>
                            </div>
                        )}
                        {asset.riaEntity && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">RIA Entity</span>
                                <span className="text-sm font-medium text-gray-700">{asset.riaEntity}</span>
                            </div>
                        )}
                        {asset.responsibleIndividual && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Responsible Individual</span>
                                <span className="text-sm font-medium text-gray-700">{asset.responsibleIndividual}</span>
                            </div>
                        )}
                        {asset.fieldplay && (
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-500">Fieldplay</span>
                                <span className="text-sm font-medium text-gray-700">{asset.fieldplay}</span>
                            </div>
                        )}

                        {!asset.owner && !asset.ivolveEntity && !asset.riaEntity && !asset.responsibleIndividual && (
                            <div className="text-center py-6 text-gray-400">
                                <Building size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No ownership details available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseRPTab;
