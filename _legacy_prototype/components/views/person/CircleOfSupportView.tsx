

import React, { useState } from 'react';
import { Person, PersonContact, PersonStatus } from '../../../types';
import Card from '../../Card';
import { UserIcon, BuildingIcon, PhoneIcon, EmailIcon, AddIcon, EditIcon, TrashIcon } from '../../Icons';
import { useData } from '../../../contexts/DataContext';
import AddEditCircleContactModal from '../../modals/AddEditCircleContactModal';

type CircleOfSupportViewProps = {
  person: Person;
};

const ContactDisplayCard: React.FC<{ contact: PersonContact; onEdit: () => void; onDelete: () => void; }> = ({ contact, onEdit, onDelete }) => {
    const isOrg = contact.isOrganisation;
    const title = isOrg ? contact.organisationName : contact.name;
    const subtitle = isOrg ? contact.name : contact.relationship;

    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                {isOrg ? <BuildingIcon /> : <UserIcon />}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-solas-dark">{title}</p>
                        <p className="text-sm text-solas-gray">{subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-xs font-semibold bg-ivolve-blue/10 text-ivolve-blue px-2 py-0.5 rounded-full">{contact.relationship}</p>
                         <button onClick={onEdit} className="p-1 text-gray-400 hover:text-ivolve-blue"><EditIcon /></button>
                         <button onClick={onDelete} className="p-1 text-gray-400 hover:text-status-red"><TrashIcon /></button>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                    {contact.phone && (
                        <div className="flex items-center space-x-2 text-solas-gray">
                            <PhoneIcon /> <span>{contact.phone}</span>
                        </div>
                    )}
                     {contact.email && (
                        <div className="flex items-center space-x-2 text-ivolve-blue">
                            <EmailIcon /> <span>{contact.email}</span>
                        </div>
                    )}
                </div>
                 {contact.notes && (
                    <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-md border">
                        <p className="font-semibold">Notes:</p>
                        <p>{contact.notes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const CircleOfSupportView: React.FC<CircleOfSupportViewProps> = ({ person }) => {
  const { handleUpdatePerson } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<PersonContact | null>(null);

  const openAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: PersonContact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };
  
  const handleDelete = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
        const updatedContacts = person.contacts.filter(c => c.id !== contactId);
        handleUpdatePerson(person.id, { contacts: updatedContacts });
    }
  };

  const handleSave = (contact: Omit<PersonContact, 'id'> & { id?: string }) => {
    let updatedContacts: PersonContact[];
    if (contact.id) { // Editing existing
        updatedContacts = person.contacts.map(c => c.id === contact.id ? (contact as PersonContact) : c);
    } else { // Adding new
        const newContact: PersonContact = { ...contact, id: `pc-${Date.now()}`};
        updatedContacts = [...person.contacts, newContact];
    }
    handleUpdatePerson(person.id, { contacts: updatedContacts });
    setIsModalOpen(false);
  };

  const isFormer = person.status === PersonStatus.Former;
  const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

  const cardTitle = (
      <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Circle of Support</h3>
          <button
              onClick={openAddModal}
              className="flex items-center space-x-2 bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"
          >
              <AddIcon />
              <span>Add Contact</span>
          </button>
      </div>
  );

  return (
    <>
        {isModalOpen && (
            <AddEditCircleContactModal
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingContact}
            />
        )}
        <Card title={cardTitle} titleClassName={cardTitleClass}>
        <p className="text-sm text-solas-gray mb-4">
            This is a private contact list for this individual only. These contacts will not appear in the main Contact Hub.
        </p>
        {person.contacts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {person.contacts.map((contact) => (
                <ContactDisplayCard 
                    key={contact.id} 
                    contact={contact} 
                    onEdit={() => openEditModal(contact)}
                    onDelete={() => handleDelete(contact.id)}
                />
            ))}
            </div>
        ) : (
            <p className="text-solas-gray text-center py-8">No contacts have been added to this person's circle of support yet.</p>
        )}
        </Card>
    </>
  );
};

export default CircleOfSupportView;
