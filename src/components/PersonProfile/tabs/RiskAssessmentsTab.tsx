import { Activity, Plus, FileText, Calendar, AlertCircle, User, Shield } from 'lucide-react';
import { Person, RiskAssessment, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';

interface RiskAssessmentsTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

export default function RiskAssessmentsTab({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }: RiskAssessmentsTabProps) {
    // Mock data - will be replaced with real data later
    const riskAssessments: RiskAssessment[] = [];

    // Find current (most recent) assessment
    const currentAssessment = riskAssessments.find(assessment => assessment.status === 'Current');
    const overdueAssessments = riskAssessments.filter(assessment => assessment.status === 'Overdue');
    const historicalAssessments = riskAssessments.filter(assessment => assessment.status === 'Completed');

    // Check if assessment is overdue
    const isOverdue = (assessment: RiskAssessment) => {
        if (!assessment.nextDueDate) return false;
        return new Date(assessment.nextDueDate) < new Date();
    };

    // Format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Assessment type colors
    const getAssessmentTypeColor = (type: string) => {
        switch (type) {
            case 'General':
                return 'bg-blue-100 text-blue-700';
            case 'Fire':
                return 'bg-red-100 text-red-700';
            case 'Moving & Handling':
                return 'bg-purple-100 text-purple-700';
            case 'Safeguarding':
                return 'bg-orange-100 text-orange-700';
            case 'Health & Safety':
                return 'bg-green-100 text-green-700';
            case 'Substance Use':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Risk level colors
    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'High':
                return 'bg-red-500 text-white';
            case 'Medium':
                return 'bg-orange-500 text-white';
            case 'Low':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // Status colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Current':
                return 'bg-green-100 text-green-700';
            case 'Overdue':
                return 'bg-red-100 text-red-700';
            case 'Completed':
                return 'bg-gray-100 text-gray-500';
            case 'Draft':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    const renderAssessmentCard = (assessment: RiskAssessment) => {
        const overdueCheck = isOverdue(assessment);

        return (
            <div key={assessment.id} className={`bg-white border-2 ${borderColor} rounded-lg p-6 hover:shadow-md transition-shadow`}>
                {/* Overdue Alert */}
                {assessment.status === 'Overdue' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-red-600" size={20} />
                            <p className="text-red-800 font-semibold">
                                This risk assessment is overdue for review!
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAssessmentTypeColor(assessment.assessmentType)}`}>
                                {assessment.assessmentType}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(assessment.status)}`}>
                                {assessment.status}
                            </span>
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getRiskLevelColor(assessment.overallRiskLevel)} flex items-center gap-1`}>
                                <Shield size={14} />
                                {assessment.overallRiskLevel} Risk
                            </span>
                        </div>
                    </div>
                    <button
                        className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2"
                        onClick={() => window.open(assessment.documentUrl, '_blank')}
                        disabled={!assessment.documentUrl}
                    >
                        <FileText size={16} />
                        <span>View Assessment</span>
                    </button>
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Date Created
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(assessment.dateCreated)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Review Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(assessment.reviewDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Next Due Date
                        </p>
                        <p className={`text-sm font-semibold ${overdueCheck ? 'text-red-600' : 'text-gray-800'}`}>
                            {formatDate(assessment.nextDueDate)}
                            {overdueCheck && <span className="ml-2 text-xs">(Overdue)</span>}
                        </p>
                    </div>
                </div>

                {/* Assessed By */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <User size={12} />
                        Assessed By
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{assessment.assessedBy}</p>
                </div>

                {/* Risk Categories */}
                {assessment.risks && assessment.risks.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Risk Categories Identified</p>
                        <div className="flex flex-wrap gap-2">
                            {assessment.risks.map((risk) => (
                                <span
                                    key={risk.id}
                                    className={`px-2.5 py-1 rounded text-xs font-semibold ${getRiskLevelColor(risk.riskLevel)}`}
                                >
                                    {risk.category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mitigation Actions Count */}
                {assessment.mitigationActions && assessment.mitigationActions.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Mitigation Actions</p>
                        <div className="flex items-center gap-2">
                            <div className="bg-ivolve-mid/10 text-ivolve-mid px-3 py-1.5 rounded-lg text-sm font-semibold">
                                {assessment.mitigationActions.length} action{assessment.mitigationActions.length > 1 ? 's' : ''} in place
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity size={28} className="text-ivolve-mid" />
                        Risk Assessments
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Legal requirement - track and manage risk assessments for individual safety
                    </p>
                </div>
                <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 shadow-sm">
                    <Plus size={20} />
                    <span>Add Risk Assessment</span>
                </button>
            </div>

            {/* Overdue Assessments Warning */}
            {overdueAssessments.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <div>
                            <h3 className="text-red-800 font-bold text-lg">
                                {overdueAssessments.length} Risk Assessment{overdueAssessments.length > 1 ? 's' : ''} Overdue
                            </h3>
                            <p className="text-red-700 text-sm">
                                These assessments require immediate review to maintain compliance and ensure safety
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Risk Assessment */}
            {currentAssessment && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className={`w-1 h-6 ${currentAssessment.overallRiskLevel === 'High' ? 'bg-red-500' : currentAssessment.overallRiskLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500'} rounded`}></div>
                        Current Risk Assessment
                    </h3>
                    {renderAssessmentCard(currentAssessment)}
                </div>
            )}

            {/* Historical Assessments */}
            {historicalAssessments.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gray-400 rounded"></div>
                        Historical Assessments ({historicalAssessments.length})
                    </h3>
                    <div className="space-y-4">
                        {historicalAssessments.map(assessment => renderAssessmentCard(assessment))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {riskAssessments.length === 0 && (
                <div className={`bg-white border-2 ${borderColor} border-dashed rounded-lg p-12 text-center`}>
                    <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Risk Assessments Yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Risk assessments are a legal requirement for supported housing. Add the first risk assessment to identify and manage risks to the person's safety and wellbeing.
                    </p>
                    <button className="px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 mx-auto shadow-sm">
                        <Plus size={20} />
                        <span>Add First Risk Assessment</span>
                    </button>
                </div>
            )}
        </div>
    );
}
