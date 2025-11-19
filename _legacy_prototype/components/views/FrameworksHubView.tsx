import React, { useState, useMemo } from 'react';
import { FileTextIcon, UserCircleIcon, BuildingIcon, ChartBarIcon, ClipboardIcon, NoSymbolIcon, SearchIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';
import { GrowthOpportunity, BDStage, OpportunityType, ServiceType, StakeholderType, DevelopmentStage } from '../../types';
import SplitText from '../SplitText';

const TABS = ['Overview', 'Bids & Tenders', 'Live Schemes', 'Not Progressed'];

const BIDS_KANBAN_COLUMNS: BDStage[] = [
    BDStage.Potential,
    BDStage.Feasibility,
    BDStage.BidInProgress,
    BDStage.Submitted,
    BDStage.Won,
    BDStage.Lost,
];

const stageColors: Record<BDStage, { bg: string, text: string, border: string }> = {
    [BDStage.Potential]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    [BDStage.Feasibility]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    [BDStage.BidInProgress]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    [BDStage.Submitted]: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    [BDStage.Won]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    [BDStage.Lost]: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    [BDStage.NotProgressed]: { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-300' },
};

const devStageColors: Record<DevelopmentStage, { bg: string, text: string }> = {
    [DevelopmentStage.Sourcing]: { bg: 'bg-gray-200', text: 'text-gray-800' },
    [DevelopmentStage.Feasibility]: { bg: 'bg-orange-100', text: 'text-orange-800' },
    [DevelopmentStage.Approval]: { bg: 'bg-purple-100', text: 'text-purple-800' },
    [DevelopmentStage.Acquisition]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [DevelopmentStage.Development]: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    [DevelopmentStage.PreHandover]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [DevelopmentStage.Complete]: { bg: 'bg-green-100', text: 'text-green-800' },
};


const OpportunityTypeTag: React.FC<{ type: OpportunityType }> = ({ type }) => {
    const styles: Record<OpportunityType, string> = {
        [OpportunityType.Framework]: 'bg-indigo-100 text-indigo-800',
        [OpportunityType.Tender]: 'bg-cyan-100 text-cyan-800',
        [OpportunityType.NewBuild]: 'bg-lime-100 text-lime-800',
        [OpportunityType.SpotPurchase]: 'bg-pink-100 text-pink-800',
        [OpportunityType.Other]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[type]}`}>{type}</span>;
};

const GrowthOpportunityCard: React.FC<{ opportunity: GrowthOpportunity, laName: string, leadName: string }> = ({ opportunity, laName, leadName }) => {
    return (
        <div className="bg-white rounded-md shadow border border-gray-200 p-3 space-y-2 cursor-pointer hover:border-ivolve-blue transition-colors">
            <div className="flex justify-between items-start">
                <OpportunityTypeTag type={opportunity.opportunityType} />
                {opportunity.beds && <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{opportunity.beds} beds</span>}
            </div>
            <p className="font-bold text-sm text-solas-dark leading-tight">{opportunity.name}</p>
            <div className="text-xs text-solas-gray space-y-1 pt-1 border-t mt-1">
                <p className="flex items-center space-x-1.5"><BuildingIcon /> <span>{laName}</span></p>
                <p className="flex items-center space-x-1.5"><UserCircleIcon /> <span>{leadName}</span></p>
                 {opportunity.dueDate && (
                    <p className="text-xs font-semibold text-status-red pt-1">
                        Submission: {new Date(opportunity.dueDate).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
        <div className="bg-ivolve-blue/10 text-ivolve-blue p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-solas-dark">{value}</p>
            <p className="text-sm font-semibold text-solas-gray">{title}</p>
        </div>
    </div>
);


const FrameworksHubView: React.FC = () => {
    const { growthOpportunities, stakeholders, ivolveStaff } = useData();
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('All');

    const laMap = useMemo(() =>
        new Map(stakeholders.filter(s => s.type === StakeholderType.LocalAuthority || s.type === StakeholderType.NHSService).map(la => [la.id, la.name])),
        [stakeholders]
    );
    const staffMap = useMemo(() =>
        new Map(ivolveStaff.map(s => [s.id, s.name])),
        [ivolveStaff]
    );
    
    const uniqueRegions = useMemo(() => ['All', ...Array.from(new Set(growthOpportunities.map(o => o.region)))], [growthOpportunities]);
    const uniqueServiceTypes = useMemo(() => ['All', ...Object.values(ServiceType)], []);

    const renderOverview = () => {
        const activeAreasOfInterest = growthOpportunities.filter(o => o.status && [BDStage.Potential, BDStage.Feasibility].includes(o.status)).length;
        const viableSchemes = growthOpportunities.filter(o => o.status && [BDStage.Feasibility, BDStage.BidInProgress, BDStage.Submitted].includes(o.status)).length;
        const bids = growthOpportunities.filter(o => o.status && [BDStage.BidInProgress, BDStage.Submitted].includes(o.status)).length;
        const capcomApproved = growthOpportunities.filter(o => o.status === BDStage.Won).length;

        return (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Active Areas of Interest" value={activeAreasOfInterest} icon={<ChartBarIcon />} />
                    <KpiCard title="Viable Schemes" value={viableSchemes} icon={<ClipboardIcon />} />
                    <KpiCard title="Bids in Progress" value={bids} icon={<FileTextIcon />} />
                    <KpiCard title="CAPCOM Approved Schemes" value={capcomApproved} icon={<BuildingIcon />} />
                </div>
            </div>
        );
    };

    const renderBidsAndTenders = () => {
        const lowerQuery = searchQuery.toLowerCase();
        const opportunitiesForKanban = growthOpportunities.filter(opp =>
            opp.status && BIDS_KANBAN_COLUMNS.includes(opp.status) &&
            (
                !lowerQuery ||
                opp.name.toLowerCase().includes(lowerQuery) ||
                (laMap.get(opp.laId) || '').toLowerCase().includes(lowerQuery) ||
                (staffMap.get(opp.bdLeadId) || '').toLowerCase().includes(lowerQuery)
            )
        );

        const opportunitiesByStage = opportunitiesForKanban.reduce((acc, opportunity) => {
            if (opportunity.status) {
                if (!acc[opportunity.status]) acc[opportunity.status] = [];
                acc[opportunity.status].push(opportunity);
            }
            return acc;
        }, {} as Record<BDStage, GrowthOpportunity[]>);

        return (
             <div className="h-full flex flex-col">
                <div className="p-4 flex-shrink-0">
                     <input
                        type="search"
                        placeholder="Search bids & tenders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                </div>
                <div className="flex-grow p-4 pt-0 overflow-x-auto">
                    <div className="flex space-x-4 h-full">
                        {BIDS_KANBAN_COLUMNS.map(stage => {
                            const opportunities = opportunitiesByStage[stage] || [];
                            const stageColor = stageColors[stage];
                            return (
                                <div key={stage} className="w-80 bg-gray-100 rounded-lg shadow-sm flex flex-col flex-shrink-0">
                                    <div className={`p-3 rounded-t-lg border-b-4 ${stageColor.border} ${stageColor.bg}`}>
                                        <h3 className={`font-bold text-sm ${stageColor.text}`}>{stage.replace(/^\d+\.\s/, '')} ({opportunities.length})</h3>
                                    </div>
                                    <div className="p-2 space-y-3 overflow-y-auto flex-grow">
                                        {opportunities.map(opp => (
                                            <GrowthOpportunityCard
                                                key={opp.id}
                                                opportunity={opp}
                                                laName={laMap.get(opp.laId) || 'Unknown'}
                                                leadName={staffMap.get(opp.bdLeadId) || 'Unassigned'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderLiveSchemes = () => {
         const liveSchemesData = growthOpportunities
            .filter(o => o.status !== BDStage.NotProgressed)
            .filter(o => {
                if (regionFilter !== 'All' && o.region !== regionFilter) return false;
                if (serviceTypeFilter !== 'All' && o.serviceType !== serviceTypeFilter) return false;
                
                const lowerQuery = searchQuery.toLowerCase();
                if (lowerQuery && !(
                    o.name.toLowerCase().includes(lowerQuery) ||
                    (laMap.get(o.laId) || '').toLowerCase().includes(lowerQuery) ||
                    (staffMap.get(o.bdLeadId) || '').toLowerCase().includes(lowerQuery)
                )) return false;

                return true;
            });

        return (
            <div className="p-4">
                <div className="mb-4 p-4 bg-white rounded-lg border shadow-sm flex items-center space-x-4">
                     <div className="flex-grow">
                        <label htmlFor="search-live" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search-live"
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={`Search ${liveSchemesData.length} opportunities...`}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="region-filter" className="text-sm font-medium text-gray-700 mr-2">Region:</label>
                        <select id="region-filter" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="service-type-filter" className="text-sm font-medium text-gray-700 mr-2">Service Type:</label>
                        <select id="service-type-filter" value={serviceTypeFilter} onChange={e => setServiceTypeFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                           {uniqueServiceTypes.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-solas-dark text-white">
                            <tr>
                                {['Opportunity Name', 'Authority', 'BD Lead', 'Region', 'Beds', 'Stage'].map(header => (
                                     <th key={header} className="p-3 text-left text-sm font-semibold tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {liveSchemesData.map(opp => (
                               <tr key={opp.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="p-3 font-medium text-solas-dark">{opp.name}</td>
                                    <td className="p-3 text-sm text-solas-gray">{laMap.get(opp.laId) || 'N/A'}</td>
                                    <td className="p-3 text-sm text-solas-gray">{staffMap.get(opp.bdLeadId) || 'N/A'}</td>
                                    <td className="p-3 text-sm text-solas-gray">{opp.region}</td>
                                    <td className="p-3 text-sm text-solas-gray text-center">{opp.beds || 'N/A'}</td>
                                    <td className="p-3 text-sm">
                                        {opp.status ? (
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${stageColors[opp.status].bg} ${stageColors[opp.status].text}`}>
                                                {opp.status.replace(/^\d+\.\s/, '')}
                                            </span>
                                        ) : opp.developmentStage && devStageColors[opp.developmentStage] ? (
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${devStageColors[opp.developmentStage].bg} ${devStageColors[opp.developmentStage].text}`}>
                                                {opp.developmentStage.replace(/^\d+\.\s/, '')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderNotProgressed = () => {
        const lowerQuery = searchQuery.toLowerCase();
        const notProgressed = growthOpportunities.filter(o => 
            o.status && [BDStage.NotProgressed, BDStage.Lost].includes(o.status) &&
            (
                !lowerQuery ||
                o.name.toLowerCase().includes(lowerQuery) ||
                (laMap.get(o.laId) || '').toLowerCase().includes(lowerQuery) ||
                (staffMap.get(o.bdLeadId) || '').toLowerCase().includes(lowerQuery)
            )
        );
         return (
            <div className="p-4">
                 <div className="mb-4">
                    <input
                        type="search"
                        placeholder="Search archived schemes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300"
                    />
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-solas-dark text-white">
                            <tr>
                                {['Opportunity Name', 'Authority', 'BD Lead', 'Region', 'Outcome', 'Reason for Not Progressing'].map(header => (
                                    <th key={header} className="p-3 text-left text-sm font-semibold tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notProgressed.length > 0 ? notProgressed.map(opp => (
                                <tr key={opp.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium text-solas-dark">{opp.name}</td>
                                    <td className="p-3 text-sm text-solas-gray">{laMap.get(opp.laId) || 'N/A'}</td>
                                    <td className="p-3 text-sm text-solas-gray">{staffMap.get(opp.bdLeadId) || 'N/A'}</td>
                                    <td className="p-3 text-sm text-solas-gray">{opp.region}</td>
                                    <td className="p-3 text-sm">
                                        {opp.status && (
                                             <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${stageColors[opp.status].bg} ${stageColors[opp.status].text}`}>
                                                {opp.status.replace(/^\d+\.\s/, '')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-sm text-solas-gray">{opp.notes || ''}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">No schemes found in the archive.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    const handleTabChange = (tab: string) => {
        setSearchQuery('');
        setRegionFilter('All');
        setServiceTypeFilter('All');
        setActiveTab(tab);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Overview': return renderOverview();
            case 'Bids & Tenders': return renderBidsAndTenders();
            case 'Live Schemes': return renderLiveSchemes();
            case 'Not Progressed': return renderNotProgressed();
            default: return null;
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <header className="flex-shrink-0 bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <FileTextIcon />
                    <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="GROWTH HUB"><SplitText>GROWTH HUB</SplitText></h1>
                </div>
            </header>

            <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`${activeTab === tab ? 'border-ivolve-blue text-ivolve-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <main className="flex-grow overflow-y-auto">
                {renderActiveTab()}
            </main>
        </div>
    );
};

export default FrameworksHubView;