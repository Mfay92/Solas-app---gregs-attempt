import { Referral } from '../../../types';
import { ReferralTabId } from '../ReferralHeroBanner';
import { User, Calendar, Building2, Heart, PoundSterling, FileText, Clock, CheckCircle } from 'lucide-react';

interface OverviewTabProps {
    referral: Referral;
    onJumpToTab: (tab: ReferralTabId) => void;
}

export default function OverviewTab({ referral, onJumpToTab }: OverviewTabProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Get service type specific styling (matching Hero banner)
    const getServiceTheme = (serviceType: string) => {
        switch (serviceType) {
            case 'Residential Care':
                return {
                    border: 'border-ivolve-blue',
                    text: 'text-ivolve-blue',
                    bg: 'bg-ivolve-blue'
                };
            case 'Supported Living':
                return {
                    border: 'border-green-500',
                    text: 'text-green-600',
                    bg: 'bg-green-500'
                };
            case 'Nursing Care':
                return {
                    border: 'border-rose-500',
                    text: 'text-rose-600',
                    bg: 'bg-rose-500'
                };
            default:
                return {
                    border: 'border-gray-300',
                    text: 'text-gray-500',
                    bg: 'bg-gray-500'
                };
        }
    };

    const theme = getServiceTheme(referral.serviceType);

    // Status timeline - show progress through workflow
    const statusSteps = [
        { key: 'New Referral', label: 'Referral Received', completed: true },
        { key: 'Under Assessment', label: 'Assessment', completed: referral.status !== 'New Referral' },
        { key: 'Funding Approved', label: 'Funding Approved', completed: referral.fundingApproved },
        { key: 'Ready to Move In', label: 'Ready for Move In', completed: referral.status === 'Ready to Move In' || referral.status === 'Moved In' },
        { key: 'Moved In', label: 'Moved In', completed: referral.status === 'Moved In' }
    ];

    const currentStepIndex = statusSteps.findIndex((step) => step.key === referral.status);

    return (
        <div className="space-y-6">
            {/* Status Timeline */}
            <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className={theme.text} size={20} />
                    Referral Progress
                </h2>
                <div className="relative">
                    {/* Progress bar background */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ left: '1rem', right: '1rem' }} />
                    {/* Progress bar fill */}
                    <div
                        className={`absolute top-5 left-0 h-1 rounded-full transition-all duration-500 ${theme.bg}`}
                        style={{
                            left: '1rem',
                            width: `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 2rem)`
                        }}
                    />
                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {statusSteps.map((step, index) => (
                            <div key={step.key} className="flex flex-col items-center" style={{ flex: 1 }}>
                                {/* Circle */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.completed
                                        ? `${theme.bg} ${theme.border} text-white`
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {step.completed ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                                </div>
                                {/* Label */}
                                <div className={`mt-2 text-xs font-medium text-center ${step.completed ? 'text-gray-800' : 'text-gray-400'
                                    }`}>
                                    {step.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Personal Info Card */}
                <div
                    onClick={() => onJumpToTab('personal-details')}
                    className={`bg-white rounded-xl shadow-sm border ${theme.border} p-5 hover:shadow-md transition-shadow cursor-pointer`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase">Personal Details</h3>
                        <User className={theme.text} size={20} />
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-gray-500">Name:</span>
                            <span className="ml-2 font-medium text-gray-800">
                                {referral.personal.firstName} {referral.personal.lastName}
                            </span>
                        </div>
                        {referral.personal.age && (
                            <div>
                                <span className="text-gray-500">Age:</span>
                                <span className="ml-2 font-medium text-gray-800">{referral.personal.age} years</span>
                            </div>
                        )}
                        {referral.personal.dateOfBirth && (
                            <div>
                                <span className="text-gray-500">DOB:</span>
                                <span className="ml-2 font-medium text-gray-800">{formatDate(referral.personal.dateOfBirth)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assessment Card */}
                <div
                    onClick={() => onJumpToTab('assessment')}
                    className={`bg-white rounded-xl shadow-sm border ${theme.border} p-5 hover:shadow-md transition-shadow cursor-pointer`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase">Assessment</h3>
                        <Heart className={theme.text} size={20} />
                    </div>
                    <div className="space-y-2 text-sm">
                        {referral.supportLevel && (
                            <div>
                                <span className="text-gray-500">Support Level:</span>
                                <span className="ml-2 font-medium text-gray-800">{referral.supportLevel}</span>
                            </div>
                        )}
                        {referral.assessmentDate ? (
                            <div>
                                <span className="text-gray-500">Assessment Date:</span>
                                <span className="ml-2 font-medium text-gray-800">{formatDate(referral.assessmentDate)}</span>
                            </div>
                        ) : (
                            <div className="text-amber-600 font-medium">Assessment pending</div>
                        )}
                        {referral.keyWorker && (
                            <div>
                                <span className="text-gray-500">Key Worker:</span>
                                <span className="ml-2 font-medium text-gray-800">{referral.keyWorker}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Funding Card */}
                <div
                    onClick={() => onJumpToTab('funding')}
                    className={`bg-white rounded-xl shadow-sm border ${theme.border} p-5 hover:shadow-md transition-shadow cursor-pointer`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase">Funding</h3>
                        <PoundSterling className={theme.text} size={20} />
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-gray-500">Status:</span>
                            <span className={`ml-2 font-semibold ${referral.fundingApproved ? 'text-green-600' : 'text-amber-600'}`}>
                                {referral.fundingApproved ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                        {referral.fundingSource && (
                            <div>
                                <span className="text-gray-500">Source:</span>
                                <span className="ml-2 font-medium text-gray-800">{referral.fundingSource}</span>
                            </div>
                        )}
                        {referral.weeklyBudget && (
                            <div>
                                <span className="text-gray-500">Weekly Budget:</span>
                                <span className="ml-2 font-medium text-gray-800">£{referral.weeklyBudget.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Linked Property (if assigned) */}
            {referral.linkedProperty && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 className="text-ivolve-mid" size={20} />
                        Linked Property
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-500">Address:</span>
                            <div className="font-medium text-gray-800">{referral.linkedProperty.propertyAddress}</div>
                        </div>
                        {referral.linkedProperty.room && (
                            <div>
                                <span className="text-sm text-gray-500">Room:</span>
                                <span className="ml-2 font-medium text-gray-800">{referral.linkedProperty.room}</span>
                            </div>
                        )}
                        {referral.proposedMoveInDate && (
                            <div>
                                <span className="text-sm text-gray-500">Proposed Move In Date:</span>
                                <span className="ml-2 font-medium text-gray-800">{formatDate(referral.proposedMoveInDate)}</span>
                            </div>
                        )}
                        {referral.confirmedMoveInDate && (
                            <div>
                                <span className="text-sm text-gray-500">Confirmed Move In Date:</span>
                                <span className="ml-2 font-semibold text-green-600">{formatDate(referral.confirmedMoveInDate)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Key Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-ivolve-mid" size={20} />
                    Key Dates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-500">Referral Received:</span>
                        <div className="font-medium text-gray-800">{formatDate(referral.referralDate)}</div>
                    </div>
                    {referral.assessmentDate && (
                        <div>
                            <span className="text-sm text-gray-500">Assessment Date:</span>
                            <div className="font-medium text-gray-800">{formatDate(referral.assessmentDate)}</div>
                        </div>
                    )}
                    {referral.proposedMoveInDate && (
                        <div>
                            <span className="text-sm text-gray-500">Proposed Move In:</span>
                            <div className="font-medium text-gray-800">{formatDate(referral.proposedMoveInDate)}</div>
                        </div>
                    )}
                    {referral.confirmedMoveInDate && (
                        <div>
                            <span className="text-sm text-gray-500">Confirmed Move In:</span>
                            <div className="font-semibold text-green-600">{formatDate(referral.confirmedMoveInDate)}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Assessment Notes (if available) */}
            {referral.assessmentNotes && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="text-ivolve-mid" size={20} />
                        Assessment Notes
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {referral.assessmentNotes}
                    </p>
                </div>
            )}
        </div>
    );
}
