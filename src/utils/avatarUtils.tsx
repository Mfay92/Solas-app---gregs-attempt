/**
 * Generate a consistent color from a string (name)
 * Uses a simple hash function to ensure the same name always gets the same color
 */
function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate a pleasant color from the hash
    // Using HSL for better color distribution
    const hue = Math.abs(hash % 360);
    const saturation = 65; // Medium saturation for pleasant colors
    const lightness = 55; // Medium lightness for good contrast with white text

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get initials from a person's name
 */
export function getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
}

/**
 * Generate avatar props for a person
 * Returns initials and a consistent background color
 */
export function getAvatarProps(firstName: string, lastName: string) {
    const initials = getInitials(firstName, lastName);
    const fullName = `${firstName} ${lastName}`;
    const backgroundColor = stringToColor(fullName);

    return {
        initials,
        backgroundColor,
        textColor: '#FFFFFF', // White text for good contrast
    };
}

/**
 * InitialsAvatar component
 * Displays a circular avatar with initials when no photo is available
 */
interface InitialsAvatarProps {
    firstName: string;
    lastName: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-2xl',
};

export function InitialsAvatar({
    firstName,
    lastName,
    size = 'md',
    className = ''
}: InitialsAvatarProps) {
    const { initials, backgroundColor, textColor } = getAvatarProps(firstName, lastName);

    return (
        <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ${className}`}
            style={{ backgroundColor, color: textColor }}
            title={`${firstName} ${lastName}`}
        >
            {initials}
        </div>
    );
}

/**
 * PersonAvatar component
 * Smart component that shows photo if available, otherwise shows initials
 */
interface PersonAvatarProps {
    firstName: string;
    lastName: string;
    photo?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function PersonAvatar({
    firstName,
    lastName,
    photo,
    size = 'md',
    className = ''
}: PersonAvatarProps) {
    if (photo) {
        return (
            <img
                src={photo}
                alt={`${firstName} ${lastName}`}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <InitialsAvatar
            firstName={firstName}
            lastName={lastName}
            size={size}
            className={className}
        />
    );
}
