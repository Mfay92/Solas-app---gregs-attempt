import { Referral } from '../../../types';
import { ReferralTabId } from '../ReferralHeroBanner';
import { ClipboardCheck, Heart, Utensils, Activity, Calendar, User, FileText } from 'lucide-react';

interface AssessmentTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function AssessmentTab({ referral }: AssessmentTabProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: any }) => (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            {Icon && <Icon className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />}
            <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</div>
                <div className="text-gray-800 font-medium">{value || 'Not specified'}</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Assessment Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="text-ivolve-mid" size={20} />
                    Assessment Overview
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Assessment Date" value={formatDate(referral.assessmentDate)} icon={Calendar} />
                    <InfoRow label="Key Worker" value={referral.keyWorker} icon={User} />
                    <InfoRow label="Support Level" value={referral.supportLevel} icon={Heart} />
                </div>
            </div>

            {/* Support Needs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="text-ivolve-mid" size={20} />
                    Support Needs
                </h2>
                <div className="space-y-4">
                    {/* Medical Needs */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-gray-400" size={18} />
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Medical Needs</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {referral.medicalNeeds || 'No medical needs specified'}
                            </p>
                        </div>
                    </div>

                    {/* Dietary Requirements */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Utensils className="text-gray-400" size={18} />
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Dietary Requirements</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {referral.dietaryRequirements || 'No dietary requirements specified'}
                            </p>
                        </div>
                    </div>

                    {/* Mobility Needs */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-gray-400" size={18} />
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Mobility Needs</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {referral.mobilityNeeds || 'No mobility needs specified'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Notes */}
            {referral.assessmentNotes && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="text-ivolve-mid" size={20} />
                        Assessment Notes
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {referral.assessmentNotes}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
