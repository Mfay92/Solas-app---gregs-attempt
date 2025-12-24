import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'heading' | 'avatar' | 'card' | 'custom';
    width?: string | number;
    height?: string | number;
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'custom',
    width,
    height,
    rounded = 'md',
}) => {
    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    const variantClasses = {
        text: 'skeleton-text',
        heading: 'skeleton-heading',
        avatar: 'skeleton-avatar',
        card: 'skeleton-card',
        custom: 'skeleton',
    };

    return (
        <div
            className={clsx(variantClasses[variant], roundedClasses[rounded], className)}
            style={{
                width: width,
                height: height,
            }}
        />
    );
};

// Pre-built skeleton layouts for common patterns
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
    <tr className="border-b border-slate-100">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="p-4">
                <Skeleton variant="text" width={i === 0 ? '70%' : '50%'} />
            </td>
        ))}
    </tr>
);

export const CardSkeleton: React.FC = () => (
    <div className="card p-4 space-y-3">
        <Skeleton variant="heading" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
    </div>
);

export const PropertyCardSkeleton: React.FC = () => (
    <div className="card p-4 space-y-4">
        <div className="flex items-start gap-3">
            <Skeleton width={48} height={48} rounded="lg" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="heading" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton width={60} height={24} rounded="full" />
            <Skeleton width={80} height={24} rounded="full" />
        </div>
    </div>
);

export const StatsSkeleton: React.FC = () => (
    <div className="stats-card">
        <Skeleton variant="text" width="40%" className="mb-2" />
        <Skeleton width={80} height={32} className="mb-1" />
        <Skeleton variant="text" width="60%" />
    </div>
);

export default Skeleton;
