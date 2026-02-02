// Compliance Data Types for Solas CRM
// Based on real ivolve compliance spreadsheet structure

export type ComplianceCategory =
  | 'eicr'           // Electrical Installation Condition Report
  | 'pat'            // Portable Appliance Testing
  | 'fra'            // Fire Risk Assessment
  | 'ffe'            // Fire Fighting Equipment
  | 'fa_el'          // Fire Alarm & Emergency Lighting
  | 'fire_door'      // Fire Door Inspection
  | 'asbestos'       // Asbestos Survey/Management
  | 'heating_hw'     // Heating & Hot Water
  | 'gas_safe'       // Gas Safety Certificate
  | 'lra'            // Legionella Risk Assessment
  | 'water_sample'   // Water Sampling
  | 'tmv'            // Thermostatic Mixing Valve Service
  | 'hot_cold_water' // Hot & Cold Water Checks
  | 'lift'           // Lift/LOLER Inspection
  | 'epc'            // Energy Performance Certificate
  | 'lightning'      // Lightning Protection
  | 'sprinkler'      // Sprinkler System
  | 'dry_riser';     // Dry Riser Test

export type ComplianceStatus =
  | 'compliant'           // Valid and up to date
  | 'due-soon'            // Expires within 30 days
  | 'overdue'             // Past expiry date
  | 'remedials-required'  // Compliant but actions needed
  | 'not-applicable'      // Category doesn't apply to property
  | 'no-data';            // No record exists

export type RemedialPriority = 'critical' | 'high' | 'medium' | 'low';
export type RemedialStatus = 'open' | 'in-progress' | 'completed';

export interface RemedialAction {
  id: string;
  complianceRecordId: string;
  description: string;
  priority: RemedialPriority;
  assignedTo?: string;
  dueDate: string | null;       // ISO date string
  status: RemedialStatus;
  completedDate: string | null; // ISO date string
  notes?: string;
  createdAt: string;            // ISO date string
}

export interface ComplianceDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'doc' | 'other';
  filePath: string;             // Relative path to document
  uploadedDate: string;         // ISO date string
  expiryDate?: string | null;   // ISO date string
  category: ComplianceCategory;
}

export interface ComplianceRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  category: ComplianceCategory | string;  // Allow string for flexibility with JSON data
  status: ComplianceStatus | string;      // Allow string for flexibility with JSON data
  lastInspectionDate: string | null;  // ISO date string
  expiryDate: string | null;          // ISO date string
  nextDueDate: string | null;         // ISO date string
  frequencyMonths?: number | null;    // Inspection frequency in months
  contractor?: string | null;
  contractorContact?: string;
  documents: ComplianceDocument[];
  remedialActions: RemedialAction[];
  notes?: string | null;
  lastUpdated: string;                // ISO date string
}

// Summary for dashboard widgets
export interface ComplianceSummary {
  total: number;
  compliant: number;
  dueSoon: number;
  overdue: number;
  remedialsRequired: number;
  notApplicable: number;
}

// Category metadata for display
export interface ComplianceCategoryInfo {
  code: ComplianceCategory;
  name: string;
  shortName: string;
  typicalCycle: string;        // e.g., "Annual", "5 years"
  icon: string;                // Lucide icon name
  description: string;
}

export const COMPLIANCE_CATEGORIES: ComplianceCategoryInfo[] = [
  { code: 'eicr', name: 'Electrical Installation Condition Report', shortName: 'EICR', typicalCycle: '5 years', icon: 'Zap', description: 'Fixed wiring inspection and testing' },
  { code: 'pat', name: 'Portable Appliance Testing', shortName: 'PAT', typicalCycle: 'Annual', icon: 'Plug', description: 'Testing of portable electrical equipment' },
  { code: 'fra', name: 'Fire Risk Assessment', shortName: 'FRA', typicalCycle: 'Annual review', icon: 'Flame', description: 'Assessment of fire safety measures' },
  { code: 'ffe', name: 'Fire Fighting Equipment', shortName: 'FFE', typicalCycle: 'Annual', icon: 'FireExtinguisher', description: 'Extinguishers, blankets, and equipment servicing' },
  { code: 'fa_el', name: 'Fire Alarm & Emergency Lighting', shortName: 'FA/EL', typicalCycle: 'Quarterly/Annual', icon: 'Bell', description: 'Fire alarm and emergency lighting tests' },
  { code: 'fire_door', name: 'Fire Door Inspection', shortName: 'Fire Doors', typicalCycle: 'Annual', icon: 'DoorOpen', description: 'Fire door condition and operation' },
  { code: 'asbestos', name: 'Asbestos Survey', shortName: 'Asbestos', typicalCycle: 'As required', icon: 'AlertTriangle', description: 'Asbestos management survey and register' },
  { code: 'heating_hw', name: 'Heating & Hot Water', shortName: 'Heating', typicalCycle: 'Annual', icon: 'Thermometer', description: 'Heating system and hot water servicing' },
  { code: 'gas_safe', name: 'Gas Safety Certificate', shortName: 'Gas Safe', typicalCycle: 'Annual', icon: 'Flame', description: 'Gas appliance safety inspection' },
  { code: 'lra', name: 'Legionella Risk Assessment', shortName: 'LRA', typicalCycle: '2 years', icon: 'Droplets', description: 'Legionella bacteria risk assessment' },
  { code: 'water_sample', name: 'Water Sampling', shortName: 'Water Sample', typicalCycle: 'Quarterly', icon: 'TestTube', description: 'Water quality testing for legionella' },
  { code: 'tmv', name: 'TMV Service', shortName: 'TMV', typicalCycle: '6 months', icon: 'Gauge', description: 'Thermostatic mixing valve servicing' },
  { code: 'hot_cold_water', name: 'Hot & Cold Water Checks', shortName: 'H&C Water', typicalCycle: 'Monthly', icon: 'Droplet', description: 'Temperature monitoring checks' },
  { code: 'lift', name: 'Lift Inspection', shortName: 'Lift/LOLER', typicalCycle: '6 months', icon: 'ArrowUpDown', description: 'LOLER inspection and testing' },
  { code: 'epc', name: 'Energy Performance Certificate', shortName: 'EPC', typicalCycle: '10 years', icon: 'Leaf', description: 'Energy efficiency rating' },
  { code: 'lightning', name: 'Lightning Protection', shortName: 'Lightning', typicalCycle: 'Annual', icon: 'CloudLightning', description: 'Lightning conductor testing' },
  { code: 'sprinkler', name: 'Sprinkler System', shortName: 'Sprinkler', typicalCycle: 'Annual', icon: 'Droplets', description: 'Sprinkler system servicing' },
  { code: 'dry_riser', name: 'Dry Riser', shortName: 'Dry Riser', typicalCycle: 'Annual', icon: 'ArrowUp', description: 'Dry riser testing and maintenance' },
];

// Helper to get category info - accepts string for flexibility with JSON data
export function getCategoryInfo(code: ComplianceCategory | string): ComplianceCategoryInfo | undefined {
  return COMPLIANCE_CATEGORIES.find(c => c.code === code);
}

// Helper to calculate status from dates
export function calculateComplianceStatus(
  expiryDate: string | null,
  hasRemedials: boolean
): ComplianceStatus {
  if (!expiryDate) return 'no-data';

  const expiry = new Date(expiryDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (expiry < today) return 'overdue';
  if (expiry <= thirtyDaysFromNow) return 'due-soon';
  if (hasRemedials) return 'remedials-required';
  return 'compliant';
}

// Helper to format days until expiry
export function getDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// Status colour mapping for Tailwind classes
export const STATUS_STYLES: Record<ComplianceStatus, { bg: string; text: string; border: string; label: string }> = {
  'compliant': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Compliant'
  },
  'due-soon': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Due Soon'
  },
  'overdue': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Overdue'
  },
  'remedials-required': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    label: 'Remedials Required'
  },
  'not-applicable': {
    bg: 'bg-slate-50',
    text: 'text-slate-400',
    border: 'border-slate-200',
    label: 'N/A'
  },
  'no-data': {
    bg: 'bg-slate-50',
    text: 'text-slate-300',
    border: 'border-slate-100',
    label: 'No Data'
  }
};

// Priority colour mapping
export const PRIORITY_STYLES: Record<RemedialPriority, { bg: string; text: string; label: string }> = {
  'critical': { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },
  'high': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
  'medium': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Medium' },
  'low': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Low' }
};
