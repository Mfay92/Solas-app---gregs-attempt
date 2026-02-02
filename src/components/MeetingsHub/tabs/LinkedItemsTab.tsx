import { useState } from 'react';
import { Meeting, MeetingLinkedEntity } from '../../../types';
import {
    Link2,
    Plus,
    Building2,
    User,
    Home,
    FileText,
    Trash2,
    X,
    ExternalLink
} from 'lucide-react';

interface LinkedItemsTabProps {
    meeting: Meeting;
    onUpdate: (meeting: Meeting) => void;
}

export default function LinkedItemsTab({ meeting, onUpdate }: LinkedItemsTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLink, setNewLink] = useState({
        entityType: 'Person' as MeetingLinkedEntity['entityType'],
        entityName: '',
        context: ''
    });

    const getEntityIcon = (type: MeetingLinkedEntity['entityType']) => {
        switch (type) {
            case 'Person':
                return <User size={18} className="text-blue-500" />;
            case 'Property':
                return <Building2 size={18} className="text-green-500" />;
            case 'Unit':
                return <Home size={18} className="text-purple-500" />;
            case 'Referral':
                return <FileText size={18} className="text-amber-500" />;
            default:
                return <Link2 size={18} className="text-gray-500" />;
        }
    };

    const getEntityColor = (type: MeetingLinkedEntity['entityType']) => {
        switch (type) {
            case 'Person':
                return 'bg-blue-50 border-blue-200';
            case 'Property':
                return 'bg-green-50 border-green-200';
            case 'Unit':
                return 'bg-purple-50 border-purple-200';
            case 'Referral':
                return 'bg-amber-50 border-amber-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const handleAddLink = () => {
        if (!newLink.entityName.trim()) return;

        const linkedEntity: MeetingLinkedEntity = {
            entityType: newLink.entityType,
            entityId: `temp-${Date.now()}`, // In real app, would be selected from search
            entityName: newLink.entityName,
            linkedAt: new Date().toISOString(),
            linkedBy: 'Current User', // In real app, would be logged-in user
            context: newLink.context || undefined
        };

        const updatedMeeting: Meeting = {
            ...meeting,
            linkedEntities: [...meeting.linkedEntities, linkedEntity],
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedMeeting);
        setNewLink({ entityType: 'Person', entityName: '', context: '' });
        setShowAddForm(false);
    };

    const handleRemoveLink = (entityId: string) => {
        const updatedMeeting: Meeting = {
            ...meeting,
            linkedEntities: meeting.linkedEntities.filter(e => e.entityId !== entityId),
            updatedAt: new Date().toISOString()
        };
        onUpdate(updatedMeeting);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Group by type
    const groupedEntities = meeting.linkedEntities.reduce((acc, entity) => {
        if (!acc[entity.entityType]) {
            acc[entity.entityType] = [];
        }
        acc[entity.entityType].push(entity);
        return acc;
    }, {} as Record<string, MeetingLinkedEntity[]>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Link2 size={20} className="text-ivolve-mid" />
                        Linked Items
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {meeting.linkedEntities.length} items linked to this meeting
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                >
                    <Plus size={18} />
                    Link Item
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Link Item to Meeting</h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                <select
                                    value={newLink.entityType}
                                    onChange={(e) => setNewLink({ ...newLink, entityType: e.target.value as MeetingLinkedEntity['entityType'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                >
                                    <option value="Person">Person</option>
                                    <option value="Property">Property</option>
                                    <option value="Unit">Unit</option>
                                    <option value="Referral">Referral</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={newLink.entityName}
                                    onChange={(e) => setNewLink({ ...newLink, entityName: e.target.value })}
                                    placeholder={`Enter ${newLink.entityType.toLowerCase()} name`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                            <input
                                type="text"
                                value={newLink.context}
                                onChange={(e) => setNewLink({ ...newLink, context: e.target.value })}
                                placeholder="Why is this linked? (optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                            />
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
                            onClick={handleAddLink}
                            disabled={!newLink.entityName.trim()}
                            className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Link Item
                        </button>
                    </div>
                </div>
            )}

            {/* Grouped Linked Items */}
            {meeting.linkedEntities.length > 0 ? (
                <div className="space-y-4">
                    {Object.entries(groupedEntities).map(([type, entities]) => (
                        <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                {getEntityIcon(type as MeetingLinkedEntity['entityType'])}
                                <h3 className="font-medium text-gray-700">
                                    {type}s ({entities.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {entities.map((entity) => (
                                    <div
                                        key={entity.entityId}
                                        className={`p-4 hover:bg-gray-50 transition-colors`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${getEntityColor(entity.entityType)}`}>
                                                    {getEntityIcon(entity.entityType)}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                                        {entity.entityName}
                                                        <button
                                                            className="text-ivolve-mid hover:text-ivolve-dark"
                                                            title="View in new tab"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </h4>
                                                    {entity.context && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {entity.context}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Linked by {entity.linkedBy} on {formatDateTime(entity.linkedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveLink(entity.entityId)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove link"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Link2 size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No linked items yet</h3>
                    <p className="text-gray-500 mb-4">
                        Link people, properties, or referrals discussed in this meeting
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                    >
                        <Plus size={18} />
                        Link First Item
                    </button>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2">About linked items</h3>
                <p className="text-sm text-blue-700">
                    When you link a person, property, or referral to a meeting, it creates a reference that can be viewed from both sides.
                    This helps track which meetings discussed specific topics and ensures nothing falls through the cracks.
                </p>
            </div>
        </div>
    );
}
