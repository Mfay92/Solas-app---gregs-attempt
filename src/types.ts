export type AssetType = 'Master' | 'Unit';
export type ManagementStatus = 'In Management' | 'Out of Management' | 'Occupied' | 'Void';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending' | 'Expired';
export type RepairStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
export type RepairPriority = 'Emergency' | 'Urgent' | 'Routine' | 'Planned';
export type TenancyStatus = 'Current' | 'Former' | 'Pending';
export type LeaseType = 'AST' | 'Licence' | 'Freehold' | 'Leasehold' | 'Management Agreement';
export type ContactType = 'Landlord' | 'RP Contact' | 'Local Authority' | 'Emergency' | 'Utility' | 'Contractor';
export type UtilityType = 'Electric' | 'Gas' | 'Water' | 'Internet' | 'Council Tax' | 'Insurance';

// NEW: Region type for property tagging
export type Region = 'South' | 'Midlands' | 'Southeast' | 'North' | 'West Wales';

// NEW: Service Type - distinguishes between Supported Living, Residential Care, and Nursing Care
export type ServiceType = 'Supported Living' | 'Residential Care' | 'Nursing Care';

// ============================================
// EXTERNAL CONTACTS
// ============================================
export interface ExternalContact {
    id: string;
    type: ContactType;
    name: string;
    company?: string;
    role?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    isPrimary?: boolean;
}

// ============================================
// UTILITY ACCOUNTS
// ============================================
export interface UtilityAccount {
    id: string;
    type: UtilityType;
    provider: string;
    accountNumber?: string;
    meterNumber?: string;
    meterLocation?: string;
    paymentMethod?: 'Direct Debit' | 'Invoice' | 'Prepayment' | 'Included in Rent';
    monthlyEstimate?: number;
    lastReading?: string;
    lastReadingDate?: string;
    notes?: string;
}

// ============================================
// PROPERTY PHOTOS
// ============================================
export interface PropertyPhoto {
    id: string;
    url: string;
    caption?: string;
    room?: string;
    uploadedAt: string;
    isPrimary?: boolean;
    tags?: string[];
}

// ============================================
// COMPLIANCE ITEMS
// ============================================
export interface ComplianceItem {
    id: string;
    type: string; // e.g., 'Gas Safety', 'EICR', 'Fire Risk Assessment', 'PAT Testing', 'Legionella'
    status: ComplianceStatus;
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    nextDueDate?: string;
    contractor?: string;
    documentUrl?: string;
    notes?: string;
    unitSpecific?: boolean; // true if this applies to a specific unit vs whole property
}

// ============================================
// REPAIRS
// ============================================
export interface Repair {
    id: string;
    title: string;
    description: string;
    status: RepairStatus;
    priority: RepairPriority;
    category?: string; // e.g., 'Plumbing', 'Electrical', 'Structural', 'Heating'
    reportedDate: string;
    reportedBy?: string;
    targetDate?: string;
    completedDate?: string;
    contractor?: string;
    cost?: number;
    jobNumber?: string;
    notes?: string;
    photos?: PropertyPhoto[];
    unitId?: string; // if unit-specific
}

// ============================================
// TENANTS / RESIDENTS
// ============================================
export interface Tenant {
    id: string;
    name: string;
    status: TenancyStatus;
    unitId: string;
    moveInDate?: string;
    moveOutDate?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    supportProvider?: string;
    careHours?: number;
    rentAmount?: number;
    housingBenefit?: boolean;
    notes?: string;
    photo?: string;
}

// ============================================
// SUPERIOR LANDLORD (Building Owner in ownership chain)
// ============================================
export interface SuperiorLandlord {
    name: string;                      // e.g., "Civitas Investment Management"
    company?: string;                  // Company name if different from name
    registrationNumber?: string;       // Companies House registration number
    contactName?: string;              // Primary contact person
    phone?: string;
    email?: string;
    address?: string;
}

// ============================================
// SERVICE LEVEL AGREEMENT (for Supported Living)
// ============================================
export interface ServiceLevelAgreement {
    id: string;
    rpName: string;                    // Registered Provider name
    slaStart: string;                  // SLA start date
    slaEnd?: string;                   // SLA end date (if not rolling)
    isRolling: boolean;                // Rolling contract or fixed term
    noticePeriod?: string;             // Notice period for termination (e.g., "3 months")
    weeklyRate?: number;               // Weekly service fee
    annualRate?: number;               // Annual service fee
    serviceTypes: string[];            // Services covered (e.g., "Housing Support", "Personal Care")
    reviewDate?: string;               // Next SLA review date
    documentUrl?: string;              // Link to SLA document
    notes?: string;
}

// ============================================
// LEASE DETAILS (embedded in PropertyAsset)
// ============================================
export interface LeaseDetails {
    leaseType: LeaseType;
    rentPA: number;
    rentPW?: number;
    rentReviewDate?: string;
    breakClauseDate?: string;
    noticePeriod?: string; // e.g., '3 months', '6 months'
    depositAmount?: number;
    depositScheme?: string;
    specialTerms?: string;
    registeredAtLandRegistry?: boolean;
    landRegistryTitle?: string;
}

// ============================================
// PROPERTY FEATURES
// ============================================
export interface PropertyFeatures {
    // Basic structure
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    yearBuilt?: number;
    squareFeet?: number;

    // Parking & Outdoor
    parking?: 'None' | 'On-street' | 'Driveway' | 'Garage' | 'Car Park';
    garage?: boolean;
    garageType?: 'Attached' | 'Detached' | 'Integral';
    garden?: 'None' | 'Shared' | 'Private' | 'Communal';
    gardenShed?: boolean;

    // Building features
    loftSpace?: boolean;
    loftAccessible?: boolean;
    basement?: boolean;

    // Heating & Energy
    heating?: 'Gas Central' | 'Electric' | 'Oil' | 'Heat Pump' | 'District' | 'Underfloor';
    underfloorHeating?: boolean;
    glazing?: 'Single' | 'Double' | 'Triple';
    epcRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    epcExpiryDate?: string;

    // Security
    cctv?: boolean;
    cctvCameras?: number;
    alarmSystem?: boolean;
    secureEntry?: boolean;

    // White goods (per-property or communal)
    whiteGoods?: WhiteGood[];

    // Decorating
    lastDecoratedDate?: string;
    lastDecoratedRooms?: string[];
    nextDecoratingDue?: string;
    decoratingResponsibility?: 'ivolve' | 'RP' | 'Landlord' | 'Tenant';

    // Adaptations & Amenities
    adaptations?: string[]; // e.g., ['Wheelchair ramp', 'Stairlift', 'Wet room']
    amenities?: string[]; // e.g., ['Communal lounge', 'Laundry room']
}

// ============================================
// WHITE GOODS
// ============================================
export interface WhiteGood {
    id: string;
    type: 'Fridge' | 'Freezer' | 'Fridge Freezer' | 'Washing Machine' | 'Tumble Dryer' | 'Washer Dryer' | 'Dishwasher' | 'Cooker' | 'Hob' | 'Oven' | 'Microwave';
    make?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    location?: string; // e.g., 'Kitchen', 'Utility Room', 'Unit 3'
    condition?: 'Good' | 'Fair' | 'Poor' | 'Needs Replacement';
    replacementResponsibility?: 'ivolve' | 'RP' | 'Landlord' | 'Tenant';
    // PAT Testing (Portable Appliance Testing) - not legally required but good practice
    lastPatDate?: string;
    nextPatDue?: string;
    // Documentation
    instructionManualUrl?: string;  // Link to instruction manual (PDF or online)
    warrantyDocumentUrl?: string;   // Link to warranty document
    notes?: string;
}

// ============================================
// MAINTENANCE RESPONSIBILITIES
// ============================================
export interface MaintenanceResponsibilities {
    general?: 'ivolve' | 'RP' | 'Landlord';
    gardening?: 'ivolve' | 'RP' | 'Landlord' | 'Contractor';
    gardeningContractor?: string;
    gardeningFrequency?: 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'As Needed';
    gardeningContact?: string;
    windowCleaning?: 'ivolve' | 'RP' | 'Landlord' | 'Contractor';
    windowCleaningContractor?: string;
    windowCleaningFrequency?: 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly';
    whiteGoods?: 'ivolve' | 'RP' | 'Landlord' | 'Tenant';
    decorating?: 'ivolve' | 'RP' | 'Landlord' | 'Tenant';
}

// ============================================
// MAIN PROPERTY ASSET
// ============================================
export interface PropertyAsset {
    id: string;
    type: AssetType;
    parentId: string | null; // null for Masters
    address: string;
    postcode: string;
    region: Region | string;  // Region type preferred, string for backwards compatibility
    registeredProvider: string;
    housingManager: string;
    serviceType: ServiceType; // 'Supported Living' | 'Residential Care' | 'Nursing Care'
    status: ManagementStatus;
    units?: PropertyAsset[]; // Optional, for nesting if needed in UI
    totalUnits?: number;
    occupiedUnits?: number;
    statusDate?: string; // ISO date string for when the current status started

    // Existing fields from data ingestion
    provider?: string;
    complianceStatus?: ComplianceStatus;
    leaseStart?: string;
    leaseEnd?: string;
    documents?: DocumentAsset[];
    missingDocs?: boolean;

    // ivolve Staff
    buildingPhone?: string;
    areaManager?: string;
    opsDirector?: string;
    fieldplay?: string;
    responsibleIndividual?: string;
    riaEntity?: string;
    ivolveEntity?: string;
    regionalFacilitiesManager?: string;
    facilitiesCoordinator?: string;
    maintenanceResponsibility?: string;
    gardeningResponsibility?: string;

    // Support & Care (for supported housing properties)
    careProvider?: string; // ⭐ CRITICAL - Care provider organization
    localAuthority?: string; // Local authority area

    // Landlord & Owner
    landlord?: string;
    landlordContact?: ExternalContact;
    owner?: string;
    propertyType?: string;
    unitType?: 'Shared Living' | 'Self-contained';

    // NEW: Lease Details
    lease?: LeaseDetails;

    // NEW: RP (Registered Provider) Details
    rpContact?: ExternalContact;
    contractType?: string; // e.g., 'Block Contract', 'Spot Purchase', 'Framework'
    referralProcess?: string;

    // NEW: External Contacts (multiple)
    externalContacts?: ExternalContact[];

    // NEW: Utilities
    utilities?: UtilityAccount[];

    // NEW: Property Features
    features?: PropertyFeatures;

    // PHASE 9: Maintenance Responsibilities
    maintenance?: MaintenanceResponsibilities;

    // NEW: Photos
    photos?: PropertyPhoto[];
    floorPlanUrl?: string;

    // NEW: Compliance Items
    complianceItems?: ComplianceItem[];

    // NEW: Repairs
    repairs?: Repair[];

    // NEW: Tenants/Residents
    tenants?: Tenant[];

    // NEW: Location
    coordinates?: {
        lat: number;
        lng: number;
    };

    // NEW: Additional Info
    description?: string;
    internalNotes?: string;
    tags?: string[];

    // PHASE 8: Superior Landlord (Building Owner in ownership chain)
    superiorLandlord?: SuperiorLandlord;

    // PHASE 8: Service Level Agreement (for Supported Living)
    sla?: ServiceLevelAgreement;

    // PHASE 8: Hero Images for property banner
    heroImageUrl?: string;              // Primary hero image
    heroImages?: string[];              // Multiple hero images for carousel

    // Warning Banner (Critical safety information)
    warning?: {
        id: string;
        content: string;
        createdAt: string;
        createdBy: string;
        lastUpdatedAt?: string;
        lastUpdatedBy?: string;
    };
}

export interface DocumentAsset {
    id: string;
    name: string;
    type: 'Lease' | 'Compliance' | 'Other';
    url: string;
    date?: string;
}

// ============================================
// PERSON (People We Support)
// ============================================
export interface Person {
    id: string;

    // Personal Information
    personal: {
        title: Title;
        firstName: string;
        lastName: string;
        preferredName?: string;
        dateOfBirth?: string;
        age?: number;
        niNumber?: string; // National Insurance (encrypted!)
        occupantType: OccupantType;
        email?: string;
        phone?: string;
        mobile?: string;
        photo?: string;
    };

    // Property/Tenancy Linkage
    tenancy: {
        propertyId: string;
        unitId?: string; // If unit within master property
        propertyAddress: string;
        room?: string; // e.g., "Room 7A"
        serviceType?: ServiceType; // Service type of property - determines if tenant or resident (defaults to 'Supported Living')
        tenancyType: TenancyType;
        tenancyStatus: TenancyStatus;
        moveInDate?: string;
        moveOutDate?: string;
    };

    // Support & Care (Critical for supported housing)
    support: {
        careProvider?: string; // ⭐ CRITICAL
        socialWorker?: string; // ⭐ CRITICAL
        keyWorker?: string;
        caseManager?: string;
        careHours?: number; // Hours per week
        supportLevel?: 'Low' | 'Medium' | 'High' | 'Intensive';
        medicationNeeds?: string;
        dietaryRequirements?: string;
        mobilityNeeds?: string;
    };

    // Emergency Contacts
    emergencyContacts?: EmergencyContact[];

    // Finance
    finance: {
        rentAmount?: number;
        serviceCharge?: number;
        supportCharge?: number;
        totalCharges?: number;
        currentBalance?: number; // Arrears if negative
        housingBenefit?: boolean;
        housingBenefitAmount?: number;
        paymentMethod?: 'Direct Debit' | 'Standing Order' | 'Cash' | 'Housing Benefit';
    };

    // Case Records (Links to other entities)
    cases?: {
        safeguardingCases?: string[]; // Array of SafeguardingCase IDs
        asbCases?: string[]; // Array of ASBCase IDs
        supportPlans?: string[]; // Array of SupportPlan IDs
        riskAssessments?: string[]; // Array of RiskAssessment IDs
    };

    // Warning Banner (Critical safety information)
    warning?: {
        id: string;
        content: string;
        createdAt: string;
        createdBy: string;
        lastUpdatedAt?: string;
        lastUpdatedBy?: string;
    };

    // Additional Info
    notes?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary?: boolean;
}

export type Title = 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Mx' | 'Dr' | 'Prof' | 'Rev';
export type OccupantType = 'Main Tenant' | 'Joint Tenant' | 'Occupier' | 'Visitor' | 'Emergency Contact';
export type TenancyType = 'Assured' | 'Assured Shorthold' | 'License' | 'Secure' | 'Introductory' | 'Non-Secure';

// ============================================
// SAFEGUARDING CASE
// ============================================
export interface SafeguardingCase {
    id: string;
    caseReference: string; // e.g., "SAF10/001"
    personId: string; // Link to Person

    // Dates
    reportedDate: string;
    openedDate: string;
    dueDate?: string;
    closedDate?: string;

    // Classification
    source: SafeguardingSource;
    status: CaseStatus;
    category: SafeguardingCategory;
    subCategory?: string;
    level: SafeguardingLevel; // Severity (1, 2, 3)

    // Workflow
    assignedTo: string; // Staff member
    stage: string; // "Investigation", "Monitoring", "Resolution"
    outcome?: string;

    // Details
    description: string;

    // Parties Involved
    parties: SafeguardingParty[];

    // Incidents
    incidents: SafeguardingIncident[];

    // Tasks
    tasks?: string[]; // Task IDs

    // Documents
    documents?: string[]; // Document URLs

    // Audit
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SafeguardingParty {
    id: string;
    firstName: string;
    lastName: string;
    type: 'Victim' | 'Perpetrator' | 'Witness' | 'Reporter';
    personId?: string; // If they're a known person in the system
    unknown: boolean;
}

export interface SafeguardingIncident {
    id: string;
    date: string;
    category: string;
    subCategory?: string;
    description: string;
    location?: string;
}

export type SafeguardingSource = 'Phone Call' | 'Email' | 'In Person' | 'Anonymous' | 'Police' | 'Social Services' | 'Family' | 'Neighbour' | 'Staff Observation';
export type SafeguardingCategory = 'Physical Abuse' | 'Emotional Abuse' | 'Financial Abuse' | 'Neglect' | 'Sexual Abuse' | 'Discrimination' | 'Self-Neglect';
export type SafeguardingLevel = 'Level 1' | 'Level 2' | 'Level 3';
export type CaseStatus = 'Open' | 'Closed' | 'Monitoring' | 'Investigation' | 'Referred' | 'Resolved';

// ============================================
// ASB CASE (Anti-Social Behaviour)
// ============================================
export interface ASBCase {
    id: string;
    caseReference: string; // e.g., "ASB1/002"
    personId: string; // Person this case relates to (perpetrator or victim)

    // Dates
    reportedDate: string;
    dueDate?: string;
    closedDate?: string;

    // Classification
    category: ASBCategory;
    stage: ASBStage;
    actionLevel: ASBActionLevel;
    riskLevel: 'Low' | 'Medium' | 'High';

    // Details
    description: string;
    location?: string;

    // Actions Taken
    actions: ASBAction[];

    // Tasks
    tasks?: string[]; // Task IDs

    // Documents
    documents?: string[];

    // Audit
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ASBAction {
    id: string;
    date: string;
    action: string; // "Warning Letter Sent", "Home Visit", "Meeting with Social Worker"
    actionLevel: ASBActionLevel;
    notes?: string;
    completedBy: string;
}

export type ASBCategory = 'Noise' | 'Harassment' | 'Drugs' | 'Pets' | 'Rubbish' | 'Threatening Behaviour' | 'Violence' | 'Vandalism' | 'Other';
export type ASBStage = 'Communication' | 'Information Gathering' | 'Warning 1' | 'Warning 2' | 'Warning 3' | 'Legal Action' | 'Closed';
export type ASBActionLevel = 'Visit/Contact' | 'Letter' | 'Meeting' | 'Legal' | 'Warning 1' | 'Warning 2' | 'Warning 3';

// ============================================
// SUPPORT PLAN
// ============================================
export interface SupportPlan {
    id: string;
    personId: string;

    // Plan Details
    planType: 'Care Plan' | 'Support Plan' | 'Move-On Plan' | 'Rehabilitation Plan';

    // Dates
    dateCreated: string;
    reviewDate: string;
    nextDueDate: string;

    // Status
    status: 'Current' | 'Overdue' | 'Completed' | 'Draft';

    // Content
    goals?: string[];
    actions?: string[];
    notes?: string;

    // Document
    documentUrl?: string; // PDF upload

    // Assigned
    assignedTo: string; // Key worker or case manager

    // Audit
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

// ============================================
// RISK ASSESSMENT
// ============================================
export interface RiskAssessment {
    id: string;
    personId: string;

    // Assessment Details
    assessmentType: 'General' | 'Fire' | 'Moving & Handling' | 'Safeguarding' | 'Health & Safety' | 'Substance Use';

    // Dates
    dateCreated: string;
    reviewDate: string;
    nextDueDate: string;

    // Risk Level
    overallRiskLevel: 'Low' | 'Medium' | 'High';

    // Risk Categories
    risks: RiskItem[];

    // Mitigation
    mitigationActions: string[];

    // Status
    status: 'Current' | 'Overdue' | 'Completed' | 'Draft';

    // Document
    documentUrl?: string;

    // Assigned
    assessedBy: string;

    // Audit
    createdAt: string;
    updatedAt?: string;
}

export interface RiskItem {
    id: string;
    category: string; // "Self-harm", "Violence", "Absconding", "Falls"
    description: string;
    likelihood: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    riskLevel: 'Low' | 'Medium' | 'High'; // Calculated from likelihood × impact
    mitigationActions: string[];
}

// ============================================
// VOID RECORD
// ============================================
export interface VoidRecord {
    id: string;
    propertyId: string;
    unitId?: string; // If specific unit
    propertyAddress: string;

    // Dates
    voidStartDate: string;
    voidEndDate?: string; // When re-let
    daysVoid: number; // Critical KPI

    // Status
    voidStatus: VoidStatus;
    voidSource: VoidSource;
    progress: VoidProgress;

    // Financial
    dailyCost: number; // Lost rent per day
    totalCost: number; // daysVoid × dailyCost

    // Works Required
    worksRequired?: string[];
    repairIds?: string[]; // Links to Repair records

    // Re-letting
    reLetDate?: string;
    newTenantId?: string;

    // Audit
    createdAt: string;
    updatedAt?: string;
}

export type VoidStatus = 'Current Void' | 'Awaiting Keys' | 'Ready to Let' | 'Lettings Process' | 'Void Inspection' | 'Repairs Required' | 'Completed';
export type VoidSource = 'New Property' | 'Tenant Left' | 'Eviction' | 'Property Maintenance' | 'Transfer' | 'Death';
export type VoidProgress = 'Awaiting Keys' | 'Keys In' | 'Inspection Complete' | 'Repairs Required' | 'Ready to let' | 'Offered' | 'Let';

// ============================================
// TASK
// ============================================
export interface Task {
    id: string;

    // Task Details
    name: string;
    description?: string;

    // Dates
    createdDate: string;
    dueDate: string;
    completedDate?: string;

    // Assignment
    assignedTo: string; // Staff member
    createdBy: string;

    // Priority
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';

    // Status
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';

    // Context (What is this task about?)
    linkedEntity?: {
        entityType: 'Property' | 'Person' | 'SafeguardingCase' | 'ASBCase' | 'Repair' | 'Void';
        entityId: string;
    };

    // Notes
    notes?: string;
}

// ============================================
// NOTE (Universal Notes System)
// ============================================
export interface Note {
    id: string;

    // Note Details
    type: NoteType;
    title: string;
    content: string;

    // Metadata
    pinned: boolean; // Pin to main page

    // Attachments
    attachments?: NoteAttachment[];

    // Context (What is this note about?)
    linkedEntity: {
        entityType: 'Property' | 'Person' | 'SafeguardingCase' | 'ASBCase' | 'Repair' | 'Task' | 'Void';
        entityId: string;
    };

    // Audit
    createdBy: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface NoteAttachment {
    id: string;
    filename: string;
    url: string;
    uploadedBy: string;
    uploadedDate: string;
    fileSize?: number;
    mimeType?: string;
}

export type NoteType =
    | 'General'
    | 'Phone Call'
    | 'Email'
    | 'Visit'
    | 'Support Note'
    | 'Clinical Note'
    | 'Risk Assessment'
    | 'Incident'
    | 'Financial'
    | 'Property Note'
    | 'System Change';

// ============================================
// REFERRALS / APPLICATIONS
// ============================================

// Referral status workflow
export type ReferralStatus =
  | 'New Referral'
  | 'Under Assessment'
  | 'Awaiting Funding Approval'
  | 'Funding Approved'
  | 'RP Approval Required'  // Supported Living only
  | 'RP Approved'
  | 'Ready to Move In'
  | 'Moved In'
  | 'Declined'
  | 'Withdrawn';

// Referral source
export type ReferralSource =
  | 'Social Worker'
  | 'Commissioner'
  | 'NHS Professional'
  | 'Care Provider'
  | 'Support Provider'
  | 'Self Referral'
  | 'Family/Friend';

export interface Referral {
  id: string;
  referralRef: string; // e.g., "REF2026/001"
  referralDate: string;
  status: ReferralStatus;
  source: ReferralSource;
  referrerName: string;
  referrerOrganization?: string;
  referrerContact: {
    phone?: string;
    email?: string;
  };

  // Person details (pre-move-in)
  personal: {
    title?: Title;
    firstName: string;
    lastName: string;
    preferredName?: string;
    dateOfBirth?: string;
    age?: number;
    niNumber?: string;
    email?: string;
    phone?: string;
    mobile?: string;
  };

  // Service requirements
  serviceType: ServiceType;  // Determines if they'll be tenant or resident
  supportLevel?: 'Low' | 'Medium' | 'High' | 'Intensive';
  medicalNeeds?: string;
  dietaryRequirements?: string;
  mobilityNeeds?: string;

  // Linked property (potential or confirmed)
  linkedProperty?: {
    propertyId: string;
    propertyAddress: string;
    unitId?: string;
    room?: string;
  };

  // Funding
  fundingApproved: boolean;
  fundingSource?: string; // e.g., "NHS Continuing Healthcare", "Council"
  weeklyBudget?: number;

  // Assessment & Planning
  assessmentDate?: string;
  assessmentNotes?: string;
  keyWorker?: string;

  // Move in details (when approved)
  proposedMoveInDate?: string;
  confirmedMoveInDate?: string;

  // Tracking
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// ============================================
// MEETINGS
// ============================================

export type MeetingStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Postponed';
export type MeetingType = 'Internal' | 'External' | 'Support Review' | 'Training' | 'Other';
export type RecurrencePattern = 'One-off' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly';
export type ActionItemStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export interface MeetingParticipant {
    id: string;
    type: 'Internal' | 'External';
    personId?: string;        // Reference to Person if internal
    name: string;             // Display name
    email?: string;
    role: 'Organizer' | 'Chair' | 'Minute Taker' | 'Attendee' | 'Apologies';
    attended?: boolean;
}

export interface AgendaItem {
    id: string;
    order: number;
    title: string;
    description?: string;
    duration?: number;        // Estimated minutes
    presenter?: string;
    completed?: boolean;
}

export interface ActionItem {
    id: string;
    title: string;
    description?: string;
    assigneeId?: string;      // Reference to Person/Staff
    assigneeName: string;
    dueDate?: string;
    status: ActionItemStatus;
    completedAt?: string;
    completedBy?: string;
    createdAt: string;
    notes?: string;
}

export interface MeetingInstance {
    id: string;
    scheduledDate: string;
    actualDate?: string;
    status: MeetingStatus;
    minutes?: string;
    actionItems: ActionItem[];
    attendanceRecord?: {
        participantId: string;
        attended: boolean;
    }[];
}

export interface MeetingLinkedEntity {
    entityType: 'Person' | 'Property' | 'Unit' | 'Referral';
    entityId: string;
    entityName: string;       // Cached display name
    linkedAt: string;
    linkedBy: string;
    context?: string;         // Why it was mentioned
}

export interface Meeting {
    id: string;
    meetingRef: string;       // e.g., "MTG2026/001"
    title: string;
    description?: string;

    // Schedule
    scheduledDate: string;
    scheduledTime: string;
    duration: number;         // Minutes
    location?: string;        // Room name or "Virtual"

    // Recurrence
    recurrence: RecurrencePattern;
    recurrenceEndDate?: string;
    parentMeetingId?: string; // If this is an instance of a recurring series

    // Participants
    organizerId: string;
    participants: MeetingParticipant[];

    // Content
    agenda: AgendaItem[];
    minutes?: string;
    actionItems: ActionItem[];

    // Context
    meetingType: MeetingType;
    linkedEntities: MeetingLinkedEntity[];

    // Status
    status: MeetingStatus;

    // For recurring meetings - historical instances
    instances?: MeetingInstance[];

    // Audit
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}
