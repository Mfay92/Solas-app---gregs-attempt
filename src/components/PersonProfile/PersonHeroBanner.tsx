import { useState, useEffect } from 'react';
import {
    ArrowLeft, Camera, Phone, Mail, MapPin, User, Users, X,
    LayoutDashboard, Home, Heart, Shield, AlertTriangle,
    ClipboardList, Activity, ShieldCheck, PoundSterling, FolderOpen, MessageSquare,
    Edit3, PlusCircle, Wrench
} from 'lucide-react';
import { Person } from '../../types';
import QuickAccessToolbox from './QuickAccessToolbox';
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';
import AddNoteSidebar, { Note } from '../Notes/AddNoteSidebar';
import WarningBannerModal, { Warning } from '../Forms/WarningBannerModal';
import AddWarningModal from '../Forms/AddWarningModal';
import WarningIcon from '../shared/WarningIcon';

// Tab types (unchanged)
export type PersonTabId =
    | 'overview'
    | 'personal-details'
    | 'tenancy'
    | 'support'
    | 'safeguarding'
    | 'asb'
    | 'support-plans'
    | 'risk-assessments'
    | 'compliance'
    | 'finance'
    | 'documents'
    | 'notes';

interface PersonHeroBannerProps {
    person: Person;
    onBack: () => void;
    activeTab: PersonTabId;
    onTabChange: (tab: PersonTabId) => void;
}

export default function PersonHeroBanner({
    person,
    onBack,
    activeTab,
    onTabChange
}: PersonHeroBannerProps) {
    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);

    // Notes Sidebar State
    const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);

    // Warning Banner State
    const [showWarningBanner, setShowWarningBanner] = useState(false);
    const [showAddWarningModal, setShowAddWarningModal] = useState(false);
    const [hasAcknowledgedWarning, setHasAcknowledgedWarning] = useState(false);

    // Permission Check (TODO: Connect to actual permission system)
    // For now, always true for development/testing
    // In production, this would check user role (Manager, Senior, etc.)
    const hasEditPermission = true;

    // Auto-popup warning banner on profile load (if warning exists and not acknowledged)
    useEffect(() => {
        if (person.warning && !hasAcknowledgedWarning) {
            setShowWarningBanner(true);
        }
    }, [person.id, person.warning, hasAcknowledgedWarning]);

    // Reset acknowledgment when person changes
    useEffect(() => {
        setHasAcknowledgedWarning(false);
    }, [person.id]);

    // Notes handler
    const handleSaveNote = (note: Omit<Note, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>) => {
        // TODO: Save note to state/backend
        console.log('Saving note:', note);
        setIsNotesSidebarOpen(false);
        // TODO: Show success toast
    };

    // Warning handlers
    const handleWarningBannerClose = () => {
        setShowWarningBanner(false);
        setHasAcknowledgedWarning(true);
    };

    const handleEditWarning = () => {
        setShowWarningBanner(false);
        setShowAddWarningModal(true);
    };

    const handleRemoveWarning = () => {
        // TODO: Remove warning from person data
        console.log('Removing warning for person:', person.id);
        setShowWarningBanner(false);
        setHasAcknowledgedWarning(true);
        // TODO: Show success toast
    };

    const handleSaveWarning = (content: string) => {
        // TODO: Save warning to person data
        const warningData: Warning = {
            id: `warning-${Date.now()}`,
            content,
            createdAt: new Date().toISOString(),
            createdBy: 'Matt Fay', // TODO: Get from auth system
            ...(person.warning && {
                lastUpdatedAt: new Date().toISOString(),
                lastUpdatedBy: 'Matt Fay'
            })
        };
        console.log('Saving warning:', warningData);
        setShowAddWarningModal(false);
        setHasAcknowledgedWarning(false); // Force re-acknowledgment after edit
        // TODO: Show success toast
    };

    const handleWarningIconClick = () => {
        setShowWarningBanner(true);
    };

    const hasPhoto = !!person.personal.photo;
    const displayName = `${person.personal.firstName} ${person.personal.lastName}`;
    const preferredName = person.personal.preferredName;

    // Get service type colors
    // Default to 'Supported Living' if serviceType is not set
    const serviceType = person.tenancy.serviceType || 'Supported Living';
    const colors = getServiceTypeColor(serviceType);

    // Calculate age
    const calculateAge = (dob?: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(person.personal.dateOfBirth);

    // Tab configuration
    const tabs = [
        { id: 'overview' as PersonTabId, label: 'Overview', icon: LayoutDashboard },
        { id: 'personal-details' as PersonTabId, label: 'Personal', icon: User },
        { id: 'tenancy' as PersonTabId, label: 'Tenancy', icon: Home },
        { id: 'support' as PersonTabId, label: 'Support', icon: Heart },
        { id: 'safeguarding' as PersonTabId, label: 'Safeguarding', icon: Shield },
        { id: 'asb' as PersonTabId, label: 'ASB', icon: AlertTriangle },
        { id: 'support-plans' as PersonTabId, label: 'Support Plans', icon: ClipboardList },
        { id: 'risk-assessments' as PersonTabId, label: 'Risk', icon: Activity },
        { id: 'compliance' as PersonTabId, label: 'Compliance', icon: ShieldCheck },
        { id: 'finance' as PersonTabId, label: 'Finance', icon: PoundSterling },
        { id: 'documents' as PersonTabId, label: 'Documents', icon: FolderOpen },
        { id: 'notes' as PersonTabId, label: 'Notes', icon: MessageSquare },
    ];

    return (
        <div className="bg-ivolve-paper relative">
            {/* Main Hero Background - Service Type Color */}
            <div
                className="w-full pb-0 shadow-md relative"
                style={{ backgroundColor: colors.primary }}
            >

                {/* Top Navigation Row */}
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors font-semibold group"
                        >
                            <div className="p-1.5 rounded-full bg-white/20 group-hover:bg-white/30 transition-all">
                                <ArrowLeft size={14} />
                            </div>
                            <span className="text-sm">Back to People Hub</span>
                        </button>

                        {/* Edit Profile - Icon Only with Tooltip */}
                        <button
                            onClick={() => hasEditPermission && setIsEditMode(!isEditMode)}
                            disabled={!hasEditPermission}
                            className={`group transition-all ${hasEditPermission
                                ? 'text-white hover:scale-110'
                                : 'text-white/30 cursor-not-allowed'
                                }`}
                            title={!hasEditPermission ? 'You do not have permission to edit this profile' : isEditMode ? 'Exit Edit Mode' : 'Edit Profile'}
                        >
                            <div className={`p-2 rounded-full border-2 transition-all ${isEditMode
                                ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50 animate-pulse'
                                : hasEditPermission
                                    ? 'bg-white/10 border-white/30 group-hover:bg-blue-500 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/50'
                                    : 'bg-transparent border-white/20'
                                }`}>
                                <Edit3 size={16} />
                            </div>
                        </button>

                        {/* Add Note/Action - Icon Only with Tooltip */}
                        <button
                            onClick={() => setIsNotesSidebarOpen(true)}
                            className="text-white group transition-all hover:scale-110"
                            title="Add New Note/Action"
                        >
                            <div className="p-2 rounded-full bg-white/10 border-2 border-white/30 text-white group-hover:bg-green-500 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all group-hover:rotate-90">
                                <PlusCircle size={16} />
                            </div>
                        </button>

                        {/* Open Notes Tab - Post-it Note Style */}
                        <button
                            onClick={() => onTabChange('notes')}
                            className="group transition-all hover:scale-110"
                            title="Open Notes Tab"
                        >
                            <div className="p-2 rounded-lg bg-yellow-300 border-2 border-yellow-400 text-yellow-900 group-hover:bg-yellow-400 group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all group-hover:-rotate-6">
                                <MessageSquare size={16} />
                            </div>
                        </button>

                        {/* Add Warning - Icon Only with Tooltip (only show if no warning exists) */}
                        {!person.warning && (
                            <button
                                onClick={() => setShowAddWarningModal(true)}
                                className="group transition-all hover:scale-110"
                                title="Add Warning"
                            >
                                <div className="p-2 rounded-full bg-orange-500 border-2 border-orange-400 text-white group-hover:bg-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all group-hover:rotate-12">
                                    <AlertTriangle size={16} />
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/*
                    ============================================================
                    HERO BANNER LAYOUT STRUCTURE (CRITICAL - DO NOT MODIFY)
                    ============================================================
                    This layout uses a THREE-COLUMN system with specific constraints:

                    LEFT COLUMN (col-span-2): FIXED/STRICT
                    - Avatar picture frame (white bg, colored text)
                    - 3 stacked pill tags (Active/Former, Service Type, Account Code)
                    - Must NOT resize or reflow based on middle content

                    MIDDLE COLUMN (col-span-7): FLUID/ADAPTABLE
                    - Person name (must wrap/scale for long names)
                    - Address (must wrap/truncate for long addresses)
                    - Demographics tags (age, start date, gender/pronouns)
                    - MUST handle varying content lengths gracefully
                    - MUST NOT push or overlap left/right columns

                    RIGHT COLUMN (Notice Board): FIXED/STRICT (Absolutely Positioned)
                    - 430px wide, positioned absolutely at right-3 top-6
                    - Overlays on top of grid (not part of grid flow)
                    - Tab row reserves 430px right padding to accommodate
                    - Must NOT be pushed by middle content

                    Grid proportions: Left=2/12, Middle=7/12, Right=3/12 (reserved for overlay)
                    ============================================================
                */}
                {/* Hero Main Content Grid */}
                <div className="px-3 pt-2 pb-0 grid grid-cols-12 gap-4">

                    {/*
                        LEFT COLUMN: Avatar & Status Pills (FIXED - 2/12 columns)
                        Components: Picture frame + 3 pill tags
                        Behavior: Strict positioning, no reflow
                    */}
                    <div className="col-span-12 md:col-span-2 flex flex-col items-center gap-3">
                        {/* Square Avatar Frame */}
                        <div className="relative w-full aspect-square bg-white rounded-xl shadow-lg border-4 border-white/40 overflow-hidden group">
                            {hasPhoto ? (
                                <img
                                    src={person.personal.photo}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ backgroundColor: 'white', color: colors.primary }}
                                >
                                    <span className="text-5xl font-bold tracking-tighter">
                                        {person.personal.firstName[0]}{person.personal.lastName[0]}
                                    </span>
                                </div>
                            )}
                            {/* Camera Button - Always visible in Edit Mode, hover-only otherwise */}
                            {isEditMode && (
                                <button
                                    onClick={() => {
                                        // TODO: Open file picker for photo upload
                                        console.log('Upload photo clicked');
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white shadow-lg transition-all"
                                    title="Upload or change photo"
                                >
                                    <Camera size={14} />
                                </button>
                            )}
                        </div>

                        {/* Stacked Status Pills - Full Width */}
                        <div className="w-full space-y-2">
                            {/* First Pill: Active/Former Status - Bright lime green */}
                            <div
                                className="w-full text-white py-1.5 px-3 rounded-lg text-center font-bold text-xs shadow-md uppercase tracking-wider border-2"
                                style={{
                                    backgroundColor: '#22C55E',
                                    borderColor: '#16A34A'
                                }}
                            >
                                {person.tenancy.tenancyStatus === 'Former' ? 'Former' : 'Active'}
                            </div>

                            {/* Second Pill: Service Type - Bright colors based on service type */}
                            <div
                                className="w-full text-white py-1.5 px-3 rounded-lg text-center font-bold text-xs shadow-md uppercase tracking-wider backdrop-blur-sm border-2"
                                style={{
                                    backgroundColor: serviceType === 'Supported Living' ? '#6BD052' :
                                                    serviceType === 'Residential Care' ? '#60A5FA' :
                                                    '#FB7185',
                                    borderColor: serviceType === 'Supported Living' ? '#4ade80' :
                                                serviceType === 'Residential Care' ? '#3b82f6' :
                                                '#f43f5e'
                                }}
                            >
                                {serviceType}
                            </div>

                            {/* Third Pill: Account Code - White with dark green border */}
                            <div className="w-full bg-white text-ivolve-dark py-1.5 px-3 rounded-lg text-center font-bold text-xs shadow-md uppercase tracking-wider border-2 border-ivolve-dark">
                                P-{person.id.slice(-6).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/*
                        MIDDLE COLUMN: Personal Information (FLUID - 7/12 columns)
                        Components: Name, address, demographics
                        Behavior: MUST adapt to varying content lengths
                        Constraints: Must not extend under Notice Board (max-width enforced)
                    */}
                    <div className="col-span-12 md:col-span-7 pt-2 pr-2">
                        {/* ID Code with Warning Icon */}
                        <div className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                            <span>CODE: P-{person.id.slice(-6).toUpperCase()}</span>
                            {person.warning && hasAcknowledgedWarning && (
                                <WarningIcon onClick={handleWarningIconClick} size="small" />
                            )}
                        </div>

                        {/* Name - Responsive sizing for varying lengths */}
                        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight leading-none break-words pr-4 max-w-full">
                            {displayName}
                        </h1>

                        {/* Address - Wraps for long addresses, max-width prevents overlap */}
                        <div className="flex items-start gap-2 text-white/90 text-base mb-6 bg-white/10 w-fit max-w-full px-4 py-2 rounded-lg backdrop-blur-sm">
                            <MapPin size={18} className="shrink-0 mt-0.5" />
                            <span className="font-medium break-words">{person.tenancy.propertyAddress || 'No Address Assigned'}</span>
                        </div>

                        {/* Demographics Grid - 2x4 Layout (2 columns, 4 rows - matches address width) */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-white/80" style={{ maxWidth: person.tenancy.propertyAddress ? 'max-content' : '600px' }}>
                            {/* Row 1: Age + Available */}
                            {age && (
                                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
                                    <User size={14} />
                                    <span className="font-semibold text-white">{age} years old</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-md border border-white/10">
                                <span className="text-white/40 text-xs italic">Available</span>
                            </div>

                            {/* Row 2: Start Date + End Date */}
                            {person.tenancy.moveInDate && (
                                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
                                    <span className="opacity-70">Start:</span>
                                    <span className="font-semibold text-white text-xs">{new Date(person.tenancy.moveInDate).toLocaleDateString('en-GB')}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
                                <span className="opacity-70">End:</span>
                                <span className="font-semibold text-white/60 text-xs">
                                    {person.tenancy.tenancyStatus === 'Former' && person.tenancy.moveOutDate
                                        ? new Date(person.tenancy.moveOutDate).toLocaleDateString('en-GB')
                                        : '--/--/----'}
                                </span>
                            </div>

                            {/* Row 3: Gender + Available */}
                            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
                                <span className="font-semibold text-white">Female (She/Her)</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-md border border-white/10">
                                <span className="text-white/40 text-xs italic">Available</span>
                            </div>

                            {/* Row 4: Available + Available */}
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-md border border-white/10">
                                <span className="text-white/40 text-xs italic">Available</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-md border border-white/10">
                                <span className="text-white/40 text-xs italic">Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                    NOTICE BOARD (RIGHT COLUMN - FIXED, Absolutely Positioned)
                    Position: absolute right-3 top-6 (24px from top, 12px from right)
                    Size: 430px wide × 350px tall
                    Z-index: z-20 (overlays on top of grid)
                    Behavior: STRICT positioning, not affected by grid content

                    REPLICATION NOTES FOR OTHER PROFILES:
                    1. Notice Board must use exact className: "absolute right-3 top-6 shadow-2xl"
                    2. Parent container must have position:relative (hero banner has this)
                    3. Tab row must reserve 430px right padding: pr-[430px]
                    4. Grid middle column should use col-span-7 to leave space
                    5. Total layout: Left(2) + Middle(7) + Right overlay(430px) = 12 column grid
                */}
                <QuickAccessToolbox
                    person={person}
                    serviceType={serviceType}
                    className="absolute right-3 top-6 shadow-2xl"
                />

                {/*
                    BOTTOM TAB ROW (Single Line - No Wrapping)
                    Right Padding: pr-[430px] - CRITICAL for Notice Board clearance
                    Layout: 12 tabs condensed to fit in single row without scrolling
                    Sizing: Reduced to fit all tabs (10px text, 12px icons, 6px padding)
                */}
                <div className="w-full bg-black/10 backdrop-blur-sm border-t border-white/10 mt-6 pr-[420px]">
                    <div className="flex px-2 gap-0.5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`
                                        flex items-center gap-0.5 px-1.5 py-2 text-[9px] font-semibold transition-all duration-200 border-b-4 whitespace-nowrap
                                        ${isActive
                                            ? 'border-white text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                            : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={11} className={isActive ? 'text-white' : 'text-white/60'} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Notes Sidebar */}
            <AddNoteSidebar
                isOpen={isNotesSidebarOpen}
                onClose={() => setIsNotesSidebarOpen(false)}
                onSave={handleSaveNote}
                entityType="Person"
                entityId={person.id}
                entityName={displayName}
            />

            {/* Warning Banner Modal - Auto-popup on profile load */}
            <WarningBannerModal
                warning={person.warning}
                isOpen={showWarningBanner}
                onClose={handleWarningBannerClose}
                onEdit={handleEditWarning}
                onRemove={handleRemoveWarning}
                entityType="Person"
                entityName={displayName}
            />

            {/* Add/Edit Warning Modal */}
            <AddWarningModal
                isOpen={showAddWarningModal}
                onClose={() => setShowAddWarningModal(false)}
                onSave={handleSaveWarning}
                existingWarning={person.warning}
                entityType="Person"
                entityName={displayName}
            />
        </div>
    );
}
