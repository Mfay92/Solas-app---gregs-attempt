

import React, { useRef, useState } from 'react';
import Modal from '../Modal';
import ToggleSwitch from '../ToggleSwitch';
import { TagStyle, DrawerMode } from '../../types';
import { RowsIcon, TemplateIcon, PanelRightIcon } from '../Icons';
import ViewTypeSelector from '../ViewTypeSelector';
import PanelPositionSelector from '../PanelPositionSelector';

type ViewSettings = {
    toggles: Record<string, boolean>;
    highlightToggles: Record<string, boolean>;
    visibleColumns: Record<string, boolean>;
    columnOrder: string[];
    tagStyle: TagStyle;
    viewMode: 'table' | 'deck' | 'collapsible';
    drawerMode: DrawerMode;
    rememberSettings: boolean;
};

type SetViewSettings = {
    setToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setHighlightToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
    setTagStyle: React.Dispatch<React.SetStateAction<TagStyle>>;
    setViewMode: React.Dispatch<React.SetStateAction<'table' | 'deck' | 'collapsible'>>;
    setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
    setRememberSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

type ViewSettingsModalProps = {
    onClose: () => void;
    settings: ViewSettings;
    setSettings: SetViewSettings;
    initialColumnConfig: { id: string, label: string }[];
};

const TABS = ['Filters & Highlights', 'Columns', 'Layout'];

const toggleOptions = [
    { key: 'supportedLiving', label: 'Supported Living' }, { key: 'residential', label: 'Residential' },
    { key: 'nursingCare', label: 'Nursing Care' }, { key: 'north', label: 'North' },
    { key: 'midlands', label: 'Midlands' }, { key: 'south', label: 'South & South West' },
    { key: 'wales', label: 'Wales' }, { key: 'masterUnits', label: 'Master Units' },
    { key: 'voidUnits', label: 'Void Units' }, { key: 'occupiedUnits', label: 'Occupied Units' },
    { key: 'outOfManagement', label: 'Out of Management' }, { key: 'staffSpace', label: 'Staff Space' },
] as const;

const highlightOptions = [
    { key: 'warning', label: 'Warnings (Orange)' }, { key: 'master', label: 'Master Units (Yellow)' },
    { key: 'void', label: 'Void Units (Blue)' }, { key: 'occupied', label: 'Occupied (Green)' },
] as const;

const tagStyleOptions: { key: TagStyle, label: string }[] = [
    { key: 'text', label: 'Plain Text' }, { key: 'outline', label: 'Outline' }, { key: 'default', label: 'Full Color' },
];

const ViewSettingsModal: React.FC<ViewSettingsModalProps> = ({ onClose, settings, setSettings, initialColumnConfig }) => {
    const [activeTab, setActiveTab] = React.useState(TABS[0]);
    const draggedItem = useRef<string | null>(null);

    const { toggles, highlightToggles, visibleColumns, columnOrder, tagStyle, viewMode, drawerMode, rememberSettings } = settings;
    const { setToggles, setHighlightToggles, setVisibleColumns, setColumnOrder, setTagStyle, setViewMode, setDrawerMode, setRememberSettings } = setSettings;

    const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);
    const [isPanelSelectorOpen, setIsPanelSelectorOpen] = useState(false);

    const handleToggle = (key: keyof typeof toggles) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    const handleHighlightToggle = (key: keyof typeof highlightToggles) => setHighlightToggles(prev => ({ ...prev, [key]: !prev[key] }));
    const handleColumnToggle = (columnId: string) => setVisibleColumns(prev => ({ ...prev, [columnId]: !prev[columnId] }));
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        draggedItem.current = id;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
        e.preventDefault();
        const dragId = draggedItem.current;
        if (!dragId || dragId === dropId || dropId === 'propId') return;
        const dragIndex = columnOrder.indexOf(dragId);
        const dropIndex = columnOrder.indexOf(dropId);
        const newOrder = [...columnOrder];
        const [item] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, item);
        setColumnOrder(newOrder);
        draggedItem.current = null;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Filters & Highlights': return (
                <div className="space-y-6">
                    <section>
                        <h4 className="font-semibold text-solas-dark mb-2 border-b pb-1">Filters</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {toggleOptions.map(opt => <ToggleSwitch key={opt.key} label={opt.label} enabled={toggles[opt.key]} onChange={() => handleToggle(opt.key)} labelClassName="text-solas-dark" />)}
                        </div>
                    </section>
                    <section className="pt-4 border-t">
                        <h4 className="font-semibold text-solas-dark mb-2 border-b pb-1">Row Highlights</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {highlightOptions.map(opt => <ToggleSwitch key={opt.key} label={opt.label} enabled={highlightToggles[opt.key]} onChange={() => handleHighlightToggle(opt.key)} labelClassName="text-solas-dark" />)}
                        </div>
                    </section>
                </div>
            );
            case 'Columns': return (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Toggle visibility and drag to reorder columns.</p>
                    <div className="space-y-2">
                        {columnOrder.map(id => {
                            const col = initialColumnConfig.find(c => c.id === id);
                            if (!col) return null;
                            const isLocked = col.id === 'propId';
                            return (
                                <div key={col.id} className={`flex items-center p-2 rounded-md ${isLocked ? 'bg-gray-200' : 'bg-gray-100'}`} draggable={!isLocked} onDragStart={e => !isLocked && handleDragStart(e, col.id)} onDragOver={e => e.preventDefault()} onDrop={e => !isLocked && handleDrop(e, col.id)}>
                                    {!isLocked && <span className="cursor-move text-gray-400 mr-2"><RowsIcon /></span>}
                                    <ToggleSwitch label={col.label} enabled={visibleColumns[col.id]} onChange={() => handleColumnToggle(col.id)} labelClassName="text-solas-dark flex-grow" disabled={isLocked} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
            case 'Layout': return (
                <div className="space-y-6">
                    <section>
                        <h4 className="font-semibold text-solas-dark mb-3">Tag Style</h4>
                        <fieldset>
                            <div className="flex items-center justify-between space-x-2">
                                {tagStyleOptions.map(opt => (
                                    <label key={opt.key} className={`flex-1 text-center p-2 border rounded-md cursor-pointer transition-colors ${tagStyle === opt.key ? 'bg-ivolve-blue text-white border-ivolve-blue' : 'bg-white text-gray-800'}`}>
                                        <input type="radio" name="tag-style" value={opt.key} checked={tagStyle === opt.key} onChange={() => setTagStyle(opt.key)} className="sr-only" />
                                        <span className="text-sm font-medium">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </section>
                     <section>
                        <h4 className="font-semibold text-solas-dark mb-3">Database View</h4>
                        <button onClick={() => setIsViewSelectorOpen(true)} className="w-full flex items-center justify-between p-3 bg-white border rounded-md text-left hover:bg-gray-50">
                            <div>
                                <p className="font-medium text-solas-dark">Change View Type...</p>
                                <p className="text-xs text-gray-500">Current: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</p>
                            </div>
                            <TemplateIcon />
                        </button>
                    </section>
                     <section>
                        <h4 className="font-semibold text-solas-dark mb-3">Detail Panel Position</h4>
                        <button onClick={() => setIsPanelSelectorOpen(true)} className="w-full flex items-center justify-between p-3 bg-white border rounded-md text-left hover:bg-gray-50">
                             <div>
                                <p className="font-medium text-solas-dark">Change Panel Position...</p>
                                <p className="text-xs text-gray-500">Current: {drawerMode.charAt(0).toUpperCase() + drawerMode.slice(1)}</p>
                            </div>
                            <PanelRightIcon />
                        </button>
                    </section>
                </div>
            );
        }
    };

    return (
        <>
            <Modal title="View Settings" onClose={onClose} className="max-w-4xl">
                <div className="flex">
                    <aside className="w-48 pr-4 border-r">
                        <nav className="flex flex-col space-y-1">
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === tab ? 'bg-ivolve-blue/10 text-ivolve-blue' : 'hover:bg-gray-100'}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <div className="flex-grow pl-4">
                        {renderContent()}
                        <div className="mt-6 pt-4 border-t">
                            <ToggleSwitch label="Remember my settings for next time" enabled={rememberSettings} onChange={setRememberSettings} labelClassName="text-gray-700" />
                        </div>
                    </div>
                </div>
            </Modal>
            {isViewSelectorOpen && (
                <ViewTypeSelector
                    isOpen={isViewSelectorOpen}
                    onClose={() => setIsViewSelectorOpen(false)}
                    currentView={viewMode}
                    onSelectView={(view) => {
                        setViewMode(view);
                        setIsViewSelectorOpen(false);
                    }}
                />
            )}
            {isPanelSelectorOpen && (
                 <PanelPositionSelector
                    isOpen={isPanelSelectorOpen}
                    onClose={() => setIsPanelSelectorOpen(false)}
                    currentMode={drawerMode}
                    onSelectMode={(mode) => {
                        setDrawerMode(mode);
                        setIsPanelSelectorOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default ViewSettingsModal;
