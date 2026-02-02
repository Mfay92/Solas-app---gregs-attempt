import { Referral } from '../../../types';
import { ReferralTabId } from '../ReferralHeroBanner';
import { Home, MapPin, DoorOpen, Calendar } from 'lucide-react';

interface LinkedPropertyTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function LinkedPropertyTab({ referral }: LinkedPropertyTabProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
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
                <div className="text-gray-800 font-medium">{value || 'Not assigned'}</div>
            </div>
        </div>
    );

    if (!referral.linkedProperty) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="p-4 bg-gray-100 rounded-full">
                            <Home className="text-gray-400" size={48} />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Property Assigned</h2>
                    <p className="text-gray-500">
                        This referral has not been linked to a property yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Home className="text-ivolve-mid" size={20} />
                    Property Details
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Address" value={referral.linkedProperty.propertyAddress} icon={MapPin} />
                    <InfoRow label="Room / Unit" value={referral.linkedProperty.room} icon={DoorOpen} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-ivolve-mid" size={20} />
                    Move In Dates
                </h2>
                <div className="space-y-0">
                    <InfoRow label="Proposed Move In Date" value={formatDate(referral.proposedMoveInDate)} icon={Calendar} />
                    <InfoRow
                        label="Confirmed Move In Date"
                        value={referral.confirmedMoveInDate ? formatDate(referral.confirmedMoveInDate) : 'Not confirmed yet'}
                        icon={Calendar}
                    />
                </div>
            </div>
        </div>
    );
}
