import React from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils';
import { TabId } from '../TabNavigation';

interface CollapsibleCardProps {
    title: React.ReactNode;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    jumpToTab?: TabId;
    onJumpToTab?: (tabId: TabId) => void;
    children: React.ReactNode;
    collapsedContent?: React.ReactNode;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
    title,
    icon,
    isExpanded,
    onToggle,
    jumpToTab,
    onJumpToTab,
    children,
    collapsedContent,
}) => {
    const handleJump = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (jumpToTab && onJumpToTab) {
            onJumpToTab(jumpToTab);
        }
    };

    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300",
                "hover:shadow-md"
            )}
        >
            {/* Green header */}
            <div
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer select-none transition-all duration-200",
                    isExpanded
                        ? "bg-gradient-to-r from-ivolve-dark to-ivolve-mid text-white"
                        : "bg-gradient-to-r from-ivolve-mid/10 to-ivolve-mid/5 hover:from-ivolve-mid/15 hover:to-ivolve-mid/10"
                )}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                        "flex-shrink-0 transition-colors",
                        isExpanded ? "text-white" : "text-ivolve-mid"
                    )}>
                        {icon}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h3 className={cn(
                            "font-semibold text-lg whitespace-nowrap transition-colors",
                            isExpanded ? "text-white" : "text-gray-800"
                        )}>
                            {title}
                        </h3>
                        {!isExpanded && collapsedContent && (
                            <div className="text-gray-600 flex-1 min-w-0">
                                {collapsedContent}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    {!isExpanded && jumpToTab && onJumpToTab && (
                        <button
                            onClick={handleJump}
                            className="hidden sm:flex items-center text-sm font-medium text-ivolve-mid hover:text-ivolve-dark transition-colors hover:underline"
                        >
                            View Full Details <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    )}
                    <div className={cn(
                        "transition-colors",
                        isExpanded ? "text-white/80" : "text-gray-400"
                    )}>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="overflow-hidden">
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
