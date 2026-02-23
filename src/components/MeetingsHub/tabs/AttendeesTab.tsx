import { useState } from 'react';
import { Meeting, MeetingParticipant } from '../../../types';
import {
    Users,
    Plus,
    Mail,
    UserCheck,
    UserX,
    Crown,
    Trash2,
    X
} from 'lucide-react';

interface AttendeesTabProps {
    meeting: Meeting;
    onUpdate: (meeting: Meeting) => void;
}

export default function AttendeesTab({ meeting, onUpdate }: AttendeesTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: '',
        type: 'Internal' as 'Internal' | 'External',
        role: 'Attendee' as MeetingParticipant['role']
    });

    const getRoleIcon = (role: MeetingParticipant['role']) => {
        switch (role) {
            case 'Organizer':
            case 'Chair':
                return <Crown size={14} className="text-amber-500" />;
            default:
                return null;
        }
    };

    const getRoleBadgeColor = (role: MeetingParticipant['role']) => {
        switch (role) {
            case 'Organizer':
                return 'bg-amber-100 text-amber-800';
            case 'Chair':
                return 'bg-purple-100 text-purple-800';
            case 'Minute Taker':
                return 'bg-blue-100 text-blue-800';
            case 'Apologies':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getAttendanceIcon = (attended?: boolean) => {
        if (attended === true) return <UserCheck size={16} className="text-green-500" />;
        if (attended === false) return <UserX size={16} className="text-red-500" />;
        return null;
    };

    const handleAddParticipant = () => {
        if (!newParticipant.name.trim()) return;

        const participant: MeetingParticipant = {
            id: `part-${Date.now()}`,
            type: newParticipant.type,
            name: newParticipant.name,
            email: newParticipant.email || undefined,
            role: newParticipant.role
        };

        const updatedMeeting: Meeting = {
            ...meeting,
            participants: [...meeting.participants, participant],
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
        setNewParticipant({ name: '', email: '', type: 'Internal', role: 'Attendee' });
        setShowAddForm(false);
    };

    const handleRemoveParticipant = (participantId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            participants: meeting.participants.filter(p => p.id !== participantId),
            updatedAt: new Date().toISOString()
        };
        onUpdate(updatedMeeting);
    };

    const handleToggleAttendance = (participantId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            participants: meeting.participants.map(p => {
                if (p.id === participantId) {
                    return {
                        ...p,
                        attended: p.attended === true ? false : p.attended === false ? undefined : true
                    };
                }
                return p;
            }),
            updatedAt: new Date().toISOString()
        };
        onUpdate(updatedMeeting);
    };

    // Group participants by type
    const internalParticipants = meeting.participants.filter(p => p.type === 'Internal');
    const externalParticipants = meeting.participants.filter(p => p.type === 'External');

    const ParticipantRow = ({ participant }: { participant: MeetingParticipant }) => (
        <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ivolve-mid to-ivolve-dark flex items-center justify-center text-white font-medium">
                    {participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{participant.name}</span>
                        {getRoleIcon(participant.role)}
                        {getAttendanceIcon(participant.attended)}
                    </div>
                    {participant.email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {participant.email}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(participant.role)}`}>
                    {participant.role}
                </span>
                {meeting.status !== 'Completed' && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleToggleAttendance(participant.id)}
                            className="p-1.5 text-gray-400 hover:text-ivolve-mid hover:bg-ivolve-mid/10 rounded-lg transition-colors"
                            title="Toggle attendance"
                        >
                            <UserCheck size={16} />
                        </button>
                        <button
                            onClick={() => handleRemoveParticipant(participant.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-ivolve-mid" />
                        Attendees
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {meeting.participants.length} participants
                    </p>
                </div>
                {meeting.status !== 'Completed' && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Add Attendee
                    </button>
                )}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Add Attendee</h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                value={newParticipant.name}
                                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                                placeholder="Enter name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={newParticipant.email}
                                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                                placeholder="Enter email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={newParticipant.type}
                                onChange={(e) => setNewParticipant({ ...newParticipant, type: e.target.value as 'Internal' | 'External' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            >
                                <option value="Internal">Internal (Staff)</option>
                                <option value="External">External</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={newParticipant.role}
                                onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value as MeetingParticipant['role'] })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            >
                                <option value="Attendee">Attendee</option>
                                <option value="Organizer">Organizer</option>
                                <option value="Chair">Chair</option>
                                <option value="Minute Taker">Minute Taker</option>
                                <option value="Apologies">Apologies</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddParticipant}
                            disabled={!newParticipant.name.trim()}
                            className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Attendee
                        </button>
                    </div>
                </div>
            )}

            {/* Internal Participants */}
            {internalParticipants.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-medium text-gray-700">
                            Internal ({internalParticipants.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {internalParticipants.map(participant => (
                            <ParticipantRow key={participant.id} participant={participant} />
                        ))}
                    </div>
                </div>
            )}

            {/* External Participants */}
            {externalParticipants.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-medium text-gray-700">
                            External ({externalParticipants.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {externalParticipants.map(participant => (
                            <ParticipantRow key={participant.id} participant={participant} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {meeting.participants.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No attendees yet</h3>
                    <p className="text-gray-500 mb-4">Add attendees to this meeting</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Add Attendee
                    </button>
                </div>
            )}
        </div>
    );
}
