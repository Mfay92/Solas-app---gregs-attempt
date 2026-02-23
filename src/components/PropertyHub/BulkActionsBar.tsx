import React, { useState } from 'react';
import {
    X,
    CheckSquare,
    Square,
    Trash2,
    Download,
    Tag,
    Archive,
    FileText,
    Printer,
    MoreHorizontal,
    AlertTriangle,
    Users,
    Mail,
    FileSpreadsheet
} from 'lucide-react';
import { ExportFormat } from './types';

interface BulkActionsBarProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onBulkAction: (actionId: string) => void;
    onExport: (format: ExportFormat) => void;
    isAllSelected: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
    selectedCount,
    totalCount,
    onSelectAll,
    onDeselectAll,
    onBulkAction,
    onExport,
    isAllSelected,
}) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);

    const primaryActions = [
        { id: 'export', label: 'Export', icon: <Download size={16} />, hasDropdown: true },
        { id: 'tag', label: 'Add Tag', icon: <Tag size={16} /> },
        { id: 'assign', label: 'Assign', icon: <Users size={16} /> },
        { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    ];

    const moreActions = [
        { id: 'archive', label: 'Archive', icon: <Archive size={16} /> },
        { id: 'print', label: 'Print', icon: <Printer size={16} /> },
        { id: 'report', label: 'Generate Report', icon: <FileText size={16} /> },
        { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, variant: 'danger' as const },
    ];

    const exportFormats = [
        { format: 'csv' as ExportFormat, label: 'CSV', icon: <FileText size={14} />, description: 'Comma-separated values' },
        { format: 'xlsx' as ExportFormat, label: 'Excel', icon: <FileSpreadsheet size={14} />, description: 'Microsoft Excel format' },
        { format: 'pdf' as ExportFormat, label: 'PDF', icon: <FileText size={14} />, description: 'Portable document format' },
        { format: 'json' as ExportFormat, label: 'JSON', icon: <FileText size={14} />, description: 'JavaScript Object Notation' },
    ];

    if (selectedCount === 0) return null;

    return (
        <>
            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-slide-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
                                <p className="text-gray-500 text-sm">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to {confirmAction} {selectedCount} selected propert{selectedCount === 1 ? 'y' : 'ies'}?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onBulkAction(confirmAction);
                                    setConfirmAction(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
                <div className="bg-ivolve-dark rounded-2xl shadow-2xl border border-white/10 px-4 py-3 flex items-center gap-4">
                    {/* Selection Info */}
                    <div className="flex items-center gap-3 pr-4 border-r border-white/20">
                        <button
                            onClick={isAllSelected ? onDeselectAll : onSelectAll}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isAllSelected ? (
                                <CheckSquare size={20} className="text-ivolve-mid" />
                            ) : (
                                <Square size={20} className="text-white/70" />
                            )}
                        </button>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">
                                {selectedCount} selected
                            </span>
                            <button
                                onClick={isAllSelected ? onDeselectAll : onSelectAll}
                                className="text-ivolve-mid text-xs hover:underline text-left"
                            >
                                {isAllSelected ? 'Deselect all' : `Select all ${totalCount}`}
                            </button>
                        </div>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex items-center gap-1">
                        {primaryActions.map((action) => (
                            <div key={action.id} className="relative">
                                <button
                                    onClick={() => {
                                        if (action.id === 'export') {
                                            setShowExportMenu(!showExportMenu);
                                            setShowMoreMenu(false);
                                        } else {
                                            onBulkAction(action.id);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {action.icon}
                                    <span className="hidden sm:inline">{action.label}</span>
                                </button>

                                {/* Export Dropdown */}
                                {action.id === 'export' && showExportMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 overflow-hidden">
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Export Format
                                            </span>
                                        </div>
                                        {exportFormats.map((format) => (
                                            <button
                                                key={format.format}
                                                onClick={() => {
                                                    onExport(format.format);
                                                    setShowExportMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                                                    {format.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{format.label}</div>
                                                    <div className="text-xs text-gray-500">{format.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-white/20" />

                    {/* More Actions */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowMoreMenu(!showMoreMenu);
                                setShowExportMenu(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <MoreHorizontal size={16} />
                            <span className="hidden sm:inline">More</span>
                        </button>

                        {showMoreMenu && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 overflow-hidden">
                                {moreActions.map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => {
                                            if (action.id === 'delete') {
                                                setConfirmAction('delete');
                                            } else {
                                                onBulkAction(action.id);
                                            }
                                            setShowMoreMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                                            action.variant === 'danger'
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onDeselectAll}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default BulkActionsBar;
