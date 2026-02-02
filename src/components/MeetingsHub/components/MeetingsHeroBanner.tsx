import { useState, useMemo } from 'react';
import { Meeting, ActionItem } from '../../../types';
import MiniCalendar from './MiniCalendar';
import OutstandingActions from './OutstandingActions';
import {
    Calendar,
    Plus,
    Play,
    Search,
    Clock,
    Users,
    MapPin,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    CalendarCheck,
    CalendarClock,
    Sparkles
} from 'lucide-react';

interface ActionWithMeeting extends ActionItem {
    meetingId: string;
    meetingTitle: string;
    meetingRef: string;
}

interface MeetingsHeroBannerProps {
    meetings: Meeting[];
    onSelectMeeting: (meeting: Meeting) => void;
    onAddMeeting: () => void;
    onStartLiveMeeting: (meeting: Meeting) => void;
    onActionClick: (action: ActionWithMeeting) => void;
}

export default function MeetingsHeroBanner({
    meetings,
    onSelectMeeting,
    onAddMeeting,
    onStartLiveMeeting,
    onActionClick
}: MeetingsHeroBannerProps) {
    const [showSearch, setShowSearch] = useState(false);

    // Calculate stats
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const todayMeetings = meetings.filter(m => {
            const date = new Date(m.scheduledDate);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === today.getTime() && m.status !== 'Cancelled';
        });

        const thisWeekMeetings = meetings.filter(m => {
            const date = new Date(m.scheduledDate);
            date.setHours(0, 0, 0, 0);
            return date >= today && date < weekEnd && m.status !== 'Cancelled';
        });

        const completedThisMonth = meetings.filter(m => {
            const date = new Date(m.scheduledDate);
            return (
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear() &&
                m.status === 'Completed'
            );
        });

        const totalActions = meetings.reduce((sum, m) => sum + (m.actionItems?.length || 0), 0);
        const completedActions = meetings.reduce(
            (sum, m) => sum + (m.actionItems?.filter(a => a.status === 'Completed').length || 0),
            0
        );

        return {
            today: todayMeetings.length,
            thisWeek: thisWeekMeetings.length,
            completed: completedThisMonth.length,
            pendingActions: totalActions - completedActions
        };
    }, [meetings]);

    // Get next upcoming meeting
    const nextMeeting = useMemo(() => {
        const now = new Date();
        return meetings
            .filter(m => {
                const meetingDateTime = new Date(`${m.scheduledDate}T${m.scheduledTime}`);
                return meetingDateTime > now && m.status === 'Scheduled';
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
                const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
                return dateA.getTime() - dateB.getTime();
            })[0];
    }, [meetings]);

    const formatTime = (time: string) => time.substring(0, 5);

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const meetingDate = new Date(dateString);
        meetingDate.setHours(0, 0, 0, 0);

        if (meetingDate.getTime() === today.getTime()) return 'Today';
        if (meetingDate.getTime() === tomorrow.getTime()) return 'Tomorrow';

        return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const handleToggleComplete = (action: ActionWithMeeting) => {
        // Find the meeting and update the action
        const meeting = meetings.find(m => m.id === action.meetingId);
        if (meeting) {
            // This would typically update state through a callback
            console.log('Toggle action complete:', action.id);
        }
    };

    return (
        <div className="bg-gradient-to-br from-ivolve-dark via-ivolve-mid to-ivolve-dark/90 rounded-2xl shadow-2xl overflow-hidden mb-6">
            {/* Main Content */}
            <div className="p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column: Title + Quick Stats + Next Meeting */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                                    <Calendar size={28} />
                                    My Meetings
                                </h1>
                                <p className="text-white/60 text-sm">
                                    Manage your meetings and track actions
                                </p>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-3 mb-6">
                            {/* Add Meeting */}
                            <button
                                onClick={onAddMeeting}
                                className="group flex items-center gap-2 px-4 py-2.5 bg-white text-ivolve-dark font-semibold rounded-xl hover:bg-ivolve-bright hover:scale-105 transition-all shadow-lg"
                            >
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                New Meeting
                            </button>

                            {/* Start Live Meeting (if there's one today) */}
                            {nextMeeting && new Date(nextMeeting.scheduledDate).toDateString() === new Date().toDateString() && (
                                <button
                                    onClick={() => onStartLiveMeeting(nextMeeting)}
                                    className="group flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:scale-105 transition-all shadow-lg"
                                >
                                    <Play size={18} className="group-hover:scale-110 transition-transform" />
                                    Start Meeting
                                </button>
                            )}

                            {/* Search Toggle */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                title="Search meetings"
                            >
                                <Search size={18} />
                            </button>
                        </div>

                        {/* Compact Stats Row */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
                                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                                    <CalendarCheck size={14} />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.today}</p>
                                <p className="text-[10px] text-white/60 uppercase font-semibold">Today</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
                                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                                    <CalendarClock size={14} />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
                                <p className="text-[10px] text-white/60 uppercase font-semibold">This Week</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
                                <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                                    <CheckCircle size={14} />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                                <p className="text-[10px] text-white/60 uppercase font-semibold">Completed</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
                                <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                                    <AlertCircle size={14} />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.pendingActions}</p>
                                <p className="text-[10px] text-white/60 uppercase font-semibold">Actions</p>
                            </div>
                        </div>

                        {/* Next Meeting Preview */}
                        {nextMeeting ? (
                            <button
                                onClick={() => onSelectMeeting(nextMeeting)}
                                className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/15 transition-colors group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Date Badge */}
                                    <div className="bg-white rounded-lg p-2 text-center shadow-lg">
                                        <p className="text-xs font-bold text-ivolve-mid uppercase">
                                            {formatRelativeDate(nextMeeting.scheduledDate)}
                                        </p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {formatTime(nextMeeting.scheduledTime)}
                                        </p>
                                    </div>

                                    {/* Meeting Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles size={14} className="text-ivolve-bright" />
                                            <span className="text-xs text-ivolve-bright font-semibold uppercase">
                                                Next Up
                                            </span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg truncate group-hover:text-ivolve-bright transition-colors">
                                            {nextMeeting.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {nextMeeting.participants.length}
                                            </span>
                                            {nextMeeting.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {nextMeeting.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {nextMeeting.duration} min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight
                                        size={24}
                                        className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                            </button>
                        ) : (
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                                    <Calendar size={24} className="text-white/50" />
                                </div>
                                <p className="text-white/70 font-medium">No upcoming meetings</p>
                                <p className="text-white/50 text-sm">Click "New Meeting" to schedule one</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Calendar + Outstanding Actions */}
                    <div className="col-span-12 lg:col-span-7 flex gap-4">
                        {/* Calendar Widget */}
                        <div className="flex-1 min-w-0" style={{ maxWidth: '220px' }}>
                            <MiniCalendar
                                meetings={meetings}
                                onSelectMeeting={onSelectMeeting}
                                className="h-full"
                            />
                        </div>

                        {/* Outstanding Actions Widget */}
                        <div className="flex-1 min-w-0">
                            <OutstandingActions
                                meetings={meetings}
                                onSelectAction={onActionClick}
                                onToggleComplete={handleToggleComplete}
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar (Expandable) */}
            {showSearch && (
                <div className="bg-black/20 backdrop-blur-sm px-6 py-4 border-t border-white/10">
                    <div className="relative max-w-2xl">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search meetings by title, reference, or attendee..."
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
