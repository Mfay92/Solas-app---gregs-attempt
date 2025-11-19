

import React, { memo } from 'react';
import { ServiceType, TagStyle } from '../types';

type StatusChipProps = {
  status: ServiceType;
  styleType: TagStyle;
};

const statusStyles: Record<ServiceType, { color: string; border: string; bg: string }> = {
  [ServiceType.SupportedLiving]: { color: 'text-brand-mid-green', border: 'border-brand-mid-green', bg: 'bg-green-50' },
  [ServiceType.Residential]: { color: 'text-brand-purple', border: 'border-brand-purple', bg: 'bg-purple-50' },
  [ServiceType.NursingCare]: { color: 'text-teal-600', border: 'border-teal-500', bg: 'bg-teal-50' },
};

const StatusChip: React.FC<StatusChipProps> = ({ status, styleType = 'default' }) => {
  const style = statusStyles[status] || statusStyles[ServiceType.SupportedLiving];

  if (styleType === 'text') {
    return <span className={`text-xs font-medium ${style.color}`}>{status}</span>;
  }
  
  const baseClasses = 'inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md border';
  
  const typeClasses = styleType === 'outline'
    ? `${style.color} ${style.border} bg-transparent`
    : `${style.color} ${style.bg} ${style.border}`;

  return (
    <span className={`${baseClasses} ${typeClasses}`}>
      {status}
    </span>
  );
};

export default memo(StatusChip);