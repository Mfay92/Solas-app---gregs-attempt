import { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, Building, Camera,
    MapPin, Phone, Mail, Users, User, X,
    LayoutDashboard, Building2, Wrench as WrenchIcon,
    Scale, PoundSterling
} from 'lucide-react';
import { PropertyAsset } from '../../types';
import StatusBadge from '../shared/StatusBadge';

// Tab types
export type TabId = 'service-overview' | 'property-details' | 'units-occupancy' | 'repairs-compliance' | 'rps-landlords' | 'legal' | 'rents-finance';

interface PropertyHeroBannerProps {
    asset: PropertyAsset;
    onBack: () => void;
    onGalleryClick: () => void;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

// Contact popover component
interface ContactPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
}

function ContactPopover({ isOpen, onClose, title, children, anchorRef }: ContactPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
                <button onClick={onClose} className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                    <X size={12} className="text-gray-400" />
                </button>
            </div>
            {children}
        </div>
    );
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
        { id: 'service-overview' as TabId, label: 'Overview', icon: LayoutDashboard },
        { id: 'property-details' as TabId, label: 'Property', icon: Building },
        { id: 'units-occupancy' as TabId, label: 'Units', icon: Building2 },
        { id: 'repairs-compliance' as TabId, label: 'Repairs', icon: WrenchIcon },
        { id: 'rps-landlords' as TabId, label: 'RPs', icon: Users },
        { id: 'legal' as TabId, label: 'Legal', icon: Scale },
        { id: 'rents-finance' as TabId, label: 'Finance', icon: PoundSterling },
    ];

    return (
        <div className="bg-white border-b border-gray-200">
            {/* Top bar with back button */}
            <div className="px-4 md:px-8 py-3 border-b border-gray-100">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-ivolve-mid transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Properties</span>
                </button>
            </div>

            {/* Main Hero Content - Mid Green Background */}
            <div className="px-4 md:px-8 py-6 pb-0">
                <div className="bg-ivolve-mid rounded-t-2xl shadow-lg overflow-hidden">
                    {/* Main content area */}
                    <div className="p-6 pb-4">
                        <div className="flex flex-col lg:flex-row gap-6">
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
                                    {asset.serviceType && (
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                                            {asset.serviceType}
                                        </span>
                                    )}
                                    {asset.complianceStatus && (
                                        <StatusBadge status={asset.complianceStatus} />
                                    )}
                                    {asset.status && (asset.status as string) !== 'Active' && (
                                        <StatusBadge status={asset.status} />
                                    )}
                                    {asset.unitType && (
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
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
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    activePopover === 'phone'
                                                        ? 'bg-white text-ivolve-mid shadow-lg'
                                                        : 'bg-white/20 hover:bg-white/30 text-white'
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
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    activePopover === 'housing'
                                                        ? 'bg-white text-ivolve-mid shadow-lg'
                                                        : 'bg-white/20 hover:bg-white/30 text-white'
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
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    activePopover === 'area'
                                                        ? 'bg-white text-ivolve-mid shadow-lg'
                                                        : 'bg-white/20 hover:bg-white/30 text-white'
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
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    activePopover === 'rp'
                                                        ? 'bg-white text-ivolve-mid shadow-lg'
                                                        : 'bg-ivolve-paper/90 hover:bg-ivolve-paper text-ivolve-dark'
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
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    activePopover === 'landlord'
                                                        ? 'bg-white text-ivolve-mid shadow-lg'
                                                        : 'bg-white/20 hover:bg-white/30 text-white'
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
                                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/10 cursor-pointer group"
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

                    {/* Tab Navigation - Inside the banner */}
                    <div className="bg-ivolve-dark/30 px-4">
                        <nav className="flex overflow-x-auto no-scrollbar gap-1" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onTabChange(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-3 border-b-[3px] text-sm whitespace-nowrap transition-all duration-200
                                            ${isActive
                                                ? 'border-white text-white bg-white/10 font-semibold'
                                                : 'border-transparent text-white/70 hover:text-white hover:bg-white/5 font-medium'}
                                        `}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
