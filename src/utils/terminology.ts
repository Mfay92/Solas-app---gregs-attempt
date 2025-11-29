/**
 * Terminology utilities for dynamic labeling based on service type
 *
 * In Supported Living contexts, we refer to occupants as "Residents"
 * In standard Residential contexts, we refer to occupants as "Tenants"
 */

/**
 * Returns the singular label for a property occupant based on service type
 */
export function getResidentLabel(serviceType: string | undefined): string {
    if (!serviceType) return 'Tenant';
    return serviceType === 'Supported Living' ? 'Resident' : 'Tenant';
}

/**
 * Returns the plural label for property occupants based on service type
 */
export function getResidentsLabel(serviceType: string | undefined): string {
    if (!serviceType) return 'Tenants';
    return serviceType === 'Supported Living' ? 'Residents' : 'Tenants';
}

/**
 * Returns both singular and plural labels for convenience
 */
export function getTerminology(serviceType: string | undefined) {
    return {
        singular: getResidentLabel(serviceType),
        plural: getResidentsLabel(serviceType),
        isSupportedLiving: serviceType === 'Supported Living'
    };
}

/**
 * Hook-like function that returns terminology based on service type
 * Can be used in components for consistent labeling
 */
export function useTerminology(serviceType: string | undefined) {
    return getTerminology(serviceType);
}
