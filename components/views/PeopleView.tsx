import React, { useState, useMemo } from 'react';
import { PersonStatus } from '../../types';
import { PeopleIcon, SearchIcon, PanelRightIcon, PanelBottomIcon, UserIcon } from '../Icons';
import { usePersona } from '../../contexts/PersonaContext';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import PanelPositionSelector from '../PanelPositionSelector';
import SplitText from '../SplitText';

const PeopleView: React.FC = () => {
    const { people, properties, ivolveStaff: staff } = useData();
    const { selectPerson, drawerMode, setDrawerMode } = useUI();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isPanelPositionSelectorOpen, setIsPanelPositionSelectorOpen] = useState(false);
    const { t } = usePersona();

    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s])), [staff]);

    const enhancedPeople = useMemo(() => {
        return people.map(person => ({
            ...person,
            name: `${person.preferredFirstName} ${person.surname}`,
            property: propertyMap.get(person.propertyId),
            keyWorker: staffMap.get(person.keyWorkerId),
        }));
    }, [people, propertyMap, staffMap]);

    const filteredPeople = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        if (!lowercasedQuery) return enhancedPeople;
        return enhancedPeople.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.property?.address.line1.toLowerCase().includes(lowercasedQuery) ||
            p.keyWorker?.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [enhancedPeople, searchQuery]);

  return (
    <div className="h-full flex flex-col">
       {isPanelPositionSelectorOpen && (
            <PanelPositionSelector
                isOpen={isPanelPositionSelectorOpen}
                onClose={() => setIsPanelPositionSelectorOpen(false)}
                currentMode={drawerMode}
                onSelectMode={(mode) => {
                    setDrawerMode(mode);
                    setIsPanelPositionSelectorOpen(false);
                }}
            />
        )}
      <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
        <div className="flex items-center space-x-4">
          <PeopleIcon />
          <h1 className="text-3xl font-bold tracking-wider uppercase animated-heading" aria-label={`${t('people_plural_capitalized')} DATABASE`}>
            {/* FIX: Pass a single string to the SplitText component by using a template literal to combine the parts. */}
            <SplitText>{`${t('people_plural_capitalized')} DATABASE`}</SplitText>
          </h1>
        </div>
        <div className="mt-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={`Search by name, property, or key worker...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-solas-dark text-white">
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Name</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Status</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Property</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Key Worker</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Move-in Date</th>
                    </tr>
                </thead>
                <tbody className="text-app-text-dark divide-y divide-gray-200">
                    {filteredPeople.map((person) => (
                        <tr 
                            key={person.id} 
                            onClick={() => selectPerson(person.id)}
                            className="hover:bg-ivolve-blue/10 cursor-pointer transition-colors"
                        >
                            <td className="p-3 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <UserIcon />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                        <div className="text-sm text-gray-500">ID: {person.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.status === PersonStatus.Current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {person.status}
                                </span>
                            </td>
                            <td className="p-3 text-sm text-gray-900">{person.property ? `${person.property.address.line1}, ${person.property.address.city}` : 'N/A'}</td>
                            <td className="p-3 text-sm text-gray-900">{person.keyWorker?.name || 'Unassigned'}</td>
                            <td className="p-3 text-sm text-gray-500">{new Date(person.moveInDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>

      <footer className="bg-app-header text-app-header-text p-3 flex justify-between items-center z-10 shadow-inner">
           <p className="text-sm font-bold">Showing {filteredPeople.length} of {people.length} {t('people_plural_lowercase')}</p>
            <button onClick={() => setIsPanelPositionSelectorOpen(true)} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors">
                {drawerMode === 'right' ? <PanelRightIcon /> : <PanelBottomIcon />}
                <span>Change Panel Position</span>
            </button>
        </footer>
    </div>
  );
};

export default PeopleView;