import { useState } from 'react';
import { Meeting, AgendaItem } from '../../../types';
import {
    FileText,
    Plus,
    GripVertical,
    Clock,
    User,
    Check,
    Trash2,
    X
} from 'lucide-react';

interface AgendaTabProps {
    meeting: Meeting;
    onUpdate: (meeting: Meeting) => void;
}

export default function AgendaTab({ meeting, onUpdate }: AgendaTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        duration: 15,
        presenter: ''
    });

    const handleAddItem = () => {
        if (!newItem.title.trim()) return;

        const agendaItem: AgendaItem = {
            id: `agenda-${Date.now()}`,
            order: meeting.agenda.length + 1,
            title: newItem.title,
            description: newItem.description || undefined,
            duration: newItem.duration || undefined,
            presenter: newItem.presenter || undefined,
            completed: false
        };

        const updatedMeeting: Meeting = {
            ...meeting,
            agenda: [...meeting.agenda, agendaItem],
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
        setNewItem({ title: '', description: '', duration: 15, presenter: '' });
        setShowAddForm(false);
    };

    const handleRemoveItem = (itemId: string) => {
        const updatedAgenda = meeting.agenda
            .filter(item => item.id !== itemId)
            .map((item, idx) => ({ ...item, order: idx + 1 }));

        const updatedMeeting: Meeting = {
            ...meeting,
            agenda: updatedAgenda,
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
    };

    const handleToggleComplete = (itemId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            agenda: meeting.agenda.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
    };

    const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
        const currentIndex = meeting.agenda.findIndex(item => item.id === itemId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= meeting.agenda.length) return;

        const newAgenda = [...meeting.agenda];
        [newAgenda[currentIndex], newAgenda[newIndex]] = [newAgenda[newIndex], newAgenda[currentIndex]];

        const updatedAgenda = newAgenda.map((item, idx) => ({ ...item, order: idx + 1 }));

        const updatedMeeting: Meeting = {
            ...meeting,
            agenda: updatedAgenda,
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
    };

    // Calculate total estimated duration
    const totalDuration = meeting.agenda.reduce((sum, item) => sum + (item.duration || 0), 0);
    const completedItems = meeting.agenda.filter(item => item.completed).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-ivolve-mid" />
                        Agenda
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {meeting.agenda.length} items ({completedItems} completed) &bull; Est. {totalDuration} mins
                    </p>
                </div>
                {meeting.status !== 'Completed' && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                )}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Add Agenda Item</h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                value={newItem.title}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                placeholder="Enter agenda item title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                placeholder="Optional description or notes"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                                <input
                                    type="number"
                                    value={newItem.duration}
                                    onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    step="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Presenter</label>
                                <input
                                    type="text"
                                    value={newItem.presenter}
                                    onChange={(e) => setNewItem({ ...newItem, presenter: e.target.value })}
                                    placeholder="Who will present this item?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
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
                            onClick={handleAddItem}
                            disabled={!newItem.title.trim()}
                            className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Item
                        </button>
                    </div>
                </div>
            )}

            {/* Agenda Items List */}
            {meeting.agenda.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {meeting.agenda
                            .sort((a, b) => a.order - b.order)
                            .map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${
                                        item.completed ? 'bg-green-50/50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Order Number / Checkbox */}
                                        <button
                                            onClick={() => handleToggleComplete(item.id)}
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                                                item.completed
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-ivolve-mid/10 text-ivolve-mid hover:bg-ivolve-mid/20'
                                            }`}
                                        >
                                            {item.completed ? <Check size={16} /> : item.order}
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium ${
                                                item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                                            }`}>
                                                {item.title}
                                            </h4>
                                            {item.description && (
                                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                                {item.duration && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {item.duration} mins
                                                    </span>
                                                )}
                                                {item.presenter && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} />
                                                        {item.presenter}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {meeting.status !== 'Completed' && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleMoveItem(item.id, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                                                    title="Move up"
                                                >
                                                    <GripVertical size={16} className="rotate-180" />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveItem(item.id, 'down')}
                                                    disabled={index === meeting.agenda.length - 1}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                                                    title="Move down"
                                                >
                                                    <GripVertical size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No agenda items yet</h3>
                    <p className="text-gray-500 mb-4">Add items to structure your meeting</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Add First Item
                    </button>
                </div>
            )}
        </div>
    );
}
