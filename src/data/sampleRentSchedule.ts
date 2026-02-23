import { RentScheduleDocument } from '../components/DocumentViewer/types';
import {
  coreRentExplanations,
  serviceChargeExplanations,
  ineligibleExplanations,
} from './rentExplanations';

// Sample Rent Schedule for 12 Maple Grove - Medium property
// Fictional data for demonstration purposes
export const mapleGroveRentSchedule: RentScheduleDocument = {
  id: 'rs_maplegrove_2025',
  propertyId: 'prop_0_1763943025011', // Links to existing property in properties.json
  rpName: 'Beacon Housing Association',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 1,

  header: {
    address: '12 Maple Grove, Bristol, BS8 2PH',
    localAuthority: 'Bristol City Council',
    occupancyLevel: 5,
    overnightRooms: 5,
  },

  coreRent: {
    id: 'coreRent',
    type: 'coreRent',
    title: 'Core Rent',
    description: 'Housing Benefit eligible rent charges',
    easyReadTitle: 'Main Rent',
    easyReadDescription: 'The main costs for your home - Housing Benefit can help pay for these',
    items: [
      {
        id: 'cr_baseRent',
        label: coreRentExplanations.baseRent.label,
        amount: 165.00,
        description: coreRentExplanations.baseRent.description,
        easyReadDescription: coreRentExplanations.baseRent.easyReadDescription,
        category: 'base-rent',
      },
      {
        id: 'cr_insurance',
        label: coreRentExplanations.buildingsInsurance.label,
        amount: 7.25,
        description: coreRentExplanations.buildingsInsurance.description,
        easyReadDescription: coreRentExplanations.buildingsInsurance.easyReadDescription,
        category: 'insurance',
      },
      {
        id: 'cr_majorRepairs',
        label: coreRentExplanations.majorRepairs.label,
        amount: 12.50,
        description: coreRentExplanations.majorRepairs.description,
        easyReadDescription: coreRentExplanations.majorRepairs.easyReadDescription,
        category: 'repairs-maintenance',
      },
      {
        id: 'cr_dayToDay',
        label: coreRentExplanations.dayToDay.label,
        amount: 10.75,
        description: coreRentExplanations.dayToDay.description,
        easyReadDescription: coreRentExplanations.dayToDay.easyReadDescription,
        category: 'repairs-maintenance',
      },
      {
        id: 'cr_licencing',
        label: coreRentExplanations.licencingFee.label,
        amount: 2.80,
        description: coreRentExplanations.licencingFee.description,
        easyReadDescription: coreRentExplanations.licencingFee.easyReadDescription,
        category: 'other',
      },
      {
        id: 'cr_councilTax',
        label: coreRentExplanations.councilTax.label,
        amount: 42.00,
        description: coreRentExplanations.councilTax.description,
        easyReadDescription: coreRentExplanations.councilTax.easyReadDescription,
        calculation: 'Annual council tax (Band C) divided by 52 weeks',
        category: 'council-tax',
      },
      {
        id: 'cr_management',
        label: coreRentExplanations.management.label,
        amount: 19.50,
        description: coreRentExplanations.management.description,
        easyReadDescription: coreRentExplanations.management.easyReadDescription,
        category: 'management',
      },
      {
        id: 'cr_overheads',
        label: coreRentExplanations.overheads.label,
        amount: 8.50,
        description: coreRentExplanations.overheads.description,
        easyReadDescription: coreRentExplanations.overheads.easyReadDescription,
        category: 'overheads',
      },
      {
        id: 'cr_voidCover',
        label: coreRentExplanations.voidCoverRent.label,
        amount: 18.78, // 7% of 268.30
        description: coreRentExplanations.voidCoverRent.description,
        easyReadDescription: coreRentExplanations.voidCoverRent.easyReadDescription,
        calculation: '7% of core rent subtotal (before void cover)',
        category: 'void-cover',
        isVoidCover: true,
        voidPercentage: 7,
      },
    ],
    subtotal: 287.08, // 268.30 + 18.78
    isCollapsible: true,
    defaultExpanded: true,
  },

  eligibleServiceCharges: {
    id: 'eligibleServiceCharges',
    type: 'eligibleServiceCharges',
    title: 'HB Eligible Service Charges',
    description: 'Communal services covered by Housing Benefit',
    easyReadTitle: 'Extra Services',
    easyReadDescription: 'Services for shared areas - Housing Benefit can help pay for these too',
    items: [
      {
        id: 'sc_gardening',
        label: serviceChargeExplanations.gardening.label,
        amount: 5.75,
        description: serviceChargeExplanations.gardening.description,
        easyReadDescription: serviceChargeExplanations.gardening.easyReadDescription,
        category: 'gardening',
      },
      {
        id: 'sc_windowCleaning',
        label: serviceChargeExplanations.windowCleaning.label,
        amount: 1.80,
        description: serviceChargeExplanations.windowCleaning.description,
        easyReadDescription: serviceChargeExplanations.windowCleaning.easyReadDescription,
        category: 'cleaning',
      },
      {
        id: 'sc_wasteRemoval',
        label: serviceChargeExplanations.wasteRemoval.label,
        amount: 3.25,
        description: serviceChargeExplanations.wasteRemoval.description,
        easyReadDescription: serviceChargeExplanations.wasteRemoval.easyReadDescription,
        category: 'other',
      },
      {
        id: 'sc_fireAlarm',
        label: serviceChargeExplanations.fireAlarm.label,
        amount: 3.80,
        description: serviceChargeExplanations.fireAlarm.description,
        easyReadDescription: serviceChargeExplanations.fireAlarm.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_fireExtinguishers',
        label: serviceChargeExplanations.fireExtinguishers.label,
        amount: 1.25,
        description: serviceChargeExplanations.fireExtinguishers.description,
        easyReadDescription: serviceChargeExplanations.fireExtinguishers.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_patTesting',
        label: serviceChargeExplanations.patTesting.label,
        amount: 1.50,
        description: serviceChargeExplanations.patTesting.description,
        easyReadDescription: serviceChargeExplanations.patTesting.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_fireRisk',
        label: serviceChargeExplanations.fireRiskAssessment.label,
        amount: 2.25,
        description: serviceChargeExplanations.fireRiskAssessment.description,
        easyReadDescription: serviceChargeExplanations.fireRiskAssessment.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_pestControl',
        label: serviceChargeExplanations.pestControl.label,
        amount: 1.10,
        description: serviceChargeExplanations.pestControl.description,
        easyReadDescription: serviceChargeExplanations.pestControl.easyReadDescription,
        category: 'pest-control',
      },
      {
        id: 'sc_communalCleaning',
        label: serviceChargeExplanations.communalCleaning.label,
        amount: 13.50,
        description: serviceChargeExplanations.communalCleaning.description,
        easyReadDescription: serviceChargeExplanations.communalCleaning.easyReadDescription,
        category: 'cleaning',
      },
      {
        id: 'sc_furniture',
        label: serviceChargeExplanations.furnitureReplacement.label,
        amount: 7.00,
        description: serviceChargeExplanations.furnitureReplacement.description,
        easyReadDescription: serviceChargeExplanations.furnitureReplacement.easyReadDescription,
        category: 'furnishings',
      },
      {
        id: 'sc_laundry',
        label: serviceChargeExplanations.laundryEquipment.label,
        amount: 4.50,
        description: serviceChargeExplanations.laundryEquipment.description,
        easyReadDescription: serviceChargeExplanations.laundryEquipment.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_redecoration',
        label: serviceChargeExplanations.redecoration.label,
        amount: 3.50,
        description: serviceChargeExplanations.redecoration.description,
        easyReadDescription: serviceChargeExplanations.redecoration.easyReadDescription,
        calculation: 'Total redecoration cost / 5 years / 52 weeks',
        category: 'other',
      },
      {
        id: 'sc_cctv',
        label: serviceChargeExplanations.cctv.label,
        amount: 2.75,
        description: serviceChargeExplanations.cctv.description,
        easyReadDescription: serviceChargeExplanations.cctv.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_communalUtilities',
        label: serviceChargeExplanations.communalUtilities.label,
        amount: 10.50,
        description: serviceChargeExplanations.communalUtilities.description,
        easyReadDescription: serviceChargeExplanations.communalUtilities.easyReadDescription,
        category: 'utilities',
      },
      {
        id: 'sc_management',
        label: serviceChargeExplanations.serviceChargeManagement.label,
        amount: 9.37, // 15% of 62.45
        description: serviceChargeExplanations.serviceChargeManagement.description,
        easyReadDescription: serviceChargeExplanations.serviceChargeManagement.easyReadDescription,
        calculation: '15% of service charges (before management cost)',
        category: 'management',
      },
      {
        id: 'sc_voidCover',
        label: serviceChargeExplanations.voidCoverServices.label,
        amount: 5.03, // 7% of 71.82
        description: serviceChargeExplanations.voidCoverServices.description,
        easyReadDescription: serviceChargeExplanations.voidCoverServices.easyReadDescription,
        calculation: '7% of service charges (before void cover)',
        category: 'void-cover',
        isVoidCover: true,
        voidPercentage: 7,
      },
    ],
    subtotal: 76.85, // sum of all items
    isCollapsible: true,
    defaultExpanded: true,
  },

  ineligibleServices: {
    id: 'ineligibleServices',
    type: 'ineligibleServices',
    title: 'Ineligible Services',
    description: 'Personal utilities - tenant responsibility',
    easyReadTitle: 'Your Personal Bills',
    easyReadDescription: 'These are your own bills - Housing Benefit does not pay for these',
    items: [
      {
        id: 'in_gasElectric',
        label: ineligibleExplanations.gasElectric.label,
        amount: 98.50,
        description: ineligibleExplanations.gasElectric.description,
        easyReadDescription: ineligibleExplanations.gasElectric.easyReadDescription,
        calculation: 'Monthly estimate (£426) × 12 / 52 weeks',
        category: 'utilities',
      },
      {
        id: 'in_water',
        label: ineligibleExplanations.water.label,
        amount: 17.35,
        description: ineligibleExplanations.water.description,
        easyReadDescription: ineligibleExplanations.water.easyReadDescription,
        calculation: 'Monthly estimate (£75) × 12 / 52 weeks',
        category: 'utilities',
      },
    ],
    subtotal: 115.85,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 287.08,
    serviceChargesWeekly: 76.85,
    ineligibleWeekly: 115.85,
    grossWeeklyRent: 479.78, // 287.08 + 76.85 + 115.85
    eligibleForHB: 363.93, // Core Rent + Service Charges
    ineligibleForHB: 115.85,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-29T00:00:00.000Z',
  },
};

// Sample Rent Schedule for Riverside Lodge - Larger property
export const riversideLodgeRentSchedule: RentScheduleDocument = {
  id: 'rs_riverside_2025',
  propertyId: 'prop_riverside_lodge',
  rpName: 'Hartwell Housing Trust',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 2,

  header: {
    address: 'Riverside Lodge, 45 Thames Road, Reading, RG1 3AB',
    localAuthority: 'Reading Borough Council',
    occupancyLevel: 10,
    overnightRooms: 10,
  },

  coreRent: {
    id: 'coreRent',
    type: 'coreRent',
    title: 'Core Rent',
    description: 'Housing Benefit eligible rent charges',
    easyReadTitle: 'Main Rent',
    easyReadDescription: 'The main costs for your home - Housing Benefit can help pay for these',
    items: [
      { id: 'cr_base', label: 'Base rent', amount: 225.00, description: 'Weekly rent for accommodation', easyReadDescription: 'The main cost for your room', category: 'base-rent' },
      { id: 'cr_insurance', label: 'Buildings Insurance', amount: 10.50, description: 'Property insurance cover', easyReadDescription: 'Protects the building', category: 'insurance' },
      { id: 'cr_repairs', label: 'Major repairs fund', amount: 16.00, description: 'Reserve for significant repairs', easyReadDescription: 'Savings for big repairs', category: 'repairs-maintenance' },
      { id: 'cr_daytoday', label: 'Day-to-day repairs', amount: 14.25, description: 'Ongoing maintenance costs', easyReadDescription: 'Fixing small things', category: 'repairs-maintenance' },
      { id: 'cr_council', label: 'Council Tax contribution', amount: 48.00, description: 'Local authority charge', easyReadDescription: 'Pays for local services', category: 'council-tax' },
      { id: 'cr_management', label: 'Management & Admin', amount: 25.50, description: 'Property management costs', easyReadDescription: 'Running the building', category: 'management' },
      { id: 'cr_overheads', label: 'Operational costs', amount: 12.50, description: 'General running costs', easyReadDescription: 'Keeping things going', category: 'overheads' },
      { id: 'cr_void', label: 'Void cover (7%)', amount: 24.62, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 376.37, // 351.75 + 24.62
    isCollapsible: true,
    defaultExpanded: true,
  },

  eligibleServiceCharges: {
    id: 'eligibleServiceCharges',
    type: 'eligibleServiceCharges',
    title: 'HB Eligible Service Charges',
    description: 'Communal services covered by Housing Benefit',
    easyReadTitle: 'Extra Services',
    easyReadDescription: 'Services for shared areas - Housing Benefit can help pay for these too',
    items: [
      { id: 'sc_cleaning', label: 'Communal cleaning', amount: 20.00, description: 'Weekly cleaning of shared areas', easyReadDescription: 'Cleaning hallways and shared spaces', category: 'cleaning' },
      { id: 'sc_gardening', label: 'Grounds maintenance', amount: 7.50, description: 'Garden and external upkeep', easyReadDescription: 'Looking after the garden', category: 'gardening' },
      { id: 'sc_fire', label: 'Fire safety systems', amount: 5.75, description: 'Alarms and extinguisher maintenance', easyReadDescription: 'Fire alarms and safety equipment', category: 'fire-safety' },
      { id: 'sc_lift', label: 'Lift maintenance', amount: 10.50, description: 'Elevator service contract', easyReadDescription: 'Keeping the lift working', category: 'equipment' },
      { id: 'sc_entry', label: 'Door entry system', amount: 4.00, description: 'Intercom and access maintenance', easyReadDescription: 'Buzzer system at the door', category: 'equipment' },
      { id: 'sc_utilities', label: 'Communal utilities', amount: 16.00, description: 'Shared area electricity', easyReadDescription: 'Lights in hallways', category: 'utilities' },
      { id: 'sc_furniture', label: 'Furniture fund', amount: 9.00, description: 'Communal furniture replacement', easyReadDescription: 'New furniture for shared rooms', category: 'furnishings' },
      { id: 'sc_cctv', label: 'CCTV & Security', amount: 4.50, description: 'Security camera maintenance', easyReadDescription: 'Security cameras', category: 'equipment' },
      { id: 'sc_mgmt', label: 'Service charge admin (15%)', amount: 11.59, description: 'Management of services', easyReadDescription: 'Organising the services', category: 'management' },
      { id: 'sc_void', label: 'Void cover (7%)', amount: 5.43, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 94.27,
    isCollapsible: true,
    defaultExpanded: true,
  },

  ineligibleServices: {
    id: 'ineligibleServices',
    type: 'ineligibleServices',
    title: 'Ineligible Services',
    description: 'Personal utilities - tenant responsibility',
    easyReadTitle: 'Your Personal Bills',
    easyReadDescription: 'These are your own bills - Housing Benefit does not pay for these',
    items: [
      { id: 'in_gas', label: 'Gas & Electric', amount: 115.00, description: 'Personal energy usage', easyReadDescription: 'Your heating and electric', category: 'utilities' },
      { id: 'in_water', label: 'Water', amount: 22.00, description: 'Water supply and sewerage', easyReadDescription: 'Water for your room', category: 'utilities' },
      { id: 'in_tv', label: 'TV Licence contribution', amount: 3.25, description: 'BBC licence fee share', easyReadDescription: 'TV licence', category: 'other' },
    ],
    subtotal: 140.25,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 376.37,
    serviceChargesWeekly: 94.27,
    ineligibleWeekly: 140.25,
    grossWeeklyRent: 610.89,
    eligibleForHB: 470.64,
    ineligibleForHB: 140.25,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-30T00:00:00.000Z',
  },
};

// Sample Rent Schedule for Elm Court - Smaller property
export const elmCourtRentSchedule: RentScheduleDocument = {
  id: 'rs_elmcourt_2025',
  propertyId: 'prop_elm_court',
  rpName: 'Northern Homes RP',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 1,

  header: {
    address: '23 Elm Court, Manchester, M4 5GH',
    localAuthority: 'Manchester City Council',
    occupancyLevel: 4,
    overnightRooms: 4,
  },

  coreRent: {
    id: 'coreRent',
    type: 'coreRent',
    title: 'Core Rent',
    description: 'Housing Benefit eligible rent charges',
    easyReadTitle: 'Main Rent',
    easyReadDescription: 'The main costs for your home - Housing Benefit can help pay for these',
    items: [
      { id: 'cr_base', label: 'Base rent', amount: 128.00, description: 'Weekly rent for accommodation', easyReadDescription: 'The main cost for your room', category: 'base-rent' },
      { id: 'cr_insurance', label: 'Buildings Insurance', amount: 5.50, description: 'Property insurance cover', easyReadDescription: 'Protects the building', category: 'insurance' },
      { id: 'cr_repairs', label: 'Repairs & Maintenance', amount: 16.50, description: 'General upkeep fund', easyReadDescription: 'Fixing things', category: 'repairs-maintenance' },
      { id: 'cr_council', label: 'Council Tax', amount: 35.00, description: 'Local authority charge', easyReadDescription: 'Pays for local services', category: 'council-tax' },
      { id: 'cr_management', label: 'Management costs', amount: 16.00, description: 'Property management', easyReadDescription: 'Running the house', category: 'management' },
      { id: 'cr_void', label: 'Void cover (7%)', amount: 14.07, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 215.07, // 201.00 + 14.07
    isCollapsible: true,
    defaultExpanded: true,
  },

  eligibleServiceCharges: {
    id: 'eligibleServiceCharges',
    type: 'eligibleServiceCharges',
    title: 'HB Eligible Service Charges',
    description: 'Communal services covered by Housing Benefit',
    easyReadTitle: 'Extra Services',
    easyReadDescription: 'Services for shared areas - Housing Benefit can help pay for these too',
    items: [
      { id: 'sc_cleaning', label: 'Cleaning', amount: 10.50, description: 'Shared area cleaning', easyReadDescription: 'Cleaning the house', category: 'cleaning' },
      { id: 'sc_gardening', label: 'Garden maintenance', amount: 4.50, description: 'Garden upkeep', easyReadDescription: 'Looking after the garden', category: 'gardening' },
      { id: 'sc_fire', label: 'Fire safety', amount: 3.75, description: 'Fire equipment', easyReadDescription: 'Fire alarms', category: 'fire-safety' },
      { id: 'sc_utilities', label: 'Shared utilities', amount: 7.25, description: 'Hallway lighting', easyReadDescription: 'Lights in shared areas', category: 'utilities' },
      { id: 'sc_void', label: 'Void cover (7%)', amount: 1.82, description: 'Vacancy coverage', easyReadDescription: 'Empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 27.82, // 26.00 + 1.82
    isCollapsible: true,
    defaultExpanded: true,
  },

  ineligibleServices: {
    id: 'ineligibleServices',
    type: 'ineligibleServices',
    title: 'Ineligible Services',
    description: 'Personal utilities - tenant responsibility',
    easyReadTitle: 'Your Personal Bills',
    easyReadDescription: 'These are your own bills - Housing Benefit does not pay for these',
    items: [
      { id: 'in_energy', label: 'Gas & Electric', amount: 78.00, description: 'Personal energy', easyReadDescription: 'Your heating and electric', category: 'utilities' },
      { id: 'in_water', label: 'Water', amount: 14.50, description: 'Water supply', easyReadDescription: 'Your water', category: 'utilities' },
    ],
    subtotal: 92.50,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 215.07,
    serviceChargesWeekly: 27.82,
    ineligibleWeekly: 92.50,
    grossWeeklyRent: 335.39,
    eligibleForHB: 242.89,
    ineligibleForHB: 92.50,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-30T00:00:00.000Z',
  },
};

// Export with the old name for backwards compatibility with Finance page
export const woodhurstRentSchedule = mapleGroveRentSchedule;

// All available rent schedules
export const allRentSchedules: RentScheduleDocument[] = [
  mapleGroveRentSchedule,
  riversideLodgeRentSchedule,
  elmCourtRentSchedule,
];

// Helper function to get rent schedule by property ID
export function getRentScheduleByPropertyId(propertyId: string): RentScheduleDocument | undefined {
  switch (propertyId) {
    case 'prop_0_1763943025011':
      return mapleGroveRentSchedule;
    case 'prop_riverside_lodge':
      return riversideLodgeRentSchedule;
    case 'prop_elm_court':
      return elmCourtRentSchedule;
    default:
      return undefined;
  }
}

// Get all rent schedules for demo/testing
export function getAllRentSchedules(): RentScheduleDocument[] {
  return allRentSchedules;
}

export default mapleGroveRentSchedule;
