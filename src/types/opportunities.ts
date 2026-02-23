/**
 * Development Hub - Enhanced Opportunity Types for Care & Support Sector
 *
 * Comprehensive data structures for tracking opportunities in the vulnerable adults
 * care and support sector, including properties, partnerships, frameworks, and service transfers.
 */

// ============================================
// ENHANCED OPPORTUNITY TYPES
// ============================================

export type OpportunityType =
    | 'Single Property'           // Individual property opportunity
    | 'Portfolio Acquisition'      // Multiple properties from one source
    | 'Partnership Agreement'      // Strategic partnership with RP/Care Provider
    | 'Framework Agreement'        // Get on LA approved provider list
    | 'Service Transfer'           // Take over existing service
    | 'Development Partnership'    // Partner on new-build scheme
    | 'Investment Deal';           // Investor-backed opportunity

export type OpportunityStage =
    | 'Leads'
    | 'Contact Made'
    | 'Site Visit Scheduled'
    | 'Proposal Submitted'
    | 'Negotiation'
    | 'CIC Review'
    | 'Due Diligence'
    | 'Contract Signed'
    | 'In Development'
    | 'Launched'
    | 'Lost';

export type OpportunityStatus = 'Active' | 'Won' | 'Lost';

export type OpportunityPropertyType =
    | 'Supported Living'
    | 'Residential Care'
    | 'Nursing Care'
    | 'Day Centre'
    | 'Office'
    | 'Training Facility'
    | 'Other';

export type OpportunitySource =
    | 'Direct Enquiry'
    | 'Registered Provider'
    | 'Commissioner'
    | 'Property Agent'
    | 'Word of Mouth'
    | 'Online Listing'
    | 'CQC Alert'              // New: Failed inspection = opportunity
    | 'Existing Relationship'   // New: Warm lead from current partner
    | 'Market Intelligence'     // New: Proactive market research
    | 'Other';

export type LostReason =
    | 'Price'
    | 'Timeline'
    | 'Competition'
    | 'Location'
    | 'Suitability'
    | 'Relationship'            // New: They went with someone they know
    | 'Capacity'                // New: We didn't have resources
    | 'Other';

// ============================================
// RELATIONSHIP & STAKEHOLDER TYPES
// ============================================

export type RelationshipStrength = 'Cold' | 'Warm' | 'Hot' | 'Partner';

export type StakeholderType =
    | 'Local Authority'
    | 'Registered Provider'
    | 'Care Provider'
    | 'Commissioner'
    | 'Developer'
    | 'Investor'
    | 'Other';

export interface Stakeholder {
    name: string;
    type: StakeholderType;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    relationshipStrength?: RelationshipStrength;
    notes?: string;
}

// ============================================
// MARKET CONTEXT TYPES
// ============================================

export type AvailabilityReason =
    | 'New Development'
    | 'Provider Failed CQC'
    | 'Provider Pulled Out'
    | 'Contract Ended'
    | 'RP Portfolio Sale'
    | 'LA New Tender'
    | 'Expansion Opportunity'
    | 'Other';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MarketContext {
    whyAvailable?: AvailabilityReason;
    urgencyLevel?: UrgencyLevel;
    competitorCount?: number;
    competitorNames?: string[];
    commissionerBudget?: number;
    tenderDeadline?: string;
    additionalContext?: string;
}

// ============================================
// SUPPORTING INTERFACES
// ============================================

export interface StageHistoryEntry {
    id: string;
    fromStage?: OpportunityStage;
    toStage: OpportunityStage;
    movedBy: string;
    movedAt: string;
    notes?: string;
}

export interface OpportunityNote {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

export interface OpportunityDocument {
    id: string;
    filename: string;
    fileType: 'pdf' | 'docx' | 'jpg' | 'png' | 'url' | 'other';
    url?: string;
    uploadedBy: string;
    uploadedAt: string;
}

// ============================================
// MAIN OPPORTUNITY INTERFACE (ENHANCED)
// ============================================

export interface Opportunity {
    id: string;

    // Basic Info
    name: string;
    opportunityType: OpportunityType;          // NEW: Type of opportunity
    propertyType: OpportunityPropertyType;
    propertyAddress?: string;
    numberOfUnits?: number;
    annualContractValue?: number;

    // Source Information
    opportunitySource: OpportunitySource;
    sourceContactName?: string;
    sourceContactPhone?: string;
    sourceContactEmail?: string;

    // Ownership
    opportunityOwner: string;
    landlordRPName?: string;

    // NEW: Multi-Party Stakeholders
    stakeholders?: {
        localAuthority?: Stakeholder;
        registeredProvider?: Stakeholder;
        careProvider?: Stakeholder;
        commissioner?: Stakeholder;
        developer?: Stakeholder;
        investor?: Stakeholder;
    };

    // NEW: Market Intelligence
    marketContext?: MarketContext;

    // Stage & Status
    currentStage: OpportunityStage;
    status: OpportunityStatus;
    lostReason?: LostReason;
    lostNotes?: string;

    // Dates
    targetContractStartDate?: string;
    createdAt: string;
    updatedAt: string;
    currentStageStartDate: string;
    wonDate?: string;
    lostDate?: string;

    // Details
    description?: string;
    tags?: string[];
    propertyListingURL?: string;

    // Links (future integration)
    linkedProjectId?: string;
    linkedPropertyIds?: string[];      // NEW: Link to properties in system
    linkedPeopleIds?: string[];        // NEW: Link to people in system

    // Activity Tracking
    stageHistory: StageHistoryEntry[];
    notes: OpportunityNote[];
    documents: OpportunityDocument[];
}

// ============================================
// HELPER CONSTANTS
// ============================================

export const OPPORTUNITY_TYPES: OpportunityType[] = [
    'Single Property',
    'Portfolio Acquisition',
    'Partnership Agreement',
    'Framework Agreement',
    'Service Transfer',
    'Development Partnership',
    'Investment Deal'
];

export const OPPORTUNITY_STAGES: OpportunityStage[] = [
    'Leads',
    'Contact Made',
    'Site Visit Scheduled',
    'Proposal Submitted',
    'Negotiation',
    'CIC Review',
    'Due Diligence',
    'Contract Signed',
    'In Development',
    'Launched',
    'Lost'
];

export const ACTIVE_STAGES: OpportunityStage[] = [
    'Leads',
    'Contact Made',
    'Site Visit Scheduled',
    'Proposal Submitted',
    'Negotiation',
    'CIC Review',
    'Due Diligence'
];

export const WON_STAGES: OpportunityStage[] = [
    'Contract Signed',
    'In Development',
    'Launched'
];

export const PROPERTY_TYPES: OpportunityPropertyType[] = [
    'Supported Living',
    'Residential Care',
    'Nursing Care',
    'Day Centre',
    'Office',
    'Training Facility',
    'Other'
];

export const OPPORTUNITY_SOURCES: OpportunitySource[] = [
    'Direct Enquiry',
    'Registered Provider',
    'Commissioner',
    'Property Agent',
    'Word of Mouth',
    'Online Listing',
    'CQC Alert',
    'Existing Relationship',
    'Market Intelligence',
    'Other'
];

export const LOST_REASONS: LostReason[] = [
    'Price',
    'Timeline',
    'Competition',
    'Location',
    'Suitability',
    'Relationship',
    'Capacity',
    'Other'
];

export const RELATIONSHIP_STRENGTHS: RelationshipStrength[] = [
    'Cold',
    'Warm',
    'Hot',
    'Partner'
];

export const AVAILABILITY_REASONS: AvailabilityReason[] = [
    'New Development',
    'Provider Failed CQC',
    'Provider Pulled Out',
    'Contract Ended',
    'RP Portfolio Sale',
    'LA New Tender',
    'Expansion Opportunity',
    'Other'
];

export const URGENCY_LEVELS: UrgencyLevel[] = [
    'Low',
    'Medium',
    'High',
    'Critical'
];

// Team members for assignment dropdown
export const TEAM_MEMBERS = [
    'Matt Fay',
    'Sarah Johnson',
    'James Wilson',
    'Emma Thompson',
    'Michael Brown'
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate days in current stage
 */
export function getDaysInStage(stageStartDate: string): number {
    const start = new Date(stageStartDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Get urgency level based on days in stage
 */
export function getStageUrgency(daysInStage: number): 'green' | 'amber' | 'red' {
    if (daysInStage > 30) return 'red';
    if (daysInStage > 14) return 'amber';
    return 'green';
}

/**
 * Get stage index for progression checks
 */
export function getStageIndex(stage: OpportunityStage): number {
    return OPPORTUNITY_STAGES.indexOf(stage);
}

/**
 * Check if can move to target stage (enforce sequential progression)
 */
export function canMoveToStage(currentStage: OpportunityStage, targetStage: OpportunityStage): boolean {
    const currentIndex = getStageIndex(currentStage);
    const targetIndex = getStageIndex(targetStage);

    // Can move backward freely
    if (targetIndex < currentIndex) return true;

    // Can move to Lost from any stage
    if (targetStage === 'Lost') return true;

    // Allow all moves but UI can show warning
    return true;
}

/**
 * Get property type color classes
 */
export function getPropertyTypeColor(propertyType: OpportunityPropertyType): {
    bg: string;
    text: string;
    border: string;
} {
    switch (propertyType) {
        case 'Supported Living':
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
        case 'Residential Care':
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
        case 'Nursing Care':
            return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' };
        case 'Day Centre':
            return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' };
        case 'Office':
            return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
        case 'Training Facility':
            return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
}

/**
 * Get opportunity type color classes
 */
export function getOpportunityTypeColor(opportunityType: OpportunityType): {
    bg: string;
    text: string;
    border: string;
} {
    switch (opportunityType) {
        case 'Single Property':
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
        case 'Portfolio Acquisition':
            return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' };
        case 'Partnership Agreement':
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
        case 'Framework Agreement':
            return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' };
        case 'Service Transfer':
            return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
        case 'Development Partnership':
            return { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' };
        case 'Investment Deal':
            return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
}

/**
 * Get relationship strength color and icon
 */
export function getRelationshipStrengthDisplay(strength: RelationshipStrength): {
    color: string;
    icon: string;
    label: string;
} {
    switch (strength) {
        case 'Cold':
            return { color: 'text-gray-500', icon: '❄️', label: 'Cold Lead' };
        case 'Warm':
            return { color: 'text-yellow-600', icon: '🌤️', label: 'Warm Lead' };
        case 'Hot':
            return { color: 'text-orange-600', icon: '🔥', label: 'Hot Lead' };
        case 'Partner':
            return { color: 'text-green-600', icon: '🤝', label: 'Active Partner' };
    }
}

/**
 * Get urgency level color
 */
export function getUrgencyLevelColor(urgency: UrgencyLevel): {
    bg: string;
    text: string;
    border: string;
} {
    switch (urgency) {
        case 'Low':
            return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
        case 'Medium':
            return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
        case 'High':
            return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
        case 'Critical':
            return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | undefined): string {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create initial stage history entry
 */
export function createInitialStageHistory(stage: OpportunityStage, createdBy: string): StageHistoryEntry {
    return {
        id: generateId(),
        toStage: stage,
        movedBy: createdBy,
        movedAt: new Date().toISOString()
    };
}
