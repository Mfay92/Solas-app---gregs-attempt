import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Building, MapPin, Users, PoundSterling, Phone, Mail, Link, Calendar, Tag, Briefcase, AlertCircle } from 'lucide-react';
import {
    Opportunity,
    OpportunityStage,
    OpportunityPropertyType,
    OpportunitySource,
    OpportunityType,
    RelationshipStrength,
    AvailabilityReason,
    UrgencyLevel,
    PROPERTY_TYPES,
    OPPORTUNITY_SOURCES,
    OPPORTUNITY_STAGES,
    OPPORTUNITY_TYPES,
    RELATIONSHIP_STRENGTHS,
    AVAILABILITY_REASONS,
    URGENCY_LEVELS,
    TEAM_MEMBERS,
    generateId,
    createInitialStageHistory
} from '../../types/opportunities';

interface AddOpportunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (opportunity: Opportunity) => void;
}

export default function AddOpportunityModal({ isOpen, onClose, onAdd }: AddOpportunityModalProps) {
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    // Form state - Essential fields
    const [name, setName] = useState('');
    const [opportunityType, setOpportunityType] = useState<OpportunityType>('Single Property');
    const [propertyType, setPropertyType] = useState<OpportunityPropertyType>('Supported Living');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [numberOfUnits, setNumberOfUnits] = useState<number | ''>('');
    const [annualContractValue, setAnnualContractValue] = useState<number | ''>('');
    const [opportunitySource, setOpportunitySource] = useState<OpportunitySource>('Direct Enquiry');
    const [sourceContactName, setSourceContactName] = useState('');
    const [opportunityOwner, setOpportunityOwner] = useState(TEAM_MEMBERS[0]);
    const [currentStage, setCurrentStage] = useState<OpportunityStage>('Leads');

    // Form state - Optional fields
    const [landlordRPName, setLandlordRPName] = useState('');
    const [sourceContactPhone, setSourceContactPhone] = useState('');
    const [sourceContactEmail, setSourceContactEmail] = useState('');
    const [propertyListingURL, setPropertyListingURL] = useState('');
    const [targetContractStartDate, setTargetContractStartDate] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    // Stakeholder fields
    const [laName, setLaName] = useState('');
    const [laContact, setLaContact] = useState('');
    const [laRelationship, setLaRelationship] = useState<RelationshipStrength>('Cold');
    const [rpName, setRpName] = useState('');
    const [rpContact, setRpContact] = useState('');
    const [rpRelationship, setRpRelationship] = useState<RelationshipStrength>('Cold');
    const [careProviderName, setCareProviderName] = useState('');
    const [careProviderContact, setCareProviderContact] = useState('');
    const [careProviderRelationship, setCareProviderRelationship] = useState<RelationshipStrength>('Cold');
    const [commissionerName, setCommissionerName] = useState('');
    const [commissionerContact, setCommissionerContact] = useState('');
    const [commissionerRelationship, setCommissionerRelationship] = useState<RelationshipStrength>('Cold');

    // Market Context fields
    const [whyAvailable, setWhyAvailable] = useState<AvailabilityReason | ''>('');
    const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | ''>('');
    const [competitorCount, setCompetitorCount] = useState<number | ''>('');
    const [competitorNames, setCompetitorNames] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        setName('');
        setOpportunityType('Single Property');
        setPropertyType('Supported Living');
        setPropertyAddress('');
        setNumberOfUnits('');
        setAnnualContractValue('');
        setOpportunitySource('Direct Enquiry');
        setSourceContactName('');
        setOpportunityOwner(TEAM_MEMBERS[0]);
        setCurrentStage('Leads');
        setLandlordRPName('');
        setSourceContactPhone('');
        setSourceContactEmail('');
        setPropertyListingURL('');
        setTargetContractStartDate('');
        setDescription('');
        setTags('');
        // Stakeholders
        setLaName('');
        setLaContact('');
        setLaRelationship('Cold');
        setRpName('');
        setRpContact('');
        setRpRelationship('Cold');
        setCareProviderName('');
        setCareProviderContact('');
        setCareProviderRelationship('Cold');
        setCommissionerName('');
        setCommissionerContact('');
        setCommissionerRelationship('Cold');
        // Market Context
        setWhyAvailable('');
        setUrgencyLevel('');
        setCompetitorCount('');
        setCompetitorNames('');
        setShowMoreDetails(false);
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Opportunity name is required';
        }
        if (!propertyType) {
            newErrors.propertyType = 'Property type is required';
        }
        if (!opportunitySource) {
            newErrors.opportunitySource = 'Opportunity source is required';
        }
        if (!opportunityOwner) {
            newErrors.opportunityOwner = 'Opportunity owner is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const now = new Date().toISOString();

        // Build stakeholders object
        const stakeholders: any = {};
        if (laName.trim()) {
            stakeholders.localAuthority = {
                name: laName.trim(),
                type: 'Local Authority' as const,
                contactName: laContact.trim() || undefined,
                relationshipStrength: laRelationship
            };
        }
        if (rpName.trim()) {
            stakeholders.registeredProvider = {
                name: rpName.trim(),
                type: 'Registered Provider' as const,
                contactName: rpContact.trim() || undefined,
                relationshipStrength: rpRelationship
            };
        }
        if (careProviderName.trim()) {
            stakeholders.careProvider = {
                name: careProviderName.trim(),
                type: 'Care Provider' as const,
                contactName: careProviderContact.trim() || undefined,
                relationshipStrength: careProviderRelationship
            };
        }
        if (commissionerName.trim()) {
            stakeholders.commissioner = {
                name: commissionerName.trim(),
                type: 'Commissioner' as const,
                contactName: commissionerContact.trim() || undefined,
                relationshipStrength: commissionerRelationship
            };
        }

        // Build market context object
        const marketContext: any = {};
        if (whyAvailable) marketContext.whyAvailable = whyAvailable;
        if (urgencyLevel) marketContext.urgencyLevel = urgencyLevel;
        if (competitorCount !== '') marketContext.competitorCount = competitorCount;
        if (competitorNames.trim()) {
            marketContext.competitorNames = competitorNames.split(',').map(c => c.trim()).filter(Boolean);
        }

        const newOpportunity: Opportunity = {
            id: generateId(),
            name: name.trim(),
            opportunityType,
            propertyType,
            propertyAddress: propertyAddress.trim() || undefined,
            numberOfUnits: numberOfUnits === '' ? undefined : numberOfUnits,
            annualContractValue: annualContractValue === '' ? undefined : annualContractValue,
            opportunitySource,
            sourceContactName: sourceContactName.trim() || undefined,
            sourceContactPhone: sourceContactPhone.trim() || undefined,
            sourceContactEmail: sourceContactEmail.trim() || undefined,
            opportunityOwner,
            landlordRPName: landlordRPName.trim() || undefined,
            stakeholders: Object.keys(stakeholders).length > 0 ? stakeholders : undefined,
            marketContext: Object.keys(marketContext).length > 0 ? marketContext : undefined,
            currentStage,
            status: 'Active',
            targetContractStartDate: targetContractStartDate || undefined,
            createdAt: now,
            updatedAt: now,
            currentStageStartDate: now,
            description: description.trim() || undefined,
            tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
            propertyListingURL: propertyListingURL.trim() || undefined,
            stageHistory: [createInitialStageHistory(currentStage, opportunityOwner)],
            notes: [],
            documents: []
        };

        onAdd(newOpportunity);
        resetForm();
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <Building size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Opportunity</h2>
                                <p className="text-white/80 text-sm">Track a new business lead</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="p-6 space-y-6">
                        {/* Essential Fields Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Essential Information
                            </h3>

                            {/* Opportunity Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opportunity Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., 5-bed house, Stockport Road"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Opportunity Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opportunity Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                    <select
                                        value={opportunityType}
                                        onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none bg-white"
                                    >
                                        {OPPORTUNITY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {opportunityType === 'Single Property' && 'Individual property opportunity'}
                                    {opportunityType === 'Portfolio Acquisition' && 'Multiple properties from one source'}
                                    {opportunityType === 'Partnership Agreement' && 'Strategic partnership with RP/Care Provider'}
                                    {opportunityType === 'Framework Agreement' && 'Get on LA approved provider list'}
                                    {opportunityType === 'Service Transfer' && 'Take over existing service'}
                                    {opportunityType === 'Development Partnership' && 'Partner on new-build scheme'}
                                    {opportunityType === 'Investment Deal' && 'Investor-backed opportunity'}
                                </p>
                            </div>

                            {/* Property Type & Units Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value as OpportunityPropertyType)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    >
                                        {PROPERTY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Units
                                    </label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={numberOfUnits}
                                            onChange={(e) => setNumberOfUnits(e.target.value === '' ? '' : parseInt(e.target.value))}
                                            placeholder="e.g., 5"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Property Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Address
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={propertyAddress}
                                        onChange={(e) => setPropertyAddress(e.target.value)}
                                        placeholder="e.g., 123 High Street, Manchester, M1 1AA"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Annual Contract Value */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Annual Contract Value
                                </label>
                                <div className="relative">
                                    <PoundSterling size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={annualContractValue}
                                        onChange={(e) => setAnnualContractValue(e.target.value === '' ? '' : parseInt(e.target.value))}
                                        placeholder="e.g., 240000"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Estimated annual revenue from this opportunity</p>
                            </div>

                            {/* Source & Contact Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Opportunity Source <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={opportunitySource}
                                        onChange={(e) => setOpportunitySource(e.target.value as OpportunitySource)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    >
                                        {OPPORTUNITY_SOURCES.map(source => (
                                            <option key={source} value={source}>{source}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Source Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        value={sourceContactName}
                                        onChange={(e) => setSourceContactName(e.target.value)}
                                        placeholder="Who told you about this?"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Owner & Stage Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Opportunity Owner <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={opportunityOwner}
                                        onChange={(e) => setOpportunityOwner(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    >
                                        {TEAM_MEMBERS.map(member => (
                                            <option key={member} value={member}>{member}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Initial Stage
                                    </label>
                                    <select
                                        value={currentStage}
                                        onChange={(e) => setCurrentStage(e.target.value as OpportunityStage)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    >
                                        {OPPORTUNITY_STAGES.filter(s => s !== 'Lost').map(stage => (
                                            <option key={stage} value={stage}>{stage}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* More Details Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                        >
                            {showMoreDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            {showMoreDetails ? 'Hide' : 'Show'} More Details
                        </button>

                        {/* Optional Fields Section */}
                        {showMoreDetails && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Additional Details
                                </h3>

                                {/* Landlord/RP Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Landlord / RP Name
                                    </label>
                                    <input
                                        type="text"
                                        value={landlordRPName}
                                        onChange={(e) => setLandlordRPName(e.target.value)}
                                        placeholder="Property owner or registered provider"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Contact Phone & Email */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Source Contact Phone
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={sourceContactPhone}
                                                onChange={(e) => setSourceContactPhone(e.target.value)}
                                                placeholder="07123 456789"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Source Contact Email
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={sourceContactEmail}
                                                onChange={(e) => setSourceContactEmail(e.target.value)}
                                                placeholder="contact@example.com"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Property Listing URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Listing URL
                                    </label>
                                    <div className="relative">
                                        <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            value={propertyListingURL}
                                            onChange={(e) => setPropertyListingURL(e.target.value)}
                                            placeholder="https://rightmove.co.uk/..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Target Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Contract Start Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={targetContractStartDate}
                                            onChange={(e) => setTargetContractStartDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags
                                    </label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="High Priority, Manchester, Quick Win (comma separated)"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes / Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Any additional details about this opportunity..."
                                        rows={3}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Stakeholders Section */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Users size={16} />
                                        Key Stakeholders
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-4">Track relationships with partners, commissioners, and providers</p>

                                    <div className="space-y-4">
                                        {/* Local Authority */}
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                                Local Authority / Commissioner
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={laName}
                                                    onChange={(e) => setLaName(e.target.value)}
                                                    placeholder="e.g., Manchester City Council"
                                                    className="px-3 py-2 border border-blue-200 rounded bg-white text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={laContact}
                                                    onChange={(e) => setLaContact(e.target.value)}
                                                    placeholder="Contact name"
                                                    className="px-3 py-2 border border-blue-200 rounded bg-white text-sm"
                                                />
                                            </div>
                                            {laName && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-blue-700 mb-1">Relationship Strength</label>
                                                    <select
                                                        value={laRelationship}
                                                        onChange={(e) => setLaRelationship(e.target.value as RelationshipStrength)}
                                                        className="w-full px-3 py-1.5 border border-blue-200 rounded bg-white text-sm"
                                                    >
                                                        {RELATIONSHIP_STRENGTHS.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Registered Provider */}
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                            <label className="block text-sm font-semibold text-purple-900 mb-2">
                                                Registered Provider / Landlord
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={rpName}
                                                    onChange={(e) => setRpName(e.target.value)}
                                                    placeholder="e.g., Great Places Housing"
                                                    className="px-3 py-2 border border-purple-200 rounded bg-white text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={rpContact}
                                                    onChange={(e) => setRpContact(e.target.value)}
                                                    placeholder="Contact name"
                                                    className="px-3 py-2 border border-purple-200 rounded bg-white text-sm"
                                                />
                                            </div>
                                            {rpName && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-purple-700 mb-1">Relationship Strength</label>
                                                    <select
                                                        value={rpRelationship}
                                                        onChange={(e) => setRpRelationship(e.target.value as RelationshipStrength)}
                                                        className="w-full px-3 py-1.5 border border-purple-200 rounded bg-white text-sm"
                                                    >
                                                        {RELATIONSHIP_STRENGTHS.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Care Provider */}
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <label className="block text-sm font-semibold text-green-900 mb-2">
                                                Care / Support Provider
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={careProviderName}
                                                    onChange={(e) => setCareProviderName(e.target.value)}
                                                    placeholder="e.g., ivolve"
                                                    className="px-3 py-2 border border-green-200 rounded bg-white text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={careProviderContact}
                                                    onChange={(e) => setCareProviderContact(e.target.value)}
                                                    placeholder="Contact name"
                                                    className="px-3 py-2 border border-green-200 rounded bg-white text-sm"
                                                />
                                            </div>
                                            {careProviderName && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-green-700 mb-1">Relationship Strength</label>
                                                    <select
                                                        value={careProviderRelationship}
                                                        onChange={(e) => setCareProviderRelationship(e.target.value as RelationshipStrength)}
                                                        className="w-full px-3 py-1.5 border border-green-200 rounded bg-white text-sm"
                                                    >
                                                        {RELATIONSHIP_STRENGTHS.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Commissioner */}
                                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                            <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                                Commissioner / Contract Manager
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={commissionerName}
                                                    onChange={(e) => setCommissionerName(e.target.value)}
                                                    placeholder="e.g., NHS Integrated Care Board"
                                                    className="px-3 py-2 border border-indigo-200 rounded bg-white text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={commissionerContact}
                                                    onChange={(e) => setCommissionerContact(e.target.value)}
                                                    placeholder="Contact name"
                                                    className="px-3 py-2 border border-indigo-200 rounded bg-white text-sm"
                                                />
                                            </div>
                                            {commissionerName && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-indigo-700 mb-1">Relationship Strength</label>
                                                    <select
                                                        value={commissionerRelationship}
                                                        onChange={(e) => setCommissionerRelationship(e.target.value as RelationshipStrength)}
                                                        className="w-full px-3 py-1.5 border border-indigo-200 rounded bg-white text-sm"
                                                    >
                                                        {RELATIONSHIP_STRENGTHS.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Market Intelligence Section */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        Market Intelligence
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-4">Context about why this opportunity is available and competitive landscape</p>

                                    <div className="space-y-3">
                                        {/* Why Available */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Why Available?
                                            </label>
                                            <select
                                                value={whyAvailable}
                                                onChange={(e) => setWhyAvailable(e.target.value as AvailabilityReason)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                                            >
                                                <option value="">Select reason...</option>
                                                {AVAILABILITY_REASONS.map(reason => (
                                                    <option key={reason} value={reason}>{reason}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Urgency & Competitors Row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Urgency Level
                                                </label>
                                                <select
                                                    value={urgencyLevel}
                                                    onChange={(e) => setUrgencyLevel(e.target.value as UrgencyLevel)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                                                >
                                                    <option value="">Select...</option>
                                                    {URGENCY_LEVELS.map(level => (
                                                        <option key={level} value={level}>{level}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Competitor Count
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={competitorCount}
                                                    onChange={(e) => setCompetitorCount(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                    placeholder="How many?"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Competitor Names */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Known Competitors
                                            </label>
                                            <input
                                                type="text"
                                                value={competitorNames}
                                                onChange={(e) => setCompetitorNames(e.target.value)}
                                                placeholder="Competitor names (comma separated)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-sm hover:shadow-md"
                        >
                            Create Opportunity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
