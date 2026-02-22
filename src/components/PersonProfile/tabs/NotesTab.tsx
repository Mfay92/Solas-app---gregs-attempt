import { useState } from 'react';
import { Person, Note, NoteType, ServiceType } from '../../../types';
import { PersonTabId } from '../../../types/tabs';
import {
    MessageSquare, Plus, Phone, Mail, Home as HomeIcon, Heart,
    Stethoscope, AlertTriangle, FileText, Pin, PinOff, ChevronDown, ChevronUp, Paperclip
} from 'lucide-react';

interface NotesTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

export default function NotesTab({ borderColor = 'border-gray-200' }: NotesTabProps) {
    const [selectedType, setSelectedType] = useState<NoteType | 'All'>('All');
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    // Mock notes (empty for now)
    const mockNotes: Note[] = [];

    const noteTypes: (NoteType | 'All')[] = [
        'All',
        'General',
        'Phone Call',
        'Email',
        'Visit',
        'Support Note',
        'Clinical Note',
        'Incident'
    ];

    const filteredNotes = mockNotes.filter(note =>
        selectedType === 'All' || note.type === selectedType
    );

    // Sort: pinned first, then by date (newest first)
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const toggleNoteExpansion = (noteId: string) => {
        const newExpanded = new Set(expandedNotes);
        if (newExpanded.has(noteId)) {
            newExpanded.delete(noteId);
        } else {
            newExpanded.add(noteId);
        }
        setExpandedNotes(newExpanded);
    };

    const getNoteTypeIcon = (type: NoteType) => {
        switch (type) {
            case 'Phone Call':
                return <Phone size={16} />;
            case 'Email':
                return <Mail size={16} />;
            case 'Visit':
                return <HomeIcon size={16} />;
            case 'Support Note':
                return <Heart size={16} />;
            case 'Clinical Note':
                return <Stethoscope size={16} />;
            case 'Incident':
                return <AlertTriangle size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    const getNoteTypeColor = (type: NoteType) => {
        const colors: Record<NoteType, string> = {
            'General': 'bg-gray-100 text-gray-800',
            'Phone Call': 'bg-blue-100 text-blue-800',
            'Email': 'bg-purple-100 text-purple-800',
            'Visit': 'bg-green-100 text-green-800',
            'Support Note': 'bg-pink-100 text-pink-800',
            'Clinical Note': 'bg-red-100 text-red-800',
            'Risk Assessment': 'bg-orange-100 text-orange-800',
            'Incident': 'bg-yellow-100 text-yellow-800',
            'Financial': 'bg-emerald-100 text-emerald-800',
            'Property Note': 'bg-indigo-100 text-indigo-800',
            'System Change': 'bg-slate-100 text-slate-800'
        };
        return colors[type];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} overflow-hidden`}>
                <div className="bg-gradient-to-r from-ivolve-teal to-ivolve-mid px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare size={24} />
                            Notes & Activity
                        </h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-ivolve-mid rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            <Plus size={18} />
                            Add Note
                        </button>
                    </div>
                </div>

                {/* Note Type Filters */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {noteTypes.map(type => {
                            const count = type === 'All' ? mockNotes.length : mockNotes.filter(n => n.type === type).length;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                        selectedType === type
                                            ? 'bg-ivolve-mid text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {type}
                                    {count > 0 && (
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                            selectedType === type
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notes Timeline */}
                {sortedNotes.length === 0 ? (
                    /* Empty State */
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <MessageSquare className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notes Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {selectedType !== 'All'
                                ? `No ${selectedType.toLowerCase()}s have been recorded yet. Add the first one to start tracking.`
                                : 'No notes have been added for this person yet. Start documenting interactions and important information.'}
                        </p>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium">
                            <Plus size={18} />
                            Add First Note
                        </button>
                    </div>
                ) : (
                    /* Timeline View */
                    <div className="p-6">
                        <div className="relative">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            {/* Notes */}
                            <div className="space-y-6">
                                {sortedNotes.map((note) => {
                                    const isExpanded = expandedNotes.has(note.id);
                                    const contentPreview = note.content.length > 200
                                        ? note.content.substring(0, 200) + '...'
                                        : note.content;

                                    return (
                                        <div key={note.id} className="relative pl-16">
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                                note.pinned
                                                    ? 'bg-amber-100 border-4 border-amber-300'
                                                    : 'bg-white border-4 border-gray-200'
                                            }`}>
                                                <div className={note.pinned ? 'text-amber-600' : 'text-gray-400'}>
                                                    {getNoteTypeIcon(note.type)}
                                                </div>
                                            </div>

                                            {/* Note Card */}
                                            <div className={`bg-white rounded-lg border-2 transition-all ${
                                                note.pinned
                                                    ? 'border-amber-200 bg-amber-50/30'
                                                    : `${borderColor} hover:border-gray-200`
                                            }`}>
                                                {/* Note Header */}
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${getNoteTypeColor(note.type)}`}>
                                                                    {getNoteTypeIcon(note.type)}
                                                                    {note.type}
                                                                </span>
                                                                {note.pinned && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                                                                        <Pin size={12} />
                                                                        Pinned
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                                {note.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <span>{formatDate(note.createdAt)}</span>
                                                                <span className="text-gray-300">•</span>
                                                                <span>by {note.createdBy}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleNoteExpansion(note.id)}
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </button>
                                                    </div>

                                                    {/* Note Content */}
                                                    <div className="text-gray-700 leading-relaxed">
                                                        {isExpanded ? note.content : contentPreview}
                                                    </div>

                                                    {!isExpanded && note.content.length > 200 && (
                                                        <button
                                                            onClick={() => toggleNoteExpansion(note.id)}
                                                            className="mt-2 text-sm text-ivolve-mid hover:text-ivolve-dark font-medium"
                                                        >
                                                            Read more
                                                        </button>
                                                    )}

                                                    {/* Attachments */}
                                                    {note.attachments && note.attachments.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                                <Paperclip size={16} />
                                                                Attachments ({note.attachments.length})
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {note.attachments.map(attachment => (
                                                                    <a
                                                                        key={attachment.id}
                                                                        href={attachment.url}
                                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                                                                    >
                                                                        <FileText size={16} />
                                                                        <span className="truncate max-w-[200px]">{attachment.filename}</span>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Note Actions */}
                                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                                        {note.pinned ? (
                                                            <>
                                                                <PinOff size={16} />
                                                                Unpin
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Pin size={16} />
                                                                Pin
                                                            </>
                                                        )}
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <button className="px-3 py-1.5 text-sm text-ivolve-mid hover:bg-ivolve-mid/10 rounded transition-colors font-medium">
                                                            Edit
                                                        </button>
                                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors font-medium">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} p-6`}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-ivolve-mid">0</p>
                        <p className="text-sm text-gray-600 mt-1">Total Notes</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Pinned</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">This Month</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">This Week</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
