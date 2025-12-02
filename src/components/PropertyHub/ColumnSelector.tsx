import React, { useState, useRef, useEffect } from 'react';
import { Settings2, Check, ChevronDown, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { columnDefinitions, columnGroups, defaultVisibleColumns } from './columns';

interface ColumnSelectorProps {
    visibleColumns: string[];
    onVisibleColumnsChange: (columns: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    visibleColumns,
    onVisibleColumnsChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumn = (columnId: string) => {
        if (visibleColumns.includes(columnId)) {
            // Don't allow hiding the address column
            if (columnId === 'address') return;
            onVisibleColumnsChange(visibleColumns.filter(id => id !== columnId));
        } else {
            onVisibleColumnsChange([...visibleColumns, columnId]);
        }
    };

    const showAll = () => {
        onVisibleColumnsChange(columnDefinitions.map(col => col.id));
    };

    const resetToDefault = () => {
        onVisibleColumnsChange(defaultVisibleColumns);
    };

    const hiddenCount = columnDefinitions.length - visibleColumns.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    isOpen
                        ? 'bg-ivolve-mid text-white border-ivolve-mid'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-ivolve-mid hover:text-ivolve-mid'
                }`}
            >
                <Settings2 size={16} />
                <span>Columns</span>
                {hiddenCount > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                        {hiddenCount} hidden
                    </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Visible Columns</h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={showAll}
                                    className="flex items-center gap-1 text-xs text-ivolve-mid hover:text-ivolve-dark px-2 py-1 rounded hover:bg-ivolve-mid/10 transition-colors"
                                >
                                    <Eye size={12} />
                                    Show all
                                </button>
                                <button
                                    onClick={resetToDefault}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                >
                                    <RotateCcw size={12} />
                                    Reset
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {visibleColumns.length} of {columnDefinitions.length} columns visible
                        </p>
                    </div>

                    {/* Column Groups */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {columnGroups.map((group) => {
                            const groupColumns = columnDefinitions.filter(col => col.group === group.id);
                            const GroupIcon = group.icon;
                            const visibleInGroup = groupColumns.filter(col => visibleColumns.includes(col.id)).length;

                            return (
                                <div key={group.id} className="mb-3 last:mb-0">
                                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <GroupIcon size={14} className="text-gray-400" />
                                        {group.label}
                                        <span className="text-gray-400 font-normal">
                                            ({visibleInGroup}/{groupColumns.length})
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {groupColumns.map((column) => {
                                            const isVisible = visibleColumns.includes(column.id);
                                            const isRequired = column.id === 'address';

                                            return (
                                                <button
                                                    key={column.id}
                                                    onClick={() => toggleColumn(column.id)}
                                                    disabled={isRequired}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                                        isRequired
                                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                            : isVisible
                                                            ? 'bg-ivolve-mid/10 text-ivolve-dark hover:bg-ivolve-mid/20'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {isVisible ? (
                                                            <Eye size={14} className="text-ivolve-mid" />
                                                        ) : (
                                                            <EyeOff size={14} className="text-gray-400" />
                                                        )}
                                                        {column.label}
                                                        {isRequired && (
                                                            <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                                                                Required
                                                            </span>
                                                        )}
                                                    </span>
                                                    {isVisible && !isRequired && (
                                                        <Check size={14} className="text-ivolve-mid" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;
