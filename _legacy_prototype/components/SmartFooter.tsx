import React from 'react';
import { useUI } from '../contexts/UIContext';
import { useData } from '../contexts/DataContext';
import { ArrowsPointingOutIcon, UserIcon } from './Icons';

const SmartFooter: React.FC = () => {
    const { drawerMode, selectedPersonId, isPopupMinimized, setPopupMinimized } = useUI();
    const { people } = useData();

    const person = people.find(p => p.id === selectedPersonId);

    if (drawerMode !== 'popup' || !isPopupMinimized || !person) {
        return null;
    }

    return (
        <footer 
            className="fixed bottom-0 left-64 right-0 h-14 bg-ivolve-dark-green/95 backdrop-blur-sm text-white shadow-lg z-[60] flex items-center justify-between px-4"
        >
            <span className="text-sm font-semibold opacity-80">Minimized tabs can be found here</span>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setPopupMinimized(false)}
                    className="flex items-center space-x-2 p-2 bg-white/10 rounded-md hover:bg-white/20"
                >
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                       <UserIcon/>
                    </div>
                    <span className="font-bold text-sm">{person.preferredFirstName} {person.surname}</span>
                    <ArrowsPointingOutIcon />
                </button>
            </div>
        </footer>
    );
};

export default SmartFooter;