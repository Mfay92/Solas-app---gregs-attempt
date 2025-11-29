/**
 * Safe accessor utilities for handling potentially undefined/null values
 * These functions provide type-safe access patterns for common operations
 */

/**
 * Safely get initials from a name string
 * @param name - The full name string
 * @param fallback - Fallback value if name is empty/invalid (default: '?')
 * @returns Uppercase initials or fallback
 */
export function getInitials(name: string | undefined | null, fallback = '?'): string {
    if (!name || typeof name !== 'string') return fallback;
    const initials = name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0]?.toUpperCase() || '')
        .join('');
    return initials || fallback;
}

/**
 * Safely access first element of an array
 * @param arr - The array to access
 * @returns First element or undefined if array is empty/null
 */
export function safeFirst<T>(arr: T[] | undefined | null): T | undefined {
    return arr && arr.length > 0 ? arr[0] : undefined;
}

/**
 * Safely access array element at index with bounds checking
 * @param arr - The array to access
 * @param index - The index to access
 * @returns Element at index or undefined if out of bounds
 */
export function safeAt<T>(arr: T[] | undefined | null, index: number): T | undefined {
    if (!arr || index < 0 || index >= arr.length) return undefined;
    return arr[index];
}

/**
 * Safely split address and get first part (before comma)
 * @param address - The full address string
 * @returns First line of address or empty string
 */
export function getAddressFirstLine(address: string | undefined | null): string {
    if (!address) return '';
    return address.split(',')[0]?.trim() || address;
}

/**
 * Safely extract unit identifier from address string
 * Handles patterns like "Room 1", "Flat A", "Unit 2", "Bedroom 3"
 * @param address - The address string to parse
 * @returns Matched unit identifier or null
 */
export function extractUnitIdentifier(address: string | undefined | null): string | null {
    if (!address) return null;

    const patterns = [
        /Room\s*(\d+)/i,
        /Flat\s*([A-Z0-9]+)/i,
        /Unit\s*(\d+)/i,
        /Bed(?:room)?\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
        const match = address.match(pattern);
        if (match?.[0]) return match[0];
    }
    return null;
}

/**
 * Safely parse an integer from string input (e.g., from form fields)
 * @param value - The string value to parse
 * @param fallback - Value to return if parsing fails
 * @returns Parsed integer or fallback
 */
export function safeParseInt(value: string | undefined | null, fallback: number = 0): number {
    if (!value) return fallback;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely convert value to lowercase for case-insensitive comparison
 * @param value - The value to convert
 * @returns Lowercase string or empty string if null/undefined
 */
export function safeLower(value: string | undefined | null): string {
    return (value ?? '').toLowerCase();
}
