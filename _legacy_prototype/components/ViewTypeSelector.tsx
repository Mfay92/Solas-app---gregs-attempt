import React, { useEffect } from 'react';

type ViewType = 'table' | 'deck' | 'collapsible';

type ViewTypeSelectorProps = {
    isOpen: boolean;
    onClose: () => void;
    currentView: ViewType;
    onSelectView: (view: ViewType) => void;
};

const viewOptions = [
    {
        id: 'table',
        name: 'Stacked Table',
        description: 'Full table with sorting, filters, and chips.',
        thumbnail: () => (
            <svg viewBox="0 0 40 40" className="w-full h-full text-gray-400">
                <rect x="2" y="6" width="36" height="6" rx="1" fill="currentColor" />
                <rect x="2" y="17" width="36" height="6" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="2" y="28" width="36" height="6" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'deck',
        name: 'Cards',
        description: 'Large tiles for visual scanning (less dense).',
        thumbnail: () => (
             <svg viewBox="0 0 40 40" className="w-full h-full text-gray-400">
                <rect x="4" y="4" width="14" height="14" rx="2" fill="currentColor" />
                <rect x="22" y="4" width="14" height="14" rx="2" fill="currentColor" opacity="0.7" />
                <rect x="4" y="22" width="14" height="14" rx="2" fill="currentColor" opacity="0.7" />
                <rect x="22" y="22" width="14" height="14" rx="2" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: 'collapsible',
        name: 'Collapsible Masters',
        description: 'Masters only; expand a row to see its Units inline.',
        thumbnail: () => (
             <svg viewBox="0 0 40 40" className="w-full h-full text-gray-400">
                <rect x="2" y="6" width="36" height="6" rx="1" fill="currentColor" />
                <path d="M7 9 L7 11 L5 11 L5 9 Z M9 9 L9 11 L11 11 L11 9 Z" fill="#fff" />
                <rect x="2" y="17" width="36" height="6" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="2" y="28" width="36" height="6" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
        ),
    }
];

const ViewTypeSelector: React.FC<ViewTypeSelectorProps> = ({ isOpen, onClose, currentView, onSelectView }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const drawerClasses = isOpen
        ? 'translate-x-0'
        : 'translate-x-full';

    return (
        <div 
            className={`fixed inset-0 z-[60] transition-opacity ${isOpen ? 'bg-black bg-opacity-30' : 'pointer-events-none bg-opacity-0'}`} 
            onClick={onClose}
        >
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-ivolve-off-white shadow-2xl transform transition-transform ease-in-out duration-300 ${drawerClasses}`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="view-selector-title"
            >
                <div className="h-full flex flex-col">
                    <header className="p-4 border-b flex justify-between items-center bg-white flex-shrink-0">
                        <h2 id="view-selector-title" className="text-xl font-bold text-solas-dark">Change Database View Type</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 text-3xl leading-none">&times;</button>
                    </header>
                    <main className="flex-grow p-6 space-y-4 overflow-y-auto">
                        <p className="text-sm text-solas-gray">Pick how you want to view properties. You can switch back any time.</p>
                        {viewOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onSelectView(option.id as ViewType)}
                                className={`w-full flex items-center p-4 border-2 rounded-lg text-left transition-all duration-200 ${currentView === option.id ? 'bg-ivolve-blue/10 border-ivolve-blue shadow-md' : 'bg-white border-gray-200 hover:border-ivolve-blue/50 hover:shadow-sm'}`}
                            >
                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md p-2">
                                    <option.thumbnail />
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <p className="font-bold text-solas-dark">{option.name}</p>
                                        {currentView === option.id && (
                                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-ivolve-blue text-white rounded-full">Active</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-solas-gray mt-1">{option.description}</p>
                                </div>
                            </button>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ViewTypeSelector;