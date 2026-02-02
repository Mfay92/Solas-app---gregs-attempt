import { useState, useEffect } from 'react';
import { AlertTriangle, X, Save } from 'lucide-react';
import type { Warning } from './WarningBannerModal';

interface AddWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string) => void;
    existingWarning?: Warning;
    entityType: 'Person' | 'Property';
    entityName: string;
}

export default function AddWarningModal({
    isOpen,
    onClose,
    onSave,
    existingWarning,
    entityType,
    entityName
}: AddWarningModalProps) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    // Load existing warning content when editing
    useEffect(() => {
        if (isOpen) {
            setContent(existingWarning?.content || '');
            setError('');
        }
    }, [isOpen, existingWarning]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Warning content is required');
            return;
        }

        if (content.trim().length < 10) {
            setError('Warning must be at least 10 characters');
            return;
        }

        if (content.length > 1000) {
            setError('Warning must be 1000 characters or less');
            return;
        }

        onSave(content.trim());
        setContent('');
        setError('');
    };

    const handleCancel = () => {
        setContent('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={handleCancel}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border-4 border-orange-400"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Fixed */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-orange-50 to-red-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500">
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-orange-900">
                                    {existingWarning ? 'Edit Warning' : 'Add Warning'}
                                </h2>
                                <p className="text-sm text-orange-700 font-semibold">
                                    {entityType}: {entityName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                            type="button"
                        >
                            <X size={24} className="text-orange-600" />
                        </button>
                    </div>

                    {/* Form - Scrollable */}
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Instructions */}
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                                <p className="text-sm text-amber-900 font-semibold">
                                    This warning will be displayed to all users when they open this {entityType.toLowerCase()}'s profile.
                                    Use it for critical safety information, restrictions, or important notices.
                                </p>
                            </div>

                            {/* Examples */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-bold text-blue-900 mb-2">Example warnings:</p>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>This person has a history of violent behaviour - approach with caution</li>
                                    <li>Health vulnerability: Cannot be exposed to cold temperatures</li>
                                    <li>Males cannot visit this property</li>
                                    <li>This property is currently a building site - do not visit</li>
                                    <li>No visits between 10:00 AM - 4:00 PM (medical appointments)</li>
                                </ul>
                            </div>

                            {/* Warning Content */}
                            <div>
                                <label htmlFor="warning-content" className="block text-sm font-bold text-gray-700 mb-2">
                                    Warning Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="warning-content"
                                    value={content}
                                    onChange={(e) => {
                                        setContent(e.target.value);
                                        if (error) setError('');
                                    }}
                                    rows={6}
                                    className={`
                                        w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none text-base
                                        ${error
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-orange-300 focus:border-orange-500'
                                        }
                                        focus:outline-none focus:ring-2 focus:ring-orange-500/20
                                    `}
                                    placeholder="Enter critical warning information..."
                                    maxLength={1000}
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-600 font-semibold">{error}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">{content.length}/1000 characters</p>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Preview
                                </label>
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg min-h-[80px]">
                                    <p className="text-base text-orange-900 font-semibold leading-relaxed whitespace-pre-wrap">
                                        {content || 'Warning content will appear here...'}
                                    </p>
                                </div>
                            </div>

                            {/* Critical Notice */}
                            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                                <p className="text-sm text-red-900 font-bold">
                                    ⚠️ This warning will auto-popup every time someone opens this profile. Users must acknowledge it before proceeding.
                                </p>
                            </div>
                        </div>

                        {/* Footer - Fixed */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {existingWarning ? 'Update Warning' : 'Save Warning'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
