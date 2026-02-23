import { Meeting } from '../../../types';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    User,
    Repeat
} from 'lucide-react';

interface OverviewTabProps {
    meeting: Meeting;
}

export default function OverviewTab({ meeting }: OverviewTabProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
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

    // Get organizer
    const organizer = meeting.participants.find(p => p.role === 'Organizer' || p.role === 'Chair');

    return (
        <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-ivolve-mid" />
                    Meeting Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <Calendar size={16} className="text-gray-400" />
                                {formatDate(meeting.scheduledDate)}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Time</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <Clock size={16} className="text-gray-400" />
                                {meeting.scheduledTime} ({meeting.duration} minutes)
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <MapPin size={16} className="text-gray-400" />
                                {meeting.location || 'To be confirmed'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Organizer</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <User size={16} className="text-gray-400" />
                                {organizer?.name || meeting.createdBy}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Attendees</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <Users size={16} className="text-gray-400" />
                                {meeting.participants.length} people
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Recurrence</label>
                            <p className="text-gray-800 flex items-center gap-2 mt-1">
                                <Repeat size={16} className="text-gray-400" />
                                {meeting.recurrence}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {meeting.description && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            {meeting.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Agenda Items</p>
                    <p className="text-2xl font-bold text-gray-800">{meeting.agenda.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Actions</p>
                    <p className="text-2xl font-bold text-gray-800">{meeting.actionItems?.length || 0}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Linked Items</p>
                    <p className="text-2xl font-bold text-gray-800">{meeting.linkedEntities.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Past Instances</p>
                    <p className="text-2xl font-bold text-gray-800">{meeting.instances?.length || 0}</p>
                </div>
            </div>

            {/* Audit Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Audit Trail</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Created by:</span>
                        <span className="ml-2 text-gray-800">{meeting.createdBy}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-800">{formatDateTime(meeting.createdAt)}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Last updated:</span>
                        <span className="ml-2 text-gray-800">{formatDateTime(meeting.updatedAt)}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Reference:</span>
                        <span className="ml-2 text-gray-800 font-mono">{meeting.meetingRef}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
