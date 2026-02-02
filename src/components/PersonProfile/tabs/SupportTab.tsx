import React from 'react';
import {
    Heart, Users, User, UserCheck, Clock, Activity,
    Pill, Utensils, Accessibility
} from 'lucide-react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';

interface SupportTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Info card component for support details
const SupportInfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
    colorClass?: string;
    borderColor?: string;
}> = ({ icon, label, value, colorClass = 'bg-gray-50', borderColor = 'border-gray-200' }) => {
    if (!value) return null;

    return (
        <div className={`p-4 ${colorClass} rounded-lg border-2 ${borderColor} hover:border-ivolve-mid/30 hover:shadow-sm transition-all`}>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-lg font-semibold text-gray-800 truncate">{value}</p>
                </div>
            </div>
        </div>
    );
};

// Support level badge with color coding
const SupportLevelBadge: React.FC<{ level?: string }> = ({ level }) => {
    if (!level) return null;

    const getColor = () => {
        switch (level) {
            case 'Intensive':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'High':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Low':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${getColor()} transition-all`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                    <Activity size={20} className={
                        level === 'Intensive' || level === 'High' ? 'text-red-600' :
                        level === 'Medium' ? 'text-amber-600' : 'text-green-600'
                    } />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Support Level</p>
                    <p className="text-2xl font-bold">{level}</p>
                </div>
            </div>
        </div>
    );
};

const SupportTab: React.FC<SupportTabProps> = ({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }) => {
    const support = person.support;

    // Check if we have any support data
    const hasAnyData = support.careProvider || support.socialWorker || support.keyWorker ||
        support.caseManager || support.careHours || support.supportLevel ||
        support.medicationNeeds || support.dietaryRequirements || support.mobilityNeeds;

    if (!hasAnyData) {
        return (
            <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No support information recorded</p>
                <p className="text-sm text-gray-400">Support details will appear here once added</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Support Team */}
            {(support.careProvider || support.socialWorker || support.keyWorker || support.caseManager) && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-ivolve-mid" />
                        Support Team
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SupportInfoCard
                            icon={<Heart size={18} className="text-ivolve-mid" />}
                            label="Care Provider"
                            value={support.careProvider}
                            colorClass="bg-ivolve-mid/5"
                            borderColor={borderColor}
                        />
                        <SupportInfoCard
                            icon={<Users size={18} className="text-blue-600" />}
                            label="Social Worker"
                            value={support.socialWorker}
                            colorClass="bg-blue-50"
                            borderColor={borderColor}
                        />
                        <SupportInfoCard
                            icon={<User size={18} className="text-purple-600" />}
                            label="Key Worker"
                            value={support.keyWorker}
                            colorClass="bg-purple-50"
                            borderColor={borderColor}
                        />
                        <SupportInfoCard
                            icon={<UserCheck size={18} className="text-green-600" />}
                            label="Case Manager"
                            value={support.caseManager}
                            colorClass="bg-green-50"
                            borderColor={borderColor}
                        />
                    </div>
                </div>
            )}

            {/* Support Level & Hours */}
            {(support.supportLevel || support.careHours) && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-ivolve-mid" />
                        Support Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SupportLevelBadge level={support.supportLevel} />
                        {support.careHours && (
                            <div className={`p-4 bg-indigo-50 rounded-lg border-2 ${borderColor} transition-all`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                        <Clock size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-600 uppercase tracking-wider mb-1">Care Hours</p>
                                        <p className="text-2xl font-bold text-indigo-700">{support.careHours}</p>
                                        <p className="text-xs text-indigo-600">hours per week</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Health & Wellbeing Needs */}
            {(support.medicationNeeds || support.dietaryRequirements || support.mobilityNeeds) && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Heart size={20} className="text-ivolve-mid" />
                        Health & Wellbeing
                    </h3>
                    <div className="space-y-4">
                        {support.medicationNeeds && (
                            <div className={`p-4 bg-rose-50 rounded-lg border-2 ${borderColor}`}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Pill size={18} className="text-rose-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-rose-600 uppercase tracking-wider mb-2 font-medium">Medication Needs</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{support.medicationNeeds}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {support.dietaryRequirements && (
                            <div className={`p-4 bg-amber-50 rounded-lg border-2 ${borderColor}`}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Utensils size={18} className="text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-amber-600 uppercase tracking-wider mb-2 font-medium">Dietary Requirements</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{support.dietaryRequirements}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {support.mobilityNeeds && (
                            <div className={`p-4 bg-sky-50 rounded-lg border-2 ${borderColor}`}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Accessibility size={18} className="text-sky-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-sky-600 uppercase tracking-wider mb-2 font-medium">Mobility Needs</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{support.mobilityNeeds}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTab;
