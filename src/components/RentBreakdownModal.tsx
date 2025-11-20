import React, { useState } from 'react';
import { X, HelpCircle, Info } from 'lucide-react';

interface RentItem {
  label: string;
  amount: number;
  description: string; // The "Assistance" text
}

interface RentBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  rentItems: RentItem[];
}

const RentBreakdownModal: React.FC<RentBreakdownModalProps> = ({ isOpen, onClose, propertyAddress, rentItems }) => {
  const [showAssistance, setShowAssistance] = useState(false);

  if (!isOpen) return null;

  const totalRent = rentItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-ivolve-dark">Rent Breakdown</h2>
            <p className="text-sm text-gray-500 mt-1">{propertyAddress}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAssistance(!showAssistance)}
              className={`p-2 rounded-full transition-all ${showAssistance
                ? 'bg-ivolve-mid text-white shadow-lg ring-2 ring-ivolve-mid ring-offset-2'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              title="Toggle Assistance Mode"
            >
              <HelpCircle size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {rentItems.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-700 ease-in-out ${showAssistance
                ? 'bg-ivolve-paper border-ivolve-mid/20 p-4 shadow-sm'
                : 'bg-gray-50 border-transparent p-3 flex justify-between items-center'
                }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`font-medium ${showAssistance ? 'text-ivolve-dark text-lg' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                <span className={`font-bold ${showAssistance ? 'text-ivolve-dark text-lg' : 'text-ivolve-mid'}`}>
                  £{item.amount.toFixed(2)}
                </span>
              </div>

              {/* Assistance Text (Animated) */}
              {showAssistance && (
                <div className="mt-2 text-sm text-gray-600 border-t border-ivolve-mid/10 pt-2 italic animate-in slide-in-from-top-2 fade-in duration-700">
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-500">Total Rent Per Month</span>
            <span className="text-3xl font-bold text-ivolve-dark">£{totalRent.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RentBreakdownModal;
