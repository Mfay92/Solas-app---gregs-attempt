import { Check, Circle } from 'lucide-react';
import { Opportunity, OpportunityStage, OPPORTUNITY_STAGES } from '../../types/opportunities';

interface OpportunityTimelineProps {
    opportunity: Opportunity;
}

export default function OpportunityTimeline({ opportunity }: OpportunityTimelineProps) {
    const currentStageIndex = OPPORTUNITY_STAGES.indexOf(opportunity.currentStage);
    const isLost = opportunity.status === 'Lost';
    const isWon = opportunity.status === 'Won';

    // Get all stages except 'Lost' for the timeline
    const timelineStages = OPPORTUNITY_STAGES.filter(stage => stage !== 'Lost');

    // Determine which stages have been completed
    const isStageCompleted = (stageIndex: number): boolean => {
        if (isLost) return false; // Lost opportunities don't have completed stages
        return stageIndex < currentStageIndex;
    };

    const isCurrentStage = (stage: OpportunityStage): boolean => {
        return stage === opportunity.currentStage && !isLost;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Visual Timeline */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                    Pipeline Progress
                </h4>

                {/* Timeline Bar */}
                <div className="relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{
                            width: `${isLost ? 0 : (currentStageIndex / (timelineStages.length - 1)) * 100}%`
                        }}
                    />

                    {/* Stage markers */}
                    <div className="relative flex justify-between">
                        {timelineStages.map((stage, index) => {
                            const completed = isStageCompleted(index);
                            const current = isCurrentStage(stage);

                            return (
                                <div key={stage} className="flex flex-col items-center" style={{ flex: 1 }}>
                                    {/* Circle marker */}
                                    <div
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                            completed
                                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500'
                                                : current
                                                ? 'bg-white border-amber-500 shadow-lg ring-4 ring-amber-100'
                                                : 'bg-white border-gray-300'
                                        }`}
                                    >
                                        {completed ? (
                                            <Check size={20} className="text-white" />
                                        ) : (
                                            <Circle
                                                size={16}
                                                className={current ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                                            />
                                        )}
                                    </div>

                                    {/* Stage label */}
                                    <p
                                        className={`mt-2 text-xs text-center font-medium max-w-[80px] leading-tight ${
                                            completed || current ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                    >
                                        {stage}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Lost indicator */}
                {isLost && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-medium">
                            Opportunity Lost
                            {opportunity.lostReason && ` - ${opportunity.lostReason}`}
                        </p>
                        {opportunity.lostNotes && (
                            <p className="text-xs text-red-600 mt-1">{opportunity.lostNotes}</p>
                        )}
                    </div>
                )}

                {/* Won indicator */}
                {isWon && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">
                            Opportunity Won! 🎉
                        </p>
                        {opportunity.wonDate && (
                            <p className="text-xs text-green-600 mt-1">
                                Contract signed on {formatDate(opportunity.wonDate)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Stage History */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                    Stage History
                </h4>

                <div className="space-y-3">
                    {opportunity.stageHistory
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                            <div key={entry.id} className="flex gap-3">
                                {/* Timeline dot */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            index === 0
                                                ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                    {index < opportunity.stageHistory.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                                    )}
                                </div>

                                {/* Entry content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {entry.fromStage ? (
                                                    <>
                                                        Moved from <span className="text-amber-600">{entry.fromStage}</span>{' '}
                                                        to <span className="text-amber-600">{entry.toStage}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Opportunity created in <span className="text-amber-600">{entry.toStage}</span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                by {entry.movedBy}
                                            </p>
                                            {entry.notes && (
                                                <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                                                    {entry.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-gray-500 whitespace-nowrap ml-4">
                                            <div>{formatDate(entry.movedAt)}</div>
                                            <div className="text-gray-400">{formatTime(entry.movedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
