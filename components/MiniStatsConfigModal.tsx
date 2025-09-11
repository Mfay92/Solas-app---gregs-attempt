import React, { useState, useEffect } from 'react';
import Modal from './Modal';

type MiniStatsConfigModalProps = {
    currentSelection: string[];
    onClose: () => void;
    onSave: (newSelection: string[]) => void;
};

const badgeOptions = [
    { key: 'taggedToYou', label: 'Tagged to you', description: 'Properties where you are a key contact.' },
    { key: 'updatedToday', label: 'Updated today', description: 'Properties with timeline activity today.' },
    { key: 'yourOpenActions', label: 'Your open actions', description: 'Open maintenance jobs linked to you.' },
];

const MiniStatsConfigModal: React.FC<MiniStatsConfigModalProps> = ({ currentSelection, onClose, onSave }) => {
    const [selected, setSelected] = useState<string[]>(currentSelection);

    const handleToggle = (key: string) => {
        setSelected(prev => {
            if (prev.includes(key)) {
                return prev.filter(item => item !== key);
            }
            if (prev.length < 2) {
                return [...prev, key];
            }
            // If already 2 selected, do nothing
            return prev;
        });
    };
    
    const isMaxSelected = selected.length >= 2;

    return (
        <Modal title="Configure Personal Stats" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Select up to two badges to display in the footer for an at-a-glance summary.</p>
                <fieldset className="space-y-3">
                    {badgeOptions.map(option => {
                        const isChecked = selected.includes(option.key);
                        const isDisabled = !isChecked && isMaxSelected;
                        return (
                            <div key={option.key} className={`relative flex items-start p-3 border rounded-md ${isDisabled ? 'opacity-60' : ''}`}>
                                <div className="flex h-5 items-center">
                                    <input
                                        id={option.key}
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => handleToggle(option.key)}
                                        className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor={option.key} className={`font-medium text-gray-800 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                        {option.label}
                                    </label>
                                    <p className="text-gray-500">{option.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </fieldset>

                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(selected)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MiniStatsConfigModal;