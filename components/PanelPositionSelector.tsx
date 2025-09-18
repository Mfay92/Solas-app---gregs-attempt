
import React, { useEffect } from 'react';
import { PanelBottomIcon, PanelRightIcon, ExternalLinkIcon } from './Icons';
import { DrawerMode } from '../types';

type PanelPositionSelectorProps = {
    isOpen: boolean;
    onClose: () => void;
    currentMode: DrawerMode;
    onSelectMode: (mode: DrawerMode) => void;
};

const positionOptions = [
    {
        id: 'right',
        name: 'Side Panel (Right)',
        description: 'Details slide in from the right of the screen.',
        icon: <PanelRightIcon />,
    },
    {
        id: 'bottom',
        name: 'Bottom Sheet',
        description: 'Details slide up from the bottom of the screen.',
        icon: <PanelBottomIcon />,
    },
    {
        id: 'popup',
        name: 'Pop-up Window',
        description: 'Details appear in a movable window.',
        icon: <ExternalLinkIcon />,
    },
];

const PanelPositionSelector: React.FC<PanelPositionSelectorProps> = ({ isOpen, onClose, currentMode, onSelectMode }) => {
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

    const drawerClasses = isOpen ? 'translate-x-0' : 'translate-x-full';

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
                aria-labelledby="panel-position-selector-title"
            >
                <div className="h-full flex flex-col">
                    <header className="p-4 border-b flex justify-between items-center bg-white flex-shrink-0">
                        <h2 id="panel-position-selector-title" className="text-xl font-bold text-solas-dark">Change Panel Position</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 text-3xl leading-none">&times;</button>
                    </header>
                    <main className="flex-grow p-6 space-y-4 overflow-y-auto">
                        <p className="text-sm text-solas-gray">Choose where detail panels appear. Your choice will be saved for next time.</p>
                        {positionOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onSelectMode(option.id as DrawerMode)}
                                className={`w-full flex items-center p-4 border-2 rounded-lg text-left transition-all duration-200 ${currentMode === option.id ? 'bg-ivolve-blue/10 border-ivolve-blue shadow-md' : 'bg-white border-gray-200 hover:border-ivolve-blue/50 hover:shadow-sm'}`}
                            >
                                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md p-4 text-ivolve-blue">
                                    {option.icon}
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <p className="font-bold text-solas-dark">{option.name}</p>
                                        {currentMode === option.id && (
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

export default PanelPositionSelector;
