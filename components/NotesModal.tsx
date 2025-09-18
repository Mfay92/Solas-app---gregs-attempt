

import React, { useState, useMemo } from 'react';
import { Person, TimelineEvent, TimelineEventType } from '../types';
import Modal from './Modal';
import { WarningIcon, AddIcon, ArrowLeftIcon } from './Icons';
import HelpButton from './HelpButton';
import HelpModal from './modals/HelpModal';

type NotesModalProps = {
    person: Person;
    onClose: () => void;
    onAddNote: () => void;
};

const NotesModal: React.FC<NotesModalProps> = ({ person, onClose, onAddNote }) => {
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [detailViewNote, setDetailViewNote] = useState<TimelineEvent | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const notes = useMemo(() => {
        let filtered = person.timeline.filter(e => e.type === TimelineEventType.Notes || e.type === TimelineEventType.System);

        if (categoryFilter !== 'All') {
            filtered = filtered.filter(n => n.noteCategory === categoryFilter);
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        return filtered;
    }, [person.timeline, categoryFilter, sortOrder]);

    const categories = ['All', 'General', 'Safeguarding', 'Incident', 'Positive', 'Health', 'Finance', 'Housing', 'Family Contact', 'Tenancy & Rent', 'RP/Landlord'];

    const renderListView = () => (
        <div className="h-full flex flex-col">
            {/* Filter Controls */}
            <div className="flex-shrink-0 p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">Category:</label>
                    <select
                        id="category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-1.5 border-gray-300 rounded-md shadow-sm text-sm"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <button onClick={() => setSortOrder('newest')} className={`px-3 py-1 text-xs font-bold rounded-full ${sortOrder === 'newest' ? 'bg-ivolve-blue text-white' : 'bg-white'}`}>Newest</button>
                    <button onClick={() => setSortOrder('oldest')} className={`px-3 py-1 text-xs font-bold rounded-full ${sortOrder === 'oldest' ? 'bg-ivolve-blue text-white' : 'bg-white'}`}>Oldest</button>
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-grow space-y-3 mt-4 overflow-y-auto pr-2">
                {notes.length > 0 ? notes.map(note => (
                    <button 
                        key={note.id} 
                        onClick={() => setDetailViewNote(note)}
                        className={`w-full text-left p-3 border rounded-md transition-colors ${note.isSensitive ? 'bg-ivolve-warning-bg border-l-4 border-status-orange hover:bg-ivolve-warning-bg-deep' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-start text-xs">
                            <h4 className="font-bold text-md text-solas-dark">{note.title || 'Untitled Note'}</h4>
                            <div className="flex items-center space-x-2">
                                {note.isSensitive && <span className="flex items-center font-bold text-status-orange"><WarningIcon className="w-4 h-4 mr-1" /> Sensitive</span>}
                                {note.noteCategory && <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-semibold">{note.noteCategory}</span>}
                                {note.noteSubCategory && <span className="px-2 py-0.5 bg-gray-600 text-white rounded-full font-semibold">{note.noteSubCategory}</span>}
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-solas-gray truncate">{note.description}</p>
                        <div className="text-left text-xs text-gray-500 mt-3">
                            {new Date(note.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            <span className="ml-2">by {note.actor}</span>
                        </div>
                    </button>
                )) : (
                    <p className="text-center text-gray-500 py-10">No notes found for the selected filters.</p>
                )}
            </div>
        </div>
    );

    const renderDetailView = () => {
        if (!detailViewNote) return null;
        return (
             <div className="h-full flex flex-col">
                <div className="flex-shrink-0">
                    <button onClick={() => setDetailViewNote(null)} className="flex items-center space-x-2 font-semibold text-ivolve-blue mb-4">
                        <ArrowLeftIcon />
                        <span>Back to Notes</span>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className={`p-4 border rounded-md ${detailViewNote.isSensitive ? 'bg-ivolve-warning-bg' : 'bg-white'}`}>
                        <div className="flex justify-between items-start text-xs">
                            <h3 className="text-2xl font-bold text-solas-dark">{detailViewNote.title}</h3>
                             <div className="flex items-center space-x-2">
                                {detailViewNote.isSensitive && <span className="flex items-center font-bold text-status-orange"><WarningIcon className="w-4 h-4 mr-1" /> Sensitive</span>}
                                {detailViewNote.noteCategory && <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-semibold">{detailViewNote.noteCategory}</span>}
                                {detailViewNote.noteSubCategory && <span className="px-2 py-0.5 bg-gray-600 text-white rounded-full font-semibold">{detailViewNote.noteSubCategory}</span>}
                            </div>
                        </div>
                        <p className="mt-4 text-md text-solas-gray whitespace-pre-wrap">{detailViewNote.description}</p>
                        <div className="text-left text-sm text-gray-500 mt-6 pt-4 border-t">
                            {new Date(detailViewNote.date).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            <span className="ml-2">by {detailViewNote.actor}</span>
                        </div>
                    </div>
                </div>
             </div>
        )
    };

    const modalTitle = detailViewNote ? `Note: ${detailViewNote.title}` : `Notes for ${person.preferredFirstName} ${person.surname}`;
    const headerActions = detailViewNote ? (
        <button onClick={() => setDetailViewNote(null)} className="flex items-center space-x-2 font-semibold text-ivolve-blue">
            <ArrowLeftIcon />
            <span>Back to Notes</span>
        </button>
    ) : (
        <div className="flex items-center space-x-2">
            <HelpButton onClick={() => setIsHelpOpen(true)} variant="modal" />
            <button
                onClick={onAddNote}
                className="flex items-center space-x-2 bg-ivolve-mid-green text-white text-sm font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"
            >
                <AddIcon />
                <span>Add New Note</span>
            </button>
        </div>
    );

    return (
        <>
            {isHelpOpen && <HelpModal topic="notesAndUpdates" onClose={() => setIsHelpOpen(false)} />}
            <Modal 
                title={modalTitle} 
                onClose={onClose} 
                className="max-w-screen-xl h-[95vh]"
            >
                {/* Custom Header within Modal Body */}
                <div className="pb-4 border-b mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-solas-dark">{modalTitle}</h3>
                    {headerActions}
                </div>
                
                <div className="h-[calc(100%-60px)]">
                    {detailViewNote ? renderDetailView() : renderListView()}
                </div>
            </Modal>
        </>
    );
};

export default NotesModal;