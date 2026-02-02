import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export interface ImportantInfo {
    id: string;
    type: 'allergy' | 'communication' | 'medical' | 'dietary' | 'mobility' | 'other';
    title: string;
    description: string;
    color: {
        bg: string;
        border: string;
        text: string;
    };
}

interface ImportantInfoModalProps {
    info?: ImportantInfo; // If provided, we're editing; if not, we're adding
    onSave: (info: Omit<ImportantInfo, 'id'>) => void;
    onClose: () => void;
}

const INFO_TYPES = [
    {
        value: 'allergy' as const,
        label: 'Allergy Warning',
        colors: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-800' },
        colorValues: { bg: 'orange-100', border: 'orange-500', text: 'orange-800' }
    },
    {
        value: 'communication' as const,
        label: 'Communication',
        colors: { bg: 'bg-sky-100', border: 'border-sky-500', text: 'text-sky-800' },
        colorValues: { bg: 'sky-100', border: 'sky-500', text: 'sky-800' }
    },
    {
        value: 'medical' as const,
        label: 'Medical',
        colors: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' },
        colorValues: { bg: 'red-100', border: 'red-500', text: 'red-800' }
    },
    {
        value: 'dietary' as const,
        label: 'Dietary',
        colors: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
        colorValues: { bg: 'green-100', border: 'green-500', text: 'green-800' }
    },
    {
        value: 'mobility' as const,
        label: 'Mobility',
        colors: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-800' },
        colorValues: { bg: 'purple-100', border: 'purple-500', text: 'purple-800' }
    },
    {
        value: 'other' as const,
        label: 'Other',
        colors: { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-800' },
        colorValues: { bg: 'gray-100', border: 'gray-500', text: 'gray-800' }
    }
];

export default function ImportantInfoModal({ info, onSave, onClose }: ImportantInfoModalProps) {
    const [type, setType] = useState<ImportantInfo['type']>(info?.type || 'allergy');
    const [title, setTitle] = useState(info?.title || '');
    const [description, setDescription] = useState(info?.description || '');
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    const selectedType = INFO_TYPES.find(t => t.value === type) || INFO_TYPES[0];

    const validateForm = () => {
        const newErrors: { title?: string; description?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 50) {
            newErrors.title = 'Title must be 50 characters or less';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length > 200) {
            newErrors.description = 'Description must be 200 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSave({
            type,
            title: title.trim(),
            description: description.trim(),
            color: selectedType.colorValues
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <AlertCircle size={24} className="text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {info ? 'Edit Important Info' : 'Add Important Info'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {INFO_TYPES.map((infoType) => (
                                <button
                                    key={infoType.value}
                                    type="button"
                                    onClick={() => setType(infoType.value)}
                                    className={`
                                        p-3 rounded-lg border-2 text-sm font-medium transition-all
                                        ${type === infoType.value
                                            ? `${infoType.colors.bg} ${infoType.colors.border} ${infoType.colors.text} shadow-md`
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {infoType.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors({ ...errors, title: undefined });
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${errors.title
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="e.g., Allergy Warning, Communication Preference"
                            maxLength={50}
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">{title.length}/50 characters</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors({ ...errors, description: undefined });
                            }}
                            rows={4}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors resize-none
                                ${errors.description
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="Provide details about this important information..."
                            maxLength={200}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">{description.length}/200 characters</p>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className={`p-3 rounded-md border-l-4 ${selectedType.colors.bg} ${selectedType.colors.border} shadow-md`}>
                            <div className="flex items-start gap-2">
                                <AlertCircle size={14} className={`${selectedType.colors.text.replace('text-', 'text-')} mt-0.5 shrink-0`} />
                                <div>
                                    <p className={`text-[10px] font-bold ${selectedType.colors.text} uppercase tracking-wide mb-0.5`}>
                                        {title || 'Title will appear here'}
                                    </p>
                                    <p className={`text-xs ${selectedType.colors.text.replace('800', '900')}`}>
                                        {description || 'Description will appear here'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* Actions - Fixed Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
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
                            {info ? 'Save Changes' : 'Add Info'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
