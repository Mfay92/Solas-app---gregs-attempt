

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Person, PersonStatus, ServiceType, Flag, DrawerMode } from '../../types';
import { PeopleIcon, SearchIcon, PanelRightIcon, PanelBottomIcon, ChartBarIcon, CogIcon, KeyIcon, WarningIcon, ExternalLinkIcon } from '../Icons';
import { usePersona } from '../../contexts/PersonaContext';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import SplitText from '../SplitText';
import StatusChip from '../StatusChip';
import RpTag from '../RpTag';
import { getRegionTagStyle } from '../../utils/theme';

const PersonStatusIcon: React.FC<{ person: { flags?: Flag[] } }> = ({ person }) => {
    const highPriorityFlag = person.flags?.find(f => f.level === 'danger') || person.flags?.find(f => f.level === 'warning');
    if (highPriorityFlag) {
        const color = highPriorityFlag.level === 'danger' ? 'text-status-danger' : 'text-status-warning';
        return <span className={color} title={highPriorityFlag.message}><WarningIcon /></span>;
    }
    return null;
};

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
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border text-solas-dark">
                    {children}
                </div>
            )}
        </div>
    );
};

const PanelPositionSelector: React.FC<{
    currentMode: DrawerMode;
    onSelectMode: (mode: DrawerMode) => void;
}> = ({ currentMode, onSelectMode }) => (
    <div className="p-2 space-y-1">
        <button onClick={() => onSelectMode('right')} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-2 ${currentMode === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <PanelRightIcon /> <span>Side Panel</span>
        </button>
        <button onClick={() => onSelectMode('bottom')} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-2 ${currentMode === 'bottom' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <PanelBottomIcon /> <span>Bottom Sheet</span>
        </button>
        <button onClick={() => onSelectMode('popup')} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-2 ${currentMode === 'popup' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <ExternalLinkIcon /> <span>Pop-up Window</span>
        </button>
    </div>
);


const PeopleView: React.FC = () => {
    const { people, properties, ivolveStaff: staff } = useData();
    const { selectPerson, drawerMode, setDrawerMode } = useUI();
    
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = usePersona();

    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s])), [staff]);

    const enhancedPeople = useMemo(() => {
        return people.map(person => ({
            ...person,
            property: propertyMap.get(person.propertyId),
            keyWorker: staffMap.get(person.keyWorkerId),
        }));
    }, [people, propertyMap, staffMap]);

    const filteredPeople = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        if (!lowercasedQuery) return enhancedPeople;
        return enhancedPeople.filter(p => 
            `${p.preferredFirstName} ${p.surname}`.toLowerCase().includes(lowercasedQuery) ||
            `${p.legalFirstName} ${p.surname}`.toLowerCase().includes(lowercasedQuery) ||
            p.id.toLowerCase().includes(lowercasedQuery) ||
            p.property?.address.line1.toLowerCase().includes(lowercasedQuery) ||
            p.keyWorker?.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [enhancedPeople, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-app-header text-app-header-text p-4 shadow-md z-10 space-y-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
            <PeopleIcon />
            <h1 className="text-3xl font-bold tracking-wider uppercase animated-heading" aria-label={`${t('people_plural_capitalized')} DATABASE`}>
                <SplitText>{`${t('people_plural_capitalized')} DATABASE`}</SplitText>
            </h1>
            </div>
             <div className="flex items-center space-x-2">
                <button disabled title="Coming soon" className="flex items-center space-x-2 bg-white/20 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChartBarIcon />
                    <span>Quick Info</span>
                </button>
                <button disabled title="Coming soon" className="flex items-center space-x-2 bg-white/20 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <CogIcon />
                    <span>View Settings</span>
                </button>
            </div>
        </div>
        <div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivolve-dark-green/70">
              <SearchIcon className="text-current" />
            </span>
            <input
              type="search"
              placeholder={`Search by name, ID, property...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-ivolve-off-white text-ivolve-dark-green placeholder-ivolve-dark-green/70 focus:outline-none focus:ring-2 focus:ring-ivolve-blue"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-brand-dark-green text-white">
                    <tr>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider w-24 border-r border-white/20">ID</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider w-12 border-r border-white/20">Icon</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">First Name (legal)</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Surname</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Preferred Name</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Status</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Unit</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Property</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Service Type</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">RP</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Region</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Tenancy Start</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Move-in Date</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider border-r border-white/20">Tenancy End</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider">Move Out</th>
                    </tr>
                </thead>
                <tbody className="text-app-text-dark divide-y divide-gray-200">
                    {filteredPeople.map((person) => (
                        <tr 
                            key={person.id} 
                            onClick={() => selectPerson(person.id)}
                            className={`cursor-pointer transition-colors ${person.status === PersonStatus.Former ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'hover:bg-ivolve-blue/10'}`}
                        >
                            <td className="p-3 whitespace-nowrap text-center font-medium text-black">{person.id}</td>
                            <td className="p-3 text-center"><PersonStatusIcon person={person} /></td>
                            <td className="p-3 whitespace-nowrap text-center text-sm font-medium">{person.legalFirstName}</td>
                            <td className="p-3 whitespace-nowrap text-center text-sm font-medium">{person.surname}</td>
                            <td className="p-3 whitespace-nowrap text-center text-sm text-gray-600 italic">
                                {person.preferredFirstName !== person.legalFirstName ? person.preferredFirstName : ''}
                            </td>
                            <td className="p-3 text-center text-sm">
                                <span className={`inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md ${person.status === PersonStatus.Current ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                    {person.status}
                                </span>
                            </td>
                            <td className="p-3 text-center text-sm">{person.property?.units.find(u => u.id === person.unitId)?.name || 'N/A'}</td>
                            <td className="p-3 text-sm text-left">{person.property ? `${person.property.address.line1}, ${person.property.address.city}` : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">{person.property ? <StatusChip status={person.property.serviceType as ServiceType} styleType="default" /> : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">{person.property ? <RpTag name={person.property.tags.rp} styleType="outline" /> : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">
                                {person.property?.region ? (
                                    <span className={`inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md ${getRegionTagStyle(person.property.region)}`}>
                                        {person.property.region}
                                    </span>
                                ) : 'N/A'}
                            </td>
                            <td className="p-3 text-center text-sm">{person.tenancy?.startDate ? new Date(person.tenancy.startDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">{person.moveInDate ? new Date(person.moveInDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">{person.tenancy?.endDate ? new Date(person.tenancy.endDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                            <td className="p-3 text-center text-sm">{person.moveOutDate ? new Date(person.moveOutDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>

      <footer className="bg-app-header text-app-header-text p-3 flex justify-between items-center z-10 shadow-inner">
           <p className="text-sm font-bold">Showing {filteredPeople.length} of {people.length} {t('people_plural_lowercase')}</p>
            <Dropdown
                buttonContent={
                    <>
                        {drawerMode === 'right' && <PanelRightIcon />}
                        {drawerMode === 'bottom' && <PanelBottomIcon />}
                        {drawerMode === 'popup' && <ExternalLinkIcon />}
                        <span className="ml-2">Panel Position</span>
                    </>
                }
            >
                <PanelPositionSelector currentMode={drawerMode} onSelectMode={setDrawerMode} />
            </Dropdown>
        </footer>
    </div>
  );
};

export default PeopleView;