import React, { useState, useMemo } from 'react';
import { DevelopmentIcon, UserCircleIcon, BuildingIcon, SearchIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';
import { GrowthOpportunity, DevelopmentStage, OpportunityType, StakeholderType } from '../../types';
import SplitText from '../SplitText';

const KANBAN_COLUMNS: DevelopmentStage[] = [
    DevelopmentStage.Sourcing,
    DevelopmentStage.Feasibility,
    DevelopmentStage.Approval,
    DevelopmentStage.Acquisition,
    DevelopmentStage.Development,
    DevelopmentStage.PreHandover,
    DevelopmentStage.Complete,
];

const stageColors: Record<DevelopmentStage, { bg: string, text: string, border: string }> = {
    [DevelopmentStage.Sourcing]: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-400' },
    [DevelopmentStage.Feasibility]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
    [DevelopmentStage.Approval]: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
    [DevelopmentStage.Acquisition]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
    [DevelopmentStage.Development]: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-400' },
    [DevelopmentStage.PreHandover]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
    [DevelopmentStage.Complete]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
};

const ProjectCard: React.FC<{ opportunity: GrowthOpportunity, laName: string, leadName: string }> = ({ opportunity, laName, leadName }) => {
    return (
        <div className="bg-white rounded-md shadow border border-gray-200 p-3 space-y-2 cursor-pointer hover:border-ivolve-blue transition-colors">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-ivolve-mid-green">{opportunity.clientGroup}</span>
                {opportunity.beds && <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{opportunity.beds} beds</span>}
            </div>
            <p className="font-bold text-sm text-solas-dark leading-tight">{opportunity.name}</p>
            <div className="text-xs text-solas-gray space-y-1 pt-1 border-t mt-1">
                <p className="flex items-center space-x-1.5"><BuildingIcon /> <span>{laName}</span></p>
                <p className="flex items-center space-x-1.5"><UserCircleIcon /> <span>{leadName}</span></p>
            </div>
        </div>
    );
};

const DevelopmentJourneyHubView: React.FC = () => {
    const { growthOpportunities, stakeholders, ivolveStaff } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const laMap = useMemo(() =>
        new Map(stakeholders.filter(s => s.type === StakeholderType.LocalAuthority || s.type === StakeholderType.NHSService).map(la => [la.id, la.name])),
        [stakeholders]
    );
    const staffMap = useMemo(() =>
        new Map(ivolveStaff.map(s => [s.id, s.name])),
        [ivolveStaff]
    );

    const filteredProjects = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        return growthOpportunities.filter(opp =>
            opp.opportunityType === OpportunityType.NewBuild &&
            (
                !lowerQuery ||
                opp.name.toLowerCase().includes(lowerQuery) ||
                (laMap.get(opp.laId) || '').toLowerCase().includes(lowerQuery) ||
                (staffMap.get(opp.bdLeadId) || '').toLowerCase().includes(lowerQuery)
            )
        );
    }, [growthOpportunities, searchQuery, laMap, staffMap]);

    const projectsByStage = useMemo(() => {
        return filteredProjects.reduce((acc, opportunity) => {
            const stage = opportunity.developmentStage;
            if (stage) {
                if (!acc[stage]) acc[stage] = [];
                acc[stage].push(opportunity);
            }
            return acc;
        }, {} as Record<DevelopmentStage, GrowthOpportunity[]>);
    }, [filteredProjects]);
    
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <header className="flex-shrink-0 text-app-header-text z-10">
                <div className="bg-app-header px-4 py-3 flex items-center space-x-4">
                    <DevelopmentIcon />
                    <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="GROWTH & DEVELOPMENT JOURNEY HUB"><SplitText>{`GROWTH & DEVELOPMENT JOURNEY HUB`}</SplitText></h1>
                </div>
                <div className="bg-brand-mid-green-light px-4 py-2">
                     <input
                        type="search"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                    />
                </div>
            </header>
            
            <main className="flex-grow p-4 overflow-x-auto">
                <div className="flex space-x-4 h-full">
                    {KANBAN_COLUMNS.map(stage => {
                        const projects = projectsByStage[stage] || [];
                        const stageColor = stageColors[stage];
                        return (
                            <div key={stage} className="w-80 bg-gray-100 rounded-lg shadow-sm flex flex-col flex-shrink-0">
                                <div className={`p-3 rounded-t-lg border-b-4 ${stageColor.border} ${stageColor.bg}`}>
                                    <h3 className={`font-bold text-sm ${stageColor.text}`}>{stage.replace(/^\d+\.\s/, '')} ({projects.length})</h3>
                                </div>
                                <div className="p-2 space-y-3 overflow-y-auto flex-grow">
                                    {projects.map(opp => (
                                        <ProjectCard
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
            </main>
        </div>
    );
};

export default DevelopmentJourneyHubView;