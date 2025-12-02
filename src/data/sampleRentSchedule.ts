import { RentScheduleDocument } from '../components/DocumentViewer/types';
import {
  coreRentExplanations,
  serviceChargeExplanations,
  ineligibleExplanations,
} from './rentExplanations';

// Sample Rent Schedule for 88 Woodhurst Avenue
// Based on EHSL template structure
export const woodhurstRentSchedule: RentScheduleDocument = {
  id: 'rs_woodhurst_2025',
  propertyId: 'prop_0_1763943025011',
  rpName: 'EHSL Supported Housing',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 1,

  header: {
    address: '86-88 Woodhurst Avenue, Watford, WD24 5PN',
    localAuthority: 'Watford Borough Council',
    occupancyLevel: 6,
    overnightRooms: 6,
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
        amount: 180.00,
        description: coreRentExplanations.baseRent.description,
        easyReadDescription: coreRentExplanations.baseRent.easyReadDescription,
        category: 'base-rent',
      },
      {
        id: 'cr_insurance',
        label: coreRentExplanations.buildingsInsurance.label,
        amount: 8.50,
        description: coreRentExplanations.buildingsInsurance.description,
        easyReadDescription: coreRentExplanations.buildingsInsurance.easyReadDescription,
        category: 'insurance',
      },
      {
        id: 'cr_majorRepairs',
        label: coreRentExplanations.majorRepairs.label,
        amount: 15.00,
        description: coreRentExplanations.majorRepairs.description,
        easyReadDescription: coreRentExplanations.majorRepairs.easyReadDescription,
        category: 'repairs-maintenance',
      },
      {
        id: 'cr_dayToDay',
        label: coreRentExplanations.dayToDay.label,
        amount: 12.50,
        description: coreRentExplanations.dayToDay.description,
        easyReadDescription: coreRentExplanations.dayToDay.easyReadDescription,
        category: 'repairs-maintenance',
      },
      {
        id: 'cr_licencing',
        label: coreRentExplanations.licencingFee.label,
        amount: 3.25,
        description: coreRentExplanations.licencingFee.description,
        easyReadDescription: coreRentExplanations.licencingFee.easyReadDescription,
        category: 'other',
      },
      {
        id: 'cr_councilTax',
        label: coreRentExplanations.councilTax.label,
        amount: 45.00,
        description: coreRentExplanations.councilTax.description,
        easyReadDescription: coreRentExplanations.councilTax.easyReadDescription,
        calculation: 'Annual council tax (Band D) divided by 52 weeks',
        category: 'council-tax',
      },
      {
        id: 'cr_management',
        label: coreRentExplanations.management.label,
        amount: 22.00,
        description: coreRentExplanations.management.description,
        easyReadDescription: coreRentExplanations.management.easyReadDescription,
        category: 'management',
      },
      {
        id: 'cr_overheads',
        label: coreRentExplanations.overheads.label,
        amount: 10.00,
        description: coreRentExplanations.overheads.description,
        easyReadDescription: coreRentExplanations.overheads.easyReadDescription,
        category: 'overheads',
      },
      {
        id: 'cr_voidCover',
        label: coreRentExplanations.voidCoverRent.label,
        amount: 20.77,
        description: coreRentExplanations.voidCoverRent.description,
        easyReadDescription: coreRentExplanations.voidCoverRent.easyReadDescription,
        calculation: '7% of core rent subtotal (before void cover)',
        category: 'void-cover',
        isVoidCover: true,
        voidPercentage: 7,
      },
    ],
    subtotal: 317.02,
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
        amount: 6.50,
        description: serviceChargeExplanations.gardening.description,
        easyReadDescription: serviceChargeExplanations.gardening.easyReadDescription,
        category: 'gardening',
      },
      {
        id: 'sc_windowCleaning',
        label: serviceChargeExplanations.windowCleaning.label,
        amount: 2.00,
        description: serviceChargeExplanations.windowCleaning.description,
        easyReadDescription: serviceChargeExplanations.windowCleaning.easyReadDescription,
        category: 'cleaning',
      },
      {
        id: 'sc_wasteRemoval',
        label: serviceChargeExplanations.wasteRemoval.label,
        amount: 3.50,
        description: serviceChargeExplanations.wasteRemoval.description,
        easyReadDescription: serviceChargeExplanations.wasteRemoval.easyReadDescription,
        category: 'other',
      },
      {
        id: 'sc_fireAlarm',
        label: serviceChargeExplanations.fireAlarm.label,
        amount: 4.25,
        description: serviceChargeExplanations.fireAlarm.description,
        easyReadDescription: serviceChargeExplanations.fireAlarm.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_fireExtinguishers',
        label: serviceChargeExplanations.fireExtinguishers.label,
        amount: 1.50,
        description: serviceChargeExplanations.fireExtinguishers.description,
        easyReadDescription: serviceChargeExplanations.fireExtinguishers.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_patTesting',
        label: serviceChargeExplanations.patTesting.label,
        amount: 1.75,
        description: serviceChargeExplanations.patTesting.description,
        easyReadDescription: serviceChargeExplanations.patTesting.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_fireRisk',
        label: serviceChargeExplanations.fireRiskAssessment.label,
        amount: 2.50,
        description: serviceChargeExplanations.fireRiskAssessment.description,
        easyReadDescription: serviceChargeExplanations.fireRiskAssessment.easyReadDescription,
        category: 'fire-safety',
      },
      {
        id: 'sc_pestControl',
        label: serviceChargeExplanations.pestControl.label,
        amount: 1.25,
        description: serviceChargeExplanations.pestControl.description,
        easyReadDescription: serviceChargeExplanations.pestControl.easyReadDescription,
        category: 'pest-control',
      },
      {
        id: 'sc_communalCleaning',
        label: serviceChargeExplanations.communalCleaning.label,
        amount: 15.00,
        description: serviceChargeExplanations.communalCleaning.description,
        easyReadDescription: serviceChargeExplanations.communalCleaning.easyReadDescription,
        category: 'cleaning',
      },
      {
        id: 'sc_furniture',
        label: serviceChargeExplanations.furnitureReplacement.label,
        amount: 8.00,
        description: serviceChargeExplanations.furnitureReplacement.description,
        easyReadDescription: serviceChargeExplanations.furnitureReplacement.easyReadDescription,
        category: 'furnishings',
      },
      {
        id: 'sc_laundry',
        label: serviceChargeExplanations.laundryEquipment.label,
        amount: 5.00,
        description: serviceChargeExplanations.laundryEquipment.description,
        easyReadDescription: serviceChargeExplanations.laundryEquipment.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_redecoration',
        label: serviceChargeExplanations.redecoration.label,
        amount: 4.00,
        description: serviceChargeExplanations.redecoration.description,
        easyReadDescription: serviceChargeExplanations.redecoration.easyReadDescription,
        calculation: 'Total redecoration cost / 5 years / 52 weeks',
        category: 'other',
      },
      {
        id: 'sc_cctv',
        label: serviceChargeExplanations.cctv.label,
        amount: 3.00,
        description: serviceChargeExplanations.cctv.description,
        easyReadDescription: serviceChargeExplanations.cctv.easyReadDescription,
        category: 'equipment',
      },
      {
        id: 'sc_communalUtilities',
        label: serviceChargeExplanations.communalUtilities.label,
        amount: 12.00,
        description: serviceChargeExplanations.communalUtilities.description,
        easyReadDescription: serviceChargeExplanations.communalUtilities.easyReadDescription,
        category: 'utilities',
      },
      {
        id: 'sc_management',
        label: serviceChargeExplanations.serviceChargeManagement.label,
        amount: 10.54,
        description: serviceChargeExplanations.serviceChargeManagement.description,
        easyReadDescription: serviceChargeExplanations.serviceChargeManagement.easyReadDescription,
        calculation: '15% of service charges (before management cost)',
        category: 'management',
      },
      {
        id: 'sc_voidCover',
        label: serviceChargeExplanations.voidCoverServices.label,
        amount: 5.63,
        description: serviceChargeExplanations.voidCoverServices.description,
        easyReadDescription: serviceChargeExplanations.voidCoverServices.easyReadDescription,
        calculation: '7% of service charges (before void cover)',
        category: 'void-cover',
        isVoidCover: true,
        voidPercentage: 7,
      },
    ],
    subtotal: 86.42,
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
        amount: 110.77,
        description: ineligibleExplanations.gasElectric.description,
        easyReadDescription: ineligibleExplanations.gasElectric.easyReadDescription,
        calculation: 'Monthly estimate (£480) × 12 / 52 weeks',
        category: 'utilities',
      },
      {
        id: 'in_water',
        label: ineligibleExplanations.water.label,
        amount: 19.62,
        description: ineligibleExplanations.water.description,
        easyReadDescription: ineligibleExplanations.water.easyReadDescription,
        calculation: 'Monthly estimate (£85) × 12 / 52 weeks',
        category: 'utilities',
      },
    ],
    subtotal: 130.39,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 317.02,
    serviceChargesWeekly: 86.42,
    ineligibleWeekly: 130.39,
    grossWeeklyRent: 533.83,
    eligibleForHB: 403.44, // Core Rent + Service Charges
    ineligibleForHB: 130.39,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-29T00:00:00.000Z',
  },
};

// Sample Rent Schedule for Sovereign House - Larger property with more items
export const sovereignHouseRentSchedule: RentScheduleDocument = {
  id: 'rs_sovereign_2025',
  propertyId: 'prop_sovereign_house',
  rpName: 'EHSL Supported Housing',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 2,

  header: {
    address: 'Sovereign House, 12 High Street, London, SE1 4RT',
    localAuthority: 'Southwark Council',
    occupancyLevel: 12,
    overnightRooms: 12,
  },

  coreRent: {
    id: 'coreRent',
    type: 'coreRent',
    title: 'Core Rent',
    description: 'Housing Benefit eligible rent charges',
    easyReadTitle: 'Main Rent',
    easyReadDescription: 'The main costs for your home - Housing Benefit can help pay for these',
    items: [
      { id: 'cr_base', label: 'Base rent', amount: 245.00, description: 'Weekly rent for accommodation', easyReadDescription: 'The main cost for your room', category: 'base-rent' },
      { id: 'cr_insurance', label: 'Buildings Insurance', amount: 12.00, description: 'Property insurance cover', easyReadDescription: 'Protects the building', category: 'insurance' },
      { id: 'cr_repairs', label: 'Major repairs fund', amount: 18.00, description: 'Reserve for significant repairs', easyReadDescription: 'Savings for big repairs', category: 'repairs-maintenance' },
      { id: 'cr_daytoday', label: 'Day-to-day repairs', amount: 15.50, description: 'Ongoing maintenance costs', easyReadDescription: 'Fixing small things', category: 'repairs-maintenance' },
      { id: 'cr_council', label: 'Council Tax contribution', amount: 52.00, description: 'Local authority charge', easyReadDescription: 'Pays for local services', category: 'council-tax' },
      { id: 'cr_management', label: 'Management & Admin', amount: 28.00, description: 'Property management costs', easyReadDescription: 'Running the building', category: 'management' },
      { id: 'cr_overheads', label: 'Operational costs', amount: 14.00, description: 'General running costs', easyReadDescription: 'Keeping things going', category: 'overheads' },
      { id: 'cr_void', label: 'Void cover (7%)', amount: 27.02, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 411.52,
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
      { id: 'sc_cleaning', label: 'Communal cleaning', amount: 22.00, description: 'Weekly cleaning of shared areas', easyReadDescription: 'Cleaning hallways and shared spaces', category: 'cleaning' },
      { id: 'sc_gardening', label: 'Grounds maintenance', amount: 8.50, description: 'Garden and external upkeep', easyReadDescription: 'Looking after the garden', category: 'gardening' },
      { id: 'sc_fire', label: 'Fire safety systems', amount: 6.25, description: 'Alarms and extinguisher maintenance', easyReadDescription: 'Fire alarms and safety equipment', category: 'fire-safety' },
      { id: 'sc_lift', label: 'Lift maintenance', amount: 12.00, description: 'Elevator service contract', easyReadDescription: 'Keeping the lift working', category: 'equipment' },
      { id: 'sc_entry', label: 'Door entry system', amount: 4.50, description: 'Intercom and access maintenance', easyReadDescription: 'Buzzer system at the door', category: 'equipment' },
      { id: 'sc_utilities', label: 'Communal utilities', amount: 18.00, description: 'Shared area electricity', easyReadDescription: 'Lights in hallways', category: 'utilities' },
      { id: 'sc_furniture', label: 'Furniture fund', amount: 10.00, description: 'Communal furniture replacement', easyReadDescription: 'New furniture for shared rooms', category: 'furnishings' },
      { id: 'sc_cctv', label: 'CCTV & Security', amount: 5.00, description: 'Security camera maintenance', easyReadDescription: 'Security cameras', category: 'equipment' },
      { id: 'sc_mgmt', label: 'Service charge admin (15%)', amount: 12.94, description: 'Management of services', easyReadDescription: 'Organising the services', category: 'management' },
      { id: 'sc_void', label: 'Void cover (7%)', amount: 6.04, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 105.23,
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
      { id: 'in_gas', label: 'Gas & Electric', amount: 125.00, description: 'Personal energy usage', easyReadDescription: 'Your heating and electric', category: 'utilities' },
      { id: 'in_water', label: 'Water', amount: 24.00, description: 'Water supply and sewerage', easyReadDescription: 'Water for your room', category: 'utilities' },
      { id: 'in_tv', label: 'TV Licence contribution', amount: 3.50, description: 'BBC licence fee share', easyReadDescription: 'TV licence', category: 'other' },
    ],
    subtotal: 152.50,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 411.52,
    serviceChargesWeekly: 105.23,
    ineligibleWeekly: 152.50,
    grossWeeklyRent: 669.25,
    eligibleForHB: 516.75,
    ineligibleForHB: 152.50,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-30T00:00:00.000Z',
  },
};

// Sample Rent Schedule for Blanford Road - Smaller property with fewer items
export const blanfordRoadRentSchedule: RentScheduleDocument = {
  id: 'rs_blanford_2025',
  propertyId: 'prop_blanford_road',
  rpName: 'EHSL Supported Housing',
  financialYear: '2025/26',
  effectiveDate: '2025-04-01',
  version: 1,

  header: {
    address: '45 Blanford Road, Birmingham, B12 9QP',
    localAuthority: 'Birmingham City Council',
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
      { id: 'cr_base', label: 'Base rent', amount: 140.00, description: 'Weekly rent for accommodation', easyReadDescription: 'The main cost for your room', category: 'base-rent' },
      { id: 'cr_insurance', label: 'Buildings Insurance', amount: 6.00, description: 'Property insurance cover', easyReadDescription: 'Protects the building', category: 'insurance' },
      { id: 'cr_repairs', label: 'Repairs & Maintenance', amount: 18.00, description: 'General upkeep fund', easyReadDescription: 'Fixing things', category: 'repairs-maintenance' },
      { id: 'cr_council', label: 'Council Tax', amount: 38.00, description: 'Local authority charge', easyReadDescription: 'Pays for local services', category: 'council-tax' },
      { id: 'cr_management', label: 'Management costs', amount: 18.00, description: 'Property management', easyReadDescription: 'Running the house', category: 'management' },
      { id: 'cr_void', label: 'Void cover (7%)', amount: 15.40, description: 'Coverage for vacant periods', easyReadDescription: 'Covers empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 235.40,
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
      { id: 'sc_cleaning', label: 'Cleaning', amount: 12.00, description: 'Shared area cleaning', easyReadDescription: 'Cleaning the house', category: 'cleaning' },
      { id: 'sc_gardening', label: 'Garden maintenance', amount: 5.00, description: 'Garden upkeep', easyReadDescription: 'Looking after the garden', category: 'gardening' },
      { id: 'sc_fire', label: 'Fire safety', amount: 4.00, description: 'Fire equipment', easyReadDescription: 'Fire alarms', category: 'fire-safety' },
      { id: 'sc_utilities', label: 'Shared utilities', amount: 8.00, description: 'Hallway lighting', easyReadDescription: 'Lights in shared areas', category: 'utilities' },
      { id: 'sc_void', label: 'Void cover (7%)', amount: 2.03, description: 'Vacancy coverage', easyReadDescription: 'Empty room costs', category: 'void-cover', isVoidCover: true, voidPercentage: 7 },
    ],
    subtotal: 31.03,
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
      { id: 'in_energy', label: 'Gas & Electric', amount: 85.00, description: 'Personal energy', easyReadDescription: 'Your heating and electric', category: 'utilities' },
      { id: 'in_water', label: 'Water', amount: 16.00, description: 'Water supply', easyReadDescription: 'Your water', category: 'utilities' },
    ],
    subtotal: 101.00,
    isCollapsible: true,
    defaultExpanded: true,
  },

  totals: {
    coreRentWeekly: 235.40,
    serviceChargesWeekly: 31.03,
    ineligibleWeekly: 101.00,
    grossWeeklyRent: 367.43,
    eligibleForHB: 266.43,
    ineligibleForHB: 101.00,
  },

  metadata: {
    source: 'manual',
    uploadedAt: '2025-11-30T00:00:00.000Z',
  },
};

// All available rent schedules
export const allRentSchedules: RentScheduleDocument[] = [
  woodhurstRentSchedule,
  sovereignHouseRentSchedule,
  blanfordRoadRentSchedule,
];

// Helper function to get rent schedule by property ID
export function getRentScheduleByPropertyId(propertyId: string): RentScheduleDocument | undefined {
  switch (propertyId) {
    case 'prop_0_1763943025011':
      return woodhurstRentSchedule;
    case 'prop_sovereign_house':
      return sovereignHouseRentSchedule;
    case 'prop_blanford_road':
      return blanfordRoadRentSchedule;
    default:
      return undefined;
  }
}

// Get all rent schedules for demo/testing
export function getAllRentSchedules(): RentScheduleDocument[] {
  return allRentSchedules;
}

export default woodhurstRentSchedule;
