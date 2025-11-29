// ============================================
// RENT SCHEDULE DOCUMENT TYPES
// Based on EHSL Rent Schedule Template
// ============================================

export type RentItemCategory =
  | 'base-rent'
  | 'repairs-maintenance'
  | 'council-tax'
  | 'insurance'
  | 'management'
  | 'overheads'
  | 'void-cover'
  | 'gardening'
  | 'cleaning'
  | 'fire-safety'
  | 'utilities'
  | 'furnishings'
  | 'equipment'
  | 'pest-control'
  | 'other';

export type ViewMode = 'normal' | 'easyRead' | 'comparison';

export type RentSectionType = 'coreRent' | 'eligibleServiceCharges' | 'ineligibleServices';

export interface RentLineItem {
  id: string;
  label: string;
  amount: number; // Weekly amount in £
  description: string; // Technical explanation
  easyReadDescription: string; // Plain English version
  calculation?: string; // How it's calculated (if known)
  category: RentItemCategory;
  isVoidCover?: boolean;
  voidPercentage?: number; // e.g., 7 for 7%
}

export interface RentSection {
  id: string;
  type: RentSectionType;
  title: string;
  description?: string;
  easyReadDescription?: string;
  easyReadTitle?: string;
  items: RentLineItem[];
  subtotal: number;
  isCollapsible: boolean;
  defaultExpanded: boolean;
}

export interface RentScheduleHeader {
  address: string;
  localAuthority: string;
  occupancyLevel: number; // Number of lettable units
  overnightRooms: number;
}

export interface RentScheduleTotals {
  coreRentWeekly: number;
  serviceChargesWeekly: number;
  ineligibleWeekly: number;
  grossWeeklyRent: number;
  eligibleForHB: number;
  ineligibleForHB: number;
}

export interface RentScheduleMetadata {
  uploadedBy?: string;
  uploadedAt?: string;
  source?: 'manual' | 'ocr' | 'import';
  originalDocumentUrl?: string;
}

export interface RentScheduleDocument {
  id: string;
  propertyId: string;
  rpName: string;
  financialYear: string; // e.g., "2025/26" (April to April)
  effectiveDate: string;
  version: number;
  header: RentScheduleHeader;
  coreRent: RentSection;
  eligibleServiceCharges: RentSection;
  ineligibleServices: RentSection;
  totals: RentScheduleTotals;
  metadata: RentScheduleMetadata;
}

// ============================================
// DOCUMENT VIEWER STATE
// ============================================

export interface DocumentViewerState {
  viewMode: ViewMode;
  expandedSections: Set<string>;
  expandedItems: Set<string>;
  activeTooltip: string | null;
  showFilter: 'all' | 'core' | 'bills';
}

export interface DocumentViewerContextValue {
  state: DocumentViewerState;
  setViewMode: (mode: ViewMode) => void;
  toggleSection: (sectionId: string) => void;
  toggleItem: (itemId: string) => void;
  setActiveTooltip: (itemId: string | null) => void;
  setShowFilter: (filter: 'all' | 'core' | 'bills') => void;
  isEasyRead: boolean;
  isComparison: boolean;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface DocumentSectionProps {
  section: RentSection;
  showEasyRead?: boolean;
}

export interface LineItemProps {
  item: RentLineItem;
  showEasyRead?: boolean;
  sectionType: RentSectionType;
}

export interface SummaryCardProps {
  label: string;
  amount: number;
  sublabel?: string;
  variant?: 'default' | 'highlight' | 'warning';
  easyReadLabel?: string;
}

export interface DocumentViewerToolbarProps {
  onExportPdf?: () => void;
}

export interface RentScheduleViewerProps {
  document: RentScheduleDocument;
  propertyId?: string;
}
