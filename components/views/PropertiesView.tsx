

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ServiceType, UnitStatus, LegalEntity, TagStyle, PropertyUnitRow, PropertyFilters } from '../../types';
import { PropertiesIcon, WarningIcon, StarIconSolid, BinocularsIcon, NoSymbolIcon, ChartBarIcon, KeyIcon, CogIcon, SparklesIcon, InformationCircleIcon, BookOpenIcon, SearchIcon } from '../Icons';
import StatusChip from '../StatusChip';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import * as storage from '../../services/storage';
import PropertyCardDeckView from './PropertyCardDeckView';
import RpTag from '../RpTag';
import Modal from '../Modal';
import UnitStatusTag from '../UnitStatusTag';
import AddNewUnitModal from '../AddNewUnitModal';
import QuickStatsModal from '../QuickStatsModal';
import ViewSettingsModal from '../modals/ViewSettingsModal';
import HelpModal from '../modals/HelpModal';
import { GoogleGenAI } from '@google/genai';
import SplitText from '../SplitText';
import HelpButton from '../HelpButton';

const CURRENT_USER_ID = 'MF01';

const entityStyles: Record<LegalEntity, string> = {
    [LegalEntity.Heathcotes]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
    [LegalEntity.HeathcotesM]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
    [LegalEntity.HeathcotesS]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
    [LegalEntity.Gresham]: 'bg-entity-gresham-bg text-entity-gresham-text',
    [LegalEntity.TLC]: 'bg-entity-tlc-bg text-entity-tlc-text',
    [LegalEntity.NewDirections]: 'bg-entity-newdirections-bg text-entity-newdirections-text',
    [LegalEntity.Fieldbay]: 'bg-entity-fieldbay-bg text-entity-fieldbay-text',
};

// --- AI CONFIGURATION ---
const filterSchema = {
    type: 'OBJECT',
    properties: {
        searchText: { type: 'STRING', description: 'General text to search for in address, RP, ID, etc. Can include property IDs like STRE01.' },
        serviceTypes: {
            type: 'ARRAY',
            items: { type: 'STRING', enum: ['Supported Living', 'Residential', 'Nursing Care'] },
            description: 'The types of services provided at the property.'
        },
        unitStatuses: {
            type: 'ARRAY',
            items: { type: 'STRING', enum: ['Occupied', 'Void', 'Master', 'Unavailable', 'Out of Management', 'Staff Space'] },
            description: 'The current status of the units.'
        },
        regions: {
            type: 'ARRAY',
            items: { type: 'STRING', enum: ['North', 'Midlands', 'South', 'South West', 'Wales'] },
            description: 'The geographical region of the property.'
        },
        rp: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'The registered provider (RP) associated with the property.'
        }
    },
};

const analyzeSearchQuery = async (query: string): Promise<PropertyFilters | null> => {
    if (!query.trim()) return null;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: `Analyze this property database query and extract the filters: "${query}"` }] }],
            config: {
                systemInstruction: "You are an expert at interpreting natural language queries for a social housing property database. Your task is to extract specific filter criteria from the user's query and return them in the provided JSON format. Only return filters that are explicitly mentioned in the query.",
                responseMimeType: "application/json",
                responseSchema: filterSchema,
            }
        });

        const resultText = response.text;
        const parsedResult: PropertyFilters = JSON.parse(resultText);
        return parsedResult;
    } catch (e) {
        console.error("AI Search Analysis Error:", e);
        return { searchText: query }; // Fallback
    }
};

const EntityTag: React.FC<{ entity: LegalEntity; styleType: TagStyle }> = ({ entity, styleType }) => {
    if (styleType === 'text') {
        return <span className={`font-medium text-xs`}>{entity}</span>;
    }
    const styleClasses = entityStyles[entity];
    const textColorClass = styleClasses.match(/text-[\w-]+/)?.[0] ?? 'text-gray-800';
    const bgColorClass = styleClasses.match(/bg-[\w-]+/)?.[0] ?? 'bg-gray-100';
    const baseClasses = 'inline-block w-full text-center px-2 py-0.5 text-xs font-medium rounded-md border';
    const typeClasses = styleType === 'outline'
        ? `${textColorClass} border-current bg-transparent`
        : `${textColorClass} ${bgColorClass} border-current`;
    return <span className={`${baseClasses} ${typeClasses}`}>{entity}</span>;
};

const StatusIcon: React.FC<{ row: PropertyUnitRow }> = ({ row }) => {
    if (row.attention) return <span className="text-status-orange" title="Attention Required"><WarningIcon /></span>;
    switch (row.status) {
        case UnitStatus.Master: return <span className="text-tag-master" title="Master Unit"><StarIconSolid /></span>;
        case UnitStatus.Void: return <span className="text-tag-void" title="Void Unit"><BinocularsIcon /></span>;
        case UnitStatus.OutOfManagement: return <span className="text-tag-oom" title="Out of Management"><NoSymbolIcon /></span>;
        default: return null;
    }
};

const initialColumnConfig = [
    { id: 'propId', label: 'ID' }, { id: 'icon', label: 'Icon' }, { id: 'unit', label: 'Unit' },
    { id: 'address', label: 'Full Address' }, { id: 'rp', label: 'RP' }, { id: 'legalEntity', label: 'Entity' },
    { id: 'serviceType', label: 'Service Type' }, { id: 'status', label: 'Status' }, { id: 'handover', label: 'Handover' },
    { id: 'handback', label: 'Handback' },
];

const Dropdown: React.FC<{ buttonContent: React.ReactNode; children: React.ReactNode; }> = ({ buttonContent, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors">{buttonContent}</button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 border text-solas-dark">
                    {children}
                </div>
            )}
        </div>
    );
};


const PropertiesView: React.FC = () => {
    const { properties, people, ivolveStaff } = useData();
    const { selectProperty, drawerMode, setDrawerMode, propertyFilters, clearPropertyFilters } = useUI();

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [activeModal, setActiveModal] = useState<null | 'addProperty' | 'addUnit' | 'stats' | 'viewSettings' | 'help'>(null);
    
    // All view settings state is managed here and passed to the ViewSettingsModal
    const [toggles, setToggles] = useState(() => storage.loadPropertiesViewSettings()?.toggles || { supportedLiving: true, residential: true, nursingCare: true, north: true, midlands: true, south: true, wales: true, masterUnits: true, voidUnits: true, occupiedUnits: true, outOfManagement: false, staffSpace: true });
    const [visibleColumns, setVisibleColumns] = useState(() => storage.loadPropertiesViewSettings()?.visibleColumns || initialColumnConfig.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}));
    const [columnOrder, setColumnOrder] = useState(() => storage.loadPropertiesViewSettings()?.columnOrder || initialColumnConfig.map(c => c.id));
    const [highlightToggles, setHighlightToggles] = useState(() => storage.loadPropertiesViewSettings()?.highlightToggles || { void: true, master: true, warning: true, occupied: false });
    const [tagStyle, setTagStyle] = useState<TagStyle>(() => storage.loadPropertiesViewSettings()?.tagStyle || 'text');
    const [viewMode, setViewMode] = useState<'table' | 'deck' | 'collapsible'>(() => storage.loadPropertiesViewSettings()?.viewMode || 'table');
    const [rememberSettings, setRememberSettings] = useState(!!storage.loadPropertiesViewSettings());
    const [selectedBadges, setSelectedBadges] = useState<string[]>(() => storage.loadMiniStatsSettings()?.selectedBadges || ['taggedToYou', 'yourOpenActions']);

    // Effect to apply filters from AI search
    useEffect(() => {
        if (propertyFilters) {
            setSearchQuery(propertyFilters.searchText || '');
            const newToggles = { ...toggles };
            // This is a simplified application; in a real app, you would have a more robust mapping.
            if (propertyFilters.serviceTypes?.length) newToggles.supportedLiving = propertyFilters.serviceTypes.includes(ServiceType.SupportedLiving);
            if (propertyFilters.unitStatuses?.length) newToggles.voidUnits = propertyFilters.unitStatuses.includes(UnitStatus.Void);
            if (propertyFilters.regions?.length) newToggles.north = propertyFilters.regions.includes('North');
            setToggles(newToggles);
            clearPropertyFilters();
        }
    }, [propertyFilters, clearPropertyFilters]);

    // Save settings on change
    useEffect(() => {
        if (rememberSettings) {
            storage.savePropertiesViewSettings({ visibleColumns, highlightToggles, tagStyle, columnOrder, viewMode, toggles });
        } else {
            storage.clearPropertiesViewSettings();
        }
    }, [rememberSettings, visibleColumns, highlightToggles, tagStyle, columnOrder, viewMode, toggles]);
    useEffect(() => { storage.saveMiniStatsSettings({ selectedBadges }); }, [selectedBadges]);
    
    const handleSearch = async () => {
        setIsSearching(true);
        setSearchError(null);
        try {
            const filters = await analyzeSearchQuery(searchQuery);
            if (filters) {
                // Manually apply filters based on AI response
                const newToggles = { ...toggles };
                // Example of applying one filter type. A full implementation would map all filter properties.
                if (filters.unitStatuses) {
                    newToggles.voidUnits = filters.unitStatuses.includes(UnitStatus.Void);
                    newToggles.occupiedUnits = filters.unitStatuses.includes(UnitStatus.Occupied);
                }
                setToggles(newToggles);
            }
        } catch(e) {
            setSearchError("AI search failed. Please try a simpler query.");
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const filteredData = useMemo(() => {
        const baseData: PropertyUnitRow[] = properties.flatMap(prop =>
          prop.units.map(unit => ({
            propertyId: prop.id, unitId: unit.id, unitName: unit.name,
            fullAddress: `${prop.address.line1}, ${prop.address.city}, ${prop.address.postcode}`,
            rp: prop.tags.rp, legalEntity: prop.legalEntity, serviceType: prop.serviceType,
            status: unit.status, region: prop.region,
            handoverDate: new Date(prop.handoverDate).toLocaleDateString('en-GB'),
            handbackDate: prop.handbackDate, attention: unit.attention,
          }))
        );
        const lowercasedQuery = searchQuery.toLowerCase();
        return baseData.filter(row => {
            const matchesSearch = !searchQuery || row.unitId.toLowerCase().includes(lowercasedQuery) || row.fullAddress.toLowerCase().includes(lowercasedQuery) || row.rp.toLowerCase().includes(lowercasedQuery);
            if (!matchesSearch) return false;
            const serviceTypeMap = { [ServiceType.SupportedLiving]: toggles.supportedLiving, [ServiceType.Residential]: toggles.residential, [ServiceType.NursingCare]: toggles.nursingCare };
            if (!serviceTypeMap[row.serviceType]) return false;
            const regionMap = { 'North': toggles.north, 'Midlands': toggles.midlands, 'South': toggles.south, 'South West': toggles.south, 'Wales': toggles.wales };
            if (!regionMap[row.region as keyof typeof regionMap]) return false;
            const statusMap = { [UnitStatus.Master]: toggles.masterUnits, [UnitStatus.Occupied]: toggles.occupiedUnits, [UnitStatus.Void]: toggles.voidUnits, [UnitStatus.OutOfManagement]: toggles.outOfManagement, [UnitStatus.StaffSpace]: toggles.staffSpace };
            if (statusMap[row.status] === false) return false;
            return true;
        });
    }, [properties, searchQuery, toggles]);
  
    const miniStats = useMemo(() => {
        const currentUser = ivolveStaff.find(s => s.id === CURRENT_USER_ID);
        if (!currentUser) return { taggedToYou: 0, updatedToday: 0, yourOpenActions: 0 };
        const todayStr = new Date().toDateString();
        const taggedToYou = properties.filter(p => p.linkedContacts?.some(c => c.contactId === CURRENT_USER_ID)).length;
        const updatedToday = properties.filter(p => p.timeline.some(event => new Date(event.date).toDateString() === todayStr)).length;
        const yourOpenActions = properties.flatMap(p => p.maintenanceJobs).filter(job => job.details.reportedBy === currentUser.name || job.activityLog.some(log => log.actor === currentUser.name)).length;
        return { taggedToYou, updatedToday, yourOpenActions };
    }, [properties, ivolveStaff]);

    const badgeDetails: { [key: string]: { label: string; count: number } } = {
        taggedToYou: { label: 'Tagged to you', count: miniStats.taggedToYou },
        updatedToday: { label: 'Updated today', count: miniStats.updatedToday },
        yourOpenActions: { label: 'Your open actions', count: miniStats.yourOpenActions },
    };

    const getRowClass = (row: PropertyUnitRow) => {
        if (highlightToggles.warning && row.attention) return 'bg-ivolve-warning-bg-deep';
        if (highlightToggles.master && row.status === UnitStatus.Master) return 'bg-bg-tag-master-row';
        if (highlightToggles.void && row.status === UnitStatus.Void) return 'bg-row-void-bg';
        if (highlightToggles.occupied && row.status === UnitStatus.Occupied) return 'bg-row-occupied-bg';
        if (row.status === UnitStatus.OutOfManagement) return 'bg-row-oom-bg text-gray-500';
        return 'bg-app-card-bg';
    };

    const orderedColumnConfig = useMemo(() => columnOrder.map(id => initialColumnConfig.find(c => c.id === id)).filter(Boolean) as typeof initialColumnConfig, [columnOrder]);

    const renderCell = (row: PropertyUnitRow, columnId: string) => {
        switch (columnId) {
            case 'propId': return row.unitId;
            case 'icon': return <div className="flex justify-center items-center"><StatusIcon row={row} /></div>;
            case 'unit': return row.unitName;
            case 'address': return row.fullAddress;
            case 'rp': return <RpTag name={row.rp} styleType={tagStyle} />;
            case 'legalEntity': return <EntityTag entity={row.legalEntity} styleType={tagStyle} />;
            case 'serviceType': return <StatusChip status={row.serviceType} styleType={tagStyle} />;
            case 'status': return <UnitStatusTag status={row.status} styleType={tagStyle} />;
            case 'handover': return row.handoverDate;
            case 'handback': return row.handbackDate ? new Date(row.handbackDate).toLocaleDateString('en-GB') : 'N/A';
            default: return null;
        }
    };
  
    const getCellClasses = (columnId: string, row: PropertyUnitRow) => {
        const baseClass = 'p-5 text-base border-r border-gray-200';
        switch (columnId) {
            case 'propId': return `${baseClass} text-center font-medium`;
            case 'icon': case 'unit': case 'rp': case 'legalEntity':
            case 'serviceType': case 'status': case 'handover': return `${baseClass} text-center`;
            case 'handback': return `${baseClass} text-center ${!row.handbackDate ? 'text-gray-400' : ''}`;
            default: return baseClass;
        }
    };

    return (
    <div className="h-full flex flex-col">
        {activeModal === 'addUnit' && <AddNewUnitModal properties={properties.filter(p => p.units.some(u => u.status === UnitStatus.Master))} onClose={() => setActiveModal(null)} onSave={() => { console.log("Save new unit"); setActiveModal(null); }}/>}
        {activeModal === 'addProperty' && <Modal title="Add New Property" onClose={() => setActiveModal(null)}><p>This feature is coming soon.</p></Modal>}
        {activeModal === 'stats' && <QuickStatsModal properties={properties} people={people} onClose={() => setActiveModal(null)} />}
        {activeModal === 'viewSettings' && <ViewSettingsModal onClose={() => setActiveModal(null)} settings={{ toggles, highlightToggles, visibleColumns, columnOrder, tagStyle, viewMode, drawerMode, rememberSettings }} setSettings={{ setToggles, setHighlightToggles, setVisibleColumns, setColumnOrder, setTagStyle, setViewMode, setDrawerMode, setRememberSettings }} initialColumnConfig={initialColumnConfig} />}
        {activeModal === 'help' && <HelpModal topic="propertyDatabase" onClose={() => setActiveModal(null)} />}

        <header className="bg-app-header text-app-header-text p-4 shadow-md z-10 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <span className="h-8 w-8"><PropertiesIcon /></span>
                    <h1 className="text-4xl font-extrabold tracking-tight animated-heading" aria-label="PROPERTY DATABASE"><SplitText>PROPERTY DATABASE</SplitText></h1>
                </div>
                <div className="flex-grow max-w-xl mx-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SparklesIcon className="h-5 w-5 text-ivolve-blue" />
                        </span>
                        <input
                            type="search"
                            placeholder="Ask anything or search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-solas-dark placeholder-ivolve-dark-green/70 focus:outline-none focus:ring-2 focus:ring-ivolve-blue"
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !searchQuery}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-ivolve-blue disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                            aria-label="Search"
                        >
                            {isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ivolve-blue"></div> : <SearchIcon className="h-5 w-5 text-current" />}
                        </button>
                    </form>
                    {searchError && <p className="text-red-300 text-xs mt-1">{searchError}</p>}
                </div>
                <div className="flex items-center space-x-2">
                    <HelpButton onClick={() => setActiveModal('help')} />
                    <Dropdown buttonContent={<><ChartBarIcon /><span>Quick Info</span></>}>
                        <div className="p-3 space-y-2">
                            <h4 className="font-bold text-sm border-b pb-2">Personal Stats</h4>
                            {selectedBadges.map(key => (
                                <div key={key} className="flex justify-between items-center text-sm"><span>{badgeDetails[key].label}</span><span className="font-bold">{badgeDetails[key].count}</span></div>
                            ))}
                            <div className="flex justify-between items-center text-sm"><span>Units Shown</span><span className="font-bold">{filteredData.length}</span></div>
                            <button onClick={() => setActiveModal('stats')} className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-sm font-semibold py-2 rounded-md">View Full Report</button>
                        </div>
                    </Dropdown>
                    <button onClick={() => setActiveModal('viewSettings')} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors"><CogIcon /><span>View Settings</span></button>
                    <Dropdown buttonContent={<><KeyIcon /><span>Admin Tools</span></>}>
                        <div className="p-2 space-y-1">
                            <button onClick={() => setActiveModal('addProperty')} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100">Add New Property</button>
                            <button onClick={() => setActiveModal('addUnit')} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100">Add New Unit</button>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </header>

        <div className="flex-grow overflow-y-auto p-4">
           {viewMode === 'deck' ? <PropertyCardDeckView rows={filteredData} /> : (
            <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-brand-dark-green text-white">
                    <tr>{orderedColumnConfig.map(col => visibleColumns[col.id] && <th key={col.id} className="p-3 text-base font-semibold border-r border-white/20 tracking-wider first:text-center last:border-r-0">{col.label}</th>)}</tr>
                </thead>
                <tbody className="text-app-text-dark">
                    {filteredData.map((row) => (
                        <tr key={row.unitId} className={`hover:bg-ivolve-blue hover:text-white cursor-pointer transition-colors duration-150 border-b border-gray-200 ${getRowClass(row)}`} onClick={() => selectProperty(row.propertyId, row.unitId)}>
                           {orderedColumnConfig.map(col => visibleColumns[col.id] && <td key={col.id} className={getCellClasses(col.id, row)}>{renderCell(row, col.id)}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
           )}
        </div>
    </div>
  );
};

export default PropertiesView;