import React from 'react';
import { FrameworkStatus } from '../types';

const statusStyles: Record<FrameworkStatus, string> = {
  [FrameworkStatus.Live]: 'bg-green-100 text-ivolve-mid-green border-green-200',
  [FrameworkStatus.ExpiringSoon]: 'bg-yellow-100 text-ivolve-yellow border-yellow-200',
  [FrameworkStatus.Expired]: 'bg-red-100 text-status-red border-red-200',
  [FrameworkStatus.OnExtension]: 'bg-purple-100 text-ivolve-purple border-purple-200',
};

const FrameworkStatusTag: React.FC<{ status: FrameworkStatus }> = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  const baseClasses = 'inline-block px-2 py-1 text-xs font-semibold rounded-md border';

  return (
    <span className={`${baseClasses} ${style}`}>
      {status}
    </span>
  );
};

export default FrameworkStatusTag;
