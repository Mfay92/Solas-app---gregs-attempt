import { ClipboardList, Plus, FileText, Calendar, AlertCircle, User } from 'lucide-react';
import { Person, SupportPlan, ServiceType } from '../../../types';
import { PersonTabId } from '../../../types/tabs';

interface SupportPlansTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

export default function SupportPlansTab({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }: SupportPlansTabProps) {
    // Mock data - will be replaced with real data later
    const supportPlans: SupportPlan[] = [];

    // Find current (most recent) plan
    const currentPlan = supportPlans.find(plan => plan.status === 'Current');
    const overduePlans = supportPlans.filter(plan => plan.status === 'Overdue');
    const historicalPlans = supportPlans.filter(plan => plan.status === 'Completed');

    // Check if a plan is overdue
    const isOverdue = (plan: SupportPlan) => {
        if (!plan.nextDueDate) return false;
        return new Date(plan.nextDueDate) < new Date();
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

    // Plan type colors
    const getPlanTypeColor = (type: string) => {
        switch (type) {
            case 'Care Plan':
                return 'bg-blue-100 text-blue-700';
            case 'Support Plan':
                return 'bg-green-100 text-green-700';
            case 'Move-On Plan':
                return 'bg-purple-100 text-purple-700';
            case 'Rehabilitation Plan':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Status badge colors (custom for this tab)
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

    const renderPlanCard = (plan: SupportPlan) => {
        const overdueCheck = isOverdue(plan);

        return (
            <div key={plan.id} className={`bg-white border-2 ${borderColor} rounded-lg p-6 hover:shadow-md transition-shadow`}>
                {/* Overdue Alert */}
                {plan.status === 'Overdue' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-red-600" size={20} />
                            <p className="text-red-800 font-semibold">
                                This support plan is overdue for review!
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanTypeColor(plan.planType)}`}>
                                {plan.planType}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(plan.status)}`}>
                                {plan.status}
                            </span>
                        </div>
                    </div>
                    <button
                        className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2"
                        onClick={() => window.open(plan.documentUrl, '_blank')}
                        disabled={!plan.documentUrl}
                    >
                        <FileText size={16} />
                        <span>View Plan</span>
                    </button>
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Date Created
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(plan.dateCreated)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Review Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(plan.reviewDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Next Due Date
                        </p>
                        <p className={`text-sm font-semibold ${overdueCheck ? 'text-red-600' : 'text-gray-800'}`}>
                            {formatDate(plan.nextDueDate)}
                            {overdueCheck && <span className="ml-2 text-xs">(Overdue)</span>}
                        </p>
                    </div>
                </div>

                {/* Assigned To */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <User size={12} />
                        Assigned To (Key Worker)
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{plan.assignedTo}</p>
                </div>

                {/* Goals Summary */}
                {plan.goals && plan.goals.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Goals</p>
                        <ul className="space-y-1">
                            {plan.goals.slice(0, 3).map((goal, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-ivolve-mid mt-1">•</span>
                                    <span>{goal}</span>
                                </li>
                            ))}
                            {plan.goals.length > 3 && (
                                <li className="text-sm text-gray-500 italic">
                                    +{plan.goals.length - 3} more goals
                                </li>
                            )}
                        </ul>
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
                        <ClipboardList size={28} className="text-ivolve-mid" />
                        Support Plans
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Legal requirement for supported housing - track care and support plans
                    </p>
                </div>
                <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 shadow-sm">
                    <Plus size={20} />
                    <span>Add Support Plan</span>
                </button>
            </div>

            {/* Overdue Plans Warning */}
            {overduePlans.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <div>
                            <h3 className="text-red-800 font-bold text-lg">
                                {overduePlans.length} Support Plan{overduePlans.length > 1 ? 's' : ''} Overdue
                            </h3>
                            <p className="text-red-700 text-sm">
                                These plans require immediate review to maintain compliance
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Support Plan */}
            {currentPlan && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-green-500 rounded"></div>
                        Current Support Plan
                    </h3>
                    {renderPlanCard(currentPlan)}
                </div>
            )}

            {/* Historical Plans */}
            {historicalPlans.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gray-400 rounded"></div>
                        Historical Plans ({historicalPlans.length})
                    </h3>
                    <div className="space-y-4">
                        {historicalPlans.map(plan => renderPlanCard(plan))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {supportPlans.length === 0 && (
                <div className={`bg-white border-2 ${borderColor} border-dashed rounded-lg p-12 text-center`}>
                    <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Support Plans Yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Support plans are a legal requirement for supported housing. Add the first support plan to begin tracking care and support goals.
                    </p>
                    <button className="px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 mx-auto shadow-sm">
                        <Plus size={20} />
                        <span>Add First Support Plan</span>
                    </button>
                </div>
            )}
        </div>
    );
}
