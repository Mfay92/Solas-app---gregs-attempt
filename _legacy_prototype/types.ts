



export enum ServiceType {
  SupportedLiving = 'Supported Living',
  Residential = 'Residential',
  NursingCare = 'Nursing Care',
}

export enum UnitStatus {
  Occupied = 'Occupied',
  Void = 'Void',
  Master = 'Master',
  Unavailable = 'Unavailable',
  OutOfManagement = 'Out of Management',
  StaffSpace = 'Staff Space',
}

export enum TimelineEventType {
  Repairs = 'Repairs',
  Compliance = 'Compliance',
  Finance = 'Finance',
  Moves = 'Moves',
  Notes = 'Notes',
  Care = 'Care',
  Tenancy = 'Tenancy',
  System = 'System',
}

export enum MaintenanceStatus {
  Open = 'Open',
  Assigned = 'Assigned',
  InProgress = 'In Progress',
  AwaitingInvoice = 'Awaiting Invoice',
  Completed = 'Completed',
  Closed = 'Closed',
}

export enum NominalCode {
  PLM = 'PLM',
  ELE = 'ELE',
  DEC = 'DEC',
  WHG = 'WHG',
  GRD = 'GRD',
  WIN = 'WIN',
  FUR = 'FUR',
  BOI = 'BOI',
}

export enum PersonStatus {
  Current = 'Current',
  Former = 'Former',
  Applicant = 'Applicant',
}

export enum ApplicationStage {
    Referral = '1. Referral Received',
    Application = '2. Application in Progress',
    AwaitingProperty = '3. Awaiting Property Match',
    PropertyMatched = '4. Property Matched',
    TenancyOffered = '5. Tenancy Offered',
    Completed = '6. Completed',
}

export interface Flag {
  id: string;
  message: string;
  level: 'warning' | 'info' | 'danger';
}

export interface Unit {
  id: string;
  name: string;
  status: UnitStatus;
  attention?: boolean;
}

export enum ContactTier {
    General = 'General Contacts',
    Executive = 'Directors & Executives',
    SeniorManagement = 'Senior & Regional Managers',
    Operations = 'Housing Officers & Managing Agents',
    Finance = 'Finance Contacts',
    Development = 'Development Team',
    Property = 'Property & Asset Team',
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  tier?: ContactTier;
  photoUrl?: string;
  isPinned?: boolean;
}

export interface User {
    name: string;
    email: string;
    role: string;
    photoUrl?: string;
}

export interface PersonalizationIcon {
    id: string;
    name: string; // e.g., 'dog', 'piano'
    color: string;
    // Position, size, etc., can be added later
}

export interface IvolveStaff {
    id: string;
    name: string;
    role: string;
    email: string;
    phone:string;
    photoUrl?: string;
    managerId: string | null;
    team: string;
    tags: string[];
    isVacancy?: boolean;
    isJoiningSoon?: boolean;
    relevance: number; // For "smart" sorting in contact hub
    personalizationIcons?: PersonalizationIcon[];
    cardTemplate?: 'white' | 'solid';
    isPinned?: boolean;
}

export type NoteCategory = 'General' | 'Safeguarding' | 'Incident' | 'Positive' | 'Health' | 'Finance' | 'Housing' | 'Family Contact' | 'Tenancy & Rent' | 'RP/Landlord';

export type NoteSubCategory = {
    name: string;
    isFlag?: boolean;
    flagLevel?: 'warning' | 'danger';
};

export type NotePrimaryCategory = {
    name: NoteCategory;
    subCategories: NoteSubCategory[];
};


export interface TimelineEvent {
  id: string;
  date: string;
  type: TimelineEventType;
  title?: string;
  description: string;
  actor: string;
  noteCategory?: NoteCategory;
  noteSubCategory?: string;
  isSensitive?: boolean;
}

export interface RentLine {
  category: string;
  description: string;
  amount: number;
  period: 'week' | 'month' | 'year';
  rechargedToIvolve: boolean;
}

export interface VoidTerms {
  initial: string;
  subsequent: string;
}

export interface RentSchedule {
  year: string;
  lines: RentLine[];
  documentUrl: string;
}

export interface RentData {
  currentSchedule: RentSchedule;
  previousSchedules: RentSchedule[];
  voidTerms: VoidTerms;
}

export interface MaintenanceJob {
  id: string;
  ref: string;
  propertyAddress: string;
  unit: string;
  category: string;
  nominalCode: NominalCode;
  priority: 'High' | 'Medium' | 'Low';
  status: MaintenanceStatus;
  reportedDate: string;
  slaDueDate: string;
  assignedTo: string;
  details: {
    reportedBy: string;
    method: 'Email' | 'Phone';
    roomLocation: string;
    summary: string;
    isTenantDamage: boolean;
    cost: { net: number; vat: number; gross: number };
  };
  activityLog: {
      date: string;
      actor: string;
      action: string;
  }[];
  jobType: 'Reactive' | 'PPM';
  linkedComplianceId?: string;
}

export enum ComplianceType {
    GasSafety = 'Gas Safety',
    EICR = 'EICR',
    FireRiskAssessment = 'Fire Risk Assessment',
    FEE = 'FEE',
    FireDoor = 'Fire Door',
    Asbestos = 'Asbestos',
    LRA = 'LRA',
    TMV = 'TMV',
    LiftLOLER = 'Lift LOLER',
    EPC = 'EPC',
    Sprinkler = 'Sprinkler',
    EmergencyLighting = 'Emergency Lighting',
    FireAlarm = 'Fire Alarm System',
}

export interface ComplianceItem {
  id: string;
  type: ComplianceType;
  lastCheck: string;
  nextCheck: string;
  status: 'Compliant' | 'Action Required' | 'Expired' | 'Due Soon' | 'N/A';
  reportUrl: string;
}

export interface PpmSchedule {
  id: string;
  name: string;
  complianceType: ComplianceType;
  frequencyMonths: number;
  leadTimeDays: number; // How many days before expiry to create the job
  scope: {
    type: 'Region' | 'All';
    value?: string; // e.g., 'North'
  };
}


export interface Clause {
  id: string;
  topic: string;
  originalText: string;
  plainText: string;
  extraPlainText: string;
}

export interface LegalAgreement {
  id: string;
  type: 'Lease' | 'SLA' | 'Licence';
  title: string;
  date: string;
  clauses: Clause[];
  documentUrl: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'Word' | 'Excel' | 'Image';
  date: string;
  year: number;
  url: string;
  linkedJobRef?: string;
}

export interface Feature {
  id: string;
  name: string;
  value: string;
}

export enum StakeholderType {
  LocalAuthority = 'Local Authority',
  NHSService = 'NHS Service',
  RegisteredProvider = 'Registered Provider',
  Developer = 'Developer',
  Contractor = 'Contractor',
  Landlord = 'Landlord',
  Other = 'Other',
}

export enum ContractorTrade {
    General = 'General Maintenance',
    Electrician = 'Electrician',
    Plumber = 'Plumber',
    Roofer = 'Roofer',
    Gardener = 'Gardener',
    WindowCleaner = 'Window Cleaner',
    Decorator = 'Decorator',
}

export interface Stakeholder {
  id: string;
  name: string;
  subName?: string;
  type: StakeholderType;
  logoComponent?: string; 
  website?: string;
  about?: string;
  address?: {
    line1: string;
    city: string;
    postcode: string;
  };
  keyInfo?: { label: string; value: string; }[];
  branding: {
    heroBg: string;
    heroText: string;
    cardBg: string;
    cardText: string;
    cardBorder?: string;
  };
  contacts: Contact[];
  // For contractors
  trades?: ContractorTrade[];
  areaOfOperation?: string;
}

export interface CommissioningDocument {
  id: string;
  name: string;
  url: string;
}

export interface CommissioningInfo {
  commissioner: Contact;
  hasWrittenSupport: boolean;
  documents: CommissioningDocument[];
}

export interface LinkedContact {
    id: string;
    role: string;
    contactId: string; // Can be ivolveStaff ID or stakeholder contact ID
    stakeholderId?: string; // Only if it's a stakeholder contact
}

export interface CareNeed {
  id: string;
  category: string;
  detail: string;
  supportStrategies?: string;
}

export interface FundingDetails {
  id: string;
  source: string;
  weeklyAmount: number;
  details: string;
}

export interface TenancyDetails {
  type: 'Licence Agreement' | 'Assured Shorthold Tenancy';
  startDate: string;
  endDate?: string | null;
  noticePeriod?: string;
  documents: Document[];
}

// New private contact type for a person's Circle of Support
export interface PersonContact {
  id: string;
  name: string;
  relationship: string; // e.g., 'Mother', 'Social Worker', 'GP Surgery'
  isOrganisation: boolean;
  organisationName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isNextOfKin?: boolean;
  isAppointee?: boolean;
  isDeputy?: boolean;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    notes?: string;
}

export enum BenefitType {
    UCHousing = 'UC Housing Element',
    UCStandard = 'UC Standard Allowance',
    UCLimitedCapability = 'UC Limited Capability for work/ work related activity',
    ESA = 'ESA',
    JSA = 'JSA',
    PIPCare = 'PIP Care Component',
    PIPMobility = 'PIP Mobility Component',
    DLACare = 'DLA Care',
    DLAMobility = 'DLA Mobility',
    SDA = 'SDA',
}

export interface Benefit {
    type: BenefitType;
    amount: number;
    frequency: 'Weekly' | 'Monthly' | 'Fortnightly';
    startDate: string;
}

export interface OtherIncome {
    source: string;
    amount: number;
    frequency: string;
}

export interface Person {
  id: string;
  preferredFirstName: string;
  legalFirstName: string;
  surname: string;
  dob: string;
  status: PersonStatus;
  propertyId: string;
  unitId: string;
  moveInDate: string;
  moveOutDate: string | null;
  keyWorkerId: string;
  areaManagerId: string;
  careNeeds: CareNeed[];
  funding: FundingDetails[]; // Changed to array to support multiple funding sources
  tenancy: TenancyDetails;
  timeline: TimelineEvent[];
  documents: Document[];
  flags: Flag[];
  contacts: PersonContact[]; // New private contacts
  
  // Expanded "About Me" fields
  title: 'Mr' | 'Miss' | 'Mrs' | '';
  email?: string;
  phone?: string;
  firstLanguage: string;
  isNonVerbal: boolean;
  secondLanguage?: string;
  preferredCommunicationMethod?: string;
  religion?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  ethnicity?: string;
  nationality?: string;
  nationalInsuranceNumber?: string;
  nhsNumber?: string;
  myStory?: string;
  importantToMe?: string[];

  // Health Information
  allergies?: string[];
  medicalConditions?: string[];
  medications?: Medication[];
  pets?: string;

  // Housing History & Status
  previousAccommodationType?: string;
  hasCapacityToConsent?: boolean;
  rightToResideStatus?: string;
  
  // Finance Information
  housingBenefitRefNumber?: string;
  housingBenefitCouncil?: string;
  housingBenefitAmount?: number;
  benefits?: Benefit[];
  otherIncome?: OtherIncome[];
  savingsInfo?: string;
  hasMobilityVehicle?: boolean;
  hasSmiExemption?: boolean;
  managesOwnMoney?: boolean;
  isOnS117?: boolean;

  // Application / Referral Tracking
  applicationStage?: ApplicationStage;
  referralDate?: string;
  referralSource?: string; // e.g., 'North Yorkshire Council', 'Self-referral'
  preferredServiceType?: ServiceType;
  preferredRegion?: string;
  potentialRp?: string;
}

export interface AgreementDates {
    startDate?: string;
    endDate?: string;
    term?: string;
    breakDate?: string;
    renewalDate?: string;
}

export interface FrameworkDates {
    appliedDate?: string;
    awardedDate?: string;
    renewalDate?: string;
}

export interface RefurbishmentDate {
    id: string;
    name: string;
    date: string;
}

export interface KeyDates {
    sla?: AgreementDates;
    lease?: AgreementDates;
    framework?: FrameworkDates;
    refurbishments?: RefurbishmentDate[];
}

export enum LegalEntity {
    Heathcotes = 'Heathcotes',
    HeathcotesM = 'Heathcotes M',
    HeathcotesS = 'Heathcotes S',
    Gresham = 'Gresham Care',
    TLC = 'TLC',
    NewDirections = 'New Directions',
    Fieldbay = 'Fieldbay',
}

export type TagStyle = 'default' | 'outline' | 'text';

export type DrawerMode = 'right' | 'bottom' | 'popup';

export interface Property {
  id: string;
  address: {
    propertyName?: string;
    line1: string;
    line2?: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
  };
  tags: {
    rp: string;
    supportProvider: string;
    la: string;
  };
  region: string;
  serviceType: ServiceType;
  legalEntity: LegalEntity;
  propertyType: 'Terraced' | 'Semi-detached' | 'Detached' | 'Flat in property' | 'Bungalow' | 'Annex to house';
  livingType: 'Shared Living' | 'Self-contained' | 'Mixed';
  handoverDate: string;
  handbackDate: string | null;
  flags: Flag[];
  units: Unit[];
  contacts: Contact[];
  timeline: TimelineEvent[];
  rentData: RentData;
  maintenanceJobs: MaintenanceJob[];
  complianceItems: ComplianceItem[];
  legalAgreements: LegalAgreement[];
  documents: Document[];
  features: Feature[];
  commissioning?: CommissioningInfo;
  photos: string[];
  floorplans: string[];
  linkedContacts?: LinkedContact[];
  keyDates?: KeyDates;
}

export type PropertyUnitRow = {
  propertyId: string;
  unitId: string;
  unitName: string;
  fullAddress: string;
  rp: string;
  legalEntity: LegalEntity;
  serviceType: ServiceType;
  status: UnitStatus;
  region: string;
  handoverDate: string;
  handbackDate: string | null;
  attention?: boolean;
};

export interface KeyTerm {
  term: string;
  value: string;
}

export interface LegalAnalysisResult {
  summary: string;
  documentType: 'SLA' | 'Lease' | 'Tenancy Agreement' | 'Unknown';
  keyTerms: KeyTerm[];
  clauses: Clause[];
}

export interface PropertyFilters {
  searchText?: string;
  serviceTypes?: ServiceType[];
  unitStatuses?: UnitStatus[];
  regions?: string[];
  rp?: string[];
  isOverdue?: boolean; // For maintenance jobs
  priorities?: ('High' | 'Medium' | 'Low')[];
}


// --- AI Reporting Types ---
export type ReportDisplayType = 'LIST' | 'GROUPED_LIST' | 'KPI';
export type ReportEntityType = 'UNITS' | 'MAINTENANCE_JOBS';
export type ReportGroupByField = 'region' | 'serviceType' | 'tags.rp' | 'status' | 'legalEntity' | 'priority';
export type ReportKpiMetric = 'COUNT';

export interface AiReportDefinition {
    title: string;
    summary: string;
    displayType: ReportDisplayType;
    entityType: ReportEntityType;
    filters: PropertyFilters;
    groupBy?: ReportGroupByField;
    kpiMetric?: ReportKpiMetric;
}

export interface ReportData {
    definition: AiReportDefinition;
    results: any; 
}

export interface CustomWidget {
    id: string;
    title: string;
    query: string;
}

// --- Growth Hub Types ---

export enum OpportunityType {
    Tender = 'Tender',
    Framework = 'Framework',
    SpotPurchase = 'Spot Purchase',
    NewBuild = 'New Build Scheme',
    Other = 'Other',
}

export enum BDStage {
    Potential = '1. Potential Opportunity',
    Feasibility = '2. Feasibility & Outline',
    BidInProgress = '3. Bid / Proposal in Progress',
    Submitted = '4. Submitted - Awaiting Decision',
    Won = '5. Won / On Framework',
    Lost = '6. Lost / Unsuccessful',
    NotProgressed = '7. Not Progressed',
}

export enum DevelopmentStage {
    Sourcing = '1. Sourcing & Origination',
    Feasibility = '2. Feasibility & Due Diligence',
    Approval = '3. CAPCOM Approval',
    Acquisition = '4. Acquisition & Legals',
    Development = '5. Development & Refurbishment',
    PreHandover = '6. Pre-Handover',
    Complete = '7. Complete & Handed Over',
}

export enum FrameworkStatus {
    Live = 'Live',
    ExpiringSoon = 'Expiring Soon',
    Expired = 'Expired',
    OnExtension = 'On Extension',
}

export enum TenderStatus {
    Potential = 'Potential',
    InProgress = 'In Progress',
    Submitted = 'Submitted',
    Won = 'Won',
    Lost = 'Lost',
}

export interface GrowthOpportunity {
    id: string;
    name: string; 
    opportunityType: OpportunityType;
    laId: string; // from stakeholder.id where type is LA or NHS
    bdLeadId: string; // from ivolveStaff.id
    region: string;
    serviceType: ServiceType; 
    clientGroup: string;
    beds?: number;

    // For Tender/Framework
    status?: BDStage;
    
    // For New Build
    developmentStage?: DevelopmentStage;
    
    // Dates
    dueDate?: string;
    decisionDate?: string;
    contractEndDate?: string;
    
    // Other info
    contractValue?: number;
    notes?: string;
}