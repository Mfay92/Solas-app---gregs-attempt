/**
 * UK Registered Provider (RP) Branding Data
 *
 * Contains brand colours and metadata for housing associations,
 * investment management companies, and registered providers.
 * Used for dynamic theming throughout the Solas CRM.
 */

export interface RPBranding {
    /** Unique identifier (kebab-case) */
    id: string;
    /** Full organization name */
    name: string;
    /** Primary brand colour (hex) */
    primary: string;
    /** Secondary brand colour (hex) */
    secondary: string;
    /** Optional accent colour (hex) */
    accent?: string;
    /** Optional background colour for cards (hex) */
    background?: string;
    /** Text colour for use on primary background (auto-calculated if not provided) */
    textOnPrimary?: string;
    /** Text colour for use on secondary background */
    textOnSecondary?: string;
}

export const RP_BRANDING: Record<string, RPBranding> = {
    'civitas': {
        id: 'civitas',
        name: 'Civitas Investment Management',
        primary: '#CF3037',
        secondary: '#1A3E6F',
        accent: '#646464',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'ehsl': {
        id: 'ehsl',
        name: 'EHSL (Essential Housing)',
        primary: '#FFDA00',
        secondary: '#3D4999',
        textOnPrimary: '#000000',
        textOnSecondary: '#FFFFFF'
    },
    'qualitas': {
        id: 'qualitas',
        name: 'Qualitas Housing',
        primary: '#1F3863',
        secondary: '#00A6DA',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'harbour-light': {
        id: 'harbour-light',
        name: 'Harbour Light Housing',
        primary: '#002D62',
        secondary: '#FFCC00',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#000000'
    },
    'inclusion': {
        id: 'inclusion',
        name: 'Inclusion Housing',
        primary: '#00234E',
        secondary: '#F05A28',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'auckland': {
        id: 'auckland',
        name: 'Auckland Home Solutions',
        primary: '#002D62',
        secondary: '#00B1B6',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'windrush': {
        id: 'windrush',
        name: 'Windrush Housing',
        primary: '#00563F',
        secondary: '#F2BA1D',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#000000'
    },
    'portus': {
        id: 'portus',
        name: 'Portus Housing',
        primary: '#1F3863',
        secondary: '#00A6DA',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'ampulis': {
        id: 'ampulis',
        name: 'Ampulis (Amplius Living)',
        primary: '#002D62',
        secondary: '#C50084',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'encircle': {
        id: 'encircle',
        name: 'Encircle Housing',
        primary: '#CDCCC7',
        secondary: '#919082',
        accent: '#6495ED',
        textOnPrimary: '#000000',
        textOnSecondary: '#FFFFFF'
    },
    'advance': {
        id: 'advance',
        name: 'Advance Housing',
        primary: '#C8102E',
        secondary: '#00073F',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'reside-progress': {
        id: 'reside-progress',
        name: 'Reside with Progress',
        primary: '#00216B',
        secondary: '#5CE500',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#000000'
    },
    'care-housing': {
        id: 'care-housing',
        name: 'Care Housing Association',
        primary: '#005A8B',
        secondary: '#8DC63F',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#000000'
    },
    'hilldale': {
        id: 'hilldale',
        name: 'Hilldale Housing',
        primary: '#1F3863',
        secondary: '#FFFFFF',
        background: '#F5F5F5',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#1F3863'
    },
    'home-group': {
        id: 'home-group',
        name: 'Home Group',
        primary: '#C50084',
        secondary: '#00216B',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    },
    'golden-lane': {
        id: 'golden-lane',
        name: 'Golden Lane Housing',
        primary: '#284185',
        secondary: '#D9007E',
        accent: '#E97D11',
        background: '#F2AA00',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF'
    }
};

/**
 * Get RP branding by organization ID
 */
export function getRPBranding(rpId: string | undefined): RPBranding | null {
    if (!rpId) return null;
    return RP_BRANDING[rpId] || null;
}

/**
 * Get RP branding by organization name (case-insensitive search)
 */
export function getRPBrandingByName(name: string | undefined): RPBranding | null {
    if (!name) return null;

    const normalizedName = name.toLowerCase().trim();

    // Try exact match first
    const exactMatch = Object.values(RP_BRANDING).find(
        rp => rp.name.toLowerCase() === normalizedName
    );
    if (exactMatch) return exactMatch;

    // Try partial match
    const partialMatch = Object.values(RP_BRANDING).find(
        rp => rp.name.toLowerCase().includes(normalizedName) ||
             normalizedName.includes(rp.name.toLowerCase())
    );

    return partialMatch || null;
}

/**
 * Get all RPs as a sorted array
 */
export function getAllRPs(): RPBranding[] {
    return Object.values(RP_BRANDING).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calculate text colour contrast for a given background
 * Returns either black or white based on luminance
 */
export function getContrastText(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance threshold
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
