import React from 'react';
import { useDocumentViewer } from '../DocumentViewerContext';
import { SummaryCardProps } from '../types';

const variantStyles = {
  default: {
    bg: 'bg-white',
    border: 'border-gray-200',
    label: 'text-gray-600',
    amount: 'text-ivolve-dark',
  },
  highlight: {
    bg: 'bg-gradient-to-br from-ivolve-mid/10 to-ivolve-teal/10',
    border: 'border-ivolve-mid/30',
    label: 'text-ivolve-dark',
    amount: 'text-ivolve-mid',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'text-amber-700',
    amount: 'text-amber-600',
  },
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  amount,
  sublabel,
  variant = 'default',
  easyReadLabel,
}) => {
  const { isEasyRead } = useDocumentViewer();
  const styles = variantStyles[variant];
  const displayLabel = isEasyRead && easyReadLabel ? easyReadLabel : label;

  return (
    <div
      className={`rounded-xl p-3 border ${styles.bg} ${styles.border} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex flex-col">
        <span className={`font-medium ${styles.label} text-sm`}>
          {displayLabel}
        </span>
        {sublabel && (
          <span className="text-gray-400 text-xs">
            {sublabel}
          </span>
        )}
        <span className={`font-black ${styles.amount} mt-1 text-xl`}>
          £{amount.toFixed(2)}
        </span>
        <span className="text-gray-400 text-xs">
          per week
        </span>
      </div>
    </div>
  );
};

// Larger variant for the main total - More compact, no monthly conversion
export const GrandTotalCard: React.FC<{
  grossWeeklyRent: number;
  eligibleForHB: number;
  ineligibleForHB: number;
}> = ({ grossWeeklyRent, eligibleForHB, ineligibleForHB }) => {
  const { isEasyRead } = useDocumentViewer();

  return (
    <div className="bg-gradient-to-br from-ivolve-dark to-ivolve-mid rounded-xl p-4 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Main Total */}
        <div className="text-center md:text-left">
          <span className="font-medium text-white/80 text-sm">
            {isEasyRead ? 'Total Rent Each Week' : 'Gross Weekly Rent'}
          </span>
          <div className="font-black text-white text-3xl">
            £{grossWeeklyRent.toFixed(2)}
            <span className="text-lg font-medium text-white/60 ml-1">/week</span>
          </div>
        </div>

        {/* Breakdown - Inline */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <span className="font-medium text-white/70 text-xs block">
              {isEasyRead ? 'HB Covers' : 'HB Eligible'}
            </span>
            <span className="font-bold text-emerald-300 text-lg">
              £{eligibleForHB.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="font-medium text-white/70 text-xs block">
              {isEasyRead ? 'You Pay' : 'Ineligible'}
            </span>
            <span className="font-bold text-amber-300 text-lg">
              £{ineligibleForHB.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
