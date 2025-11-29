import { STATUS_COLORS } from '../constants';

// Re-export safe accessor utilities
export {
    getInitials,
    safeFirst,
    safeAt,
    getAddressFirstLine,
    extractUnitIdentifier,
    safeParseInt,
    safeLower,
} from './safeAccessors';

/**
 * Returns Tailwind classes for a given status
 */
export function getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-500';
}

/**
 * Safely formats a date string, returning fallback for invalid dates
 */
export function formatDate(date: string | Date | undefined, fallback = '-'): string {
    if (!date) return fallback;
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return fallback;
    return parsed.toLocaleDateString();
}

/**
 * Generates a unique ID using crypto API with fallback
 */
export function generateUniqueId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safely converts a value to lowercase string for searching
 */
export function safeString(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
}

/**
 * Combines class names using clsx pattern (simple version)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
