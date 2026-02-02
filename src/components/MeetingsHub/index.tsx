import { useState, useMemo } from 'react';
import { Meeting, MeetingStatus, MeetingType, ActionItem } from '../../types';
import meetingsData from '../../data/meetings.json';
import MeetingProfile from './MeetingProfile';
import MeetingForm from './MeetingForm';
import MeetingsHeroBanner from './components/MeetingsHeroBanner';
import LiveMeetingMode from './components/LiveMeetingMode';
import {
    Calendar,
    Search,
    X,
    Filter,
    Users,
    ArrowUpDown,
    MapPin,
    Repeat,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface ActionWithMeeting extends ActionItem {
    meetingId: string;
    meetingTitle: string;
    meetingRef: string;
}

interface SortConfig {
    key: 'meetingRef' | 'title' | 'scheduledDate' | 'status' | 'meetingType';
    direction: 'asc' | 'desc';
}

interface FilterConfig {
    status: string;
    meetingType: string;
    recurrence: string;
}

/**
 * MeetingsHub Component
 *
 * Main hub for managing meetings and minute-taking.
 * Features:
 * - Interactive hero banner with calendar and actions
 * - Live meeting mode for guided minute-taking
 * - List view of all meetings with search and filters
 * - Color-coded badges by status and type
 */
export default function MeetingsHub() {
    // State
    const [meetings, setMeetings] = useState<Meeting[]>(meetingsData as unknown as Meeting[]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [liveMeetingMode, setLiveMeetingMode] = useState<Meeting | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'scheduledDate',
        direction: 'asc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterConfig>({
        status: 'All',
        meetingType: 'All',
        recurrence: 'All'
    });

    // Filter and sort meetings
    const filteredAndSortedMeetings = useMemo(() => {
        // Apply filters first
        let filtered = meetings.filter(meeting => {
            if (filters.status !== 'All' && meeting.status !== filters.status) {
                return false;
            }
            if (filters.meetingType !== 'All' && meeting.meetingType !== filters.meetingType) {
                return false;
            }
            if (filters.recurrence !== 'All' && meeting.recurrence !== filters.recurrence) {
                return false;
            }
            return true;
        });

        // Then apply search query
        filtered = filtered.filter(meeting => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                meeting.title.toLowerCase().includes(query) ||
                meeting.meetingRef.toLowerCase().includes(query) ||
                (meeting.description?.toLowerCase().includes(query) ?? false) ||
                (meeting.location?.toLowerCase().includes(query) ?? false)
            );
        });

        // Sort
        filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortConfig.key) {
                case 'meetingRef':
                    aValue = a.meetingRef.toLowerCase();
                    bValue = b.meetingRef.toLowerCase();
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'scheduledDate':
                    aValue = new Date(a.scheduledDate).getTime();
                    bValue = new Date(b.scheduledDate).getTime();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'meetingType':
                    aValue = a.meetingType;
                    bValue = b.meetingType;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [meetings, searchQuery, sortConfig, filters]);

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            status: 'All',
            meetingType: 'All',
            recurrence: 'All'
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.status !== 'All' ||
                            filters.meetingType !== 'All' ||
                            filters.recurrence !== 'All';

    // Handle sort
    const handleSort = (key: SortConfig['key']) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
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

    // Get status color
    const getStatusColor = (status: MeetingStatus) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'In Progress':
                return 'bg-amber-100 text-amber-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Postponed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5);
    };

    // Handle add meeting
    const handleAddMeeting = (newMeeting: Meeting) => {
        setMeetings(prev => [...prev, newMeeting]);
        setShowAddForm(false);
    };

    // Handle update meeting (from profile or live mode)
    const handleUpdateMeeting = (updatedMeeting: Meeting) => {
        setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
        if (selectedMeeting?.id === updatedMeeting.id) {
            setSelectedMeeting(updatedMeeting);
        }
        if (liveMeetingMode?.id === updatedMeeting.id) {
            setLiveMeetingMode(updatedMeeting);
        }
    };

    // Handle action click from outstanding actions widget
    const handleActionClick = (action: ActionWithMeeting) => {
        const meeting = meetings.find(m => m.id === action.meetingId);
        if (meeting) {
            setSelectedMeeting(meeting);
        }
    };

    // Handle end live meeting
    const handleEndLiveMeeting = () => {
        setLiveMeetingMode(null);
    };

    // If in live meeting mode
    if (liveMeetingMode) {
        return (
            <LiveMeetingMode
                meeting={liveMeetingMode}
                onUpdateMeeting={handleUpdateMeeting}
                onEndMeeting={handleEndLiveMeeting}
                onClose={() => setLiveMeetingMode(null)}
            />
        );
    }

    // If showing add form
    if (showAddForm) {
        return (
            <MeetingForm
                onSave={handleAddMeeting}
                onCancel={() => setShowAddForm(false)}
            />
        );
    }

    // If a meeting is selected, show their profile
    if (selectedMeeting) {
        return (
            <MeetingProfile
                meeting={selectedMeeting}
                onBack={() => setSelectedMeeting(null)}
                onUpdate={handleUpdateMeeting}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivolve-paper via-white to-ivolve-paper">
            {/* Main Content */}
            <div className="px-4 md:px-6 py-6">
                {/* Hero Banner */}
                <MeetingsHeroBanner
                    meetings={meetings}
                    onSelectMeeting={setSelectedMeeting}
                    onAddMeeting={() => setShowAddForm(true)}
                    onStartLiveMeeting={setLiveMeetingMode}
                    onActionClick={handleActionClick}
                />

                {/* Search and Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search meetings by title, reference, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    hasActiveFilters
                                        ? 'bg-ivolve-mid text-white border-ivolve-mid shadow-sm'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <Filter size={18} />
                                <span className="font-medium">
                                    {hasActiveFilters ? 'Filters Active' : 'Filters'}
                                </span>
                                {hasActiveFilters && (
                                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {Object.values(filters).filter(v => v !== 'All').length}
                                    </span>
                                )}
                                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {/* Results Count */}
                        <p className="text-sm text-gray-500 mt-3">
                            Showing {filteredAndSortedMeetings.length} of {meetings.length} meetings
                            {searchQuery && ` matching "${searchQuery}"`}
                        </p>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Postponed">Postponed</option>
                                    </select>
                                </div>

                                {/* Meeting Type Filter */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                        Meeting Type
                                    </label>
                                    <select
                                        value={filters.meetingType}
                                        onChange={(e) => setFilters({ ...filters, meetingType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="All">All Types</option>
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                        <option value="Support Review">Support Review</option>
                                        <option value="Training">Training</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Recurrence Filter */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                        Recurrence
                                    </label>
                                    <select
                                        value={filters.recurrence}
                                        onChange={(e) => setFilters({ ...filters, recurrence: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="All">All</option>
                                        <option value="One-off">One-off</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Fortnightly">Fortnightly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-sm text-ivolve-mid hover:text-ivolve-dark font-medium flex items-center gap-1"
                                    >
                                        <X size={16} />
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Meetings Table */}
                {filteredAndSortedMeetings.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('meetingRef')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Ref
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Title
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('scheduledDate')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Date & Time
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Location
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('meetingType')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Type
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Status
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Attendees
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAndSortedMeetings.map((meeting) => (
                                        <tr
                                            key={meeting.id}
                                            className="hover:bg-ivolve-paper/50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedMeeting(meeting)}
                                        >
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-mono text-gray-600">
                                                    {meeting.meetingRef}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-800">
                                                        {meeting.title}
                                                    </span>
                                                    {meeting.recurrence !== 'One-off' && (
                                                        <span title={meeting.recurrence}>
                                                            <Repeat size={14} className="text-gray-400" />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <div className="font-medium text-gray-800">
                                                        {formatDate(meeting.scheduledDate)}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {formatTime(meeting.scheduledTime)} ({meeting.duration} mins)
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="truncate max-w-[150px]">
                                                        {meeting.location || 'TBC'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getMeetingTypeColor(meeting.meetingType)}`}>
                                                    {meeting.meetingType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                                    {meeting.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {meeting.participants.length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMeeting(meeting);
                                                    }}
                                                    className="px-3 py-1.5 text-sm font-medium text-ivolve-mid hover:text-ivolve-dark hover:bg-ivolve-mid/10 rounded-lg transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredAndSortedMeetings.map((meeting) => (
                                <div
                                    key={meeting.id}
                                    className="p-4 hover:bg-ivolve-paper/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedMeeting(meeting)}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-800">
                                                    {meeting.title}
                                                </span>
                                                {meeting.recurrence !== 'One-off' && (
                                                    <Repeat size={14} className="text-gray-400" />
                                                )}
                                            </div>
                                            <p className="text-xs font-mono text-gray-500">{meeting.meetingRef}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-gray-400" />
                                            {formatDate(meeting.scheduledDate)} at {formatTime(meeting.scheduledTime)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            {meeting.location || 'TBC'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMeetingTypeColor(meeting.meetingType)}`}>
                                                {meeting.meetingType}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Users size={12} />
                                                {meeting.participants.length} attendees
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMeeting(meeting);
                                            }}
                                            className="px-3 py-1.5 text-sm font-medium text-ivolve-mid hover:text-ivolve-dark"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex items-center justify-center min-h-64">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Calendar className="text-gray-400" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">No meetings found</h2>
                            <p className="text-gray-500 mb-4 max-w-md">
                                {hasActiveFilters || searchQuery
                                    ? 'Try adjusting your filters or search query.'
                                    : 'Your meeting list is empty. Schedule your first meeting!'}
                            </p>
                            {(hasActiveFilters || searchQuery) && (
                                <button
                                    onClick={() => {
                                        handleClearFilters();
                                        setSearchQuery('');
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-ivolve-mid hover:text-ivolve-dark font-medium"
                                >
                                    <X size={18} />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
