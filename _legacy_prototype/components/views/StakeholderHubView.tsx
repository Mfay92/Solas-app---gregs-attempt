import React, { useState, useMemo } from 'react';
import { Stakeholder, StakeholderType } from '../../types';
import { SearchIcon, StakeholderHubIcon } from '../Icons';
import StakeholderCard from '../StakeholderCard';
import ContractorsTableView from '../ContractorsTableView';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import SplitText from '../SplitText';

type StakeholderHubViewProps = {};

const TABS: { name: string, type: StakeholderType | 'All' }[] = [
    { name: 'All Stakeholders', type: 'All' },
    { name: 'Local Authorities', type: StakeholderType.LocalAuthority },
    { name: 'Registered Providers (RP)', type: StakeholderType.RegisteredProvider },
    { name: 'Contractors', type: StakeholderType.Contractor },
    { name: 'Developers', type: StakeholderType.Developer },
    { name: 'Landlords', type: StakeholderType.Landlord },
    { name: 'NHS Services', type: StakeholderType.NHSService },
    { name: 'Others', type: StakeholderType.Other },
];

const StakeholderHubView: React.FC<StakeholderHubViewProps> = () => {
    const { stakeholders } = useData();
    const { selectStakeholder } = useUI();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<StakeholderType | 'All'>('All');

    const filteredStakeholders = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return stakeholders
            .filter(s => activeTab === 'All' || s.type === activeTab)
            .filter(s => 
                searchQuery === '' ||
                s.name.toLowerCase().includes(lowercasedQuery) ||
                (s.subName && s.subName.toLowerCase().includes(lowercasedQuery)) ||
                (s.areaOfOperation && s.areaOfOperation.toLowerCase().includes(lowercasedQuery))
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [stakeholders, searchQuery, activeTab]);

    const renderContent = () => {
        if (activeTab === StakeholderType.Contractor) {
            return <ContractorsTableView contractors={filteredStakeholders} />;
        }
        if (filteredStakeholders.length === 0) {
            return <p className="text-center text-app-text-gray py-10">No stakeholders found for this category.</p>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStakeholders.map(stakeholder => (
                    <StakeholderCard 
                        key={stakeholder.id} 
                        stakeholder={stakeholder} 
                        onClick={() => selectStakeholder(stakeholder.id)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <StakeholderHubIcon />
                    <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="STAKEHOLDER HUB"><SplitText>STAKEHOLDER HUB</SplitText></h1>
                </div>
                <div className="mt-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="search"
                            placeholder="Search stakeholders by name or area..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                        />
                    </div>
                </div>
            </header>

            <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <nav className="-mb-px flex space-x-6 px-4 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.type)}
                            className={`${
                                activeTab === tab.type
                                ? 'border-ivolve-blue text-ivolve-dark-green'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <main className="flex-grow overflow-y-auto p-6">
                {renderContent()}
            </main>
        </div>
    );
};

export default StakeholderHubView;