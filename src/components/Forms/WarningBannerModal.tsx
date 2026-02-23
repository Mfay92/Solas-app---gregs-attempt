import { useState, useEffect } from 'react';
import { AlertTriangle, X, Edit2, Trash2 } from 'lucide-react';

export interface Warning {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
    lastUpdatedAt?: string;
    lastUpdatedBy?: string;
}

interface WarningBannerModalProps {
    warning?: Warning;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onRemove?: () => void;
    entityType: 'Person' | 'Property';
    entityName: string;
}

export default function WarningBannerModal({
    warning,
    isOpen,
    onClose,
    onEdit,
    onRemove,
    entityType,
    entityName
}: WarningBannerModalProps) {
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    // Reset acknowledgment when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsAcknowledged(false);
        }
    }, [isOpen]);

    if (!isOpen || !warning) return null;

    const handleClose = () => {
        if (!isAcknowledged) {
            return; // Can't close without acknowledging
        }
        onClose();
    };

    return (
        <>
            {/* Overlay - Click disabled, must acknowledge */}
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-4 border-orange-500 animate-pulse-border"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Warning Theme */}
                    <div className="flex items-center justify-between p-6 border-b-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-orange-500 animate-pulse-glow">
                                <AlertTriangle size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
                                    IMPORTANT WARNING
                                </h2>
                                <p className="text-sm text-orange-700 font-semibold mt-1">
                                    {entityType}: {entityName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning Content */}
                    <div className="p-8">
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-6">
                            <p className="text-lg text-orange-900 font-semibold leading-relaxed whitespace-pre-wrap">
                                {warning.content}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-semibold">Created by:</span> {warning.createdBy}
                                </div>
                                <div>
                                    <span className="font-semibold">Created:</span>{' '}
                                    {new Date(warning.createdAt).toLocaleString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                {warning.lastUpdatedAt && (
                                    <>
                                        <div>
                                            <span className="font-semibold">Updated by:</span> {warning.lastUpdatedBy}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Updated:</span>{' '}
                                            {new Date(warning.lastUpdatedAt).toLocaleString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Acknowledgment Required */}
                        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAcknowledged}
                                    onChange={(e) => setIsAcknowledged(e.target.checked)}
                                    className="w-6 h-6 text-orange-600 border-2 border-orange-400 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                                />
                                <span className="text-amber-900 font-bold text-lg">
                                    I acknowledge that I have read and understood this warning
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={20} />
                                    Edit Warning
                                </button>
                            )}
                            {onRemove && (
                                <button
                                    onClick={onRemove}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} />
                                    Remove Warning
                                </button>
                            )}
                            <button
                                onClick={handleClose}
                                disabled={!isAcknowledged}
                                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                                    isAcknowledged
                                        ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                }`}
                            >
                                <X size={20} />
                                {isAcknowledged ? 'Close' : 'Acknowledge to Continue'}
                            </button>
                        </div>

                        {!isAcknowledged && (
                            <p className="text-center text-amber-700 font-semibold mt-4 text-sm animate-pulse">
                                You must acknowledge this warning before proceeding
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add animations to Tailwind */}
            <style>{`
                @keyframes pulse-border {
                    0%, 100% {
                        border-color: rgb(249 115 22);
                    }
                    50% {
                        border-color: rgb(234 88 12);
                    }
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(234, 88, 12, 0.8);
                    }
                }

                .animate-pulse-border {
                    animation: pulse-border 2s ease-in-out infinite;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
