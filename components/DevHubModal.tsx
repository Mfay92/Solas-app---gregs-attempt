import React, { useState } from 'react';
import { ChartBarIcon, LibraryIcon, SparklesIcon, TemplateIcon } from './Icons';
import ActionPlanTab from './dev_hub/ActionPlanTab';
import UILibraryTab from './dev_hub/UILibraryTab';
import AssetLibraryTab from './dev_hub/AssetLibraryTab';
import NotesTab from './dev_hub/NotesTab';

const TABS = [
    { name: 'Action Plan', icon: <ChartBarIcon /> },
    { name: 'UI Library', icon: <TemplateIcon /> },
    { name: 'Assets', icon: <LibraryIcon /> },
    { name: 'Notes', icon: <SparklesIcon /> },
];

const DevHubModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState(TABS[0].name);

    const renderContent = () => {
        switch (activeTab) {
            case 'Action Plan': return <ActionPlanTab />;
            case 'UI Library': return <UILibraryTab />;
            case 'Assets': return <AssetLibraryTab />;
            case 'Notes': return <NotesTab />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[99] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-gray-100 rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 bg-devhub-orange text-white border-b border-white/20 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">Developer Hub</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-white/70 hover:bg-white/20 text-3xl leading-none">&times;</button>
                </header>
                
                <div className="flex flex-grow overflow-hidden">
                    <aside className="w-56 bg-devhub-orange p-2 flex-shrink-0">
                        <nav className="flex flex-col space-y-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.name 
                                        ? 'bg-white/20 text-white font-bold' 
                                        : 'text-orange-100 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="w-6 h-6">{tab.icon}</span>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-grow p-6 overflow-y-auto">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DevHubModal;