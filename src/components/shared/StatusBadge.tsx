import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
    className?: string;
}

const statusColors: Record<string, string> = {
    'Occupied': 'bg-green-100 text-green-700',
    'Void': 'bg-amber-100 text-amber-700',
    'In Management': 'bg-blue-100 text-blue-700',
    'Out of Management': 'bg-gray-100 text-gray-500',
    'Compliant': 'bg-green-100 text-green-700',
    'Non-Compliant': 'bg-red-100 text-red-700',
    'Pending': 'bg-orange-100 text-orange-700',
    'Supported Living': 'bg-ivolve-mid/10 text-ivolve-mid',
    'Residential': 'bg-ivolve-blue/10 text-ivolve-blue',
    'Nursing Home': 'bg-ivolve-blue/10 text-ivolve-blue'
};

const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm'
};

export default function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
    // Handle undefined/null status gracefully
    const displayStatus = status || 'Unknown';
    const colorClass = statusColors[displayStatus] || 'bg-gray-100 text-gray-500';

    const getIcon = () => {
        switch (displayStatus) {
            case 'Occupied':
            case 'Compliant':
                return <CheckCircle size={12} />;
            case 'Void':
            case 'Non-Compliant':
                return <AlertCircle size={12} />;
            case 'Pending':
                return <Clock size={12} />;
            default:
                return null;
        }
    };

    const icon = getIcon();
    const isPending = displayStatus === 'Pending';

    return (
        <span className={`
            inline-flex items-center gap-1
            font-bold rounded-full shadow-sm
            ${colorClass}
            ${sizeClasses[size]}
            ${isPending ? 'animate-pulse' : ''}
            ${className}
        `.trim().replace(/\s+/g, ' ')}>
            {icon}
            <span>{displayStatus}</span>
        </span>
    );
}
