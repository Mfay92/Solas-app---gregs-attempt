import React from 'react';
import { Search, FileQuestion, Building2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

type EmptyStateVariant = 'no-results' | 'no-data' | 'error' | 'custom';

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const defaultContent: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
    'no-results': {
        icon: <Search className="w-12 h-12 text-slate-300" />,
        title: 'No results found',
        description: 'Try adjusting your search or filters to find what you\'re looking for.',
    },
    'no-data': {
        icon: <Building2 className="w-12 h-12 text-slate-300" />,
        title: 'Nothing here yet',
        description: 'Get started by adding your first item.',
    },
    'error': {
        icon: <AlertCircle className="w-12 h-12 text-ivolve-rouge/60" />,
        title: 'Something went wrong',
        description: 'We couldn\'t load this content. Please try again.',
    },
    'custom': {
        icon: <FileQuestion className="w-12 h-12 text-slate-300" />,
        title: 'No content',
        description: 'There\'s nothing to display here.',
    },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    variant = 'custom',
    title,
    description,
    icon,
    action,
    className = '',
}) => {
    const defaults = defaultContent[variant];

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                {icon || defaults.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
                {title || defaults.title}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-4">
                {description || defaults.description}
            </p>
            {action && (
                <Button variant="secondary" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
};

// Inline empty state for tables
export const TableEmptyState: React.FC<{
    colSpan: number;
    message?: string;
    onClearFilters?: () => void;
}> = ({
    colSpan,
    message = 'No properties match your filters',
    onClearFilters
}) => (
    <tr>
        <td colSpan={colSpan} className="py-12">
            <EmptyState
                variant="no-results"
                title={message}
                description="Try adjusting your search or clearing filters."
                action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : undefined}
            />
        </td>
    </tr>
);

export default EmptyState;
