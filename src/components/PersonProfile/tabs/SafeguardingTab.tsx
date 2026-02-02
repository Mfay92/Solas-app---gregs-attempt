import React from 'react';
import { Shield, Plus, AlertCircle, Calendar, User } from 'lucide-react';
import { Person, SafeguardingCase, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';

interface SafeguardingTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Severity level badge with color coding
const SeverityBadge: React.FC<{ level: string }> = ({ level }) => {
    const getColor = () => {
        if (level === 'Level 3') return 'bg-red-100 text-red-700 border-red-300';
        if (level === 'Level 2') return 'bg-orange-100 text-orange-700 border-orange-300';
        if (level === 'Level 1') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getColor()}`}>
            {level}
        </span>
    );
};

// Status badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getColor = () => {
        switch (status) {
            case 'Open':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Investigation':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Monitoring':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Closed':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getColor()}`}>
            {status}
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

// Safeguarding case card
const SafeguardingCaseCard: React.FC<{ safeguardingCase: SafeguardingCase; borderColor?: string }> = ({ safeguardingCase, borderColor = 'border-gray-200' }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const latestIncident = safeguardingCase.incidents?.[safeguardingCase.incidents.length - 1];

    return (
        <div className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-ivolve-mid shadow-md"></div>

            {/* Card */}
            <div className={`bg-white rounded-lg border-2 ${borderColor} p-4 hover:shadow-lg transition-all mb-6`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={18} className="text-ivolve-mid" />
                            <span className="font-semibold text-gray-800">{safeguardingCase.caseReference}</span>
                            <SeverityBadge level={safeguardingCase.level} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <CategoryBadge category={safeguardingCase.category} />
                            <StatusBadge status={safeguardingCase.status} />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span className="text-xs">Reported:</span>
                        <span className="font-medium">{formatDate(safeguardingCase.reportedDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} />
                        <span className="text-xs">Assigned to:</span>
                        <span className="font-medium">{safeguardingCase.assignedTo}</span>
                    </div>

                    {latestIncident && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Latest Incident</p>
                            <p className="text-sm text-gray-700 mb-1">{latestIncident.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(latestIncident.date)}</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{safeguardingCase.description}</p>
                </div>
            </div>
        </div>
    );
};

const SafeguardingTab: React.FC<SafeguardingTabProps> = ({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }) => {
    // For now, mock empty state since person.cases?.safeguardingCases will be empty
    // In future, we'll fetch actual cases from a backend
    const cases: SafeguardingCase[] = [];

    return (
        <div>
            {/* Header with Add button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Shield size={24} className="text-ivolve-mid" />
                        Safeguarding Cases
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Critical legal requirement for supported housing
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-deep transition-colors shadow-md hover:shadow-lg">
                    <Plus size={18} />
                    <span className="font-medium">Add Safeguarding Case</span>
                </button>
            </div>

            {/* Cases or Empty State */}
            {cases.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Shield size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No safeguarding cases recorded</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Safeguarding cases are a critical legal requirement. When incidents occur, they will be tracked here with full timeline and documentation.
                    </p>
                    <button className="px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-deep transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2">
                        <Plus size={18} />
                        Add Safeguarding Case
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ivolve-mid via-ivolve-mid/50 to-transparent"></div>

                    {/* Cases list */}
                    <div className="space-y-0">
                        {cases.map((safeguardingCase) => (
                            <SafeguardingCaseCard
                                key={safeguardingCase.id}
                                safeguardingCase={safeguardingCase}
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
                        <p className="font-medium mb-1">About Safeguarding Cases</p>
                        <p className="text-blue-700">
                            Safeguarding cases must be recorded, investigated, and monitored according to legal requirements.
                            All incidents are categorized by severity level (1-3), with Level 3 being the most serious.
                            Cases remain open until fully resolved and documented.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafeguardingTab;
