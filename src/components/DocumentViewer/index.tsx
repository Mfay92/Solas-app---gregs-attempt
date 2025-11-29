import React from 'react';
import { X } from 'lucide-react';
import { DocumentViewerProvider } from './DocumentViewerContext';
import DocumentViewerToolbar from './DocumentViewerToolbar';
import RentScheduleViewer from './RentScheduleViewer';
import { RentScheduleDocument, ViewMode } from './types';

// Re-export types for convenience
export * from './types';
export { DocumentViewerProvider, useDocumentViewer } from './DocumentViewerContext';

interface DocumentViewerProps {
  document: RentScheduleDocument;
  onClose?: () => void;
  defaultViewMode?: ViewMode;
  isModal?: boolean;
  onExportPdf?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  defaultViewMode = 'normal',
  isModal = false,
  onExportPdf,
}) => {
  const content = (
    <DocumentViewerProvider defaultViewMode={defaultViewMode}>
      <div className="space-y-3">
        <DocumentViewerToolbar onExportPdf={onExportPdf} />
        <RentScheduleViewer document={document} propertyId={document.propertyId} />
      </div>
    </DocumentViewerProvider>
  );

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
          className="bg-ivolve-paper rounded-xl shadow-2xl w-full max-w-3xl my-4 overflow-hidden animate-in fade-in zoom-in duration-200"
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
