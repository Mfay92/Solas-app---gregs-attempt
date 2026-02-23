import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Check } from 'lucide-react';

type RentCategory = 'core' | 'service' | 'other';
type Frequency = 'weekly' | 'monthly' | 'annual';

interface RentItem {
  id: string;
  label: string;
  weeklyAmount: number; // Store as weekly, calculate others
  description: string;
  category: RentCategory;
  isHBEligible: boolean;
}

interface RentBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  unitNumber?: string;
  rentItems: RentItem[];
}

// Helper to convert weekly amount to other frequencies
const convertAmount = (weeklyAmount: number, frequency: Frequency): number => {
  switch (frequency) {
    case 'weekly': return weeklyAmount;
    case 'monthly': return weeklyAmount * 52 / 12;
    case 'annual': return weeklyAmount * 52;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const categoryLabels: Record<RentCategory, string> = {
  core: 'Core Rent',
  service: 'Service Charges',
  other: 'Other Charges',
};

const categoryOrder: RentCategory[] = ['core', 'service', 'other'];

const RentBreakdownModal: React.FC<RentBreakdownModalProps> = ({
  isOpen,
  onClose,
  propertyAddress,
  unitNumber,
  rentItems
}) => {
  const [showAssistance, setShowAssistance] = useState(false);
  const [showHBEligibility, setShowHBEligibility] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('weekly');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group items by category
  const groupedItems = categoryOrder.reduce((acc, category) => {
    const items = rentItems.filter(item => item.category === category);
    if (items.length > 0) {
      acc[category] = items;
    }
    return acc;
  }, {} as Record<RentCategory, RentItem[]>);

  // Calculate totals
  const totalWeekly = rentItems.reduce((sum, item) => sum + item.weeklyAmount, 0);
  const totalAmount = convertAmount(totalWeekly, frequency);

  // HB eligible total
  const hbEligibleWeekly = rentItems
    .filter(item => item.isHBEligible)
    .reduce((sum, item) => sum + item.weeklyAmount, 0);
  const hbEligibleAmount = convertAmount(hbEligibleWeekly, frequency);

  const frequencyLabel = frequency === 'weekly' ? 'Per Week' : frequency === 'monthly' ? 'Per Month' : 'Per Year';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rent-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 id="rent-modal-title" className="text-2xl font-bold text-ivolve-dark font-rounded">Rent Breakdown</h2>
              <p className="text-gray-600 mt-1 font-medium">
                {propertyAddress}
                {unitNumber && <span className="text-ivolve-mid ml-2">• Unit {unitNumber}</span>}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Frequency Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['weekly', 'monthly', 'annual'] as Frequency[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    frequency === freq
                      ? 'bg-white text-ivolve-dark shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center gap-2">
              {/* HB Eligibility Toggle */}
              <button
                onClick={() => setShowHBEligibility(!showHBEligibility)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  showHBEligibility
                    ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title="Show Housing Benefit / Universal Credit eligibility"
              >
                <Check size={16} />
                <span>HB Eligible</span>
              </button>

              {/* Assistance Toggle */}
              <button
                onClick={() => setShowAssistance(!showAssistance)}
                className={`p-2 rounded-lg transition-all ${
                  showAssistance
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title="Toggle explanations"
              >
                <HelpCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[55vh] overflow-y-auto">
          {/* HB Eligibility Legend (when toggle is on) */}
          {showHBEligibility && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-emerald-700">Eligible</span>
                    <p className="text-gray-500 text-xs mt-0.5">Housing Benefit or Universal Credit may cover this</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mt-1 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-600">Ineligible</span>
                    <p className="text-gray-500 text-xs mt-0.5">You'll need to pay this directly to your landlord</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grouped Items */}
          {categoryOrder.map((category) => {
            const items = groupedItems[category];
            if (!items) return null;

            const categoryTotal = items.reduce((sum, item) => sum + item.weeklyAmount, 0);

            return (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    {categoryLabels[category]}
                  </h3>
                  <span className="text-sm font-medium text-gray-400">
                    {formatCurrency(convertAmount(categoryTotal, frequency))}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const isEligible = item.isHBEligible;
                    const showHighlight = showHBEligibility && isEligible;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-all duration-300 ${
                          showHighlight
                            ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                            : 'bg-gray-50 border-gray-100'
                        } ${showAssistance ? 'p-4' : 'p-3'}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2">
                            {showHBEligibility && (
                              <div
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                                  isEligible ? 'bg-emerald-400' : 'bg-gray-300'
                                }`}
                              />
                            )}
                            <span className={`font-medium ${
                              showHighlight ? 'text-emerald-800' : 'text-gray-700'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          <span className={`font-bold ${
                            showHighlight ? 'text-emerald-700' : 'text-ivolve-mid'
                          }`}>
                            {formatCurrency(convertAmount(item.weeklyAmount, frequency))}
                          </span>
                        </div>

                        {/* Assistance Text */}
                        {showAssistance && (
                          <div className={`mt-2 text-sm border-t pt-2 italic animate-in slide-in-from-top-2 fade-in duration-500 ${
                            showHighlight
                              ? 'border-emerald-200 text-emerald-700'
                              : 'border-gray-200 text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          {/* HB Eligible Summary (when toggle is on) */}
          {showHBEligibility && (
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-sm font-medium text-emerald-700">HB/UC Eligible Amount</span>
              </div>
              <span className="text-xl font-bold text-emerald-600">
                {formatCurrency(hbEligibleAmount)}
                <span className="text-sm font-normal text-emerald-500 ml-1">{frequencyLabel.toLowerCase()}</span>
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-500 font-rounded">Total Rent {frequencyLabel}</span>
            <span className="text-4xl font-black text-ivolve-dark font-rounded">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RentBreakdownModal;
