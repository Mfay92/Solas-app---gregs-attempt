

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
}

export interface Flag {
  id: string;
  message: string;
  level: 'warning' | 'info';
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
    photoUrl: string;
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

export interface TimelineEvent {
  id: string;
  date: string;
  type: TimelineEventType;
  description: string;
  actor: string;
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
}

export interface FundingDetails {
  source: string;
  weeklyAmount: number;
  details: string;
}

export interface TenancyDetails {
  type: 'Licence Agreement' | 'Assured Shorthold Tenancy';
  startDate: string;
  documents: Document[];
}

export interface Person {
  id: string;
  preferredFirstName: string;
  legalFirstName: string;
  surname: string;
  photoUrl: string;
  dob: string;
  status: PersonStatus;
  propertyId: string;
  unitId: string;
  moveInDate: string;
  moveOutDate: string | null;
  keyWorkerId: string;
  areaManagerId: string;
  careNeeds: CareNeed[];
  funding: FundingDetails;
  tenancy: TenancyDetails;
  timeline: TimelineEvent[];
  documents: Document[];
  // New "About Me" fields
  title: 'Mr' | 'Miss' | 'Mrs' | '';
  firstLanguage: string;
  isNonVerbal: boolean;
  secondLanguage?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  ethnicity?: string;
  nationality?: string;
  nationalInsuranceNumber?: string;
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
