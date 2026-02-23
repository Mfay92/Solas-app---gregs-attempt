import { Building, User, Clock, ExternalLink, AlertCircle, Briefcase } from 'lucide-react';
import {
    Opportunity,
    getDaysInStage,
    getStageUrgency,
    getPropertyTypeColor,
    getOpportunityTypeColor,
    formatCurrency
} from '../../types/opportunities';

interface OpportunityCardProps {
    opportunity: Opportunity;
    onClick: () => void;
}

export default function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
    const daysInStage = getDaysInStage(opportunity.currentStageStartDate);
    const urgency = getStageUrgency(daysInStage);
    const propertyTypeColors = getPropertyTypeColor(opportunity.propertyType);
    const opportunityTypeColors = getOpportunityTypeColor(opportunity.opportunityType);

    // Urgency border color
    const urgencyBorderColor = {
        green: 'border-l-green-500',
        amber: 'border-l-amber-500',
        red: 'border-l-red-500'
    }[urgency];

    // Urgency badge color
    const urgencyBadgeColor = {
        green: 'bg-green-100 text-green-700 border-green-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        red: 'bg-red-100 text-red-700 border-red-300'
    }[urgency];

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg border-l-4 ${urgencyBorderColor} border-t border-r border-b border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 group`}
        >
            {/* Header: Name & Value */}
            <div className="mb-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {opportunity.name}
                </h4>
                {opportunity.annualContractValue && (
                    <p className="text-lg font-bold text-amber-600">
                        {formatCurrency(opportunity.annualContractValue)}/yr
                    </p>
                )}
            </div>

            {/* Badges */}
            <div className="mb-3 flex flex-wrap gap-2">
                {/* Opportunity Type Badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${opportunityTypeColors.bg} ${opportunityTypeColors.text} ${opportunityTypeColors.border}`}>
                    <Briefcase size={12} />
                    {opportunity.opportunityType}
                </span>

                {/* Property Type Badge */}
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${propertyTypeColors.bg} ${propertyTypeColors.text} ${propertyTypeColors.border}`}>
                    {opportunity.propertyType}
                </span>
            </div>

            {/* Property Details */}
            <div className="space-y-2 mb-3 text-xs text-gray-600">
                {/* Address */}
                {opportunity.propertyAddress && (
                    <div className="flex items-start gap-1.5">
                        <Building size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{opportunity.propertyAddress}</span>
                    </div>
                )}

                {/* Units */}
                {opportunity.numberOfUnits && (
                    <div className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        <span>{opportunity.numberOfUnits} units</span>
                    </div>
                )}
            </div>

            {/* Owner */}
            <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                        {opportunity.opportunityOwner.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{opportunity.opportunityOwner}</span>
                </div>
            </div>

            {/* Footer: Days in stage */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{daysInStage} days in stage</span>
                </div>
                {urgency !== 'green' && (
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${urgencyBadgeColor}`}>
                        {urgency === 'red' ? (
                            <div className="flex items-center gap-1">
                                <AlertCircle size={12} />
                                <span>At Risk</span>
                            </div>
                        ) : (
                            <span>Stalled</span>
                        )}
                    </div>
                )}
            </div>

            {/* External Link Indicator */}
            {opportunity.propertyListingURL && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <a
                        href={opportunity.propertyListingURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 hover:underline"
                    >
                        <ExternalLink size={12} />
                        View Listing
                    </a>
                </div>
            )}
        </div>
    );
}
