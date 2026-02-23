import { useState, useRef } from 'react';
import {
    ArrowLeft, Building, Camera,
    MapPin, Phone, Mail, Users, User,
    LayoutDashboard, Building2, Wrench as WrenchIcon,
    Scale, PoundSterling, ShieldCheck
} from 'lucide-react';
import { PropertyAsset } from '../../types';
import { PropertyTabId } from '../../types/tabs';
export type { PropertyTabId };
import StatusBadge from '../shared/StatusBadge';
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';
import ContactPopover from '../shared/ContactPopover';

interface PropertyHeroBannerProps {
    asset: PropertyAsset;
    onBack: () => void;
    onGalleryClick: () => void;
    activeTab: PropertyTabId;
    onTabChange: (tab: PropertyTabId) => void;
}

export default function PropertyHeroBanner({
    asset,
    onBack,
    onGalleryClick,
    activeTab,
    onTabChange
}: PropertyHeroBannerProps) {
    const hasImage = !!asset.heroImageUrl;
    const photoCount = asset.photos?.length || 0;

    // Popover states
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const phoneRef = useRef<HTMLButtonElement>(null);
    const housingManagerRef = useRef<HTMLButtonElement>(null);
    const areaManagerRef = useRef<HTMLButtonElement>(null);
    const rpRef = useRef<HTMLButtonElement>(null);
    const landlordRef = useRef<HTMLButtonElement>(null);

    const togglePopover = (id: string) => {
        setActivePopover(activePopover === id ? null : id);
    };

    // Tab configuration
    const tabs = [
        { id: 'service-overview' as PropertyTabId, label: 'Overview', icon: LayoutDashboard },
        { id: 'property-details' as PropertyTabId, label: 'Property', icon: Building },
        { id: 'units-occupancy' as PropertyTabId, label: 'Units', icon: Building2 },
        { id: 'repairs-compliance' as PropertyTabId, label: 'Repairs', icon: WrenchIcon },
        { id: 'compliance' as PropertyTabId, label: 'Compliance', icon: ShieldCheck },
        { id: 'rps-landlords' as PropertyTabId, label: 'RPs', icon: Users },
        { id: 'legal' as PropertyTabId, label: 'Legal', icon: Scale },
        { id: 'rents-finance' as PropertyTabId, label: 'Finance', icon: PoundSterling },
    ];

    return (
        <div className="bg-ivolve-paper">
            {/* Main Hero Content - Mid Green Background - Full Width, No Curves */}
            <div className="bg-ivolve-mid w-full pb-0 shadow-md">
                <div className="px-6 pt-6 pb-2">
                    {/* Back Button - Integrated */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
                    >
                        <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium text-sm">Back to Properties</span>
                    </button>

                    {/* Main content area */}
                    <div className="flex flex-col lg:flex-row gap-6 pb-6">
                        {/* Left side: Property Information */}
                        <div className="flex-1 min-w-0">
                            {/* Address */}
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                {asset.address}
                            </h1>
                            <div className="flex items-center gap-2 text-white/80 mb-4">
                                <MapPin size={16} />
                                <span>{asset.postcode}</span>
                                {asset.region && (
                                    <>
                                        <span className="text-white/50">•</span>
                                        <span>{asset.region}</span>
                                    </>
                                )}
                            </div>

                            {/* Status badges/tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                {asset.serviceType && (() => {
                                    const colors = getServiceTypeColor(asset.serviceType);
                                    return (
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${colors.bg} ${colors.text} ${colors.border} shadow-sm`}
                                            style={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                                color: colors.primary || '#008C67' // Fallback to mid green if primary undefined, though colors.primary usually comes from getServiceTypeColor? 
                                                // Actually getServiceTypeColor returns {bg, text, border, primary}.
                                            }}
                                        >
                                            {asset.serviceType}
                                        </span>
                                    );
                                })()}
                                {asset.complianceStatus && (
                                    <div className="shadow-sm rounded-full overflow-hidden">
                                        <StatusBadge status={asset.complianceStatus} />
                                    </div>
                                )}
                                {asset.status && (asset.status as string) !== 'Active' && (
                                    <div className="shadow-sm rounded-full overflow-hidden">
                                        <StatusBadge status={asset.status} />
                                    </div>
                                )}
                                {asset.unitType && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                                        {asset.unitType}
                                    </span>
                                )}
                            </div>

                            {/* Compact Contact Icons Row */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Building Phone */}
                                {asset.buildingPhone && (
                                    <div className="relative">
                                        <button
                                            ref={phoneRef}
                                            onClick={() => togglePopover('phone')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activePopover === 'phone'
                                                ? 'bg-white text-ivolve-mid border-white shadow-lg'
                                                : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <Phone size={14} />
                                            <span className="text-xs font-medium">Building</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'phone'}
                                            onClose={() => setActivePopover(null)}
                                            title="Building Phone"
                                            anchorRef={phoneRef}
                                        >
                                            <a
                                                href={`tel:${asset.buildingPhone}`}
                                                className="text-sm font-semibold text-ivolve-mid hover:underline flex items-center gap-2"
                                            >
                                                <Phone size={14} className="text-ivolve-mid" />
                                                {asset.buildingPhone}
                                            </a>
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* Housing Manager */}
                                {asset.housingManager && (
                                    <div className="relative">
                                        <button
                                            ref={housingManagerRef}
                                            onClick={() => togglePopover('housing')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activePopover === 'housing'
                                                ? 'bg-white text-ivolve-mid border-white shadow-lg'
                                                : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <User size={14} />
                                            <span className="text-xs font-medium">Housing Mgr</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'housing'}
                                            onClose={() => setActivePopover(null)}
                                            title="Housing Manager"
                                            anchorRef={housingManagerRef}
                                        >
                                            <p className="text-sm font-semibold text-gray-800">{asset.housingManager}</p>
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* Area Manager */}
                                {asset.areaManager && (
                                    <div className="relative">
                                        <button
                                            ref={areaManagerRef}
                                            onClick={() => togglePopover('area')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activePopover === 'area'
                                                ? 'bg-white text-ivolve-mid border-white shadow-lg'
                                                : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <Users size={14} />
                                            <span className="text-xs font-medium">Area Mgr</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'area'}
                                            onClose={() => setActivePopover(null)}
                                            title="Area Manager"
                                            anchorRef={areaManagerRef}
                                        >
                                            <p className="text-sm font-semibold text-gray-800">{asset.areaManager}</p>
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* RP Contact */}
                                {(asset.registeredProvider || asset.rpContact) && (
                                    <div className="relative">
                                        <button
                                            ref={rpRef}
                                            onClick={() => togglePopover('rp')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activePopover === 'rp'
                                                ? 'bg-white text-ivolve-mid border-white shadow-lg'
                                                : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <Building size={14} />
                                            <span className="text-xs font-medium">RP</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'rp'}
                                            onClose={() => setActivePopover(null)}
                                            title="Registered Provider"
                                            anchorRef={rpRef}
                                        >
                                            <p className="text-sm font-semibold text-gray-800">
                                                {asset.rpContact?.company || asset.registeredProvider}
                                            </p>
                                            {asset.rpContact?.name && (
                                                <p className="text-xs text-gray-600 mt-1">{asset.rpContact.name}</p>
                                            )}
                                            {asset.rpContact?.phone && (
                                                <a
                                                    href={`tel:${asset.rpContact.phone}`}
                                                    className="text-xs text-ivolve-mid hover:underline flex items-center gap-1.5 mt-2"
                                                >
                                                    <Phone size={12} />
                                                    {asset.rpContact.phone}
                                                </a>
                                            )}
                                            {asset.rpContact?.email && (
                                                <a
                                                    href={`mailto:${asset.rpContact.email}`}
                                                    className="text-xs text-ivolve-mid hover:underline flex items-center gap-1.5 mt-1"
                                                >
                                                    <Mail size={12} />
                                                    {asset.rpContact.email}
                                                </a>
                                            )}
                                        </ContactPopover>
                                    </div>
                                )}

                                {/* Landlord */}
                                {asset.landlordContact && asset.landlordContact.company !== asset.registeredProvider && (
                                    <div className="relative">
                                        <button
                                            ref={landlordRef}
                                            onClick={() => togglePopover('landlord')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${activePopover === 'landlord'
                                                ? 'bg-white text-ivolve-mid border-white shadow-lg'
                                                : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <Building size={14} />
                                            <span className="text-xs font-medium">Landlord</span>
                                        </button>
                                        <ContactPopover
                                            isOpen={activePopover === 'landlord'}
                                            onClose={() => setActivePopover(null)}
                                            title="Landlord"
                                            anchorRef={landlordRef}
                                        >
                                            <p className="text-sm font-semibold text-gray-800">
                                                {asset.landlordContact.company || asset.landlordContact.name}
                                            </p>
                                            {asset.landlordContact.name && asset.landlordContact.company && (
                                                <p className="text-xs text-gray-600 mt-1">{asset.landlordContact.name}</p>
                                            )}
                                            {asset.landlordContact.phone && (
                                                <a
                                                    href={`tel:${asset.landlordContact.phone}`}
                                                    className="text-xs text-ivolve-mid hover:underline flex items-center gap-1.5 mt-2"
                                                >
                                                    <Phone size={12} />
                                                    {asset.landlordContact.phone}
                                                </a>
                                            )}
                                        </ContactPopover>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side: Property Image */}
                        <div className="lg:w-64 flex-shrink-0">
                            {/* Image card */}
                            <div
                                className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/10 cursor-pointer group shadow-md border-2 border-white/20"
                                onClick={photoCount > 0 ? onGalleryClick : undefined}
                            >
                                {hasImage ? (
                                    <img
                                        src={asset.heroImageUrl}
                                        alt={asset.address}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                                        <Building className="text-white/40 w-16 h-16" />
                                    </div>
                                )}

                                {/* Gallery button overlay */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onGalleryClick();
                                    }}
                                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-black/80 transition-colors"
                                >
                                    <Camera size={14} />
                                    <span>Gallery</span>
                                    {photoCount > 0 && (
                                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">{photoCount}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - Full Width */}
                <div className="border-t border-white/10 bg-black/10 backdrop-blur-sm">
                    <nav className="flex overflow-x-auto no-scrollbar gap-1 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 border-b-4 text-sm whitespace-nowrap transition-all duration-200
                                        ${isActive
                                            ? 'border-white text-white font-bold bg-white/10'
                                            : 'border-transparent text-white/70 hover:text-white hover:bg-white/5 font-medium'}
                                    `}
                                >
                                    <Icon size={16} className={isActive ? 'text-white' : 'text-white/70'} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
