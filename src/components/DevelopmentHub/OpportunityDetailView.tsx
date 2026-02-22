import { useState } from 'react';
import {
    X,
    Building,
    MapPin,
    User,
    PoundSterling,
    Calendar,
    Tag,
    ArrowRight,
    Trophy,
    XCircle,
    FileText,
    Link,
    MessageSquare,
    Clock,
    Users,
    Briefcase,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
    Opportunity,
    OpportunityStage,
    LostReason,
    OPPORTUNITY_STAGES,
    LOST_REASONS,
    getDaysInStage,
    getStageUrgency,
    getPropertyTypeColor,
    getOpportunityTypeColor,
    getRelationshipStrengthDisplay,
    getUrgencyLevelColor,
    formatCurrency,
    generateId
} from '../../types/opportunities';
import OpportunityTimeline from './OpportunityTimeline';

interface OpportunityDetailViewProps {
    opportunity: Opportunity;
    onClose: () => void;
    onUpdate: (updatedOpportunity: Opportunity) => void;
    onDelete: (opportunityId: string) => void;
}

type TabType = 'overview' | 'timeline' | 'documents' | 'notes';

export default function OpportunityDetailView({
    opportunity,
    onClose,
    onUpdate,
    onDelete
}: OpportunityDetailViewProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [showMoveStageModal, setShowMoveStageModal] = useState(false);
    const [showMarkWonModal, setShowMarkWonModal] = useState(false);
    const [showMarkLostModal, setShowMarkLostModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Move stage state
    const [targetStage, setTargetStage] = useState<OpportunityStage>(opportunity.currentStage);
    const [stageNotes, setStageNotes] = useState('');

    // Mark lost state
    const [lostReason, setLostReason] = useState<LostReason>('Other');
    const [lostNotes, setLostNotes] = useState('');

    // Add note state
    const [newNoteContent, setNewNoteContent] = useState('');

    const daysInStage = getDaysInStage(opportunity.currentStageStartDate);
    const urgency = getStageUrgency(daysInStage);
    const propertyTypeColors = getPropertyTypeColor(opportunity.propertyType);
    const opportunityTypeColors = getOpportunityTypeColor(opportunity.opportunityType);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const celebrateWin = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handleMoveStage = () => {
        const now = new Date().toISOString();
        const updatedOpportunity: Opportunity = {
            ...opportunity,
            currentStage: targetStage,
            currentStageStartDate: now,
            updatedAt: now,
            stageHistory: [
                ...opportunity.stageHistory,
                {
                    id: generateId(),
                    fromStage: opportunity.currentStage,
                    toStage: targetStage,
                    movedBy: opportunity.opportunityOwner, // In real app, use logged-in user
                    movedAt: now,
                    notes: stageNotes.trim() || undefined
                }
            ]
        };

        onUpdate(updatedOpportunity);
        setShowMoveStageModal(false);
        setStageNotes('');
    };

    const handleMarkWon = () => {
        const now = new Date().toISOString();
        celebrateWin();

        const updatedOpportunity: Opportunity = {
            ...opportunity,
            status: 'Won',
            currentStage: 'Contract Signed',
            wonDate: now,
            currentStageStartDate: now,
            updatedAt: now,
            stageHistory: [
                ...opportunity.stageHistory,
                {
                    id: generateId(),
                    fromStage: opportunity.currentStage,
                    toStage: 'Contract Signed',
                    movedBy: opportunity.opportunityOwner,
                    movedAt: now,
                    notes: 'Opportunity won! Contract signed.'
                }
            ]
        };

        onUpdate(updatedOpportunity);
        setShowMarkWonModal(false);

        // Show celebration for a moment before closing
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    const handleMarkLost = () => {
        const now = new Date().toISOString();
        const updatedOpportunity: Opportunity = {
            ...opportunity,
            status: 'Lost',
            currentStage: 'Lost',
            lostDate: now,
            lostReason,
            lostNotes: lostNotes.trim() || undefined,
            currentStageStartDate: now,
            updatedAt: now,
            stageHistory: [
                ...opportunity.stageHistory,
                {
                    id: generateId(),
                    fromStage: opportunity.currentStage,
                    toStage: 'Lost',
                    movedBy: opportunity.opportunityOwner,
                    movedAt: now,
                    notes: `Lost - ${lostReason}: ${lostNotes.trim() || 'No additional details'}`
                }
            ]
        };

        onUpdate(updatedOpportunity);
        setShowMarkLostModal(false);
        onClose();
    };

    const handleAddNote = () => {
        if (!newNoteContent.trim()) return;

        const now = new Date().toISOString();
        const newNote = {
            id: generateId(),
            content: newNoteContent.trim(),
            createdBy: opportunity.opportunityOwner, // In real app, use logged-in user
            createdAt: now
        };

        const updatedOpportunity: Opportunity = {
            ...opportunity,
            notes: [...opportunity.notes, newNote],
            updatedAt: now
        };

        onUpdate(updatedOpportunity);
        setNewNoteContent('');
    };

    const handleDelete = () => {
        onDelete(opportunity.id);
        onClose();
    };

    // Urgency badge
    const urgencyBadge = urgency !== 'green' && (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                urgency === 'red'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-amber-100 text-amber-700 border-amber-300'
            }`}
        >
            {urgency === 'red' ? 'At Risk' : 'Stalled'}
        </span>
    );

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden mx-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Building size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-1">{opportunity.name}</h2>
                                        {opportunity.propertyAddress && (
                                            <p className="text-white/90 text-sm flex items-center gap-1">
                                                <MapPin size={14} />
                                                {opportunity.propertyAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Opportunity Type Badge */}
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${opportunityTypeColors.bg} ${opportunityTypeColors.text} ${opportunityTypeColors.border}`}
                                    >
                                        <Briefcase size={14} />
                                        {opportunity.opportunityType}
                                    </span>

                                    {/* Property Type Badge */}
                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${propertyTypeColors.bg} ${propertyTypeColors.text} ${propertyTypeColors.border}`}
                                    >
                                        {opportunity.propertyType}
                                    </span>

                                    {/* Stage Badge */}
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
                                        {opportunity.currentStage}
                                    </span>

                                    {/* Urgency Badge */}
                                    {urgencyBadge}

                                    {/* Annual Value */}
                                    {opportunity.annualContractValue && (
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold border border-white/30">
                                            {formatCurrency(opportunity.annualContractValue)}/yr
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4">
                            <button
                                onClick={() => setShowMoveStageModal(true)}
                                disabled={opportunity.status !== 'Active'}
                                className="px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Move Stage
                            </button>
                            <button
                                onClick={() => setShowMarkWonModal(true)}
                                disabled={opportunity.status !== 'Active'}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trophy size={16} />
                                Mark Won
                            </button>
                            <button
                                onClick={() => setShowMarkLostModal(true)}
                                disabled={opportunity.status !== 'Active'}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/20 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Mark Lost
                            </button>
                            <div className="flex-1" />
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600/20 backdrop-blur-sm text-white border border-red-300/30 rounded-lg hover:bg-red-600/30 transition-all font-semibold text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="flex px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: Building },
                                { id: 'timeline', label: 'Timeline', icon: Clock },
                                { id: 'documents', label: 'Documents', icon: FileText },
                                { id: 'notes', label: 'Notes', icon: MessageSquare }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                        {tab.id === 'notes' && opportunity.notes.length > 0 && (
                                            <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                                {opportunity.notes.length}
                                            </span>
                                        )}
                                        {tab.id === 'documents' && opportunity.documents.length > 0 && (
                                            <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                                {opportunity.documents.length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-300px)] p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Key Details Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Opportunity Owner
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{opportunity.opportunityOwner}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Units / Beds
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {opportunity.numberOfUnits || '-'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <PoundSterling size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Annual Value
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-amber-600">
                                            {formatCurrency(opportunity.annualContractValue)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Target Start
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatDate(opportunity.targetContractStartDate)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Days in Stage
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{daysInStage} days</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building size={16} className="text-gray-400" />
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Source
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{opportunity.opportunitySource}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                {opportunity.description && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                                            Description
                                        </h4>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{opportunity.description}</p>
                                    </div>
                                )}

                                {/* Source Contact */}
                                {(opportunity.sourceContactName ||
                                    opportunity.sourceContactPhone ||
                                    opportunity.sourceContactEmail) && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                                            Source Contact
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            {opportunity.sourceContactName && (
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Name:</span> {opportunity.sourceContactName}
                                                </p>
                                            )}
                                            {opportunity.sourceContactPhone && (
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Phone:</span> {opportunity.sourceContactPhone}
                                                </p>
                                            )}
                                            {opportunity.sourceContactEmail && (
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Email:</span> {opportunity.sourceContactEmail}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {opportunity.tags && opportunity.tags.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                                            <Tag size={14} />
                                            Tags
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {opportunity.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Property Listing Link */}
                                {opportunity.propertyListingURL && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                                            <Link size={14} />
                                            Property Listing
                                        </h4>
                                        <a
                                            href={opportunity.propertyListingURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                                        >
                                            <Link size={16} />
                                            View Property Listing
                                        </a>
                                    </div>
                                )}

                                {/* Stakeholders Section */}
                                {opportunity.stakeholders && Object.keys(opportunity.stakeholders).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <Users size={14} />
                                            Key Stakeholders
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Local Authority */}
                                            {opportunity.stakeholders.localAuthority && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                                                                Local Authority
                                                            </p>
                                                            <p className="font-semibold text-blue-900">
                                                                {opportunity.stakeholders.localAuthority.name}
                                                            </p>
                                                        </div>
                                                        {opportunity.stakeholders.localAuthority.relationshipStrength && (
                                                            <span className={`text-xl ${getRelationshipStrengthDisplay(opportunity.stakeholders.localAuthority.relationshipStrength).color}`}>
                                                                {getRelationshipStrengthDisplay(opportunity.stakeholders.localAuthority.relationshipStrength).icon}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {opportunity.stakeholders.localAuthority.contactName && (
                                                        <p className="text-sm text-blue-700 mt-2">
                                                            Contact: {opportunity.stakeholders.localAuthority.contactName}
                                                        </p>
                                                    )}
                                                    {opportunity.stakeholders.localAuthority.relationshipStrength && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            {getRelationshipStrengthDisplay(opportunity.stakeholders.localAuthority.relationshipStrength).label}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Registered Provider */}
                                            {opportunity.stakeholders.registeredProvider && (
                                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
                                                                Registered Provider
                                                            </p>
                                                            <p className="font-semibold text-purple-900">
                                                                {opportunity.stakeholders.registeredProvider.name}
                                                            </p>
                                                        </div>
                                                        {opportunity.stakeholders.registeredProvider.relationshipStrength && (
                                                            <span className={`text-xl ${getRelationshipStrengthDisplay(opportunity.stakeholders.registeredProvider.relationshipStrength).color}`}>
                                                                {getRelationshipStrengthDisplay(opportunity.stakeholders.registeredProvider.relationshipStrength).icon}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {opportunity.stakeholders.registeredProvider.contactName && (
                                                        <p className="text-sm text-purple-700 mt-2">
                                                            Contact: {opportunity.stakeholders.registeredProvider.contactName}
                                                        </p>
                                                    )}
                                                    {opportunity.stakeholders.registeredProvider.relationshipStrength && (
                                                        <p className="text-xs text-purple-600 mt-1">
                                                            {getRelationshipStrengthDisplay(opportunity.stakeholders.registeredProvider.relationshipStrength).label}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Care Provider */}
                                            {opportunity.stakeholders.careProvider && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                                                                Care Provider
                                                            </p>
                                                            <p className="font-semibold text-green-900">
                                                                {opportunity.stakeholders.careProvider.name}
                                                            </p>
                                                        </div>
                                                        {opportunity.stakeholders.careProvider.relationshipStrength && (
                                                            <span className={`text-xl ${getRelationshipStrengthDisplay(opportunity.stakeholders.careProvider.relationshipStrength).color}`}>
                                                                {getRelationshipStrengthDisplay(opportunity.stakeholders.careProvider.relationshipStrength).icon}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {opportunity.stakeholders.careProvider.contactName && (
                                                        <p className="text-sm text-green-700 mt-2">
                                                            Contact: {opportunity.stakeholders.careProvider.contactName}
                                                        </p>
                                                    )}
                                                    {opportunity.stakeholders.careProvider.relationshipStrength && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            {getRelationshipStrengthDisplay(opportunity.stakeholders.careProvider.relationshipStrength).label}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Commissioner */}
                                            {opportunity.stakeholders.commissioner && (
                                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
                                                                Commissioner
                                                            </p>
                                                            <p className="font-semibold text-indigo-900">
                                                                {opportunity.stakeholders.commissioner.name}
                                                            </p>
                                                        </div>
                                                        {opportunity.stakeholders.commissioner.relationshipStrength && (
                                                            <span className={`text-xl ${getRelationshipStrengthDisplay(opportunity.stakeholders.commissioner.relationshipStrength).color}`}>
                                                                {getRelationshipStrengthDisplay(opportunity.stakeholders.commissioner.relationshipStrength).icon}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {opportunity.stakeholders.commissioner.contactName && (
                                                        <p className="text-sm text-indigo-700 mt-2">
                                                            Contact: {opportunity.stakeholders.commissioner.contactName}
                                                        </p>
                                                    )}
                                                    {opportunity.stakeholders.commissioner.relationshipStrength && (
                                                        <p className="text-xs text-indigo-600 mt-1">
                                                            {getRelationshipStrengthDisplay(opportunity.stakeholders.commissioner.relationshipStrength).label}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Market Intelligence Section */}
                                {opportunity.marketContext && Object.keys(opportunity.marketContext).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <TrendingUp size={14} />
                                            Market Intelligence
                                        </h4>
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 space-y-3">
                                            {opportunity.marketContext.whyAvailable && (
                                                <div>
                                                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
                                                        Why Available
                                                    </p>
                                                    <p className="text-gray-900 font-medium">{opportunity.marketContext.whyAvailable}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                {opportunity.marketContext.urgencyLevel && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            Urgency Level
                                                        </p>
                                                        <span className={`inline-flex px-2 py-1 rounded-full text-sm font-semibold border ${getUrgencyLevelColor(opportunity.marketContext.urgencyLevel).bg} ${getUrgencyLevelColor(opportunity.marketContext.urgencyLevel).text} ${getUrgencyLevelColor(opportunity.marketContext.urgencyLevel).border}`}>
                                                            {opportunity.marketContext.urgencyLevel}
                                                        </span>
                                                    </div>
                                                )}

                                                {opportunity.marketContext.competitorCount !== undefined && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
                                                            Competitor Count
                                                        </p>
                                                        <p className="text-2xl font-bold text-orange-600">{opportunity.marketContext.competitorCount}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {opportunity.marketContext.competitorNames && opportunity.marketContext.competitorNames.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">
                                                        Known Competitors
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {opportunity.marketContext.competitorNames.map((competitor, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-white text-orange-700 rounded text-sm font-medium border border-orange-200"
                                                            >
                                                                {competitor}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Timeline Tab */}
                        {activeTab === 'timeline' && <OpportunityTimeline opportunity={opportunity} />}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Documents & Links
                                    </h4>
                                    <button className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                                        Upload Document
                                    </button>
                                </div>

                                {opportunity.documents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">No documents uploaded yet</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Upload proposals, contracts, or other documents
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {opportunity.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText size={20} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{doc.filename}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes Tab */}
                        {activeTab === 'notes' && (
                            <div>
                                {/* Add Note */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                                        Add Note
                                    </h4>
                                    <textarea
                                        value={newNoteContent}
                                        onChange={(e) => setNewNoteContent(e.target.value)}
                                        placeholder="Add a note about this opportunity..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!newNoteContent.trim()}
                                        className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Note
                                    </button>
                                </div>

                                {/* Notes List */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                        Previous Notes ({opportunity.notes.length})
                                    </h4>

                                    {opportunity.notes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                                            <p className="text-gray-500">No notes yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {opportunity.notes
                                                .slice()
                                                .reverse()
                                                .map((note) => (
                                                    <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <p className="text-gray-700 mb-2">{note.content}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {note.createdBy} - {formatDate(note.createdAt)}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Move Stage Modal */}
            {showMoveStageModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMoveStageModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Move to Next Stage</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Stage</label>
                                <select
                                    value={targetStage}
                                    onChange={(e) => setTargetStage(e.target.value as OpportunityStage)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                >
                                    {OPPORTUNITY_STAGES.filter((s) => s !== 'Lost').map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={stageNotes}
                                    onChange={(e) => setStageNotes(e.target.value)}
                                    placeholder="Any notes about this stage change..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowMoveStageModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMoveStage}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
                                >
                                    <ArrowRight size={16} />
                                    Move Stage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mark Won Modal */}
            {showMarkWonModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMarkWonModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="text-center mb-4">
                            <Trophy size={48} className="mx-auto text-green-500 mb-3" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Mark as Won?</h3>
                            <p className="text-gray-600">
                                Congratulations! Mark this opportunity as won and celebrate!
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowMarkWonModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMarkWon}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <Trophy size={16} />
                                Mark as Won
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mark Lost Modal */}
            {showMarkLostModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMarkLostModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Mark as Lost</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Help us learn: Why did we lose this opportunity?
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <select
                                    value={lostReason}
                                    onChange={(e) => setLostReason(e.target.value as LostReason)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                >
                                    {LOST_REASONS.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Details
                                </label>
                                <textarea
                                    value={lostNotes}
                                    onChange={(e) => setLostNotes(e.target.value)}
                                    placeholder="What could we have done differently?"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowMarkLostModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkLost}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <XCircle size={16} />
                                    Mark as Lost
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Opportunity?</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this opportunity? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
