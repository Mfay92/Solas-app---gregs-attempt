import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DocumentViewerProvider } from './DocumentViewerContext';
import DocumentViewerToolbar from './DocumentViewerToolbar';
import { ThreeColumnLayout, TwoColumnLayout, LayoutType } from './layouts';
import { RentScheduleDocument, ViewMode } from './types';

// Re-export types for convenience
export * from './types';
export { DocumentViewerProvider, useDocumentViewer } from './DocumentViewerContext';
export type { LayoutType } from './layouts';

interface DocumentViewerProps {
  document: RentScheduleDocument;
  onClose?: () => void;
  defaultViewMode?: ViewMode;
  defaultLayout?: LayoutType;
  isModal?: boolean;
  onExportPdf?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  defaultViewMode = 'normal',
  defaultLayout = 'two-column',
  isModal = false,
  onExportPdf,
}) => {
  const [layout, setLayout] = useState<LayoutType>(defaultLayout);

  // Render the appropriate layout
  const renderLayout = () => {
    switch (layout) {
      case 'three-column':
        return <ThreeColumnLayout document={document} />;
      case 'two-column':
      default:
        return <TwoColumnLayout document={document} />;
    }
  };

  // TwoColumnLayout has toolbar integrated, others need separate toolbar
  const needsSeparateToolbar = layout === 'three-column';

  const content = (
    <DocumentViewerProvider defaultViewMode={defaultViewMode}>
      <div className="space-y-3">
        {needsSeparateToolbar && (
          <DocumentViewerToolbar
            onExportPdf={onExportPdf}
            layout={layout}
            onLayoutChange={setLayout}
          />
        )}
        {renderLayout()}
      </div>
    </DocumentViewerProvider>
  );

  // Determine modal width based on layout
  const getModalWidth = () => {
    switch (layout) {
      case 'three-column':
        return 'max-w-6xl'; // 1152px - wide for 3 columns
      case 'two-column':
      default:
        return 'max-w-5xl'; // 1024px - for 2 columns
    }
  };

  // If used as a modal, wrap with modal styling
  if (isModal && onClose) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-3 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-viewer-title"
      >
        <div
          className={`bg-ivolve-paper rounded-xl shadow-2xl w-full ${getModalWidth()} my-4 overflow-hidden animate-in fade-in zoom-in duration-200 transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header - Compact */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2
              id="document-viewer-title"
              className="text-lg font-bold text-ivolve-dark"
            >
              Rent Schedule
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              aria-label="Close viewer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content - Reduced padding */}
          <div className="p-4">{content}</div>
        </div>
      </div>
    );
  }

  // Otherwise, render inline
  return <div className="document-viewer">{content}</div>;
};

export default DocumentViewer;
