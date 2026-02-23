import { useState, useRef } from 'react';
import {
    ArrowLeft, Phone, Mail, User, Users, CheckCircle,
    LayoutDashboard, Home, PoundSterling, FolderOpen, MessageSquare, ClipboardCheck
} from 'lucide-react';
import { Referral } from '../../types';
import { ReferralTabId } from '../../types/tabs';
export type { ReferralTabId };
import StatusBadge from '../shared/StatusBadge';
import { InitialsAvatar } from '../../utils/avatarUtils';
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';
import ContactPopover from '../shared/ContactPopover';

interface ReferralHeroBannerProps {
    referral: Referral;
    onBack: () => void;
    activeTab: ReferralTabId;
    onTabChange: (tab: ReferralTabId) => void;
    onProcessMoveIn?: () => void;
}

export default function ReferralHeroBanner({
    referral,
    onBack,
    activeTab,
    onTabChange,
    onProcessMoveIn
}: ReferralHeroBannerProps) {
    const displayName = `${referral.personal.firstName} ${referral.personal.lastName}`;
    const preferredName = referral.personal.preferredName;

    // Popover states
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const phoneRef = useRef<HTMLButtonElement>(null);
    const emailRef = useRef<HTMLButtonElement>(null);
    const referrerRef = useRef<HTMLButtonElement>(null);

    const togglePopover = (id: string) => {
        setActivePopover(activePopover === id ? null : id);
    };

    const serviceTypeColors = getServiceTypeColor(referral.serviceType);

    // Tab configuration
    const tabs = [
        { id: 'overview' as ReferralTabId, label: 'Overview', icon: LayoutDashboard },
        { id: 'personal-details' as ReferralTabId, label: 'Personal', icon: User },
        { id: 'assessment' as ReferralTabId, label: 'Assessment', icon: ClipboardCheck },
        { id: 'referrer' as ReferralTabId, label: 'Referrer', icon: Users },
        { id: 'linked-property' as ReferralTabId, label: 'Property', icon: Home },
        { id: 'funding' as ReferralTabId, label: 'Funding', icon: PoundSterling },
        { id: 'documents' as ReferralTabId, label: 'Documents', icon: FolderOpen },
        { id: 'notes' as ReferralTabId, label: 'Notes', icon: MessageSquare },
    ];

    // Check if ready to move in
    const isReadyToMoveIn = referral.status === 'Ready to Move In';

    return (
        <div className="bg-ivolve-paper">
            {/* Main Hero Content - Service Type Color Background - Full Width, No Curves */}
            <div className={`${serviceTypeColors.bg} w-full pb-0 shadow-md`}>
                <div className="px-6 pt-6 pb-2">
                    {/* Back Button - Integrated */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
                    >
                        <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium text-sm">Back to Referrals</span>
                    </button>

                    {/* Main content area */}
                    <div className="flex flex-col md:flex-row gap-6 pb-6">
                        {/* Left: Avatar and basic info */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            {/* Avatar */}
                            <InitialsAvatar
                                firstName={referral.personal.firstName}
                                lastName={referral.personal.lastName}
                                size="xl"
                                className="border-4 border-white/20"
                            />
                        </div>

                        {/* Middle: Name, status, and key info */}
                        <div className="flex-1 text-center md:text-left">
                            {/* Name */}
                            <h1 className={`text-3xl md:text-4xl font-bold ${serviceTypeColors.text} mb-2`}>
                                {displayName}
                            </h1>
                            {preferredName && preferredName !== referral.personal.firstName && (
                                <p className={`text-lg ${serviceTypeColors.text} opacity-90 mb-3`}>
                                    Prefers: {preferredName}
                                </p>
                            )}

                            {/* Referral Reference & Service Type */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                                <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white border border-white/30">
                                    {referral.referralRef}
                                </span>
                                <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white border border-white/30">
                                    {referral.serviceType}
                                </span>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-4">
                                <StatusBadge status={referral.status} size="md" />
                            </div>

                            {/* Key Contact Info - Inline buttons with popovers */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 relative">
                                {/* Phone */}
                                {(referral.personal.phone || referral.personal.mobile) && (
                                    <div className="relative">
                                        <button
                                            ref={phoneRef}
                                            onClick={() => togglePopover('phone')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                                        >
                                            <Phone size={16} />
                                            <span className="text-sm font-medium">Phone</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'phone'}
                                            onClose={() => setActivePopover(null)}
                                            title="Phone Numbers"
                                            anchorRef={phoneRef}
                                        >
                                            <div className="space-y-2 text-sm">
                                                {referral.personal.mobile && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-0.5">Mobile</div>
                                                        <a href={`tel:${referral.personal.mobile}`} className="text-ivolve-mid hover:underline font-medium">
                                                            {referral.personal.mobile}
                                                        </a>
                                                    </div>
                                                )}
                                                {referral.personal.phone && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                                                        <a href={`tel:${referral.personal.phone}`} className="text-ivolve-mid hover:underline font-medium">
                                                            {referral.personal.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* Email */}
                                {referral.personal.email && (
                                    <div className="relative">
                                        <button
                                            ref={emailRef}
                                            onClick={() => togglePopover('email')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                                        >
                                            <Mail size={16} />
                                            <span className="text-sm font-medium">Email</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'email'}
                                            onClose={() => setActivePopover(null)}
                                            title="Email"
                                            anchorRef={emailRef}
                                        >
                                            <div className="space-y-1 text-sm">
                                                <a href={`mailto:${referral.personal.email}`} className="text-ivolve-mid hover:underline font-medium block">
                                                    {referral.personal.email}
                                                </a>
                                            </div>
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* Referrer */}
                                <div className="relative">
                                    <button
                                        ref={referrerRef}
                                        onClick={() => togglePopover('referrer')}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                                    >
                                        <Users size={16} />
                                        <span className="text-sm font-medium">Referrer</span>
                                    </button>
                                    <ContactPopover
                                        isOpen={activePopover === 'referrer'}
                                        onClose={() => setActivePopover(null)}
                                        title="Referrer Details"
                                        anchorRef={referrerRef}
                                    >
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Name</div>
                                                <div className="font-medium text-gray-800">{referral.referrerName}</div>
                                            </div>
                                            {referral.referrerOrganization && (
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-0.5">Organization</div>
                                                    <div className="font-medium text-gray-800">{referral.referrerOrganization}</div>
                                                </div>
                                            )}
                                            {referral.referrerContact.phone && (
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                                                    <a href={`tel:${referral.referrerContact.phone}`} className="text-ivolve-mid hover:underline font-medium">
                                                        {referral.referrerContact.phone}
                                                    </a>
                                                </div>
                                            )}
                                            {referral.referrerContact.email && (
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-0.5">Email</div>
                                                    <a href={`mailto:${referral.referrerContact.email}`} className="text-ivolve-mid hover:underline font-medium">
                                                        {referral.referrerContact.email}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </ContactPopover>
                                </div>
                            </div>
                        </div>

                        {/* Right: Move In Action (if ready) */}
                        {isReadyToMoveIn && (
                            <div className="flex items-start">
                                <button
                                    onClick={onProcessMoveIn}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-ivolve-mid rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                                >
                                    <CheckCircle size={20} />
                                    <span>Process Move In</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs Section - Full Width */}
                <div className="overflow-x-auto scrollbar-hide border-t border-white/10">
                    <div className="flex gap-1 px-6 min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 border-b-4
                                        ${isActive
                                            ? 'border-white text-white bg-white/10'
                                            : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={16} />
                                    <span className="whitespace-nowrap">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
