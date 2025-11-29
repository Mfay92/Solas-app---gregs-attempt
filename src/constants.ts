export const ASSET_STATUS = {
    OCCUPIED: 'Occupied',
    VOID: 'Void',
    IN_MANAGEMENT: 'In Management',
    OUT_OF_MANAGEMENT: 'Out of Management'
} as const;

export const ASSET_TYPES = {
    MASTER: 'Master',
    UNIT: 'Unit'
} as const;

export const SERVICE_TYPES = {
    SUPPORTED_LIVING: 'Supported Living',
    RESIDENTIAL: 'Residential'
} as const;

export const COMPLIANCE_STATUS = {
    COMPLIANT: 'Compliant',
    NON_COMPLIANT: 'Non-Compliant',
    PENDING: 'Pending'
} as const;

export const UI_CONSTANTS = {
    TOAST_DURATION: 3000,
    SIDEBAR_WIDTH_EXPANDED: 256,
    SIDEBAR_WIDTH_COLLAPSED: 64,
    VIEW_TRANSITION_DELAY: 600
} as const;

export const STATUS_COLORS: Record<string, string> = {
    'Occupied': 'bg-green-100 text-green-700',
    'Void': 'bg-purple-100 text-purple-700',
    'In Management': 'bg-blue-100 text-blue-700',
    'Out of Management': 'bg-gray-100 text-gray-500',
    'Compliant': 'text-green-500',
    'Non-Compliant': 'text-red-500',
    'Pending': 'text-orange-500'
};
