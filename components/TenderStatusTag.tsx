import React from 'react';
import { TenderStatus } from '../types';

const statusStyles: Record<TenderStatus, string> = {
  [TenderStatus.Potential]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TenderStatus.InProgress]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TenderStatus.Submitted]: 'bg-purple-100 text-purple-800 border-purple-200',
  [TenderStatus.Won]: 'bg-green-100 text-green-800 border-green-200',
  [TenderStatus.Lost]: 'bg-red-100 text-red-800 border-red-200',
};

const TenderStatusTag: React.FC<{ status: TenderStatus }> = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  const baseClasses = 'inline-block px-2 py-1 text-xs font-semibold rounded-md border';

  return (
    <span className={`${baseClasses} ${style}`}>
      {status}
    </span>
  );
};

export default TenderStatusTag;
