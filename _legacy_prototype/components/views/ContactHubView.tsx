import React, { useState, useMemo } from 'react';
import { IvolveStaff, Stakeholder, StakeholderType, Contact, ContactTier } from '../../types';
import { ContactHubIcon, HierarchyIcon, SearchIcon } from '../Icons';
import ContactCard from '../ContactCard';
import OrgChartModal from '../OrgChartModal';
import StakeholderContactCard from '../StakeholderContactCard';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import SplitText from '../SplitText';

type ContactHubViewProps = {
  currentUserId: string;
};

const TABS = [
    'ivolve Care & Support',
    'Registered Providers',
    'Local Authorities',
];

const TIER_ORDER: ContactTier[] = [
    ContactTier.General,
    ContactTier.Executive,
    ContactTier.SeniorManagement,
    ContactTier.Operations,
    ContactTier.Finance,
    ContactTier.Development,
    ContactTier.Property,
];

const ContactHubView: React.FC<ContactHubViewProps> = ({ currentUserId }) => {
    const { ivolveStaff: staff, stakeholders, pinnedContactIds, handleTogglePin } = useData();
    const { selectIvolveContact, selectStakeholderContact } = useUI();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [isOrgChartVisible, setIsOrgChartVisible] = useState(false);
    
    // ivolve filters
    const [teamFilter, setTeamFilter] = useState('All Teams');
    const [tagFilter, setTagFilter] = useState('All Tags');

    // RP filter
    const [selectedRpId, setSelectedRpId] = useState<string | 'All'>('All');

    const { uniqueTeams, uniqueTags, registeredProviders } = useMemo(() => {
        const teams = new Set(staff.map(s => s.team));
        const tags = new Set(staff.flatMap(s => s.tags));
        const rps = stakeholders.filter(s => s.type === StakeholderType.RegisteredProvider);
        return {
            uniqueTeams: ['All Teams', ...Array.from(teams).sort()],
            uniqueTags: ['All Tags', ...Array.from(tags).sort()],
            registeredProviders: rps,
        };
    }, [staff, stakeholders]);

    const allStakeholderContacts = useMemo(() => 
        stakeholders.flatMap(s => s.contacts.map(c => ({ ...c, stakeholder: s })))
    , [stakeholders]);

    const filteredData = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        
        // Global search logic
        if (lowercasedQuery) {
            const searchedStaff = staff.filter(s => 
                s.name.toLowerCase().includes(lowercasedQuery) ||
                s.role.toLowerCase().includes(lowercasedQuery) ||
                s.team.toLowerCase().includes(lowercasedQuery)
            );
            const searchedStakeholders = allStakeholderContacts.filter(c =>
                c.name.toLowerCase().includes(lowercasedQuery) ||
                c.role.toLowerCase().includes(lowercasedQuery) ||
                c.stakeholder.name.toLowerCase().includes(lowercasedQuery)
            );
            return {
                ivolve: searchedStaff,
                rp: searchedStakeholders.filter(c => c.stakeholder.type === StakeholderType.RegisteredProvider),
                la: searchedStakeholders.filter(c => c.stakeholder.type === StakeholderType.LocalAuthority),
            };
        }

        // Tab-specific filtering
        if (activeTab === 'ivolve Care & Support') {
            const filteredStaff = staff.filter(s => {
                const matchesTeam = teamFilter === 'All Teams' || s.team === teamFilter;
                const matchesTag = tagFilter === 'All Tags' || s.tags.includes(tagFilter);
                return matchesTeam && matchesTag;
            });
            return { ivolve: [...filteredStaff].sort((a, b) => b.relevance - a.relevance) };
        }
        
        const stakeholderTypeMap: Record<string, StakeholderType> = {
            'Registered Providers': StakeholderType.RegisteredProvider,
            'Local Authorities': StakeholderType.LocalAuthority,
        };
        const type = stakeholderTypeMap[activeTab];
        if (!type) return {};

        let relevantStakeholderContacts = allStakeholderContacts.filter(s => s.stakeholder.type === type);

        if (type === StakeholderType.RegisteredProvider && selectedRpId !== 'All') {
            relevantStakeholderContacts = relevantStakeholderContacts.filter(s => s.stakeholder.id === selectedRpId);
        }

        const groupedByTier = relevantStakeholderContacts.reduce((acc, contact) => {
            const tier = contact.tier || ContactTier.General;
            if (!acc[tier]) acc[tier] = [];
            acc[tier].push(contact);
            return acc;
        }, {} as Record<ContactTier, (Contact & { stakeholder: Stakeholder })[]>);

        return { groupedStakeholders: groupedByTier };

    }, [staff, allStakeholderContacts, searchQuery, activeTab, teamFilter, tagFilter, selectedRpId]);

    const renderContent = () => {
       if (searchQuery) { // Global search results view
            const { ivolve = [], rp = [], la = [] } = filteredData;
            const hasResults = ivolve.length > 0 || rp.length > 0 || la.length > 0;
            if (!hasResults) {
                return <p className="text-center text-app-text-gray py-10">No contacts found for "{searchQuery}".</p>;
            }
            return (
                <div className="space-y-8">
                    {ivolve.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-solas-dark pb-2 mb-4 border-b-2 border-gray-200">ivolve Care & Support</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {ivolve.map(person => (
                                    <ContactCard key={person.id} person={person} onClick={() => selectIvolveContact(person.id)} isPinned={pinnedContactIds.has(person.id)} onTogglePin={person.id !== currentUserId ? () => handleTogglePin(person.id) : undefined}/>
                                ))}
                            </div>
                        </div>
                    )}
                     {rp.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-solas-dark pb-2 mb-4 border-b-2 border-gray-200">Registered Providers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {rp.map(contact => (
                                    <StakeholderContactCard key={contact.id} contact={contact} stakeholder={contact.stakeholder} onClick={() => selectStakeholderContact(contact.stakeholder.id, contact.id)} isPinned={pinnedContactIds.has(contact.id)} onTogglePin={() => handleTogglePin(contact.id)}/>
                                ))}
                            </div>
                        </div>
                    )}
                     {la.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-solas-dark pb-2 mb-4 border-b-2 border-gray-200">Local Authorities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {la.map(contact => (
                                    <StakeholderContactCard key={contact.id} contact={contact} stakeholder={contact.stakeholder} onClick={() => selectStakeholderContact(contact.stakeholder.id, contact.id)} isPinned={pinnedContactIds.has(contact.id)} onTogglePin={() => handleTogglePin(contact.id)}/>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
       }

        if (activeTab === 'ivolve Care & Support') {
            const staffList = filteredData.ivolve || [];
            if (staffList.length === 0) return <p className="text-center text-app-text-gray py-10">No contacts found for the selected filters.</p>;
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {staffList.map(person => (
                        <ContactCard key={person.id} person={person} onClick={() => selectIvolveContact(person.id)} isPinned={pinnedContactIds.has(person.id)} onTogglePin={person.id !== currentUserId ? () => handleTogglePin(person.id) : undefined} />
                    ))}
                </div>
            );
        }
        
        const groupedByTier = filteredData.groupedStakeholders || {};
        if (Object.keys(groupedByTier).length === 0) return <p className="text-center text-app-text-gray py-10">No contacts found.</p>;
        
        return (
             <div className="space-y-8">
                {TIER_ORDER.map(tier => {
                    if (!groupedByTier[tier]) return null;
                    return (
                        <div key={tier}>
                            <h2 className="text-xl font-bold text-solas-dark pb-2 mb-4 border-b-2 border-gray-200">{tier}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {groupedByTier[tier].map(contact => (
                                    <StakeholderContactCard
                                        key={contact.id}
                                        contact={contact}
                                        stakeholder={contact.stakeholder}
                                        onClick={() => selectStakeholderContact(contact.stakeholder.id, contact.id)}
                                        isPinned={pinnedContactIds.has(contact.id)}
                                        onTogglePin={() => handleTogglePin(contact.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <ContactHubIcon />
                        <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="CONTACT HUB"><SplitText>CONTACT HUB</SplitText></h1>
                    </div>
                    <button 
                        onClick={() => setIsOrgChartVisible(true)}
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        <HierarchyIcon />
                        <span>See Company Structure</span>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="search"
                            placeholder="Search all contacts by name, role, or organization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                        />
                    </div>
                </div>
            </header>

            {!searchQuery && (
                <>
                    <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                        <nav className="-mb-px flex space-x-6 px-4 overflow-x-auto" aria-label="Tabs">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setTeamFilter('All Teams');
                                        setTagFilter('All Tags');
                                        setSelectedRpId('All');
                                    }}
                                    className={`${
                                        activeTab === tab
                                        ? 'border-ivolve-blue text-ivolve-dark-green'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-shrink-0 bg-gray-100 p-2 border-b border-gray-200 flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Filter by:</label>
                        {activeTab === 'ivolve Care & Support' && (
                            <>
                                <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="p-1.5 border rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-ivolve-blue">
                                    {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="p-1.5 border rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-ivolve-blue">
                                    {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </>
                        )}
                        {activeTab === 'Registered Providers' && (
                            <select value={selectedRpId} onChange={e => setSelectedRpId(e.target.value)} className="p-1.5 border rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-ivolve-blue">
                                <option value="All">All Registered Providers</option>
                                {registeredProviders.map(rp => <option key={rp.id} value={rp.id}>{rp.name}</option>)}
                            </select>
                        )}
                    </div>
                </>
            )}

            <main className="flex-grow overflow-y-auto p-6 bg-gray-50">
                {renderContent()}
            </main>
            
            {isOrgChartVisible && (
                <OrgChartModal 
                    staff={staff}
                    currentUserId={currentUserId}
                    onClose={() => setIsOrgChartVisible(false)}
                />
            )}
        </div>
    );
};

export default ContactHubView;