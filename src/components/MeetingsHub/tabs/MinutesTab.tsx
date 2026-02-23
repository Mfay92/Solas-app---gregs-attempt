import { useState } from 'react';
import { Meeting } from '../../../types';
import {
    FileText,
    Save,
    Edit2,
    X,
    Clock
} from 'lucide-react';

interface MinutesTabProps {
    meeting: Meeting;
    onUpdate: (meeting: Meeting) => void;
}

export default function MinutesTab({ meeting, onUpdate }: MinutesTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState(meeting.minutes || '');

    const handleSave = () => {
        const updatedMeeting: Meeting = {
            ...meeting,
            minutes: minutes.trim() || undefined,
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setMinutes(meeting.minutes || '');
        setIsEditing(false);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-ivolve-mid" />
                        Meeting Minutes
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Record outcomes and decisions from this meeting
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Edit2 size={18} />
                        {meeting.minutes ? 'Edit Minutes' : 'Add Minutes'}
                    </button>
                )}
            </div>

            {/* Editor or Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isEditing ? (
                    <div className="p-6">
                        <textarea
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            placeholder="Enter meeting minutes, decisions, and key outcomes..."
                            rows={15}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-y min-h-[300px] text-gray-700 leading-relaxed"
                            autoFocus
                        />
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                {minutes.length} characters
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                                >
                                    <Save size={18} />
                                    Save Minutes
                                </button>
                            </div>
                        </div>
                    </div>
                ) : meeting.minutes ? (
                    <div className="p-6">
                        <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {meeting.minutes}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            Last updated: {formatDateTime(meeting.updatedAt)}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No minutes recorded yet</h3>
                        <p className="text-gray-500 mb-4">
                            {meeting.status === 'Scheduled'
                                ? 'Minutes will be added after the meeting takes place'
                                : 'Add minutes to document outcomes and decisions'}
                        </p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                        >
                            <Edit2 size={18} />
                            Add Minutes
                        </button>
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2">Tips for good meeting minutes</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>&bull; Record key decisions and who made them</li>
                    <li>&bull; Note any disagreements and how they were resolved</li>
                    <li>&bull; Capture action items with clear owners (also add them in the Actions tab)</li>
                    <li>&bull; Include important dates and deadlines mentioned</li>
                    <li>&bull; Keep it concise - focus on outcomes, not the discussion</li>
                </ul>
            </div>
        </div>
    );
}
