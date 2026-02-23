import { AlertTriangle } from 'lucide-react';

interface WarningIconProps {
    onClick: () => void;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function WarningIcon({ onClick, size = 'medium', className = '' }: WarningIconProps) {
    const sizeClasses = {
        small: 'w-6 h-6 p-1',
        medium: 'w-8 h-8 p-1.5',
        large: 'w-10 h-10 p-2'
    };

    const iconSizes = {
        small: 16,
        medium: 20,
        large: 24
    };

    return (
        <button
            onClick={onClick}
            className={`
                ${sizeClasses[size]}
                bg-orange-500 rounded-full
                flex items-center justify-center
                cursor-pointer
                hover:bg-orange-600
                transition-all
                animate-warning-pulse
                shadow-warning
                ${className}
            `}
            title="Click to view warning"
            type="button"
        >
            <AlertTriangle size={iconSizes[size]} className="text-white animate-warning-shake" />
        </button>
    );
}
