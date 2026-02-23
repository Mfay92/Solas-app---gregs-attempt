import { useState } from 'react';
import { X, Save, FileText, User, Calendar, Tag } from 'lucide-react';

export interface Note {
    id: string;
    category: NoteCategory;
    title: string;
    content: string;
    createdAt: string;
    createdBy: string;
    lastModifiedAt?: string;
    lastModifiedBy?: string;
    linkedEntity: {
        entityType: 'Person' | 'Property' | 'Referral';
        entityId: string;
        entityName: string;
    };
    isPinned: boolean;
}

export type NoteCategory =
    | 'daily-update'
    | 'visitor'
    | 'behaviours'
    | 'medical-notice'
    | 'doctors-visit'
    | 'landlord-visit'
    | 'maintenance'
    | 'safeguarding'
    | 'incident'
    | 'support-plan'
    | 'finance'
    | 'general'
    | 'other';

interface AddNoteSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: Omit<Note, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>) => void;
    entityType: 'Person' | 'Property' | 'Referral';
    entityId: string;
    entityName: string;
    currentUser?: string; // TODO: Connect to auth system
}

const NOTE_CATEGORIES = [
    { value: 'daily-update' as const, label: 'Daily Update', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'visitor' as const, label: 'Visitor', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'behaviours' as const, label: 'Behaviours', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'medical-notice' as const, label: 'Medical Notice', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'doctors-visit' as const, label: 'Doctors Visit', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { value: 'landlord-visit' as const, label: 'Landlord Visit', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'maintenance' as const, label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'safeguarding' as const, label: 'Safeguarding', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { value: 'incident' as const, label: 'Incident', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'support-plan' as const, label: 'Support Plan', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'finance' as const, label: 'Finance', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'general' as const, label: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'other' as const, label: 'Other', color: 'bg-slate-100 text-slate-800 border-slate-200' }
];

export default function AddNoteSidebar({
    isOpen,
    onClose,
    onSave,
    entityType,
    entityId,
    entityName,
    currentUser = 'Matt Fay' // Default for development
}: AddNoteSidebarProps) {
    const [category, setCategory] = useState<NoteCategory>('daily-update');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    const selectedCategory = NOTE_CATEGORIES.find(c => c.value === category) || NOTE_CATEGORIES[0];

    const validateForm = () => {
        const newErrors: { title?: string; content?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }

        if (!content.trim()) {
            newErrors.content = 'Note content is required';
        } else if (content.length > 5000) {
            newErrors.content = 'Note content must be 5000 characters or less';
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
            category,
            title: title.trim(),
            content: content.trim(),
            linkedEntity: {
                entityType,
                entityId,
                entityName
            },
            isPinned
        });

        // Reset form
        setTitle('');
        setContent('');
        setCategory('daily-update');
        setIsPinned(false);
        setErrors({});
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setCategory('daily-update');
        setIsPinned(false);
        setErrors({});
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                    onClick={handleCancel}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 bg-ivolve-mid">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                            <FileText size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Add Note / Action</h2>
                            <p className="text-sm text-white/80">{entityName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        {/* Metadata Info */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <div className="text-blue-600 mt-0.5">
                                    <User size={18} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-blue-600" />
                                        <span className="font-semibold text-blue-900">
                                            {new Date().toLocaleDateString('en-GB', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <User size={14} className="text-blue-600" />
                                        <span className="text-blue-800">Logged by: <strong>{currentUser}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                <Tag size={16} className="inline mr-2" />
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {NOTE_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setCategory(cat.value)}
                                        className={`
                                            p-3 rounded-lg border-2 text-sm font-medium transition-all text-left
                                            ${category === cat.value
                                                ? `${cat.color} border-current shadow-md ring-2 ring-offset-1 ring-current`
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="note-title" className="block text-sm font-bold text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="note-title"
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: undefined });
                                }}
                                className={`
                                    w-full px-4 py-3 rounded-lg border-2 transition-colors text-base
                                    ${errors.title
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-ivolve-mid'
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                                `}
                                placeholder="e.g., Daily welfare check completed, Medication administered"
                                maxLength={100}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">{title.length}/100 characters</p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="note-content" className="block text-sm font-bold text-gray-700 mb-2">
                                Note Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="note-content"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (errors.content) setErrors({ ...errors, content: undefined });
                                }}
                                rows={12}
                                className={`
                                    w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none text-base
                                    ${errors.content
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-ivolve-mid'
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                                `}
                                placeholder="Provide detailed information about this note or action..."
                                maxLength={5000}
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">{content.length}/5000 characters</p>
                        </div>

                        {/* Pin Option */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-amber-900">Pin this note</div>
                                    <div className="text-sm text-amber-700">Pinned notes appear at the top of the notes list and in the Notice Board</div>
                                </div>
                            </label>
                        </div>

                        {/* Preview */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Preview
                            </label>
                            <div className={`p-4 rounded-lg border-2 ${selectedCategory.color} border-current shadow-sm`}>
                                <div className="flex items-start gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedCategory.color}`}>
                                        {selectedCategory.label}
                                    </span>
                                    {isPinned && (
                                        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-amber-100 text-amber-800">
                                            PINNED
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">
                                    {title || 'Note title will appear here'}
                                </h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {content || 'Note content will appear here...'}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-gray-600">
                                    <div>Created by {currentUser}</div>
                                    <div>On {new Date().toLocaleString('en-GB')}</div>
                                </div>
                            </div>
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
                            className="flex-1 px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Save Note
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
