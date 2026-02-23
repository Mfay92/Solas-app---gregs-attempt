import { useState } from 'react';
import { FileText, X } from 'lucide-react';

interface RenameDocumentModalProps {
    currentName: string;
    onSave: (newName: string) => void;
    onClose: () => void;
}

export default function RenameDocumentModal({ currentName, onSave, onClose }: RenameDocumentModalProps) {
    const [newName, setNewName] = useState(currentName);
    const [error, setError] = useState<string>('');

    const validateAndSave = () => {
        const trimmedName = newName.trim();

        if (!trimmedName) {
            setError('Document name cannot be empty');
            return;
        }

        if (trimmedName.length > 80) {
            setError('Document name must be 80 characters or less');
            return;
        }

        onSave(trimmedName);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateAndSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <FileText size={24} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Rename Document</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="documentName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Document Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="documentName"
                            type="text"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                if (error) setError('');
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${error
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="Enter document name"
                            maxLength={80}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-1 text-xs text-red-600">{error}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">{newName.length}/80 characters</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> This only changes the display name on the Notice Board.
                            The actual file name will remain unchanged.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium"
                        >
                            Rename
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
