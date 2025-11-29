import React from 'react';
import { ChevronDown, ChevronRight, Percent } from 'lucide-react';
import { useDocumentViewer } from '../DocumentViewerContext';
import { LineItemProps } from '../types';

const sectionColors = {
  coreRent: {
    bg: 'bg-ivolve-mid/5',
    border: 'border-ivolve-mid/20',
    accent: 'text-ivolve-mid',
  },
  eligibleServiceCharges: {
    bg: 'bg-ivolve-teal/5',
    border: 'border-ivolve-teal/20',
    accent: 'text-ivolve-teal',
  },
  ineligibleServices: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'text-amber-600',
  },
};

const LineItem: React.FC<LineItemProps> = ({ item, showEasyRead = false, sectionType }) => {
  const { state, toggleItem, isEasyRead } = useDocumentViewer();

  const isExpanded = state.expandedItems.has(item.id);
  const displayEasyRead = showEasyRead || isEasyRead;
  const colors = sectionColors[sectionType] || sectionColors.coreRent;

  const description = displayEasyRead ? item.easyReadDescription : item.description;

  return (
    <div className="relative">
      {/* Main Line Item Row - More compact */}
      <div
        className={`px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
          isExpanded ? 'bg-gray-50' : ''
        }`}
        onClick={() => toggleItem(item.id)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-gray-400 transition-transform duration-200 flex-shrink-0">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 truncate text-sm">
                {item.label}
              </span>

              {item.isVoidCover && item.voidPercentage && (
                <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                  <Percent size={9} className="mr-0.5" />
                  {item.voidPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center ml-3">
          <span className={`font-bold ${colors.accent} text-sm`}>
            £{item.amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Expanded Details - More compact */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`mx-3 mb-2 p-2.5 rounded-lg ${colors.bg} border ${colors.border}`}>
          <p className={`text-gray-700 text-sm leading-relaxed`}>
            {description}
          </p>
          {item.calculation && (
            <p className="text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-gray-200">
              <span className="font-medium">Calculation:</span> {item.calculation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineItem;
