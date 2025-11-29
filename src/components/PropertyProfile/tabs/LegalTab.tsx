import React from 'react';
import {
    Scale, FileText, ArrowRight, Building, User, Calendar, Clock, ExternalLink, ShieldCheck, Building2
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import { formatDate } from '../../../utils';


interface LegalTabProps {
    asset: PropertyAsset;
}

const LegalTab: React.FC<LegalTabProps> = ({ asset }) => {
    const isSupportedLiving = asset.serviceType === 'Supported Living';
    const title = isSupportedLiving ? 'Service Level Agreement' : 'Lease Agreement';

    // Helper to calculate duration/remaining time
    const getTimeRemaining = (endDate?: string) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const daysRemaining = isSupportedLiving
        ? getTimeRemaining(asset.sla?.slaEnd)
        : getTimeRemaining(asset.leaseEnd);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-ivolve-mid/10 rounded-lg">
                    <Scale className="text-ivolve-mid" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="text-sm text-gray-500">
                        {isSupportedLiving
                            ? 'Manage service level agreements and provider relationships'
                            : 'View lease details and tenure information'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Agreement Overview - Spans 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FileText size={20} className="text-ivolve-mid" />
                                Agreement Details
                            </h3>
                            {daysRemaining !== null && daysRemaining <= 90 && daysRemaining > 0 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    <Clock size={12} />
                                    Expiring Soon
                                </span>
                            )}
                        </div>

                        {isSupportedLiving ? (
                            // SLA Details
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Registered Provider</p>
                                    <p className="font-medium text-gray-900">{asset.sla?.rpName || asset.registeredProvider || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Agreement Type</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            {asset.sla?.isRolling ? 'Rolling Contract' : 'Fixed Term'}
                                        </span>
                                        {asset.sla?.isRolling && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Rolling</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Start Date</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.sla?.slaStart)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">End Date</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {asset.sla?.isRolling ? 'N/A' : formatDate(asset.sla?.slaEnd)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notice Period</p>
                                    <p className="font-medium text-gray-900">{asset.sla?.noticePeriod || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Review Date</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.sla?.reviewDate)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Lease Details
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Lease Type</p>
                                    <p className="font-medium text-gray-900">{asset.lease?.leaseType || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Annual Rent</p>
                                    <p className="font-medium text-gray-900">
                                        {asset.lease?.rentPA ? `£${asset.lease.rentPA.toLocaleString()}` : 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Lease Start</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.leaseStart)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Lease End</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.leaseEnd)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Rent Review</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.lease?.rentReviewDate)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Break Clause</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(asset.lease?.breakClauseDate)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline Visualization */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-4">Agreement Timeline</h4>
                            <div className="relative h-2 bg-gray-100 rounded-full mt-2 mb-6 mx-4">
                                {/* Start Point */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                <div className="absolute left-0 top-6 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                                    Start<br />{formatDate(isSupportedLiving ? asset.sla?.slaStart : asset.leaseStart)}
                                </div>

                                {/* Current Point (approximate for visual) */}
                                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-ivolve-mid rounded-full border-2 border-white shadow-sm z-10" />
                                <div className="absolute left-1/2 top-6 -translate-x-1/2 text-xs font-medium text-ivolve-mid whitespace-nowrap">
                                    Today
                                </div>

                                {/* End Point */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                                <div className="absolute right-0 top-6 translate-x-1/2 text-xs text-gray-500 whitespace-nowrap text-right">
                                    End<br />{isSupportedLiving && asset.sla?.isRolling ? 'Rolling' : formatDate(isSupportedLiving ? asset.sla?.slaEnd : asset.leaseEnd)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ownership Chain */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Building2 size={20} className="text-ivolve-mid" />
                            Ownership Structure
                        </h3>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            {/* Superior Landlord Node */}
                            {asset.superiorLandlord && (
                                <>
                                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200 w-full md:w-48">
                                        <Building size={24} className="text-gray-400 mb-2" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Superior Landlord</span>
                                        <span className="font-medium text-gray-900 text-sm">{asset.superiorLandlord.name}</span>
                                    </div>
                                    <ArrowRight className="text-gray-300 rotate-90 md:rotate-0" />
                                </>
                            )}

                            {/* RP Node (Only for Supported Living) */}
                            {isSupportedLiving && (
                                <>
                                    <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg border border-blue-100 w-full md:w-48">
                                        <ShieldCheck size={24} className="text-blue-400 mb-2" />
                                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Registered Provider</span>
                                        <span className="font-medium text-gray-900 text-sm">{asset.sla?.rpName || asset.registeredProvider}</span>
                                    </div>
                                    <ArrowRight className="text-gray-300 rotate-90 md:rotate-0" />
                                </>
                            )}

                            {/* ivolve Node */}
                            <div className="flex flex-col items-center text-center p-4 bg-ivolve-mid/5 rounded-lg border border-ivolve-mid/20 w-full md:w-48">
                                <div className="w-6 h-6 rounded-full bg-ivolve-mid flex items-center justify-center mb-2">
                                    <span className="text-white font-bold text-xs">i</span>
                                </div>
                                <span className="text-xs font-semibold text-ivolve-mid uppercase tracking-wider mb-1">Care Provider</span>
                                <span className="font-medium text-gray-900 text-sm">{asset.ivolveEntity || 'ivolve Care'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Additional Info & Documents */}
                <div className="space-y-6">
                    {/* Superior Landlord Details Card */}
                    {asset.superiorLandlord && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Building size={20} className="text-ivolve-mid" />
                                Superior Landlord
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{asset.superiorLandlord.name}</p>
                                    {asset.superiorLandlord.company && (
                                        <p className="text-sm text-gray-500">{asset.superiorLandlord.company}</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-50 space-y-3">
                                    {asset.superiorLandlord.contactName && (
                                        <div className="flex items-center gap-3">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-700">{asset.superiorLandlord.contactName}</span>
                                        </div>
                                    )}
                                    {asset.superiorLandlord.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 flex items-center justify-center">@</div>
                                            <a href={`mailto:${asset.superiorLandlord.email}`} className="text-sm text-ivolve-mid hover:underline truncate">
                                                {asset.superiorLandlord.email}
                                            </a>
                                        </div>
                                    )}
                                    {asset.superiorLandlord.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 flex items-center justify-center">#</div>
                                            <a href={`tel:${asset.superiorLandlord.phone}`} className="text-sm text-ivolve-mid hover:underline">
                                                {asset.superiorLandlord.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interactive Document Viewer Placeholder */}
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <FileText size={24} className="text-ivolve-mid" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">Interactive Viewer</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Interactive document features coming soon. You'll be able to highlight clauses, track renewals, and sign digitally.
                        </p>
                        <span className="inline-flex px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                            Coming Soon
                        </span>
                    </div>

                    {/* Document Links */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-ivolve-mid" />
                            Legal Documents
                        </h3>

                        {asset.documents && asset.documents.length > 0 ? (
                            <div className="space-y-2">
                                {asset.documents
                                    .filter(d => d.type === 'Lease' || d.name.toLowerCase().includes('agreement') || d.name.toLowerCase().includes('contract'))
                                    .map((doc, idx) => (
                                        <a
                                            key={doc.id || idx}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText size={18} className="text-gray-400 group-hover:text-ivolve-mid transition-colors flex-shrink-0" />
                                                <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                                            </div>
                                            <ExternalLink size={14} className="text-gray-300 group-hover:text-ivolve-mid transition-colors flex-shrink-0" />
                                        </a>
                                    ))}
                                {asset.documents.filter(d => d.type === 'Lease' || d.name.toLowerCase().includes('agreement') || d.name.toLowerCase().includes('contract')).length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No legal documents found.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No documents available.</p>
                        )}

                        <button className="w-full mt-4 text-sm text-ivolve-mid font-medium hover:underline flex items-center justify-center gap-1">
                            View All Documents <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalTab;
