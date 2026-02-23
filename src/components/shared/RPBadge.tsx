/**
 * RP Badge Component
 *
 * Displays a colored badge/tag for Registered Providers
 * Uses brand colours from rpBranding.ts
 *
 * Usage:
 *   <RPBadge rpId="inclusion" />
 *   <RPBadge rpId="auckland" size="lg" />
 *   <RPBadge rpName="Encircle Housing" variant="outline" />
 */

import { getRPBranding, getRPBrandingByName } from '../../data/rpBranding';

interface RPBadgeProps {
    /** RP organization ID (e.g., 'inclusion', 'auckland') */
    rpId?: string;
    /** RP organization name (if ID not available) */
    rpName?: string;
    /** Badge size */
    size?: 'sm' | 'md' | 'lg';
    /** Badge variant */
    variant?: 'solid' | 'outline' | 'subtle';
    /** Show full name or abbreviated */
    showFullName?: boolean;
    /** Custom className */
    className?: string;
}

export default function RPBadge({
    rpId,
    rpName,
    size = 'md',
    variant = 'solid',
    showFullName = false,
    className = ''
}: RPBadgeProps) {
    // Get branding data
    const branding = rpId
        ? getRPBranding(rpId)
        : getRPBrandingByName(rpName);

    if (!branding) {
        // Fallback if no branding found
        return (
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 ${className}`}>
                {rpName || rpId || 'Unknown RP'}
            </span>
        );
    }

    // Size classes
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    };

    // Variant styles (inline styles for brand colours)
    const getVariantStyles = () => {
        switch (variant) {
            case 'solid':
                return {
                    backgroundColor: branding.primary,
                    color: branding.textOnPrimary || '#FFFFFF',
                    borderColor: branding.primary
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    color: branding.primary,
                    borderColor: branding.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                };
            case 'subtle':
                return {
                    backgroundColor: `${branding.primary}15`, // 15 = ~8% opacity
                    color: branding.primary,
                    borderColor: 'transparent'
                };
        }
    };

    // Get display name
    const displayName = showFullName
        ? branding.name
        : branding.name.split(' ')[0]; // First word only

    return (
        <span
            className={`inline-flex items-center rounded font-medium ${sizeClasses[size]} ${className}`}
            style={getVariantStyles()}
            title={branding.name}
        >
            {displayName}
        </span>
    );
}

/**
 * RP Dot Indicator
 * Small colored dot to indicate RP affiliation
 */
interface RPDotProps {
    rpId?: string;
    rpName?: string;
    size?: number;
    className?: string;
}

export function RPDot({ rpId, rpName, size = 8, className = '' }: RPDotProps) {
    const branding = rpId
        ? getRPBranding(rpId)
        : getRPBrandingByName(rpName);

    if (!branding) return null;

    return (
        <span
            className={`inline-block rounded-full ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: branding.primary
            }}
            title={branding.name}
        />
    );
}
