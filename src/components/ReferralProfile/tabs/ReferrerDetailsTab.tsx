import { Referral } from '../../../types';
import { ReferralTabId } from '../../../types/tabs';
import { Users, User, Building2, Phone, Mail, Calendar } from 'lucide-react';

interface ReferrerDetailsTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function ReferrerDetailsTab({ referral }: ReferrerDetailsTabProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
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
                <div className="text-gray-800 font-medium">{value || '-'}</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="text-ivolve-mid" size={20} />
                    Referrer Information
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Referrer Name" value={referral.referrerName} icon={User} />
                    <InfoRow label="Organization" value={referral.referrerOrganization} icon={Building2} />
                    <InfoRow label="Referral Source Type" value={referral.source} icon={Users} />
                    <InfoRow label="Referral Date" value={formatDate(referral.referralDate)} icon={Calendar} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="text-ivolve-mid" size={20} />
                    Contact Details
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Phone" value={referral.referrerContact.phone} icon={Phone} />
                    <InfoRow label="Email" value={referral.referrerContact.email} icon={Mail} />
                </div>
            </div>
        </div>
    );
}
