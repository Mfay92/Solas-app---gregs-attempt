import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ALL_WIDGETS } from './views/DashboardView';
import * as storage from '../services/storage';
import { CustomWidget } from '../types';
import { SparklesIcon } from './Icons';

type AddWidgetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    visibleWidgetIds: string[];
    onSave: (newVisibleWidgetIds: string[]) => void;
};

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, visibleWidgetIds, onSave }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(visibleWidgetIds));
    const [customWidgets, setCustomWidgets] = useState<CustomWidget[]>([]);

    useEffect(() => {
        if (isOpen) {
            setCustomWidgets(storage.loadCustomWidgets());
            setSelectedIds(new Set(visibleWidgetIds));
        }
    }, [isOpen, visibleWidgetIds]);

    const handleToggle = (widgetId: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(widgetId)) {
                newSet.delete(widgetId);
            } else {
                newSet.add(widgetId);
            }
            return newSet;
        });
    };

    const handleSaveChanges = () => {
        onSave(Array.from(selectedIds));
        onClose();
    };

    if (!isOpen) return null;

    const allStandardWidgets = ALL_WIDGETS.map(widget => {
        const isSelected = selectedIds.has(widget.id);
        return (
             <div key={widget.id} className="relative flex items-start p-3 border rounded-md bg-gray-50">
                <div className="flex h-5 items-center">
                    <input
                        id={`widget-${widget.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(widget.id)}
                        className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={`widget-${widget.id}`} className="font-medium text-gray-800 flex items-center space-x-2 cursor-pointer">
                        <span className="text-ivolve-blue">{widget.icon}</span>
                        <span>{widget.title}</span>
                    </label>
                </div>
            </div>
        )
    });

    const allCustomWidgets = customWidgets.map(widget => {
        const isSelected = selectedIds.has(widget.id);
         return (
             <div key={widget.id} className="relative flex items-start p-3 border rounded-md bg-blue-50 border-ivolve-blue/50">
                <div className="flex h-5 items-center">
                    <input
                        id={`widget-${widget.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(widget.id)}
                        className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={`widget-${widget.id}`} className="font-medium text-gray-800 flex items-center space-x-2 cursor-pointer">
                        <span className="text-ivolve-blue"><SparklesIcon /></span>
                        <span>{widget.title}</span>
                    </label>
                </div>
            </div>
        )
    });


    return (
        <Modal title="Customize Dashboard Widgets" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Select the widgets you want to display on your dashboard.</p>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    <h3 className="font-bold text-solas-dark text-md pt-2">Standard Widgets</h3>
                    {allStandardWidgets}
                    
                    {customWidgets.length > 0 && (
                        <>
                            <h3 className="font-bold text-solas-dark text-md pt-4">My Custom Report Widgets</h3>
                            {allCustomWidgets}
                        </>
                    )}
                </div>
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
                        onClick={handleSaveChanges}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddWidgetModal;