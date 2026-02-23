import { useState } from 'react';
import { Meeting, ActionItem, ActionItemStatus } from '../../../types';
import {
    CheckSquare,
    Plus,
    Calendar,
    User,
    Check,
    Trash2,
    X,
    Filter
} from 'lucide-react';

interface ActionsTabProps {
    meeting: Meeting;
    onUpdate: (meeting: Meeting) => void;
}

export default function ActionsTab({ meeting, onUpdate }: ActionsTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [newAction, setNewAction] = useState({
        title: '',
        description: '',
        assigneeName: '',
        dueDate: ''
    });

    const handleAddAction = () => {
        if (!newAction.title.trim() || !newAction.assigneeName.trim()) return;

        const actionItem: ActionItem = {
            id: `action-${Date.now()}`,
            title: newAction.title,
            description: newAction.description || undefined,
            assigneeName: newAction.assigneeName,
            dueDate: newAction.dueDate || undefined,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        const updatedMeeting: Meeting = {
            ...meeting,
            actionItems: [...(meeting.actionItems || []), actionItem],
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
        setNewAction({ title: '', description: '', assigneeName: '', dueDate: '' });
        setShowAddForm(false);
    };

    const handleRemoveAction = (actionId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            actionItems: (meeting.actionItems || []).filter(a => a.id !== actionId),
            updatedAt: new Date().toISOString()
        };
        onUpdate(updatedMeeting);
    };

    const handleToggleStatus = (actionId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            actionItems: (meeting.actionItems || []).map(action => {
                if (action.id === actionId) {
                    if (action.status === 'Completed') {
                        return { ...action, status: 'Pending' as ActionItemStatus, completedAt: undefined, completedBy: undefined };
                    } else {
                        return {
                            ...action,
                            status: 'Completed' as ActionItemStatus,
                            completedAt: new Date().toISOString(),
                            completedBy: 'Current User' // In real app, this would be the logged-in user
                        };
                    }
                }
                return action;
            }),
            updatedAt: new Date().toISOString()
        };
        onUpdate(updatedMeeting);
    };

    const getStatusColor = (status: ActionItemStatus) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-amber-100 text-amber-800';
            case 'Overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
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
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Check if action is overdue
    const isOverdue = (action: ActionItem) => {
        if (action.status === 'Completed') return false;
        if (!action.dueDate) return false;
        return new Date(action.dueDate) < new Date();
    };

    // Get filtered actions
    const actions = (meeting.actionItems || []).map(action => ({
        ...action,
        status: isOverdue(action) ? 'Overdue' as ActionItemStatus : action.status
    }));

    const filteredActions = filterStatus === 'All'
        ? actions
        : actions.filter(a => a.status === filterStatus);

    // Stats
    const stats = {
        total: actions.length,
        pending: actions.filter(a => a.status === 'Pending').length,
        inProgress: actions.filter(a => a.status === 'In Progress').length,
        completed: actions.filter(a => a.status === 'Completed').length,
        overdue: actions.filter(a => a.status === 'Overdue').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <CheckSquare size={20} className="text-ivolve-mid" />
                        Action Items
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {stats.total} actions ({stats.completed} completed, {stats.pending + stats.inProgress} pending)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent text-sm"
                        >
                            <option value="All">All ({stats.total})</option>
                            <option value="Pending">Pending ({stats.pending})</option>
                            <option value="In Progress">In Progress ({stats.inProgress})</option>
                            <option value="Completed">Completed ({stats.completed})</option>
                            <option value="Overdue">Overdue ({stats.overdue})</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Add Action
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            {stats.total > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                        <p className="text-xs text-gray-500 uppercase">Pending</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-amber-800">{stats.inProgress}</p>
                        <p className="text-xs text-amber-600 uppercase">In Progress</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
                        <p className="text-xs text-green-600 uppercase">Completed</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-800">{stats.overdue}</p>
                        <p className="text-xs text-red-600 uppercase">Overdue</p>
                    </div>
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Add Action Item</h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action *</label>
                            <input
                                type="text"
                                value={newAction.title}
                                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                                placeholder="What needs to be done?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={newAction.description}
                                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                                placeholder="Additional details or context"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                                <input
                                    type="text"
                                    value={newAction.assigneeName}
                                    onChange={(e) => setNewAction({ ...newAction, assigneeName: e.target.value })}
                                    placeholder="Who is responsible?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newAction.dueDate}
                                    onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
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
                            onClick={handleAddAction}
                            disabled={!newAction.title.trim() || !newAction.assigneeName.trim()}
                            className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Action
                        </button>
                    </div>
                </div>
            )}

            {/* Actions List */}
            {filteredActions.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredActions.map((action) => (
                            <div
                                key={action.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                    action.status === 'Completed' ? 'bg-green-50/30' : ''
                                } ${action.status === 'Overdue' ? 'bg-red-50/30' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggleStatus(action.id)}
                                        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                            action.status === 'Completed'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-ivolve-mid'
                                        }`}
                                    >
                                        {action.status === 'Completed' && <Check size={14} />}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className={`font-medium ${
                                                action.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                                            }`}>
                                                {action.title}
                                            </h4>
                                            <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(action.status)}`}>
                                                {action.status}
                                            </span>
                                        </div>
                                        {action.description && (
                                            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                {action.assigneeName}
                                            </span>
                                            {action.dueDate && (
                                                <span className={`flex items-center gap-1 ${
                                                    action.status === 'Overdue' ? 'text-red-500 font-medium' : ''
                                                }`}>
                                                    <Calendar size={12} />
                                                    Due: {formatDate(action.dueDate)}
                                                </span>
                                            )}
                                            {action.completedAt && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <Check size={12} />
                                                    Completed: {formatDateTime(action.completedAt)}
                                                    {action.completedBy && ` by ${action.completedBy}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleRemoveAction(action.id)}
                                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {filterStatus !== 'All' ? `No ${filterStatus.toLowerCase()} actions` : 'No action items yet'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {filterStatus !== 'All'
                            ? 'Try changing the filter to see other actions'
                            : 'Add action items to track follow-ups from this meeting'}
                    </p>
                    {filterStatus === 'All' && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                        >
                            <Plus size={18} />
                            Add First Action
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
