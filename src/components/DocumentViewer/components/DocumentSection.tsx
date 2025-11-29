import React from 'react';
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocumentViewer } from '../DocumentViewerContext';
import { DocumentSectionProps } from '../types';
import LineItem from './LineItem';

const sectionIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  coreRent: {
    icon: <CheckCircle size={14} />,
    color: 'text-ivolve-mid',
  },
  eligibleServiceCharges: {
    icon: <CheckCircle size={14} />,
    color: 'text-ivolve-teal',
  },
  ineligibleServices: {
    icon: <AlertCircle size={14} />,
    color: 'text-amber-500',
  },
};

const DocumentSection: React.FC<DocumentSectionProps> = ({ section, showEasyRead = false }) => {
  const { state, toggleSection, isEasyRead } = useDocumentViewer();
  const isExpanded = state.expandedSections.has(section.id);
  const displayEasyRead = showEasyRead || isEasyRead;

  const sectionStyle = sectionIcons[section.type] || sectionIcons.coreRent;

  const title = displayEasyRead && section.easyReadTitle ? section.easyReadTitle : section.title;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Section Header - Compact */}
      <button
        onClick={() => toggleSection(section.id)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-200"
        aria-expanded={isExpanded}
        aria-controls={`section-content-${section.id}`}
      >
        <div className="flex items-center space-x-2">
          <span className={sectionStyle.color}>{sectionStyle.icon}</span>
          <h3 className="font-bold text-ivolve-dark text-sm">
            {title}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="font-bold text-ivolve-dark text-base">
              £{section.subtotal.toFixed(2)}
            </span>
            <span className="text-gray-400 text-xs ml-1">/week</span>
          </div>
          <span className="text-gray-400">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>
      </button>

      {/* Section Content */}
      <div
        id={`section-content-${section.id}`}
        className={`transition-all duration-400 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100">
          {section.items.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <LineItem
                  key={item.id}
                  item={item}
                  showEasyRead={displayEasyRead}
                  sectionType={section.type}
                />
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-400 text-sm italic">
              No items in this section
            </div>
          )}

          {/* Section Subtotal Footer - Compact */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="font-medium text-gray-500 text-xs">
              Subtotal
            </span>
            <span className="font-bold text-ivolve-dark text-sm">
              £{section.subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSection;
