import { Referral } from '../../../types';
import { ReferralTabId } from '../../../types/tabs';
import { User, Calendar, Hash, Mail, Phone, IdCard } from 'lucide-react';

interface PersonalDetailsTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function PersonalDetailsTab({ referral }: PersonalDetailsTabProps) {
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
                    <User className="text-ivolve-mid" size={20} />
                    Personal Information
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Title" value={referral.personal.title} icon={User} />
                    <InfoRow label="First Name" value={referral.personal.firstName} icon={User} />
                    <InfoRow label="Last Name" value={referral.personal.lastName} icon={User} />
                    <InfoRow label="Preferred Name" value={referral.personal.preferredName} icon={User} />
                    <InfoRow label="Date of Birth" value={formatDate(referral.personal.dateOfBirth)} icon={Calendar} />
                    <InfoRow label="Age" value={referral.personal.age ? `${referral.personal.age} years` : undefined} icon={Hash} />
                    <InfoRow label="National Insurance Number" value={referral.personal.niNumber} icon={IdCard} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="text-ivolve-mid" size={20} />
                    Contact Information
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Email" value={referral.personal.email} icon={Mail} />
                    <InfoRow label="Mobile" value={referral.personal.mobile} icon={Phone} />
                    <InfoRow label="Phone" value={referral.personal.phone} icon={Phone} />
                </div>
            </div>
        </div>
    );
}
