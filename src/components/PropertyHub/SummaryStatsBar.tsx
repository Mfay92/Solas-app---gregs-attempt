import React from 'react';
import { PoundSterling, AlertTriangle, CheckCircle, Home, TrendingUp } from 'lucide-react';
import { PropertyAsset } from '../../types';

interface SummaryStatsBarProps {
    properties: PropertyAsset[];
    filteredCount: number;
    totalCount: number;
    selectedCount: number;
}

const SummaryStatsBar: React.FC<SummaryStatsBarProps> = ({
    properties,
    filteredCount,
    totalCount,
    selectedCount,
}) => {
    // Calculate stats from master properties only
    const masterProperties = properties.filter(p => p.type === 'Master');

    const totalUnits = masterProperties.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
    const occupiedUnits = masterProperties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);
    const voidUnits = totalUnits - occupiedUnits;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const totalAnnualRent = masterProperties.reduce((sum, p) => {
        const rent = p.lease?.rentPA || p.sla?.annualRate || 0;
        return sum + rent;
    }, 0);

    const compliantCount = masterProperties.filter(p => p.complianceStatus === 'Compliant').length;
    const nonCompliantCount = masterProperties.filter(p => p.complianceStatus === 'Non-Compliant' || p.complianceStatus === 'Expired').length;
    const pendingCount = masterProperties.filter(p => p.complianceStatus === 'Pending').length;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `£${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `£${(amount / 1000).toFixed(0)}K`;
        }
        return `£${amount}`;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left: Results Count */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">
                            {filteredCount === totalCount ? (
                                <>Showing <span className="text-ivolve-mid font-bold">{totalCount}</span> properties</>
                            ) : (
                                <>Showing <span className="text-ivolve-mid font-bold">{filteredCount}</span> of {totalCount} properties</>
                            )}
                        </span>
                        {selectedCount > 0 && (
                            <span className="bg-ivolve-mid/10 text-ivolve-mid px-2 py-0.5 rounded-full text-xs font-medium">
                                {selectedCount} selected
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Stats */}
                <div className="flex flex-wrap items-center gap-6">
                    {/* Total Units */}
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Home size={14} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Units</span>
                            <span className="text-sm font-bold text-gray-900">{totalUnits}</span>
                        </div>
                    </div>

                    {/* Occupancy */}
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                            <TrendingUp size={14} className="text-green-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Occupancy</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-gray-900">{occupancyRate}%</span>
                                {voidUnits > 0 && (
                                    <span className="text-xs text-amber-600">({voidUnits} void)</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total Rent */}
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <PoundSterling size={14} className="text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Annual Rent</span>
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(totalAnnualRent)}</span>
                        </div>
                    </div>

                    {/* Compliance Summary */}
                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                        {/* Compliant */}
                        <div className="flex items-center gap-1.5" title="Compliant">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-green-700">{compliantCount}</span>
                        </div>

                        {/* Pending */}
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1.5" title="Pending">
                                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                    <span className="text-[10px] text-white font-bold">!</span>
                                </div>
                                <span className="text-sm font-medium text-orange-700">{pendingCount}</span>
                            </div>
                        )}

                        {/* Non-Compliant */}
                        {nonCompliantCount > 0 && (
                            <div className="flex items-center gap-1.5" title="Non-Compliant">
                                <AlertTriangle size={16} className="text-red-500" />
                                <span className="text-sm font-medium text-red-700">{nonCompliantCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryStatsBar;
