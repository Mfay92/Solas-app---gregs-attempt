import { ServiceType } from '../types';

/**
 * Service Type Color Coding Utilities
 *
 * Provides consistent color theming and labeling across the Solas CRM
 * to distinguish between service types:
 * - Supported Living (Green) - Tenants, rent-based
 * - Residential Care (Blue) - Residents, fee-based
 * - Nursing Care (Rose) - Residents, fee-based with 24/7 nursing
 */

export interface ServiceTypeColors {
  bg: string;
  text: string;
  border: string;
  primary: string;
  hover?: string;
  light?: string;
}

/**
 * Get color scheme for a service type
 */
export function getServiceTypeColor(serviceType: ServiceType): ServiceTypeColors {
  switch (serviceType) {
    case 'Supported Living':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        primary: '#008C67', // ivolve-mid
        hover: 'hover:bg-green-200',
        light: 'bg-green-50',
      };
    case 'Residential Care':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        primary: '#3B82F6', // blue-500
        hover: 'hover:bg-blue-200',
        light: 'bg-blue-50',
      };
    case 'Nursing Care':
      return {
        bg: 'bg-rose-100',
        text: 'text-rose-700',
        border: 'border-rose-200',
        primary: '#E11D48', // rose-600
        hover: 'hover:bg-rose-200',
        light: 'bg-rose-50',
      };
  }
}

/**
 * Get appropriate label based on service type and context
 * @param serviceType - The service type of the property
 * @param role - The context: 'occupant' for tenant/resident, 'financial' for rent/fees
 */
export function getServiceTypeLabel(
  serviceType: ServiceType,
  role: 'occupant' | 'financial' | 'plural-occupant'
): string {
  const isTenant = serviceType === 'Supported Living';

  if (role === 'occupant') {
    return isTenant ? 'Tenant' : 'Resident';
  }

  if (role === 'plural-occupant') {
    return isTenant ? 'Tenants' : 'Residents';
  }

  if (role === 'financial') {
    return isTenant ? 'Rent' : 'Fees';
  }

  return '';
}

/**
 * Determine if tenancy-specific fields should be shown
 * Only Supported Living has traditional tenancy agreements and rent
 */
export function shouldShowTenancyFields(serviceType: ServiceType): boolean {
  return serviceType === 'Supported Living';
}

/**
 * Determine if care-specific fields should be shown
 * Residential and Nursing Care have higher care hours and different financial models
 */
export function shouldShowCareFields(serviceType: ServiceType): boolean {
  return serviceType === 'Residential Care' || serviceType === 'Nursing Care';
}

/**
 * Get typical care hours range for service type
 */
export function getTypicalCareHours(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'Supported Living':
      return '5-30 hours/week';
    case 'Residential Care':
      return '24/7 care';
    case 'Nursing Care':
      return '24/7 nursing care';
  }
}

/**
 * Get financial model description
 */
export function getFinancialModel(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'Supported Living':
      return 'Rent paid to Registered Provider, support paid to care provider';
    case 'Residential Care':
      return 'Weekly fees paid to care provider (includes accommodation and care)';
    case 'Nursing Care':
      return 'Weekly fees paid to care provider (includes accommodation, care, and nursing)';
  }
}

/**
 * Get service type icon/emoji
 */
export function getServiceTypeIcon(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'Supported Living':
      return '🏠';
    case 'Residential Care':
      return '🏥';
    case 'Nursing Care':
      return '⚕️';
  }
}

/**
 * Get service type description
 */
export function getServiceTypeDescription(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'Supported Living':
      return 'Independent living with flexible support hours. Tenants have their own tenancy agreement.';
    case 'Residential Care':
      return '24-hour care in a residential setting. Residents pay weekly fees to care provider.';
    case 'Nursing Care':
      return '24-hour nursing care with registered nurses on-site. Higher dependency care needs.';
  }
}

/**
 * Validate service type
 */
export function isValidServiceType(value: unknown): value is ServiceType {
  return (
    typeof value === 'string' &&
    ['Supported Living', 'Residential Care', 'Nursing Care'].includes(value)
  );
}
