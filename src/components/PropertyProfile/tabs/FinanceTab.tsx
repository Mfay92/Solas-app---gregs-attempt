import React, { useState } from 'react';
import {
    PoundSterling,
    Calendar,
    TrendingUp,
    AlertCircle,
    Clock,
    History,
    Wallet,
    CreditCard,
    Calculator
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import { CollapsibleCard } from '../shared/CollapsibleCard';
import { formatDate } from '../../../utils';

interface FinanceTabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

const FinanceTab: React.FC<FinanceTabProps> = ({ asset, units }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        breakdown: true,
        schedule: false,
        arrears: false,
        calculator: false
    });

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

            {/* 2. RENT BREAKDOWN */}
            <CollapsibleCard
                title="Rent Breakdown"
                icon={<CreditCard className="w-5 h-5" />}
                isExpanded={expandedSections.breakdown}
                onToggle={() => toggleSection('breakdown')}
            >
                {units.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Unit</th>
                                    <th className="px-4 py-3 font-medium">Tenant</th>
                                    <th className="px-4 py-3 font-medium text-right">Weekly</th>
                                    <th className="px-4 py-3 font-medium text-right">Monthly</th>
                                    <th className="px-4 py-3 font-medium text-right">Annual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {units.map((unit) => {
                                    // Try to get rent from unit lease or SLA, fallback to 0
                                    const unitWeekly = unit.lease?.rentPW || unit.sla?.weeklyRate || 0;
                                    const unitMonthly = (unitWeekly * 52) / 12;
                                    const unitAnnual = unitWeekly * 52;

                                    return (
                                        <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {unit.address.split(',')[0]}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {unit.tenants && unit.tenants.length > 0
                                                    ? unit.tenants[0].name
                                                    : <span className="text-gray-400 italic">Vacant</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                {formatCurrency(unitWeekly)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">
                                                {formatCurrency(unitMonthly)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">
                                                {formatCurrency(unitAnnual)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Total Row */}
                                <tr className="bg-gray-50 font-semibold border-t-2 border-gray-100">
                                    <td className="px-4 py-3 text-gray-900" colSpan={2}>Total</td>
                                    <td className="px-4 py-3 text-right text-emerald-600">
                                        {formatCurrency(units.reduce((acc, u) => acc + (u.lease?.rentPW || u.sla?.weeklyRate || 0), 0))}
                                    </td>
                                    <td className="px-4 py-3 text-right text-emerald-600">
                                        {formatCurrency(units.reduce((acc, u) => acc + ((u.lease?.rentPW || u.sla?.weeklyRate || 0) * 52 / 12), 0))}
                                    </td>
                                    <td className="px-4 py-3 text-right text-emerald-600">
                                        {formatCurrency(units.reduce((acc, u) => acc + ((u.lease?.rentPW || u.sla?.weeklyRate || 0) * 52), 0))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        No unit breakdown available for this property.
                    </div>
                )}
            </CollapsibleCard>

            {/* 3. PLACEHOLDER - RENT SCHEDULE */}
            <CollapsibleCard
                title="Payment Schedule"
                icon={<History className="w-5 h-5" />}
                isExpanded={expandedSections.schedule}
                onToggle={() => toggleSection('schedule')}
            >
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Payment Schedule Coming Soon</h4>
                    <p className="text-gray-500 max-w-md text-sm">
                        We're integrating with our finance systems to bring you real-time payment history, upcoming due dates, and reconciliation status directly in this view.
                    </p>
                </div>
            </CollapsibleCard>

            {/* 4. PLACEHOLDER - ARREARS */}
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

            {/* 5. VOID COST CALCULATOR */}
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

export default FinanceTab;
