/**
 * Centralized tab type definitions for all profile components
 *
 * These types define the available tabs for each profile type.
 * Used for type-safe tab navigation and state management.
 */

// Person Profile Tabs (12 tabs)
export type PersonTabId =
    | 'overview'
    | 'personal-details'
    | 'tenancy'
    | 'support'
    | 'safeguarding'
    | 'asb'
    | 'support-plans'
    | 'risk-assessments'
    | 'compliance'
    | 'finance'
    | 'documents'
    | 'notes';

// Property Profile Tabs (8 tabs)
export type PropertyTabId =
    | 'service-overview'
    | 'property-details'
    | 'units-occupancy'
    | 'repairs-compliance'
    | 'compliance'
    | 'rps-landlords'
    | 'legal'
    | 'rents-finance';

// Referral Profile Tabs (8 tabs)
export type ReferralTabId =
    | 'overview'
    | 'personal-details'
    | 'assessment'
    | 'referrer'
    | 'linked-property'
    | 'funding'
    | 'documents'
    | 'notes';

// Generic tab configuration interface
export interface TabConfig<T extends string> {
    id: T;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}
