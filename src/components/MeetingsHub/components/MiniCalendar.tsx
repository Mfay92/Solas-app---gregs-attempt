import { useState, useMemo } from 'react';
import { Meeting } from '../../../types';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Maximize2,
    X,
    Clock,
    MapPin
} from 'lucide-react';

interface MiniCalendarProps {
    meetings: Meeting[];
    onSelectDate?: (date: Date) => void;
    onSelectMeeting?: (meeting: Meeting) => void;
    className?: string;
}

export default function MiniCalendar({
    meetings,
    onSelectDate,
    onSelectMeeting,
    className = ''
}: MiniCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Get calendar grid data
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDay = firstDayOfMonth.getDay(); // 0 = Sunday
        const daysInMonth = lastDayOfMonth.getDate();

        // Build array of day numbers with padding
        const days: (number | null)[] = [];

        // Add empty slots for days before the 1st
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return { days, year, month };
    }, [currentDate]);

    // Get meetings for a specific date
    const getMeetingsForDate = (day: number | null) => {
        if (!day) return [];
        const dateStr = new Date(calendarData.year, calendarData.month, day)
            .toISOString()
            .split('T')[0];
        return meetings.filter(m => m.scheduledDate === dateStr);
    };

    // Check if date is today
    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            calendarData.month === today.getMonth() &&
            calendarData.year === today.getFullYear()
        );
    };

    // Check if date is selected
    const isSelected = (day: number | null) => {
        if (!day || !selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            calendarData.month === selectedDate.getMonth() &&
            calendarData.year === selectedDate.getFullYear()
        );
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(calendarData.year, calendarData.month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(calendarData.year, calendarData.month + 1, 1));
    };

    const handleDateClick = (day: number | null) => {
        if (!day) return;
        const date = new Date(calendarData.year, calendarData.month, day);
        setSelectedDate(date);
        onSelectDate?.(date);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get meetings for selected date
    const selectedDateMeetings = selectedDate
        ? meetings.filter(m => {
            const meetingDate = new Date(m.scheduledDate);
            return (
                meetingDate.getDate() === selectedDate.getDate() &&
                meetingDate.getMonth() === selectedDate.getMonth() &&
                meetingDate.getFullYear() === selectedDate.getFullYear()
            );
        })
        : [];

    const formatTime = (time: string) => {
        return time.substring(0, 5); // Get HH:MM from HH:MM:SS
    };

    // Expanded modal view
    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-ivolve-mid to-ivolve-dark px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <Calendar size={24} />
                            <h2 className="text-xl font-bold">Meeting Calendar</h2>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* Calendar Grid - Larger */}
                        <div>
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={24} className="text-gray-600" />
                                </button>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {monthNames[calendarData.month]} {calendarData.year}
                                </h3>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={24} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map(day => (
                                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarData.days.map((day, index) => {
                                    const dayMeetings = getMeetingsForDate(day);
                                    const hasMeetings = dayMeetings.length > 0;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateClick(day)}
                                            disabled={!day}
                                            className={`
                                                relative h-14 rounded-lg transition-all font-medium text-lg
                                                ${!day ? 'cursor-default' : 'hover:bg-gray-100'}
                                                ${isToday(day) ? 'bg-ivolve-mid text-white hover:bg-ivolve-dark' : ''}
                                                ${isSelected(day) && !isToday(day) ? 'bg-ivolve-mid/20 ring-2 ring-ivolve-mid' : ''}
                                                ${day && !isToday(day) && !isSelected(day) ? 'text-gray-700' : ''}
                                            `}
                                        >
                                            {day}
                                            {hasMeetings && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                    {dayMeetings.slice(0, 3).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-white' : 'bg-ivolve-mid'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Date Meetings */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-800 mb-4 text-lg">
                                {selectedDate
                                    ? selectedDate.toLocaleDateString('en-GB', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                    : 'Select a date to view meetings'}
                            </h4>

                            {selectedDate ? (
                                selectedDateMeetings.length > 0 ? (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {selectedDateMeetings.map(meeting => (
                                            <button
                                                key={meeting.id}
                                                onClick={() => {
                                                    onSelectMeeting?.(meeting);
                                                    setIsExpanded(false);
                                                }}
                                                className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-ivolve-mid/30 transition-all text-left group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-ivolve-mid/10 text-ivolve-mid group-hover:bg-ivolve-mid group-hover:text-white transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-semibold text-gray-800 group-hover:text-ivolve-mid transition-colors">
                                                            {meeting.title}
                                                        </h5>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                {formatTime(meeting.scheduledTime)}
                                                            </span>
                                                            {meeting.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin size={14} />
                                                                    {meeting.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                                        <p>No meetings scheduled for this date</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p>Click on a date to see meetings</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mini calendar view
    return (
        <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-ivolve-mid to-ivolve-dark px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">Calendar</span>
                </div>
                <button
                    onClick={() => setIsExpanded(true)}
                    className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                    title="Expand calendar"
                >
                    <Maximize2 size={12} />
                </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border-b border-gray-100">
                <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                    <ChevronLeft size={14} className="text-gray-600" />
                </button>
                <span className="text-xs font-semibold text-gray-700">
                    {monthNames[calendarData.month].substring(0, 3)} {calendarData.year}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                    <ChevronRight size={14} className="text-gray-600" />
                </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 px-1.5 pt-1">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-[9px] font-semibold text-gray-400">
                        {day.substring(0, 1)}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 p-1.5">
                {calendarData.days.map((day, index) => {
                    const dayMeetings = getMeetingsForDate(day);
                    const hasMeetings = dayMeetings.length > 0;

                    return (
                        <button
                            key={index}
                            onClick={() => handleDateClick(day)}
                            disabled={!day}
                            className={`
                                relative w-6 h-6 rounded text-[10px] font-medium transition-all
                                ${!day ? 'cursor-default' : 'hover:bg-gray-100'}
                                ${isToday(day) ? 'bg-ivolve-mid text-white' : ''}
                                ${isSelected(day) && !isToday(day) ? 'bg-ivolve-mid/20 ring-1 ring-ivolve-mid' : ''}
                                ${day && !isToday(day) && !isSelected(day) ? 'text-gray-600' : ''}
                            `}
                        >
                            {day}
                            {hasMeetings && (
                                <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday(day) ? 'bg-white' : 'bg-ivolve-mid'}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Today's Meetings Quick View */}
            {selectedDateMeetings.length > 0 && selectedDate && (
                <div className="border-t border-gray-100 px-2 py-1.5 max-h-20 overflow-y-auto">
                    <p className="text-[9px] font-semibold text-gray-500 uppercase mb-1">
                        {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <div className="space-y-1">
                        {selectedDateMeetings.slice(0, 2).map(meeting => (
                            <button
                                key={meeting.id}
                                onClick={() => onSelectMeeting?.(meeting)}
                                className="w-full text-left text-[10px] text-gray-700 hover:text-ivolve-mid truncate"
                            >
                                <span className="text-ivolve-mid font-semibold">{formatTime(meeting.scheduledTime)}</span>
                                {' '}{meeting.title}
                            </button>
                        ))}
                        {selectedDateMeetings.length > 2 && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-[9px] text-ivolve-mid hover:underline"
                            >
                                +{selectedDateMeetings.length - 2} more
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
