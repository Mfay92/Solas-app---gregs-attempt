import React from 'react';
import { AlertTriangle, Plus, AlertCircle, Calendar, FileText } from 'lucide-react';
import { Person, ASBCase, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';

interface ASBTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Risk level badge with color coding
const RiskLevelBadge: React.FC<{ level: string }> = ({ level }) => {
    const getColor = () => {
        switch (level) {
            case 'High':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'Medium':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'Low':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getColor()}`}>
            {level} Risk
        </span>
    );
};

// Stage badge
const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
    const getColor = () => {
        switch (stage) {
            case 'Communication':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Information Gathering':
                return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Warning 1':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Warning 2':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Warning 3':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Legal Action':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'Closed':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getColor()}`}>
            {stage}
        </span>
    );
};

// Category badge
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
            {category}
        </span>
    );
};

// Action level badge
const ActionLevelBadge: React.FC<{ level: string }> = ({ level }) => {
    return (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {level}
        </span>
    );
};

// ASB case card
const ASBCaseCard: React.FC<{ asbCase: ASBCase; borderColor?: string }> = ({ asbCase, borderColor = 'border-gray-200' }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const latestAction = asbCase.actions?.[asbCase.actions.length - 1];

    return (
        <div className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-amber-500 shadow-md"></div>

            {/* Card */}
            <div className={`bg-white rounded-lg border-2 ${borderColor} p-4 hover:shadow-lg transition-all mb-6`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} className="text-amber-600" />
                            <span className="font-semibold text-gray-800">{asbCase.caseReference}</span>
                            <RiskLevelBadge level={asbCase.riskLevel} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <CategoryBadge category={asbCase.category} />
                            <StageBadge stage={asbCase.stage} />
                            <ActionLevelBadge level={asbCase.actionLevel} />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span className="text-xs">Reported:</span>
                        <span className="font-medium">{formatDate(asbCase.reportedDate)}</span>
                    </div>

                    {asbCase.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <AlertCircle size={14} />
                            <span className="text-xs">Location:</span>
                            <span className="font-medium">{asbCase.location}</span>
                        </div>
                    )}

                    {latestAction && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Latest Action</p>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 mb-1 font-medium">{latestAction.action}</p>
                                    {latestAction.notes && (
                                        <p className="text-xs text-gray-600 mb-1">{latestAction.notes}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        {formatDate(latestAction.date)} • {latestAction.completedBy}
                                    </p>
                                </div>
                                <ActionLevelBadge level={latestAction.actionLevel} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{asbCase.description}</p>
                </div>

                {/* Actions count */}
                {asbCase.actions && asbCase.actions.length > 1 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <FileText size={12} />
                        <span>{asbCase.actions.length} actions recorded</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ASBTab: React.FC<ASBTabProps> = ({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }) => {
    // For now, mock empty state since person.cases?.asbCases will be empty
    // In future, we'll fetch actual cases from a backend
    const cases: ASBCase[] = [];

    return (
        <div>
            {/* Header with Add button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <AlertTriangle size={24} className="text-amber-600" />
                        Anti-Social Behaviour Cases
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Track and manage ASB incidents with escalating interventions
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg">
                    <Plus size={18} />
                    <span className="font-medium">Add ASB Case</span>
                </button>
            </div>

            {/* Cases or Empty State */}
            {cases.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No ASB cases recorded</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Anti-social behaviour cases are tracked here with full timeline of interventions from initial communication through to legal action if necessary.
                    </p>
                    <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2">
                        <Plus size={18} />
                        Add ASB Case
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-500/50 to-transparent"></div>

                    {/* Cases list */}
                    <div className="space-y-0">
                        {cases.map((asbCase) => (
                            <ASBCaseCard
                                key={asbCase.id}
                                asbCase={asbCase}
                                borderColor={borderColor}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Info footer */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">About ASB Cases</p>
                        <p className="text-blue-700">
                            ASB cases follow a staged intervention process: Communication → Information Gathering → Warning 1 → Warning 2 → Warning 3 → Legal Action.
                            Each case is risk-assessed (Low/Medium/High) and all actions are documented with dates and responsible staff members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ASBTab;
