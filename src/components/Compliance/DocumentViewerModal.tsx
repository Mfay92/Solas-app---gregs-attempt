import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';

interface DocumentInfo {
  fileName: string;
  filePath: string;
  fileType?: string;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentInfo: DocumentInfo | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentInfo,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !documentInfo) return null;

  const isPDF = documentInfo.fileName.toLowerCase().endsWith('.pdf') || documentInfo.fileType === 'pdf';
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentInfo.fileName) || documentInfo.fileType === 'image';

  // For local files, we'd need to serve them through the app
  // For now, show a placeholder with download option
  const isLocalFile = documentInfo.filePath.startsWith('/') || documentInfo.filePath.includes('\\');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] m-4 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ivolve-mid/10 rounded-lg">
              <FileText size={20} className="text-ivolve-mid" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 truncate max-w-md">
                {documentInfo.fileName}
              </h2>
              <p className="text-sm text-slate-500">
                {isPDF ? 'PDF Document' : isImage ? 'Image' : 'Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open in new tab */}
            <a
              href={documentInfo.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>

            {/* Download */}
            <a
              href={documentInfo.filePath}
              download={documentInfo.fileName}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          {isLocalFile ? (
            // For local files, show a placeholder
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <FileText size={40} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Document Preview
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                This document is stored locally. To view it, please download or open it in your file explorer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Copy file path to clipboard
                    navigator.clipboard.writeText(documentInfo.filePath);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Copy File Path
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-mono">
                {documentInfo.filePath}
              </p>
            </div>
          ) : isPDF ? (
            // PDF viewer using iframe
            <iframe
              src={`${documentInfo.filePath}#view=FitH`}
              className="w-full h-full min-h-[600px] rounded-lg bg-white shadow-inner"
              title={documentInfo.fileName}
            />
          ) : isImage ? (
            // Image viewer
            <div className="flex items-center justify-center h-full">
              <img
                src={documentInfo.filePath}
                alt={documentInfo.fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            // Unsupported format
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={40} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Preview not available
              </h3>
              <p className="text-slate-500 max-w-md mb-4">
                This file type cannot be previewed in the browser. Please download it to view.
              </p>
              <a
                href={documentInfo.filePath}
                download={documentInfo.fileName}
                className="px-4 py-2 text-sm font-medium text-white bg-ivolve-mid rounded-lg hover:bg-ivolve-dark transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
