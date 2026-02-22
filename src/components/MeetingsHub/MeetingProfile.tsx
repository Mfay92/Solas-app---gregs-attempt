import { useState, useMemo } from 'react';
import { Meeting, MeetingStatus, MeetingType } from '../../types';
import OverviewTab from './tabs/OverviewTab';
import AttendeesTab from './tabs/AttendeesTab';
import AgendaTab from './tabs/AgendaTab';
import MinutesTab from './tabs/MinutesTab';
import ActionsTab from './tabs/ActionsTab';
import TimelineTab from './tabs/TimelineTab';
import LinkedItemsTab from './tabs/LinkedItemsTab';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    CheckSquare,
    History,
    Link2,
    Repeat,
    Edit,
    Download,
    Mail,
    MoreVertical,
    Play,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

interface MeetingProfileProps {
    meeting: Meeting;
    onBack: () => void;
    onUpdate: (meeting: Meeting) => void;
    onStartLiveMeeting: (meeting: Meeting) => void;
}

type TabKey = 'overview' | 'attendees' | 'agenda' | 'minutes' | 'actions' | 'timeline' | 'linked';

interface TabConfig {
    key: TabKey;
    label: string;
    icon: typeof Calendar;
    show?: boolean;
}

type StartMeetingWarning = {
    type: 'none' | 'early' | 'completed' | 'cancelled' | 'far_future';
    message: string;
    subMessage?: string;
    canProceed: boolean;
};

export default function MeetingProfile({ meeting, onBack, onUpdate, onStartLiveMeeting }: MeetingProfileProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [showActions, setShowActions] = useState(false);
    const [showStartConfirm, setShowStartConfirm] = useState(false);

    // Determine meeting timing status for smart warnings
    const meetingWarning = useMemo((): StartMeetingWarning => {
        const now = new Date();
        const meetingDateTime = new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`);
        const diffMinutes = Math.round((meetingDateTime.getTime() - now.getTime()) / (1000 * 60));
        const diffDays = Math.round(diffMinutes / (60 * 24));

        // Meeting is cancelled
        if (meeting.status === 'Cancelled') {
            return {
                type: 'cancelled',
                message: 'This meeting has been cancelled',
                subMessage: 'Are you sure you want to start it anyway?',
                canProceed: true
            };
        }

        // Meeting is already completed
        if (meeting.status === 'Completed') {
            return {
                type: 'completed',
                message: 'This meeting has been marked as completed',
                subMessage: 'Are you sure you want to re-open it?',
                canProceed: true
            };
        }

        // Meeting is more than a day in the future
        if (diffMinutes > 60 * 24) {
            return {
                type: 'far_future',
                message: `This meeting isn't scheduled for another ${diffDays} day${diffDays > 1 ? 's' : ''}`,
                subMessage: 'Are you sure you want to start it now?',
                canProceed: true
            };
        }

        // Meeting is more than 30 minutes in the future
        if (diffMinutes > 30) {
            const hours = Math.floor(diffMinutes / 60);
            const mins = diffMinutes % 60;
            const timeStr = hours > 0
                ? `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : ''}`
                : `${mins} minutes`;
            return {
                type: 'early',
                message: `Meeting starts in ${timeStr}`,
                subMessage: 'Would you like to start early?',
                canProceed: true
            };
        }

        // Meeting is within 30 minutes or in progress - all good
        return {
            type: 'none',
            message: '',
            canProceed: true
        };
    }, [meeting]);

    // Handle start meeting click
    const handleStartMeetingClick = () => {
        if (meetingWarning.type === 'none') {
            onStartLiveMeeting(meeting);
        } else {
            setShowStartConfirm(true);
        }
    };

    // Confirm start meeting
    const handleConfirmStart = () => {
        setShowStartConfirm(false);
        onStartLiveMeeting(meeting);
    };

    // Get status color
    const getStatusColor = (status: MeetingStatus) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'In Progress':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'Postponed':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Get meeting type color
    const getMeetingTypeColor = (type: MeetingType) => {
        switch (type) {
            case 'Internal':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'External':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Support Review':
                return 'bg-ivolve-mid/10 text-ivolve-mid border-ivolve-mid/30';
            case 'Training':
                return 'bg-teal-100 text-teal-800 border-teal-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Tab configuration
    const tabs: TabConfig[] = [
        { key: 'overview', label: 'Overview', icon: FileText },
        { key: 'attendees', label: 'Attendees', icon: Users },
        { key: 'agenda', label: 'Agenda', icon: FileText },
        { key: 'minutes', label: 'Minutes', icon: FileText },
        { key: 'actions', label: 'Actions', icon: CheckSquare },
        { key: 'timeline', label: 'Timeline', icon: History, show: meeting.recurrence !== 'One-off' || (meeting.instances && meeting.instances.length > 0) },
        { key: 'linked', label: 'Linked Items', icon: Link2 }
    ];

    // Filter visible tabs
    const visibleTabs = tabs.filter(tab => tab.show !== false);

    // Get action count
    const actionCount = meeting.actionItems?.length || 0;
    const pendingActions = meeting.actionItems?.filter(a => a.status === 'Pending' || a.status === 'In Progress').length || 0;

    // Render active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab meeting={meeting} />;
            case 'attendees':
                return <AttendeesTab meeting={meeting} onUpdate={onUpdate} />;
            case 'agenda':
                return <AgendaTab meeting={meeting} onUpdate={onUpdate} />;
            case 'minutes':
                return <MinutesTab meeting={meeting} onUpdate={onUpdate} />;
            case 'actions':
                return <ActionsTab meeting={meeting} onUpdate={onUpdate} />;
            case 'timeline':
                return <TimelineTab meeting={meeting} />;
            case 'linked':
                return <LinkedItemsTab meeting={meeting} onUpdate={onUpdate} />;
            default:
                return <OverviewTab meeting={meeting} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivolve-paper via-white to-ivolve-paper">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-ivolve-dark via-ivolve-mid to-ivolve-dark text-white">
                <div className="px-4 md:px-8 py-6">
                    {/* Back Button & Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Meetings</span>
                        </button>
                        <div className="flex items-center gap-2">
                            {/* Start Meeting Button - Prominent */}
                            <button
                                onClick={handleStartMeetingClick}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                            >
                                <Play size={18} />
                                <span>Start Meeting</span>
                            </button>

                            <div className="w-px h-6 bg-white/20 mx-1" />

                            <button
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Edit Meeting"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Export PDF"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Email Notes"
                            >
                                <Mail size={20} />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {showActions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                            Duplicate Meeting
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                            Cancel Meeting
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                            Postpone Meeting
                                        </button>
                                        <hr className="my-1" />
                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                            Delete Meeting
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meeting Info */}
                    <div className="mb-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(meeting.status)}`}>
                                {meeting.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMeetingTypeColor(meeting.meetingType)}`}>
                                {meeting.meetingType}
                            </span>
                            {meeting.recurrence !== 'One-off' && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/10 border border-white/20">
                                    <Repeat size={14} />
                                    {meeting.recurrence}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            {meeting.title}
                        </h1>
                        <p className="text-white/70 text-sm font-mono">
                            {meeting.meetingRef}
                        </p>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-white/70" />
                            <span>{formatDate(meeting.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-white/70" />
                            <span>{meeting.scheduledTime} ({meeting.duration} mins)</span>
                        </div>
                        {meeting.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-white/70" />
                                <span>{meeting.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-white/70" />
                            <span>{meeting.participants.length} attendees</span>
                        </div>
                        {actionCount > 0 && (
                            <div className="flex items-center gap-2">
                                <CheckSquare size={18} className="text-white/70" />
                                <span>{pendingActions} of {actionCount} actions pending</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 md:px-8 border-t border-white/10">
                    <div className="flex overflow-x-auto -mb-px">
                        {visibleTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        isActive
                                            ? 'text-white border-white'
                                            : 'text-white/60 border-transparent hover:text-white/80 hover:border-white/30'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {tab.key === 'actions' && pendingActions > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                                            {pendingActions}
                                        </span>
                                    )}
                                    {tab.key === 'linked' && meeting.linkedEntities.length > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                                            {meeting.linkedEntities.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 md:px-8 py-6">
                {renderTabContent()}
            </div>

            {/* Start Meeting Confirmation Dialog */}
            {showStartConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header */}
                        <div className={`px-6 py-4 flex items-center gap-3 ${
                            meetingWarning.type === 'cancelled' ? 'bg-red-500' :
                            meetingWarning.type === 'completed' ? 'bg-amber-500' :
                            'bg-blue-500'
                        } text-white`}>
                            {meetingWarning.type === 'cancelled' ? (
                                <AlertTriangle size={24} />
                            ) : meetingWarning.type === 'completed' ? (
                                <AlertTriangle size={24} />
                            ) : (
                                <Info size={24} />
                            )}
                            <h3 className="text-lg font-bold">Start Meeting?</h3>
                            <button
                                onClick={() => setShowStartConfirm(false)}
                                className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                                {meetingWarning.message}
                            </p>
                            {meetingWarning.subMessage && (
                                <p className="text-gray-600">
                                    {meetingWarning.subMessage}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowStartConfirm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                            >
                                <Play size={18} />
                                Start Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
