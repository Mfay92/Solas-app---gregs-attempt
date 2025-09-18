import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="p-8 animate-pulse">
      {/* Skeleton Header */}
      <div className="h-20 bg-gray-200 rounded-lg mb-8 flex items-center p-4">
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
      </div>
      {/* Skeleton Content */}
      <div className="space-y-6">
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
