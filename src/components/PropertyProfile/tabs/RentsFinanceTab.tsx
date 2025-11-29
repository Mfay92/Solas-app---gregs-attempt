import React, { useState } from 'react';
import {
    PoundSterling,
    Calendar,
    TrendingUp,
    AlertCircle,
    Clock,
    Wallet,
    Calculator,
    FileText,
    ExternalLink
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import { CollapsibleCard } from '../shared/CollapsibleCard';
import { formatDate } from '../../../utils';
import DocumentViewer from '../../DocumentViewer';
import { getRentScheduleByPropertyId } from '../../../data/sampleRentSchedule';

interface RentsFinanceTabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

const RentsFinanceTab: React.FC<RentsFinanceTabProps> = ({ asset, units: _units }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        schedule: true,
        arrears: false,
        calculator: false
    });
    const [showRentScheduleViewer, setShowRentScheduleViewer] = useState(false);

    // Get rent schedule for this property (if available)
    const rentSchedule = getRentScheduleByPropertyId(asset.id);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Determine rent data source
    const annualRent = asset.lease?.rentPA || asset.sla?.annualRate;
    const weeklyRent = asset.lease?.rentPW || asset.sla?.weeklyRate;
    const reviewDate = asset.lease?.rentReviewDate || asset.sla?.reviewDate;

    // Void Calculator State
    const [voidDays, setVoidDays] = useState<number>(7);
    const estimatedVoidCost = (weeklyRent || 0) / 7 * voidDays;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 1. RENT SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Annual Rent */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-600 mb-1">Annual Rent</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {formatCurrency(annualRent)}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg text-emerald-600">
                            <PoundSterling className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-emerald-700 font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>Projected Income</span>
                    </div>
                </div>

                {/* Weekly Rent */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Weekly Rent</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {formatCurrency(weeklyRent)}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg text-blue-600">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-blue-700 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Recurring Revenue</span>
                    </div>
                </div>

                {/* Next Review */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-600 mb-1">Next Review</p>
                            <h3 className="text-xl font-bold text-gray-900">
                                {formatDate(reviewDate)}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg text-amber-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-amber-700 font-medium">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        <span>Action Required Soon</span>
                    </div>
                </div>
            </div>

            {/* 2. RENT SCHEDULE VIEWER */}
            <CollapsibleCard
                title="Rent Schedule"
                icon={<FileText className="w-5 h-5" />}
                isExpanded={expandedSections.schedule}
                onToggle={() => toggleSection('schedule')}
            >
                {rentSchedule ? (
                    <div className="space-y-4">
                        {/* Schedule Summary */}
                        <div className="bg-gradient-to-br from-ivolve-paper to-white rounded-xl p-5 border border-ivolve-mid/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-ivolve-dark">
                                        {rentSchedule.rpName}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Financial Year {rentSchedule.financialYear} • Version {rentSchedule.version}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                    Active
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 block">Core Rent</span>
                                    <span className="text-lg font-bold text-ivolve-dark">
                                        £{rentSchedule.totals.coreRentWeekly.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-400">/week</span>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 block">Service Charges</span>
                                    <span className="text-lg font-bold text-ivolve-teal">
                                        £{rentSchedule.totals.serviceChargesWeekly.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-400">/week</span>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 block">Total Weekly</span>
                                    <span className="text-lg font-bold text-ivolve-mid">
                                        £{rentSchedule.totals.grossWeeklyRent.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-400">/week</span>
                                </div>
                            </div>
                        </div>

                        {/* View Full Schedule Button */}
                        <button
                            onClick={() => setShowRentScheduleViewer(true)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-ivolve-mid text-white rounded-xl font-medium hover:bg-ivolve-dark transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <FileText className="w-5 h-5" />
                            <span>View Full Rent Schedule</span>
                            <ExternalLink className="w-4 h-4 ml-1" />
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            Interactive viewer with Simple View mode and HB eligibility breakdown
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No Rent Schedule Available</h4>
                        <p className="text-gray-500 max-w-md text-sm">
                            A rent schedule has not been uploaded for this property yet. Contact your administrator to add one.
                        </p>
                    </div>
                )}
            </CollapsibleCard>

            {/* Rent Schedule Viewer Modal */}
            {showRentScheduleViewer && rentSchedule && (
                <DocumentViewer
                    document={rentSchedule}
                    onClose={() => setShowRentScheduleViewer(false)}
                    isModal={true}
                    defaultViewMode="normal"
                />
            )}

            {/* 3. PLACEHOLDER - ARREARS */}
            <CollapsibleCard
                title="Arrears Tracking"
                icon={<AlertCircle className="w-5 h-5" />}
                isExpanded={expandedSections.arrears}
                onToggle={() => toggleSection('arrears')}
            >
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Arrears Management Coming Soon</h4>
                    <p className="text-gray-500 max-w-md text-sm">
                        Advanced arrears monitoring and action workflows are currently under development. You'll soon be able to track outstanding balances and initiate recovery actions here.
                    </p>
                </div>
            </CollapsibleCard>

            {/* 4. VOID COST CALCULATOR */}
            <CollapsibleCard
                title="Void Cost Calculator"
                icon={<Calculator className="w-5 h-5" />}
                isExpanded={expandedSections.calculator}
                onToggle={() => toggleSection('calculator')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Void Period (Days)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="90"
                            value={voidDays}
                            onChange={(e) => setVoidDays(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>1 Day</span>
                            <span className="font-bold text-amber-600">{voidDays} Days</span>
                            <span>90 Days</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Calculate the potential revenue loss based on the current weekly rent of <strong>{formatCurrency(weeklyRent || 0)}</strong>.
                        </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-center">
                        <p className="text-sm font-medium text-amber-800 mb-1">Estimated Lost Income</p>
                        <div className="text-3xl font-bold text-amber-600">
                            {formatCurrency(estimatedVoidCost)}
                        </div>
                        <p className="text-xs text-amber-700 mt-2">
                            Based on {voidDays} days vacancy
                        </p>
                    </div>
                </div>
            </CollapsibleCard>
        </div>
    );
};

export default RentsFinanceTab;
