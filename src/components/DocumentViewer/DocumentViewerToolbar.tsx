import React from 'react';
import {
  Eye,
  FileText,
  Filter,
  Download,
  Home,
  Zap,
} from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { DocumentViewerToolbarProps, ViewMode } from './types';

const viewModeOptions: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'normal', label: 'Standard', icon: <Eye size={14} /> },
  { mode: 'easyRead', label: 'Simple View', icon: <FileText size={14} /> },
];

const filterOptions: { value: 'all' | 'core' | 'bills'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <Filter size={12} /> },
  { value: 'core', label: 'Rent', icon: <Home size={12} /> },
  { value: 'bills', label: 'Bills', icon: <Zap size={12} /> },
];

const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({ onExportPdf }) => {
  const { state, setViewMode, setShowFilter, isEasyRead } = useDocumentViewer();

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-medium text-xs">View:</span>
          <div className="inline-flex rounded-md bg-gray-100 p-0.5">
            {viewModeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => setViewMode(option.mode)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  state.viewMode === option.mode
                    ? 'bg-white text-ivolve-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={state.viewMode === option.mode}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-medium text-xs">Show:</span>
          <div className="inline-flex rounded-md bg-gray-100 p-0.5">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setShowFilter(option.value)}
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  state.showFilter === option.value
                    ? 'bg-white text-ivolve-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={state.showFilter === option.value}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-ivolve-mid text-white rounded-md text-xs font-medium hover:bg-ivolve-dark transition-colors"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Simple View Indicator */}
      {isEasyRead && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1.5 text-ivolve-mid">
            <FileText size={14} />
            <span className="text-xs font-medium">
              Simple View - everything is shown in easier words
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewerToolbar;
