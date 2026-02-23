import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { HousePlus, Plus, TrendingUp, Users, FileCheck, Target, Search, X, Trophy } from 'lucide-react';
import {
    Opportunity,
    OpportunityStage,
    ACTIVE_STAGES,
    WON_STAGES,
    generateId
} from '../../types/opportunities';
import AddOpportunityModal from './AddOpportunityModal';
import OpportunityCard from './OpportunityCard';
import OpportunityDetailView from './OpportunityDetailView';
import { mockOpportunities } from '../../data/mockOpportunities';

const STORAGE_KEY = 'solas_opportunities';

export default function DevelopmentHub() {
    // State
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'active' | 'won' | 'lost'>('active');

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setOpportunities(parsed);
            } catch (error) {
                console.error('Failed to parse opportunities from localStorage:', error);
            }
        }
    }, []);

    // Save to localStorage whenever opportunities change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
    }, [opportunities]);

    // Calculate stats
    const stats = useMemo(() => {
        const activeOpportunities = opportunities.filter((o) => o.status === 'Active').length;
        const inNegotiation = opportunities.filter(
            (o) => o.status === 'Active' && o.currentStage === 'Negotiation'
        ).length;
        const wonThisQuarter = opportunities.filter((o) => {
            if (!o.wonDate) return false;
            const wonDate = new Date(o.wonDate);
            const now = new Date();
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            return wonDate >= quarterStart;
        }).length;

        const totalOpportunities = opportunities.length;
        const wonOpportunities = opportunities.filter((o) => o.status === 'Won').length;
        const conversionRate =
            totalOpportunities > 0 ? Math.round((wonOpportunities / totalOpportunities) * 100) : 0;

        return {
            activeOpportunities,
            inNegotiation,
            wonThisQuarter,
            conversionRate
        };
    }, [opportunities]);

    // Filter opportunities by search query
    const filteredOpportunities = useMemo(() => {
        if (!searchQuery.trim()) return opportunities;

        const query = searchQuery.toLowerCase();
        return opportunities.filter((opp) => {
            return (
                opp.name.toLowerCase().includes(query) ||
                opp.propertyAddress?.toLowerCase().includes(query) ||
                opp.propertyType.toLowerCase().includes(query) ||
                opp.opportunityOwner.toLowerCase().includes(query) ||
                opp.landlordRPName?.toLowerCase().includes(query)
            );
        });
    }, [opportunities, searchQuery]);

    // Get opportunities by view mode and stage
    const opportunitiesByStage = useMemo(() => {
        let relevantOpps = filteredOpportunities;

        if (viewMode === 'active') {
            relevantOpps = relevantOpps.filter((o) => o.status === 'Active');
        } else if (viewMode === 'won') {
            relevantOpps = relevantOpps.filter((o) => o.status === 'Won');
        } else if (viewMode === 'lost') {
            relevantOpps = relevantOpps.filter((o) => o.status === 'Lost');
        }

        // Group by stage
        const byStage: Record<OpportunityStage, Opportunity[]> = {} as any;

        const stages = viewMode === 'active' ? ACTIVE_STAGES : viewMode === 'won' ? WON_STAGES : (['Lost'] as OpportunityStage[]);

        stages.forEach((stage) => {
            byStage[stage] = relevantOpps.filter((o) => o.currentStage === stage);
        });

        return byStage;
    }, [filteredOpportunities, viewMode]);

    // Handlers
    const handleAddOpportunity = (opportunity: Opportunity) => {
        setOpportunities([...opportunities, opportunity]);
    };

    const handleUpdateOpportunity = (updatedOpportunity: Opportunity) => {
        setOpportunities(
            opportunities.map((o) => (o.id === updatedOpportunity.id ? updatedOpportunity : o))
        );

        // Update selected opportunity if it's the one being edited
        if (selectedOpportunity?.id === updatedOpportunity.id) {
            setSelectedOpportunity(updatedOpportunity);
        }
    };

    const handleDeleteOpportunity = (opportunityId: string) => {
        setOpportunities(opportunities.filter((o) => o.id !== opportunityId));
    };

    const handleLoadDemoData = () => {
        setOpportunities(mockOpportunities);
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Dropped outside valid droppable
        if (!destination) return;

        // Dropped in same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Find the opportunity
        const opportunity = opportunities.find((o) => o.id === draggableId);
        if (!opportunity) return;

        // Update the stage
        const newStage = destination.droppableId as OpportunityStage;
        const now = new Date().toISOString();

        const updatedOpportunity: Opportunity = {
            ...opportunity,
            currentStage: newStage,
            currentStageStartDate: now,
            updatedAt: now,
            stageHistory: [
                ...opportunity.stageHistory,
                {
                    id: generateId(),
                    fromStage: opportunity.currentStage,
                    toStage: newStage,
                    movedBy: opportunity.opportunityOwner, // In real app, use logged-in user
                    movedAt: now,
                    notes: 'Moved via drag and drop'
                }
            ]
        };

        setOpportunities(opportunities.map((o) => (o.id === draggableId ? updatedOpportunity : o)));
    };

    const stages = viewMode === 'active' ? ACTIVE_STAGES : viewMode === 'won' ? WON_STAGES : (['Lost'] as OpportunityStage[]);

    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-full shadow-md">
                <div className="px-6 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <HousePlus className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Development Hub</h1>
                            <p className="text-white/90">
                                Track new business opportunities from initial lead to signed contract
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {/* Active Opportunities */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-white/80 uppercase mb-1">
                                        Active Opportunities
                                    </p>
                                    <p className="text-2xl font-bold text-white">{stats.activeOpportunities}</p>
                                </div>
                                <TrendingUp className="text-white/70" size={28} />
                            </div>
                        </div>

                        {/* In Negotiation */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-white/80 uppercase mb-1">
                                        In Negotiation
                                    </p>
                                    <p className="text-2xl font-bold text-white">{stats.inNegotiation}</p>
                                </div>
                                <Users className="text-white/70" size={28} />
                            </div>
                        </div>

                        {/* Contracts Signed This Quarter */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-white/80 uppercase mb-1">
                                        Won This Quarter
                                    </p>
                                    <p className="text-2xl font-bold text-white">{stats.wonThisQuarter}</p>
                                </div>
                                <FileCheck className="text-white/70" size={28} />
                            </div>
                        </div>

                        {/* Conversion Rate */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-white/80 uppercase mb-1">
                                        Conversion Rate
                                    </p>
                                    <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
                                </div>
                                <Target className="text-white/70" size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        >
                            <Plus size={20} />
                            Add Opportunity
                        </button>
                        <button
                            onClick={() => setViewMode('won')}
                            className="px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold border border-white/30"
                        >
                            <Trophy size={20} />
                            View Won Deals
                        </button>
                        {opportunities.length === 0 && (
                            <button
                                onClick={handleLoadDemoData}
                                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2 font-semibold border border-white/30"
                            >
                                Load Demo Data
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* View Mode Tabs */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                viewMode === 'active'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Active Pipeline
                        </button>
                        <button
                            onClick={() => setViewMode('won')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                viewMode === 'won'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Won Deals
                        </button>
                        <button
                            onClick={() => setViewMode('lost')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                viewMode === 'lost'
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Lost Deals
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search opportunities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {stages.map((stage) => {
                            const stageOpportunities = opportunitiesByStage[stage] || [];
                            const stageTotal = stageOpportunities.reduce(
                                (sum, opp) => sum + (opp.annualContractValue || 0),
                                0
                            );

                            return (
                                <Droppable droppableId={stage} key={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 transition-all ${
                                                snapshot.isDraggingOver ? 'bg-amber-50 ring-2 ring-amber-300' : ''
                                            }`}
                                        >
                                            {/* Stage Header */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                                                        {stage}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                                                        {stageOpportunities.length}
                                                    </span>
                                                </div>
                                                {stageTotal > 0 && (
                                                    <p className="text-xs text-gray-600 font-medium">
                                                        Total Value:{' '}
                                                        {new Intl.NumberFormat('en-GB', {
                                                            style: 'currency',
                                                            currency: 'GBP',
                                                            maximumFractionDigits: 0
                                                        }).format(stageTotal)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Opportunity Cards */}
                                            <div className="space-y-3">
                                                {stageOpportunities.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-400 text-sm">
                                                        No opportunities in this stage
                                                    </div>
                                                ) : (
                                                    stageOpportunities.map((opportunity, index) => (
                                                        <Draggable
                                                            key={opportunity.id}
                                                            draggableId={opportunity.id}
                                                            index={index}
                                                            isDragDisabled={viewMode !== 'active'}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={snapshot.isDragging ? 'opacity-50' : ''}
                                                                >
                                                                    <OpportunityCard
                                                                        opportunity={opportunity}
                                                                        onClick={() => setSelectedOpportunity(opportunity)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                    </div>
                </DragDropContext>

                {/* Empty State */}
                {opportunities.length === 0 && (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="p-4 bg-amber-100 rounded-full">
                                    <HousePlus className="text-amber-600" size={48} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No opportunities yet</h2>
                            <p className="text-gray-500 mb-6">
                                Start tracking your new business pipeline by adding your first opportunity
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 flex items-center gap-2 font-semibold mx-auto"
                            >
                                <Plus size={20} />
                                Add First Opportunity
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Opportunity Modal */}
            <AddOpportunityModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddOpportunity}
            />

            {/* Opportunity Detail View */}
            {selectedOpportunity && (
                <OpportunityDetailView
                    opportunity={selectedOpportunity}
                    onClose={() => setSelectedOpportunity(null)}
                    onUpdate={handleUpdateOpportunity}
                    onDelete={handleDeleteOpportunity}
                />
            )}
        </div>
    );
}
