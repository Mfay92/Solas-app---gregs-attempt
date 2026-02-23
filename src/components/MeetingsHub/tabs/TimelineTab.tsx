import { useState } from 'react';
import { Meeting, MeetingInstance, MeetingStatus } from '../../../types';
import {
    History,
    CheckCircle,
    XCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    Users,
    FileText,
    CheckSquare
} from 'lucide-react';

interface TimelineTabProps {
    meeting: Meeting;
}

export default function TimelineTab({ meeting }: TimelineTabProps) {
    const [expandedInstance, setExpandedInstance] = useState<string | null>(null);

    const getStatusIcon = (status: MeetingStatus) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'Cancelled':
                return <XCircle size={20} className="text-red-500" />;
            case 'Scheduled':
                return <Clock size={20} className="text-blue-500" />;
            default:
                return <Clock size={20} className="text-gray-400" />;
        }
    };

    const getStatusColor = (status: MeetingStatus) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sort instances by date (newest first)
    const sortedInstances = [...(meeting.instances || [])].sort(
        (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );

    // Calculate stats
    const totalInstances = sortedInstances.length;
    const completedInstances = sortedInstances.filter(i => i.status === 'Completed').length;
    const totalActions = sortedInstances.reduce((sum, i) => sum + (i.actionItems?.length || 0), 0);
    const completedActions = sortedInstances.reduce(
        (sum, i) => sum + (i.actionItems?.filter(a => a.status === 'Completed').length || 0),
        0
    );

    // Get attendance stats for an instance
    const getAttendanceStats = (instance: MeetingInstance) => {
        if (!instance.attendanceRecord) return null;
        const attended = instance.attendanceRecord.filter(r => r.attended).length;
        const total = instance.attendanceRecord.length;
        return { attended, total };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <History size={20} className="text-ivolve-mid" />
                    Meeting Timeline
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {meeting.recurrence} meeting &bull; {totalInstances} past instances
                </p>
            </div>

            {/* Summary Stats */}
            {totalInstances > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Meetings</p>
                        <p className="text-2xl font-bold text-gray-800">{totalInstances}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{completedInstances}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Actions</p>
                        <p className="text-2xl font-bold text-gray-800">{totalActions}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Actions Done</p>
                        <p className="text-2xl font-bold text-green-600">{completedActions}</p>
                    </div>
                </div>
            )}

            {/* Timeline */}
            {sortedInstances.length > 0 ? (
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />

                    {/* Timeline Items */}
                    <div className="space-y-4">
                        {sortedInstances.map((instance) => {
                            const isExpanded = expandedInstance === instance.id;
                            const attendance = getAttendanceStats(instance);

                            return (
                                <div key={instance.id} className="relative pl-12">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center z-10">
                                        {getStatusIcon(instance.status)}
                                    </div>

                                    {/* Content Card */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* Header */}
                                        <button
                                            onClick={() => setExpandedInstance(isExpanded ? null : instance.id)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="font-medium text-gray-800 text-left">
                                                        {formatDate(instance.scheduledDate)}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
                                                            {instance.status}
                                                        </span>
                                                        {attendance && (
                                                            <span className="flex items-center gap-1">
                                                                <Users size={12} />
                                                                {attendance.attended}/{attendance.total} attended
                                                            </span>
                                                        )}
                                                        {instance.actionItems && instance.actionItems.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <CheckSquare size={12} />
                                                                {instance.actionItems.filter(a => a.status === 'Completed').length}/{instance.actionItems.length} actions
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp size={20} className="text-gray-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-400" />
                                            )}
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 border-t border-gray-100">
                                                {/* Minutes */}
                                                {instance.minutes && (
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                            <FileText size={14} />
                                                            Minutes
                                                        </h4>
                                                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                                                            {instance.minutes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Action Items */}
                                                {instance.actionItems && instance.actionItems.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                            <CheckSquare size={14} />
                                                            Action Items ({instance.actionItems.length})
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {instance.actionItems.map(action => (
                                                                <div
                                                                    key={action.id}
                                                                    className={`flex items-start gap-2 p-2 rounded-lg ${
                                                                        action.status === 'Completed' ? 'bg-green-50' : 'bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                                                                        action.status === 'Completed'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'border border-gray-300'
                                                                    }`}>
                                                                        {action.status === 'Completed' && <CheckCircle size={12} />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-sm ${
                                                                            action.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                                                                        }`}>
                                                                            {action.title}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                                            {action.assigneeName}
                                                                            {action.completedAt && ` • Completed ${formatDateTime(action.completedAt)}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Attendance Record */}
                                                {instance.attendanceRecord && instance.attendanceRecord.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                            <Users size={14} />
                                                            Attendance
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {instance.attendanceRecord.map(record => {
                                                                const participant = meeting.participants.find(p => p.id === record.participantId);
                                                                return (
                                                                    <span
                                                                        key={record.participantId}
                                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                                            record.attended
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-gray-100 text-gray-500'
                                                                        }`}
                                                                    >
                                                                        {record.attended ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                                        {participant?.name || 'Unknown'}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* No content message */}
                                                {!instance.minutes && (!instance.actionItems || instance.actionItems.length === 0) && (
                                                    <p className="mt-4 text-sm text-gray-500 italic">
                                                        No minutes or actions recorded for this instance.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <History size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No meeting history yet</h3>
                    <p className="text-gray-500">
                        {meeting.recurrence === 'One-off'
                            ? 'This is a one-off meeting with no recurring history.'
                            : 'Past meeting instances will appear here once completed.'}
                    </p>
                </div>
            )}
        </div>
    );
}
