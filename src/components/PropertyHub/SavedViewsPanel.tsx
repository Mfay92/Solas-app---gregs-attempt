import React, { useState } from 'react';
import {
    Bookmark,
    Plus,
    Star,
    StarOff,
    Edit3,
    Trash2,
    Copy,
    Check,
    X,
    MoreHorizontal,
    Users,
    Sparkles,
    FolderOpen
} from 'lucide-react';
import { SavedView, FilterConfig, SortConfig, RowDensity } from './types';

interface SavedViewsPanelProps {
    views: SavedView[];
    activeViewId: string | null;
    onViewSelect: (view: SavedView) => void;
    onViewCreate: (view: Omit<SavedView, 'id' | 'createdAt'>) => void;
    onViewUpdate: (id: string, updates: Partial<SavedView>) => void;
    onViewDelete: (id: string) => void;
    onClose: () => void;
    // Current state to save
    currentState: {
        visibleColumns: string[];
        filters: FilterConfig[];
        sortConfig: SortConfig | null;
        groupBy: string | null;
        density: RowDensity;
    };
}

const viewIcons = [
    { icon: '📊', label: 'Chart' },
    { icon: '🏠', label: 'Home' },
    { icon: '⚡', label: 'Quick' },
    { icon: '📋', label: 'List' },
    { icon: '🎯', label: 'Target' },
    { icon: '💼', label: 'Business' },
    { icon: '🔍', label: 'Search' },
    { icon: '📈', label: 'Growth' },
    { icon: '🏢', label: 'Building' },
    { icon: '💰', label: 'Money' },
    { icon: '⚠️', label: 'Warning' },
    { icon: '✅', label: 'Complete' },
];

const viewColors = [
    { value: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', ring: 'ring-gray-300' },
    { value: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-300' },
    { value: 'green', bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-300' },
    { value: 'amber', bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' },
    { value: 'red', bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-300' },
    { value: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-300' },
    { value: 'pink', bg: 'bg-pink-100', text: 'text-pink-700', ring: 'ring-pink-300' },
    { value: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-300' },
];

const SavedViewsPanel: React.FC<SavedViewsPanelProps> = ({
    views,
    activeViewId,
    onViewSelect,
    onViewCreate,
    onViewUpdate,
    onViewDelete,
    onClose,
    currentState,
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newViewName, setNewViewName] = useState('');
    const [newViewDescription, setNewViewDescription] = useState('');
    const [newViewIcon, setNewViewIcon] = useState('📊');
    const [newViewColor, setNewViewColor] = useState('blue');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const pinnedViews = views.filter(v => v.isPinned);
    const regularViews = views.filter(v => !v.isPinned);

    const handleCreateView = () => {
        if (!newViewName.trim()) return;

        onViewCreate({
            name: newViewName.trim(),
            description: newViewDescription.trim() || undefined,
            icon: newViewIcon,
            color: newViewColor,
            visibleColumns: currentState.visibleColumns,
            columnOrder: currentState.visibleColumns,
            pinnedColumns: [],
            sortConfig: currentState.sortConfig,
            filters: currentState.filters,
            groupBy: currentState.groupBy,
            density: currentState.density,
            isDefault: false,
            isShared: false,
            isPinned: false,
        });

        setNewViewName('');
        setNewViewDescription('');
        setNewViewIcon('📊');
        setNewViewColor('blue');
        setIsCreating(false);
    };

    const handleDuplicateView = (view: SavedView) => {
        onViewCreate({
            name: `${view.name} (Copy)`,
            description: view.description,
            icon: view.icon,
            color: view.color,
            visibleColumns: view.visibleColumns,
            columnOrder: view.columnOrder,
            pinnedColumns: view.pinnedColumns,
            sortConfig: view.sortConfig,
            filters: view.filters,
            groupBy: view.groupBy,
            density: view.density,
            isDefault: false,
            isShared: false,
            isPinned: false,
        });
        setMenuOpenId(null);
    };

    const getColorClasses = (colorValue: string) => {
        return viewColors.find(c => c.value === colorValue) || viewColors[0];
    };

    const renderViewCard = (view: SavedView) => {
        const isActive = view.id === activeViewId;
        const isEditing = editingId === view.id;
        const colorClasses = getColorClasses(view.color || 'gray');

        return (
            <div
                key={view.id}
                className={`group relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isActive
                        ? `${colorClasses.bg} border-current ${colorClasses.text} shadow-sm`
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => !isEditing && onViewSelect(view)}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`text-2xl p-1.5 rounded-lg ${isActive ? 'bg-white/50' : colorClasses.bg}`}>
                        {view.icon || '📊'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={view.name}
                                onChange={(e) => onViewUpdate(view.id, { name: e.target.value })}
                                onBlur={() => setEditingId(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                                className="w-full px-2 py-1 text-sm font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <h3 className={`font-semibold truncate ${isActive ? colorClasses.text : 'text-gray-900'}`}>
                                {view.name}
                            </h3>
                        )}
                        {view.description && (
                            <p className={`text-xs mt-0.5 truncate ${isActive ? 'opacity-70' : 'text-gray-500'}`}>
                                {view.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-xs ${isActive ? 'opacity-60' : 'text-gray-400'}`}>
                                {view.filters.length} filter{view.filters.length !== 1 ? 's' : ''}
                            </span>
                            {view.isDefault && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                                    Default
                                </span>
                            )}
                            {view.isShared && (
                                <Users size={12} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(menuOpenId === view.id ? null : view.id);
                            }}
                            className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                isActive ? 'hover:bg-white/30' : 'hover:bg-gray-100'
                            }`}
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {menuOpenId === view.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewUpdate(view.id, { isPinned: !view.isPinned });
                                        setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    {view.isPinned ? <StarOff size={14} /> : <Star size={14} />}
                                    {view.isPinned ? 'Unpin' : 'Pin to top'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewUpdate(view.id, { isDefault: !view.isDefault });
                                        setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Check size={14} />
                                    {view.isDefault ? 'Remove as default' : 'Set as default'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(view.id);
                                        setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit3 size={14} />
                                    Rename
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateView(view);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Copy size={14} />
                                    Duplicate
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewDelete(view.id);
                                        setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-current rounded-r" />
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-ivolve-dark to-ivolve-mid flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Bookmark size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Saved Views</h2>
                        <p className="text-white/70 text-sm">{views.length} view{views.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Create New View */}
                {isCreating ? (
                    <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 space-y-3">
                        <div className="flex items-center gap-3">
                            {/* Icon Picker */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="text-2xl p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                                >
                                    {newViewIcon}
                                </button>
                                {showIconPicker && (
                                    <div className="absolute left-0 top-full mt-2 p-2 bg-white rounded-xl shadow-xl border border-gray-200 grid grid-cols-6 gap-1 z-50">
                                        {viewIcons.map((item) => (
                                            <button
                                                key={item.icon}
                                                onClick={() => {
                                                    setNewViewIcon(item.icon);
                                                    setShowIconPicker(false);
                                                }}
                                                className="text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title={item.label}
                                            >
                                                {item.icon}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={newViewName}
                                onChange={(e) => setNewViewName(e.target.value)}
                                placeholder="View name..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                                autoFocus
                            />
                        </div>

                        <input
                            type="text"
                            value={newViewDescription}
                            onChange={(e) => setNewViewDescription(e.target.value)}
                            placeholder="Description (optional)..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                        />

                        {/* Color Picker */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Color:</span>
                            {viewColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setNewViewColor(color.value)}
                                    className={`w-6 h-6 rounded-full ${color.bg} ${
                                        newViewColor === color.value ? `ring-2 ${color.ring} ring-offset-2` : ''
                                    } transition-all`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewViewName('');
                                    setNewViewDescription('');
                                }}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateView}
                                disabled={!newViewName.trim()}
                                className="px-4 py-1.5 text-sm font-medium text-white bg-ivolve-mid hover:bg-ivolve-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save View
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-ivolve-mid hover:text-ivolve-mid hover:bg-ivolve-mid/5 transition-all"
                    >
                        <Plus size={16} />
                        Save current view
                    </button>
                )}

                {/* Pinned Views */}
                {pinnedViews.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <Star size={12} />
                            Pinned
                        </div>
                        <div className="space-y-2">
                            {pinnedViews.map(renderViewCard)}
                        </div>
                    </div>
                )}

                {/* Regular Views */}
                {regularViews.length > 0 && (
                    <div className="space-y-2">
                        {pinnedViews.length > 0 && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <FolderOpen size={12} />
                                All Views
                            </div>
                        )}
                        <div className="space-y-2">
                            {regularViews.map(renderViewCard)}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {views.length === 0 && !isCreating && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <Sparkles size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved views yet</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Save your current filters and columns as a view for quick access
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions Footer */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Tip: Pin your most-used views</span>
                    <button
                        onClick={onClose}
                        className="text-ivolve-mid hover:underline"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavedViewsPanel;
