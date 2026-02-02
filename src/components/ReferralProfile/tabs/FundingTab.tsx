import { Referral } from '../../../types';
import { ReferralTabId } from '../ReferralHeroBanner';
import { PoundSterling, CheckCircle, Clock, Building2 } from 'lucide-react';

interface FundingTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function FundingTab({ referral }: FundingTabProps) {
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
            {/* Funding Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <PoundSterling className="text-ivolve-mid" size={20} />
                    Funding Status
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                    {referral.fundingApproved ? (
                        <>
                            <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
                            <div>
                                <div className="font-bold text-green-700 text-lg">Funding Approved</div>
                                <div className="text-sm text-gray-600">Ready to proceed with placement</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Clock className="text-amber-600 flex-shrink-0" size={32} />
                            <div>
                                <div className="font-bold text-amber-700 text-lg">Awaiting Approval</div>
                                <div className="text-sm text-gray-600">Funding application in progress</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Funding Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="text-ivolve-mid" size={20} />
                    Funding Details
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Funding Source" value={referral.fundingSource} icon={Building2} />
                    <InfoRow
                        label="Weekly Budget"
                        value={referral.weeklyBudget ? `£${referral.weeklyBudget.toFixed(2)}` : undefined}
                        icon={PoundSterling}
                    />
                </div>
            </div>
        </div>
    );
}
