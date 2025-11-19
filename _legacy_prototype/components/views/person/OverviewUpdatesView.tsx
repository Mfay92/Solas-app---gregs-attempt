import React, { useState } from 'react';
import { Person, PersonStatus, TimelineEvent, TimelineEventType, NoteCategory, Flag } from '../../../types';
import Card from '../../Card';
import TimelineView from '../TimelineView';
import NotesModal from '../../NotesModal';
import { useData } from '../../../contexts/DataContext';
import AddNoteModal from '../../modals/AddNoteModal';
import { NOTE_CATEGORIES_DATA } from '../../../services/noteCategories';

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-bold text-ivolve-dark-green">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
);

const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


const OverviewUpdatesView: React.FC<{ person: Person }> = ({ person }) => {
    const { handleUpdatePerson } = useData();
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    
    const age = calculateAge(person.dob);
    const isFormer = person.status === PersonStatus.Former;
    const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

    const recentNotes = person.timeline
        .filter(e => e.type === TimelineEventType.Notes)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const handleSaveNote = (noteData: { title: string; category: NoteCategory; subCategory: string; description: string; isSensitive: boolean; }) => {
        const newNote: TimelineEvent = {
            id: `note-${Date.now()}`,
            date: new Date().toISOString(),
            type: TimelineEventType.Notes,
            title: noteData.title,
            description: noteData.description,
            actor: 'Matt Fay', // Should be current user
            noteCategory: noteData.category,
            noteSubCategory: noteData.subCategory,
            isSensitive: noteData.isSensitive
        };
        
        let updatedFlags = person.flags ? [...person.flags] : [];

        // Check if this sub-category should generate a flag
        const primaryCat = NOTE_CATEGORIES_DATA.find(c => c.name === noteData.category);
        const subCat = primaryCat?.subCategories.find(sc => sc.name === noteData.subCategory);

        if (subCat?.isFlag) {
            const newFlag: Flag = {
                id: `flag-note-${Date.now()}`,
                message: `${noteData.category}: ${noteData.title}`,
                level: subCat.flagLevel || 'warning',
            };
            updatedFlags.push(newFlag);
        }

        const updatedTimeline = [...person.timeline, newNote];
        handleUpdatePerson(person.id, { timeline: updatedTimeline, flags: updatedFlags });
        setIsAddNoteModalOpen(false);
        // Re-open the main notes modal to see the new note
        setIsNotesModalOpen(true);
    };
    
    return (
        <>
            {isNotesModalOpen && <NotesModal person={person} onClose={() => setIsNotesModalOpen(false)} onAddNote={() => { setIsNotesModalOpen(false); setIsAddNoteModalOpen(true); }} />}
            {isAddNoteModalOpen && <AddNoteModal onSave={handleSaveNote} onClose={() => setIsAddNoteModalOpen(false)} />}
            <div className="space-y-6">
                <Card title="Personal Details" titleClassName={cardTitleClass}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        <InfoItem label="Legal First Name" value={person.legalFirstName} />
                        <InfoItem label="Preferred First Name" value={person.preferredFirstName} />
                        <InfoItem label="Surname" value={person.surname} />
                        <InfoItem label="Title" value={person.title} />
                        <InfoItem 
                            label="Date of Birth" 
                            value={`${new Date(person.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (Age ${age})`}
                        />
                        <InfoItem label="Email Address" value={person.email} />
                        <InfoItem label="Phone Number" value={person.phone} />
                        <InfoItem label="Marital Status" value={person.maritalStatus} />
                        <InfoItem label="Ethnicity" value={person.ethnicity} />
                        <InfoItem label="Nationality" value={person.nationality} />
                        <InfoItem label="Religion / Faith" value={person.religion} />
                    </div>
                </Card>
                
                <Card 
                    title={
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Recent Notes</h3>
                            <button onClick={() => setIsNotesModalOpen(true)} className="bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm">View All Notes</button>
                        </div>
                    } 
                    titleClassName={cardTitleClass}
                >
                    {recentNotes.length > 0 ? (
                        <div className="space-y-3">
                            {recentNotes.map(note => (
                                <div key={note.id} className={`p-2 border-l-4 rounded-r-md ${note.isSensitive ? 'bg-ivolve-warning-bg border-status-orange' : 'bg-gray-50 border-gray-300'}`}>
                                    <p className="text-sm text-solas-gray">{note.description}</p>
                                    <p className="text-xs text-right text-gray-500 mt-1">- {note.actor} on {new Date(note.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-solas-gray text-center py-4">No notes have been logged for this person yet.</p>
                    )}
                </Card>

                <TimelineView events={person.timeline.filter(e => e.type !== TimelineEventType.Notes)} moveInDate={person.moveInDate} moveOutDate={person.moveOutDate} />
            </div>
        </>
    );
};

export default OverviewUpdatesView;