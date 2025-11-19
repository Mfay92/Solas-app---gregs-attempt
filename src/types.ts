export type ServiceType = 'Supported Living' | 'Residential' | 'Nursing' | 'Outreach' | 'Day Service';

export interface Address {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    w3w?: string; // what3words
}

export interface Unit {
    id: string;
    name: string; // e.g., "Master Unit", "Room 1", "Flat A"
    type: 'Master' | 'Bedroom' | 'Flat';
    isMaster: boolean; // True if this is the property controller
    status: 'Occupied' | 'Void' | 'Reserved' | 'Maintenance' | 'OutOfManagement';
    tenantName?: string;
    currentRent?: number;
    beds?: number; // For the unit itself (usually 1 for bedroom, N for Master)
}

export interface Property {
    id: string;
    name: string;
    serviceType: ServiceType;
    address: Address;
    region: string;

    // Operational
    managerName?: string;
    areaManagerName?: string;

    // Capacity
    totalUnits: number;
    units: Unit[];

    // Compliance & Legals
    landlord?: string;
    legalEntity?: string;

    // Metadata for unmapped columns
    raw_data?: Record<string, any>;
}

export interface PropertyFilter {
    region?: string[];
    serviceType?: ServiceType[];
    status?: string[]; // Void, Occupied
}
