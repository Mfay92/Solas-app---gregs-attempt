import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../../../types/tabs';
import { PoundSterling, TrendingDown, TrendingUp, CreditCard, FileText } from 'lucide-react';

interface FinanceTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

export default function FinanceTab({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }: FinanceTabProps) {
    const { finance } = person;

    // Calculate totals
    const totalCharges = (finance.rentAmount || 0) + (finance.serviceCharge || 0) + (finance.supportCharge || 0);
    const currentBalance = finance.currentBalance || 0;
    const isInArrears = currentBalance < 0;
    const hasCredit = currentBalance > 0;

    // Mock transaction data
    const mockTransactions = [
        { id: '1', date: '2026-01-25', description: 'Rent Payment', debit: 0, credit: 450, balance: -50 },
        { id: '2', date: '2026-01-18', description: 'Service Charge', debit: 50, credit: 0, balance: -500 },
        { id: '3', date: '2026-01-15', description: 'Rent Charge', debit: 450, credit: 0, balance: -450 },
        { id: '4', date: '2025-12-28', description: 'Housing Benefit Payment', debit: 0, credit: 400, balance: 0 },
        { id: '5', date: '2025-12-15', description: 'Rent Charge', debit: 450, credit: 0, balance: -400 },
    ];

    return (
        <div className="space-y-6">
            {/* Account Summary Card */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} overflow-hidden`}>
                <div className="bg-gradient-to-r from-ivolve-teal to-ivolve-mid px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <PoundSterling size={24} />
                        Account Summary
                    </h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Balance - Large Display */}
                        <div className="md:col-span-2">
                            <div className={`p-6 rounded-xl ${
                                isInArrears
                                    ? 'bg-red-50 border-2 border-red-200'
                                    : hasCredit
                                    ? 'bg-green-50 border-2 border-green-200'
                                    : 'bg-gray-50 border-2 border-gray-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Current Balance</p>
                                        <p className={`text-4xl font-bold ${
                                            isInArrears
                                                ? 'text-red-600'
                                                : hasCredit
                                                ? 'text-green-600'
                                                : 'text-gray-800'
                                        }`}>
                                            {currentBalance < 0 ? '-' : ''}£{Math.abs(currentBalance).toFixed(2)}
                                        </p>
                                        <p className={`text-sm mt-1 font-medium ${
                                            isInArrears
                                                ? 'text-red-600'
                                                : hasCredit
                                                ? 'text-green-600'
                                                : 'text-gray-600'
                                        }`}>
                                            {isInArrears ? 'In Arrears' : hasCredit ? 'In Credit' : 'No Balance'}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-full ${
                                        isInArrears
                                            ? 'bg-red-100'
                                            : hasCredit
                                            ? 'bg-green-100'
                                            : 'bg-gray-100'
                                    }`}>
                                        {isInArrears ? (
                                            <TrendingDown className="text-red-600" size={32} />
                                        ) : hasCredit ? (
                                            <TrendingUp className="text-green-600" size={32} />
                                        ) : (
                                            <PoundSterling className="text-gray-600" size={32} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rent Amount */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Weekly Rent</p>
                            <p className="text-2xl font-bold text-gray-800">
                                £{(finance.rentAmount || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                £{((finance.rentAmount || 0) * 52 / 12).toFixed(2)} per month
                            </p>
                        </div>

                        {/* Service Charge */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Service Charge</p>
                            <p className="text-2xl font-bold text-gray-800">
                                £{(finance.serviceCharge || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Per week</p>
                        </div>

                        {/* Support Charge */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Support Charge</p>
                            <p className="text-2xl font-bold text-gray-800">
                                £{(finance.supportCharge || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Per week</p>
                        </div>

                        {/* Total Charges */}
                        <div className="bg-ivolve-teal/10 p-4 rounded-lg border-2 border-ivolve-teal">
                            <p className="text-sm text-ivolve-dark mb-1 font-medium">Total Weekly Charges</p>
                            <p className="text-2xl font-bold text-ivolve-dark">
                                £{totalCharges.toFixed(2)}
                            </p>
                            <p className="text-xs text-ivolve-mid mt-1">
                                £{(totalCharges * 52 / 12).toFixed(2)} per month
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Housing Benefit Section */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} overflow-hidden`}>
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard size={20} className="text-ivolve-mid" />
                        Housing Benefit
                    </h3>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                finance.housingBenefit
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {finance.housingBenefit ? 'Receiving HB' : 'Not Receiving HB'}
                            </span>
                        </div>

                        {finance.housingBenefit && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">HB Amount</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        £{(finance.housingBenefitAmount || 0).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Per week</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {finance.paymentMethod || 'Not specified'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} overflow-hidden`}>
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-ivolve-mid" />
                        Recent Transactions
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Debit
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Credit
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Balance
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(transaction.date).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                                        {transaction.debit > 0 ? `£${transaction.debit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                                        {transaction.credit > 0 ? `£${transaction.credit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                                        transaction.balance < 0
                                            ? 'text-red-600'
                                            : transaction.balance > 0
                                            ? 'text-green-600'
                                            : 'text-gray-800'
                                    }`}>
                                        {transaction.balance < 0 ? '-' : ''}£{Math.abs(transaction.balance).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Arrears Management Section (only if in arrears) */}
            {isInArrears && (
                <div className="bg-red-50 rounded-xl shadow-sm border-2 border-red-200 overflow-hidden">
                    <div className="bg-red-100 px-6 py-4 border-b border-red-200">
                        <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                            <TrendingDown size={20} />
                            Arrears Management
                        </h3>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-red-700 font-medium mb-1">Total Arrears</p>
                                    <p className="text-3xl font-bold text-red-700">
                                        £{Math.abs(currentBalance).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-red-200 px-4 py-2 rounded-lg">
                                    <p className="text-xs text-red-700 font-medium">Action Required</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Arrears Action Plan</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                No action plan currently in place. Contact the resident to discuss payment options.
                            </p>
                            <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors text-sm font-medium">
                                Create Action Plan
                            </button>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Payment Arrangement</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                No payment arrangement currently in place.
                            </p>
                            <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors text-sm font-medium">
                                Set Up Payment Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
