import React, { useState } from 'react';
import { IvolveStaff, PersonalizationIcon } from '../types';
import ContactCard, { getDepartmentStyles } from './ContactCard';
import { TemplateIcon, AddIcon, DECORATIVE_ICON_MAP } from './Icons';

type CardEditorModalProps = {
  user: IvolveStaff;
  onClose: () => void;
};

const TABS = ['Change Template', 'Add Icons'];

const ICON_LIBRARY = Object.entries(DECORATIVE_ICON_MAP).map(([name, Icon]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    id: name,
    icon: <Icon />,
}));

const BRAND_COLORS = [
    '#025A40', // dark-green
    '#008C67', // mid-green
    '#6BD052', // bright-green
    '#009EA5', // blue
    '#8B5CF6', // purple
    '#F59E0B', // yellow
    '#f97316', // orange (property)
    '#ec4899', // pink (commercial)
];

const CardEditorModal: React.FC<CardEditorModalProps> = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    
    // Local state for editing
    const [cardTemplate, setCardTemplate] = useState(user.cardTemplate || 'white');
    const [icons, setIcons] = useState<PersonalizationIcon[]>(user.personalizationIcons || []);
    
    const [selectedNewIcon, setSelectedNewIcon] = useState<{id: string, name: string} | null>(null);
    const [newIconColor, setNewIconColor] = useState<string>(BRAND_COLORS[0]);
    const [selectedPlacedIconId, setSelectedPlacedIconId] = useState<string | null>(null);

    const departmentStyles = getDepartmentStyles(user.team);
    const departmentColor = `var(--dept-${user.team.split(' ')[0].toLowerCase()})`; // A bit of a hack to get the color
    const customColors = [...BRAND_COLORS];
    if (departmentColor) {
        customColors.unshift(departmentStyles.bg.replace('bg-', '')); // Add dept color
    }
    
    const addIcon = () => {
        if (!selectedNewIcon || icons.length >= 5) return;
        const newIcon: PersonalizationIcon = {
            id: Date.now().toString(),
            name: selectedNewIcon.id,
            color: newIconColor,
        };
        setIcons([...icons, newIcon]);
        setSelectedNewIcon(null); // Reset selection
    };

    const deleteIcon = (iconId: string) => {
        setIcons(icons.filter(icon => icon.id !== iconId));
        setSelectedPlacedIconId(null);
    }
    
    const editedUser = { ...user, cardTemplate, personalizationIcons: icons };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Change Template':
                return (
                    <div>
                        <h3 className="font-semibold text-lg text-solas-dark">Card Background</h3>
                        <p className="text-sm text-solas-gray mt-1">Choose a background style for your contact card.</p>
                        <div className="mt-4 space-y-2">
                            <button 
                                onClick={() => setCardTemplate('white')}
                                className={`w-full text-left p-3 border rounded-md transition-colors ${cardTemplate === 'white' ? 'bg-ivolve-blue text-white border-ivolve-blue' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <p className="font-bold">White</p>
                                <p className="text-xs">The standard clean white background.</p>
                            </button>
                             <button 
                                onClick={() => setCardTemplate('solid')}
                                className={`w-full text-left p-3 border rounded-md transition-colors ${cardTemplate === 'solid' ? 'bg-ivolve-blue text-white border-ivolve-blue' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <p className="font-bold">Solid Color</p>
                                <p className="text-xs">Uses your department's primary color for the background.</p>
                            </button>
                        </div>
                    </div>
                );
            case 'Add Icons':
                 return (
                    <div>
                        <h3 className="font-semibold text-lg text-solas-dark">Personalize with Icons</h3>
                        <p className="text-sm text-solas-gray mt-1">Add up to 5 icons. Select an icon from the library, pick a color, and place it.</p>
                        
                        {selectedNewIcon && (
                            <div className="my-4 p-3 bg-gray-100 rounded-md border">
                                <p className="font-semibold text-sm">Customize '{selectedNewIcon.name}'</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {customColors.map(color => (
                                        <button key={color} onClick={() => setNewIconColor(color)} className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: color, borderColor: newIconColor === color ? '#025A40' : 'transparent' }}></button>
                                    ))}
                                </div>
                                <button onClick={addIcon} disabled={icons.length >= 5} className="mt-3 w-full bg-ivolve-mid-green text-white font-semibold py-2 rounded-md disabled:bg-gray-400">Place Icon</button>
                            </div>
                        )}

                        <div className="mt-4 grid grid-cols-4 gap-2 text-gray-500 max-h-48 overflow-y-auto pr-2">
                           {ICON_LIBRARY.map(item => (
                               <button 
                                key={item.id} 
                                onClick={() => setSelectedNewIcon(item)}
                                className={`aspect-square flex flex-col items-center justify-center p-2 border rounded-md bg-gray-50 hover:bg-ivolve-blue hover:text-white transition-colors ${selectedNewIcon?.id === item.id ? 'ring-2 ring-ivolve-blue' : ''}`}
                                title={`Add ${item.name} icon`}
                                >
                                   <div className="w-8 h-8">{item.icon}</div>
                                   <span className="text-xs mt-1">{item.name}</span>
                               </button>
                           ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0"
                onClick={onClose}
            ></div>
            <div className="relative bg-gray-100 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <header className="p-4 bg-white border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-solas-dark">Edit My Card</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">&times;</button>
                </header>
                
                {/* Main Content */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
                    {/* Left: Preview */}
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="font-semibold text-solas-dark mb-2">Live Preview</h3>
                        <div className="w-full max-w-sm">
                            <ContactCard 
                                person={editedUser}
                                isEditing={true}
                                onIconSelect={(icon) => setSelectedPlacedIconId(icon.id)}
                                onIconDelete={deleteIcon}
                                selectedIconId={selectedPlacedIconId}
                             />
                        </div>
                    </div>
                    {/* Right: Tools */}
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="border-b mb-4">
                            <nav className="-mb-px flex space-x-4">
                                {TABS.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab ? 'border-ivolve-blue text-ivolve-dark-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {tab === 'Change Template' ? <TemplateIcon /> : <AddIcon />}
                                        <span>{tab}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        {renderTabContent()}
                    </div>
                </div>

                 {/* Footer */}
                <footer className="p-4 bg-white border-t flex justify-end items-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={() => { alert('Saving card customizations... (demo)'); onClose(); }} className="px-6 py-2 rounded-md bg-ivolve-mid-green text-white font-semibold hover:bg-opacity-90">
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CardEditorModal;