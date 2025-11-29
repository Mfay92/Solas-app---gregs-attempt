import { RentItemCategory } from '../components/DocumentViewer/types';

// ============================================
// RENT LINE ITEM EXPLANATIONS
// Based on EHSL Rent Schedule Template
// ============================================

export interface RentExplanation {
  label: string;
  description: string;
  easyReadDescription: string;
  category: RentItemCategory;
  isVoidCover?: boolean;
  voidPercentage?: number;
}

// Core Rent Items - HB Eligible
export const coreRentExplanations: Record<string, RentExplanation> = {
  baseRent: {
    label: 'Base rent',
    description: 'The fundamental rent charge for occupying the property, excluding any service charges or additional costs.',
    easyReadDescription: 'This is the main cost for living in your home.',
    category: 'base-rent',
  },
  buildingsInsurance: {
    label: 'Buildings Insurance',
    description: 'Insurance covering the structure of the building against damage from fire, flood, storms, and other risks.',
    easyReadDescription: 'This pays to fix the building if something bad happens, like a fire or flood.',
    category: 'insurance',
  },
  majorRepairs: {
    label: 'Major repairs and adaptations',
    description: 'Reserve fund for significant structural repairs and accessibility adaptations such as ramps, stairlifts, or bathroom modifications.',
    easyReadDescription: 'Money saved up for big repairs or changes to make the home easier to live in.',
    category: 'repairs-maintenance',
  },
  dayToDay: {
    label: 'Repairs and Maintenance (day-to-day)',
    description: 'Covers routine maintenance and minor repairs such as fixing taps, door handles, and general wear and tear.',
    easyReadDescription: 'Money for fixing small things that break, like taps or door handles.',
    category: 'repairs-maintenance',
  },
  licencingFee: {
    label: 'Local Authority Licencing Fee',
    description: 'Fee paid to the local council for property licensing under HMO (House in Multiple Occupation) regulations.',
    easyReadDescription: 'A fee paid to the council for permission to run this type of home.',
    category: 'other',
  },
  councilTax: {
    label: 'Council Tax',
    description: 'Local authority tax that pays for services like rubbish collection, street cleaning, and local facilities.',
    easyReadDescription: 'Money paid to the council for local services like bin collection.',
    category: 'council-tax',
  },
  management: {
    label: 'Management and Administration Costs',
    description: 'Costs for managing the property including staff time, office resources, and administrative tasks.',
    easyReadDescription: 'The cost of having people look after the property and sort out paperwork.',
    category: 'management',
  },
  overheads: {
    label: 'Operational overheads',
    description: 'General running costs including office expenses, professional fees, and regulatory compliance costs.',
    easyReadDescription: 'General costs to keep everything running smoothly.',
    category: 'overheads',
  },
  voidCoverRent: {
    label: 'Void and Bad Debt Cover on Rent',
    description: 'A reserve to cover periods when rooms are empty (voids) or when rent is not paid. Typically set at 7%.',
    easyReadDescription: 'Money set aside for when rooms are empty or people cannot pay.',
    category: 'void-cover',
    isVoidCover: true,
    voidPercentage: 7,
  },
};

// HB Eligible Service Charges
export const serviceChargeExplanations: Record<string, RentExplanation> = {
  gardening: {
    label: 'Gardening and grounds maintenance',
    description: 'Regular upkeep of gardens, lawns, hedges, and outdoor areas. Typically includes grass cutting and seasonal maintenance.',
    easyReadDescription: 'Keeping the garden tidy - cutting grass, trimming hedges.',
    category: 'gardening',
  },
  windowCleaning: {
    label: 'Window Cleaning (external only)',
    description: 'Professional cleaning of external windows. Internal window cleaning is tenant responsibility.',
    easyReadDescription: 'Having someone clean the outside of the windows.',
    category: 'cleaning',
  },
  wasteRemoval: {
    label: 'Waste Removal',
    description: 'Collection and disposal of general waste and recycling beyond standard council collection.',
    easyReadDescription: 'Getting rid of extra rubbish that the normal bin collection does not take.',
    category: 'other',
  },
  fireAlarm: {
    label: 'Fire Alarm and emergency lighting servicing',
    description: 'Regular testing, maintenance, and certification of fire alarm systems and emergency lighting to meet safety regulations.',
    easyReadDescription: 'Checking that fire alarms and emergency lights are working properly.',
    category: 'fire-safety',
  },
  fireExtinguishers: {
    label: 'Fire Extinguishers',
    description: 'Provision, maintenance, and annual inspection of fire extinguishers as required by fire safety regulations.',
    easyReadDescription: 'Making sure fire extinguishers are ready to use if needed.',
    category: 'fire-safety',
  },
  aovServicing: {
    label: 'Automatic Opening Vent (AOV) Servicing',
    description: 'Maintenance of automatic smoke ventilation systems that open during a fire to let smoke escape.',
    easyReadDescription: 'Checking the vents that open automatically if there is a fire.',
    category: 'fire-safety',
  },
  patTesting: {
    label: 'Portable Appliance Testing (PAT)',
    description: 'Annual safety testing of electrical appliances to ensure they are safe to use.',
    easyReadDescription: 'Testing electrical items like kettles and toasters to make sure they are safe.',
    category: 'equipment',
  },
  fireRiskAssessment: {
    label: 'Fire Risk Assessment',
    description: 'Professional assessment of fire hazards and safety measures, required by law for shared accommodation.',
    easyReadDescription: 'A safety expert checking the building for fire risks.',
    category: 'fire-safety',
  },
  pestControl: {
    label: 'Pest Control',
    description: 'Prevention and treatment of pest infestations including mice, rats, and insects.',
    easyReadDescription: 'Dealing with pests like mice or insects if they become a problem.',
    category: 'pest-control',
  },
  communalCleaning: {
    label: 'Communal cleaning (Weekly)',
    description: 'Regular cleaning of shared areas including hallways, stairs, communal kitchens, and bathrooms.',
    easyReadDescription: 'Cleaning the shared areas of the home every week.',
    category: 'cleaning',
  },
  furnitureReplacement: {
    label: 'Furniture and household equipment replacement',
    description: 'Reserve fund for replacing worn furniture and household items in communal areas.',
    easyReadDescription: 'Money saved up for replacing furniture when it gets old or broken.',
    category: 'furnishings',
  },
  laundryEquipment: {
    label: 'Laundry Equipment and white goods',
    description: 'Provision and replacement of washing machines, tumble dryers, fridges, and other major appliances.',
    easyReadDescription: 'Paying for washing machines, fridges and other big appliances.',
    category: 'equipment',
  },
  redecoration: {
    label: 'Redecoration of communal areas (5 year cycle)',
    description: 'Scheduled repainting and refurbishment of shared spaces on a five-year rotation.',
    easyReadDescription: 'Repainting and freshening up shared areas every five years.',
    category: 'other',
  },
  specialistEquipment: {
    label: 'Specialist equipment',
    description: 'Maintenance and replacement of specialist accessibility or care equipment.',
    easyReadDescription: 'Looking after special equipment that helps people in the home.',
    category: 'equipment',
  },
  lifts: {
    label: 'Lifts',
    description: 'Maintenance, safety inspections, and servicing of passenger lifts.',
    easyReadDescription: 'Keeping the lift working safely.',
    category: 'equipment',
  },
  cctv: {
    label: 'CCTV maintenance and servicing',
    description: 'Upkeep and maintenance of security cameras and recording equipment.',
    easyReadDescription: 'Looking after the security cameras.',
    category: 'equipment',
  },
  communalUtilities: {
    label: 'Utility bills in communal areas',
    description: 'Gas, electricity, and water costs for shared spaces like hallways, communal lounges, and laundry rooms.',
    easyReadDescription: 'Gas, electric and water for the shared parts of the building.',
    category: 'utilities',
  },
  serviceChargeManagement: {
    label: 'Service Charge management cost (at 15%)',
    description: 'Administrative costs for managing and coordinating all service charge activities. Set at 15% of total service charges.',
    easyReadDescription: 'The cost of organising and managing all these services.',
    category: 'management',
  },
  voidCoverServices: {
    label: 'Void and Bad Debt Cover on Communal services',
    description: 'A reserve to cover service charge shortfalls when rooms are empty. Typically set at 7%.',
    easyReadDescription: 'Money set aside in case some people cannot pay their share.',
    category: 'void-cover',
    isVoidCover: true,
    voidPercentage: 7,
  },
};

// Ineligible Services - Tenant pays directly (not covered by Housing Benefit)
export const ineligibleExplanations: Record<string, RentExplanation> = {
  gasElectric: {
    label: 'Gas and Electricity (personal)',
    description: 'Personal energy usage in your room/flat. This is your individual consumption and is not covered by Housing Benefit.',
    easyReadDescription: 'The gas and electric you use in your own room. You pay this yourself.',
    category: 'utilities',
  },
  water: {
    label: 'Water and Sewerage',
    description: 'Personal water usage and sewerage charges. Not eligible for Housing Benefit.',
    easyReadDescription: 'The water you use. You pay this yourself.',
    category: 'utilities',
  },
  wifi: {
    label: 'WiFi / Internet (personal)',
    description: 'Personal internet connection for your room. Optional service not covered by Housing Benefit.',
    easyReadDescription: 'Internet for your room. You pay this yourself.',
    category: 'utilities',
  },
};

// Helper function to get explanation by key
export function getExplanation(key: string): RentExplanation | undefined {
  return (
    coreRentExplanations[key] ||
    serviceChargeExplanations[key] ||
    ineligibleExplanations[key]
  );
}

// Helper to get all explanations as a flat array
export function getAllExplanations(): RentExplanation[] {
  return [
    ...Object.values(coreRentExplanations),
    ...Object.values(serviceChargeExplanations),
    ...Object.values(ineligibleExplanations),
  ];
}
