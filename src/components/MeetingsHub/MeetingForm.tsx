import { useState } from 'react';
import { Meeting, MeetingType, RecurrencePattern, MeetingParticipant, AgendaItem } from '../../types';
import {
    ArrowLeft,
    Calendar,
    Users,
    FileText,
    Plus,
    X,
    Save
} from 'lucide-react';

interface MeetingFormProps {
    meeting?: Meeting; // If provided, we're editing; otherwise creating
    onSave: (meeting: Meeting) => void;
    onCancel: () => void;
}

export default function MeetingForm({ meeting, onSave, onCancel }: MeetingFormProps) {
    const isEditing = !!meeting;

    // Form state
    const [formData, setFormData] = useState({
        title: meeting?.title || '',
        description: meeting?.description || '',
        scheduledDate: meeting?.scheduledDate || '',
        scheduledTime: meeting?.scheduledTime || '09:00',
        duration: meeting?.duration || 60,
        location: meeting?.location || '',
        meetingType: (meeting?.meetingType || 'Internal') as MeetingType,
        recurrence: (meeting?.recurrence || 'One-off') as RecurrencePattern
    });

    const [participants, setParticipants] = useState<MeetingParticipant[]>(
        meeting?.participants || []
    );

    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(
        meeting?.agenda || []
    );

    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: '',
        type: 'Internal' as 'Internal' | 'External',
        role: 'Attendee' as MeetingParticipant['role']
    });

    const [newAgendaItem, setNewAgendaItem] = useState({
        title: '',
        duration: 15
    });

    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [showAddAgenda, setShowAddAgenda] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Generate meeting reference
    const generateMeetingRef = () => {
        const year = new Date().getFullYear();
        const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
        return `MTG${year}/${num}`;
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.scheduledDate) {
            newErrors.scheduledDate = 'Date is required';
        }
        if (!formData.scheduledTime) {
            newErrors.scheduledTime = 'Time is required';
        }
        if (formData.duration <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = () => {
        if (!validateForm()) return;

        const newMeeting: Meeting = {
            id: meeting?.id || `mtg-${Date.now()}`,
            meetingRef: meeting?.meetingRef || generateMeetingRef(),
            title: formData.title,
            description: formData.description || undefined,
            scheduledDate: formData.scheduledDate,
            scheduledTime: formData.scheduledTime,
            duration: formData.duration,
            location: formData.location || undefined,
            recurrence: formData.recurrence,
            organizerId: meeting?.organizerId || 'current-user',
            participants: participants,
            agenda: agendaItems,
            actionItems: meeting?.actionItems || [],
            meetingType: formData.meetingType,
            linkedEntities: meeting?.linkedEntities || [],
            status: meeting?.status || 'Scheduled',
            createdAt: meeting?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: meeting?.createdBy || 'Current User'
        };

        onSave(newMeeting);
    };

    // Add participant
    const handleAddParticipant = () => {
        if (!newParticipant.name.trim()) return;

        const participant: MeetingParticipant = {
            id: `part-${Date.now()}`,
            type: newParticipant.type,
            name: newParticipant.name,
            email: newParticipant.email || undefined,
            role: newParticipant.role
        };

        setParticipants([...participants, participant]);
        setNewParticipant({ name: '', email: '', type: 'Internal', role: 'Attendee' });
        setShowAddParticipant(false);
    };

    // Remove participant
    const handleRemoveParticipant = (id: string) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    // Add agenda item
    const handleAddAgendaItem = () => {
        if (!newAgendaItem.title.trim()) return;

        const item: AgendaItem = {
            id: `agenda-${Date.now()}`,
            order: agendaItems.length + 1,
            title: newAgendaItem.title,
            duration: newAgendaItem.duration || undefined,
            completed: false
        };

        setAgendaItems([...agendaItems, item]);
        setNewAgendaItem({ title: '', duration: 15 });
        setShowAddAgenda(false);
    };

    // Remove agenda item
    const handleRemoveAgendaItem = (id: string) => {
        setAgendaItems(
            agendaItems
                .filter(a => a.id !== id)
                .map((a, idx) => ({ ...a, order: idx + 1 }))
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivolve-paper via-white to-ivolve-paper">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCancel}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-medium">Back</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Meeting' : 'New Meeting'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                            >
                                <Save size={18} />
                                {isEditing ? 'Save Changes' : 'Create Meeting'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-ivolve-mid" />
                            Meeting Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter meeting title"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                        errors.title ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What is this meeting about?"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meeting Type
                                    </label>
                                    <select
                                        value={formData.meetingType}
                                        onChange={(e) => setFormData({ ...formData, meetingType: e.target.value as MeetingType })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                        <option value="Support Review">Support Review</option>
                                        <option value="Training">Training</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Recurrence
                                    </label>
                                    <select
                                        value={formData.recurrence}
                                        onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as RecurrencePattern })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="One-off">One-off</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Fortnightly">Fortnightly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-ivolve-mid" />
                            Schedule
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                        errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.scheduledDate && <p className="text-sm text-red-500 mt-1">{errors.scheduledDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                        errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.scheduledTime && <p className="text-sm text-red-500 mt-1">{errors.scheduledTime}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (mins)
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    min="15"
                                    step="15"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Room name, address, or 'Virtual - Microsoft Teams'"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Users size={20} className="text-ivolve-mid" />
                                Attendees ({participants.length})
                            </h2>
                            <button
                                onClick={() => setShowAddParticipant(true)}
                                className="flex items-center gap-1 text-sm text-ivolve-mid hover:text-ivolve-dark font-medium"
                            >
                                <Plus size={16} />
                                Add Attendee
                            </button>
                        </div>

                        {/* Add Participant Form */}
                        {showAddParticipant && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid md:grid-cols-4 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={newParticipant.name}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                                        placeholder="Name"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <input
                                        type="email"
                                        value={newParticipant.email}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                                        placeholder="Email (optional)"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <select
                                        value={newParticipant.type}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, type: e.target.value as 'Internal' | 'External' })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                    </select>
                                    <select
                                        value={newParticipant.role}
                                        onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value as MeetingParticipant['role'] })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="Attendee">Attendee</option>
                                        <option value="Organizer">Organizer</option>
                                        <option value="Chair">Chair</option>
                                        <option value="Minute Taker">Minute Taker</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddParticipant(false)}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddParticipant}
                                        disabled={!newParticipant.name.trim()}
                                        className="px-3 py-1.5 text-sm bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Participants List */}
                        {participants.length > 0 ? (
                            <div className="space-y-2">
                                {participants.map(participant => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid font-medium text-sm">
                                                {participant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{participant.name}</p>
                                                <p className="text-xs text-gray-500">{participant.type} &bull; {participant.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveParticipant(participant.id)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No attendees added yet. Click "Add Attendee" to invite people.
                            </p>
                        )}
                    </div>

                    {/* Agenda */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FileText size={20} className="text-ivolve-mid" />
                                Agenda ({agendaItems.length})
                            </h2>
                            <button
                                onClick={() => setShowAddAgenda(true)}
                                className="flex items-center gap-1 text-sm text-ivolve-mid hover:text-ivolve-dark font-medium"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>

                        {/* Add Agenda Form */}
                        {showAddAgenda && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid md:grid-cols-3 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={newAgendaItem.title}
                                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                                        placeholder="Agenda item title"
                                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={newAgendaItem.duration}
                                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, duration: parseInt(e.target.value) || 0 })}
                                        placeholder="Duration (mins)"
                                        min="5"
                                        step="5"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddAgenda(false)}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddAgendaItem}
                                        disabled={!newAgendaItem.title.trim()}
                                        className="px-3 py-1.5 text-sm bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Agenda List */}
                        {agendaItems.length > 0 ? (
                            <div className="space-y-2">
                                {agendaItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid font-medium text-xs">
                                                {item.order}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                                                {item.duration && (
                                                    <p className="text-xs text-gray-500">{item.duration} mins</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveAgendaItem(item.id)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No agenda items yet. Click "Add Item" to structure your meeting.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
