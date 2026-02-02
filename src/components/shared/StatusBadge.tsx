import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
    className?: string;
}

const statusColors: Record<string, string> = {
    // Property statuses
    'Occupied': 'bg-green-100 text-green-700',
    'Void': 'bg-amber-100 text-amber-700',
    'In Management': 'bg-blue-100 text-blue-700',
    'Out of Management': 'bg-gray-100 text-gray-500',
    'Compliant': 'bg-green-100 text-green-700',
    'Non-Compliant': 'bg-red-100 text-red-700',
    'Pending': 'bg-orange-100 text-orange-700',
    'Supported Living': 'bg-ivolve-mid/10 text-ivolve-mid',
    'Residential': 'bg-blue-100 text-blue-700',

    // Compliance statuses (SASSHA-style)
    'OK': 'bg-green-100 text-green-700',
    'ok': 'bg-green-100 text-green-700',
    'Due': 'bg-yellow-100 text-yellow-700',
    'due': 'bg-yellow-100 text-yellow-700',
    'Due Soon': 'bg-yellow-100 text-yellow-700',
    'due-soon': 'bg-yellow-100 text-yellow-700',
    'Overdue': 'bg-red-100 text-red-700',
    'overdue': 'bg-red-100 text-red-700',
    'N/A': 'bg-gray-100 text-gray-500',
    'n/a': 'bg-gray-100 text-gray-500',
    'Suspended': 'bg-purple-100 text-purple-700',
    'suspended': 'bg-purple-100 text-purple-700',
    'Missing': 'bg-gray-200 text-gray-600',
    'missing': 'bg-gray-200 text-gray-600',

    // Case statuses
    'Open': 'bg-blue-100 text-blue-700',
    'Closed': 'bg-gray-100 text-gray-500',
    'Investigation': 'bg-orange-100 text-orange-700',
    'Monitoring': 'bg-amber-100 text-amber-700',
    'Referred': 'bg-purple-100 text-purple-700',
    'Resolved': 'bg-green-100 text-green-700',

    // Tenancy statuses
    'Current': 'bg-green-100 text-green-700',
    'Former': 'bg-gray-100 text-gray-500',

    // Support Plan / Risk Assessment statuses
    'Completed': 'bg-gray-100 text-gray-500',
    'Draft': 'bg-blue-100 text-blue-700',

    // Risk levels
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-orange-100 text-orange-700',
    'Low': 'bg-green-100 text-green-700',

    // Support levels
    'Intensive': 'bg-red-100 text-red-700',
    'Intensive Support': 'bg-red-100 text-red-700',
    'High Support': 'bg-orange-100 text-orange-700',
    'Medium Support': 'bg-amber-100 text-amber-700',
    'Low Support': 'bg-green-100 text-green-700'
};

const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm'
};

export default function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-500';

    const getIcon = () => {
        switch (status) {
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
    const isPending = status === 'Pending';

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
            <span>{status}</span>
        </span>
    );
}
