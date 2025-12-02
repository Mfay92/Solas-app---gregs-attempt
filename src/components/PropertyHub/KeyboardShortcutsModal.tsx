import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
    onClose: () => void;
}

const shortcuts = [
    {
        category: 'Navigation',
        items: [
            { keys: ['↑', '↓'], description: 'Navigate between rows' },
            { keys: ['Enter'], description: 'Open selected property' },
            { keys: ['Esc'], description: 'Close modal / Deselect' },
            { keys: ['Home'], description: 'Go to first row' },
            { keys: ['End'], description: 'Go to last row' },
        ],
    },
    {
        category: 'Selection',
        items: [
            { keys: ['Space'], description: 'Select/deselect current row' },
            { keys: ['⌘', 'A'], description: 'Select all rows' },
            { keys: ['Shift', '↑/↓'], description: 'Extend selection' },
            { keys: ['⌘', 'Click'], description: 'Toggle row selection' },
        ],
    },
    {
        category: 'Search & Filter',
        items: [
            { keys: ['⌘', 'K'], description: 'Focus search' },
            { keys: ['⌘', 'F'], description: 'Open advanced filters' },
            { keys: ['⌘', 'Shift', 'F'], description: 'Clear all filters' },
        ],
    },
    {
        category: 'Views',
        items: [
            { keys: ['⌘', '1'], description: 'Table view' },
            { keys: ['⌘', '2'], description: 'Card view' },
            { keys: ['⌘', 'S'], description: 'Save current view' },
            { keys: ['⌘', 'B'], description: 'Open saved views' },
        ],
    },
    {
        category: 'Actions',
        items: [
            { keys: ['⌘', 'E'], description: 'Export selected' },
            { keys: ['⌘', 'P'], description: 'Print' },
            { keys: ['⌘', '/'], description: 'Show keyboard shortcuts' },
            { keys: ['?'], description: 'Show keyboard shortcuts' },
        ],
    },
];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-ivolve-dark to-ivolve-mid flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Keyboard size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
                            <p className="text-white/70 text-sm">Navigate faster with these shortcuts</p>
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
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shortcuts.map((section) => (
                            <div key={section.category}>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-ivolve-mid rounded-full" />
                                    {section.category}
                                </h3>
                                <div className="space-y-2">
                                    {section.items.map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-600">{shortcut.description}</span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <React.Fragment key={keyIndex}>
                                                        <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded shadow-sm">
                                                            {key === '⌘' ? (
                                                                <Command size={12} />
                                                            ) : (
                                                                key
                                                            )}
                                                        </kbd>
                                                        {keyIndex < shortcut.keys.length - 1 && (
                                                            <span className="text-gray-400 text-xs">+</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">?</kbd> anytime to show this dialog
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-ivolve-mid hover:bg-ivolve-dark rounded-lg transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
