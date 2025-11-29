import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { PropertyAsset } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { formatDate } from '../../utils';

interface PropertyHeaderProps {
    asset: PropertyAsset;
    onBack: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ asset, onBack }) => {
    return (
        <div className="mb-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md text-ivolve-slate hover:text-ivolve-dark transition-all duration-200 mb-4"
            >
                <ChevronLeft size={18} />
                <span>Back to Properties</span>
            </button>

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-ivolve-dark">{asset.address}</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={asset.serviceType} />
                    <StatusBadge status={asset.status} />
                    {asset.complianceStatus && <StatusBadge status={asset.complianceStatus} />}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span>{asset.totalUnits || 0} units</span>
                    <span className="text-gray-300">|</span>
                    <span>{asset.occupiedUnits || 0} occupied</span>
                    {asset.leaseEnd && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>Lease ends: {formatDate(asset.leaseEnd)}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyHeader;
