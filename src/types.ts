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
    serviceType: string; // e.g., 'Supported Living', 'Residential'
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
}

export interface DocumentAsset {
    id: string;
    name: string;
    type: 'Lease' | 'Compliance' | 'Other';
    url: string;
    date?: string;
}

export interface Person {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}
