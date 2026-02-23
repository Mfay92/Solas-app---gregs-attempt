import { Meeting, ActionItem } from '../../../types';
import {
    CheckSquare,
    Check,
    Clock,
    AlertTriangle,
    ChevronRight,
    ListTodo
} from 'lucide-react';

interface ActionWithMeeting extends ActionItem {
    meetingId: string;
    meetingTitle: string;
    meetingRef: string;
}

interface OutstandingActionsProps {
    meetings: Meeting[];
    currentUserId?: string; // To filter actions assigned to current user
    onSelectAction?: (action: ActionWithMeeting) => void;
    onToggleComplete?: (action: ActionWithMeeting) => void;
    className?: string;
}

export default function OutstandingActions({
    meetings,
    currentUserId: _currentUserId = 'current-user',
    onSelectAction,
    onToggleComplete,
    className = ''
}: OutstandingActionsProps) {
    // Collect all incomplete actions from all meetings
    const outstandingActions: ActionWithMeeting[] = meetings
        .flatMap(meeting =>
            (meeting.actionItems || [])
                .filter(action => action.status !== 'Completed')
                .map(action => ({
                    ...action,
                    meetingId: meeting.id,
                    meetingTitle: meeting.title,
                    meetingRef: meeting.meetingRef
                }))
        )
        .sort((a, b) => {
            // Sort by: overdue first, then by due date, then by creation date
            const aOverdue = a.dueDate && new Date(a.dueDate) < new Date();
            const bOverdue = b.dueDate && new Date(b.dueDate) < new Date();

            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;

            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    const isOverdue = (action: ActionItem) => {
        if (!action.dueDate) return false;
        return new Date(action.dueDate) < new Date();
    };

    const isDueSoon = (action: ActionItem) => {
        if (!action.dueDate) return false;
        const dueDate = new Date(action.dueDate);
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        return dueDate >= today && dueDate <= threeDaysFromNow;
    };

    const formatDueDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        }
        if (diffDays <= 7) {
            return `${diffDays} days`;
        }

        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <ListTodo size={14} />
                    <span className="text-xs font-bold">My Actions</span>
                </div>
                <div className="bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                    {outstandingActions.length}
                </div>
            </div>

            {/* Actions List */}
            <div className="flex-1 overflow-y-auto">
                {outstandingActions.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {outstandingActions.map((action) => {
                            const overdue = isOverdue(action);
                            const dueSoon = isDueSoon(action);

                            return (
                                <div
                                    key={action.id}
                                    className={`p-2 hover:bg-gray-50 transition-colors cursor-pointer group ${
                                        overdue ? 'bg-red-50/50' : dueSoon ? 'bg-amber-50/50' : ''
                                    }`}
                                    onClick={() => onSelectAction?.(action)}
                                >
                                    <div className="flex items-start gap-2">
                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleComplete?.(action);
                                            }}
                                            className={`
                                                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                                ${overdue
                                                    ? 'border-red-400 hover:bg-red-100 hover:border-red-500'
                                                    : dueSoon
                                                        ? 'border-amber-400 hover:bg-amber-100 hover:border-amber-500'
                                                        : 'border-gray-300 hover:bg-green-100 hover:border-green-500'
                                                }
                                            `}
                                        >
                                            <Check size={10} className="text-transparent group-hover:text-green-500" />
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 truncate group-hover:text-ivolve-mid transition-colors">
                                                {action.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] text-gray-500 truncate">
                                                    {action.meetingRef}
                                                </span>
                                                {action.dueDate && (
                                                    <span className={`
                                                        flex items-center gap-0.5 text-[9px] font-medium
                                                        ${overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-gray-500'}
                                                    `}>
                                                        {overdue ? (
                                                            <AlertTriangle size={8} />
                                                        ) : (
                                                            <Clock size={8} />
                                                        )}
                                                        {formatDueDate(action.dueDate)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight
                                            size={12}
                                            className="flex-shrink-0 text-gray-300 group-hover:text-ivolve-mid transition-colors"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <CheckSquare size={18} className="text-green-600" />
                        </div>
                        <p className="text-xs font-medium text-gray-800">All caught up!</p>
                        <p className="text-[10px] text-gray-500">No outstanding actions</p>
                    </div>
                )}
            </div>

            {/* Footer - Stats */}
            {outstandingActions.length > 0 && (
                <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-3">
                        {outstandingActions.filter(a => isOverdue(a)).length > 0 && (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                <AlertTriangle size={10} />
                                {outstandingActions.filter(a => isOverdue(a)).length} overdue
                            </span>
                        )}
                        {outstandingActions.filter(a => isDueSoon(a)).length > 0 && (
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <Clock size={10} />
                                {outstandingActions.filter(a => isDueSoon(a)).length} due soon
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
