import React from 'react';
import { Check, AlertTriangle, XCircle, Wrench, Minus, HelpCircle } from 'lucide-react';
import { ComplianceStatus, STATUS_STYLES, getDaysUntilExpiry } from '../../types/compliance';
import clsx from 'clsx';

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus | string;  // Accept string for flexibility with JSON data
  expiryDate?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDays?: boolean;
  className?: string;
}

const statusIcons: Record<ComplianceStatus, React.ReactNode> = {
  'compliant': <Check size={14} strokeWidth={2.5} />,
  'due-soon': <AlertTriangle size={14} strokeWidth={2.5} />,
  'overdue': <XCircle size={14} strokeWidth={2.5} />,
  'remedials-required': <Wrench size={14} strokeWidth={2.5} />,
  'not-applicable': <Minus size={14} strokeWidth={2.5} />,
  'no-data': <HelpCircle size={14} strokeWidth={2.5} />,
};

// Validate and normalize status to ensure it's a valid ComplianceStatus
const normalizeStatus = (status: ComplianceStatus | string): ComplianceStatus => {
  const validStatuses: ComplianceStatus[] = ['compliant', 'due-soon', 'overdue', 'remedials-required', 'not-applicable', 'no-data'];
  return validStatuses.includes(status as ComplianceStatus) ? (status as ComplianceStatus) : 'no-data';
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

export const ComplianceStatusBadge: React.FC<ComplianceStatusBadgeProps> = ({
  status,
  expiryDate,
  size = 'md',
  showLabel = true,
  showDays = false,
  className,
}) => {
  const normalizedStatus = normalizeStatus(status);
  const style = STATUS_STYLES[normalizedStatus];
  const daysUntil = expiryDate ? getDaysUntilExpiry(expiryDate) : null;

  // Format days text
  let daysText = '';
  if (showDays && daysUntil !== null) {
    if (daysUntil < 0) {
      daysText = `${Math.abs(daysUntil)}d overdue`;
    } else if (daysUntil === 0) {
      daysText = 'Today';
    } else if (daysUntil === 1) {
      daysText = 'Tomorrow';
    } else if (daysUntil <= 30) {
      daysText = `${daysUntil}d`;
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        style.bg,
        style.text,
        style.border,
        sizeClasses[size],
        className
      )}
    >
      {statusIcons[normalizedStatus]}
      {showLabel && <span>{style.label}</span>}
      {showDays && daysText && (
        <span className="text-xs opacity-75">({daysText})</span>
      )}
    </span>
  );
};

// Compact icon-only badge for tables
export const ComplianceStatusIcon: React.FC<{
  status: ComplianceStatus | string;
  className?: string;
}> = ({ status, className }) => {
  const normalizedStatus = normalizeStatus(status);
  const style = STATUS_STYLES[normalizedStatus];

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center w-6 h-6 rounded-full',
        style.bg,
        style.text,
        className
      )}
      title={style.label}
    >
      {statusIcons[normalizedStatus]}
    </span>
  );
};

export default ComplianceStatusBadge;
