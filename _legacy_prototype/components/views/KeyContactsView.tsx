import React from 'react';
import { Property, IvolveStaff, Stakeholder, LinkedContact, Contact } from '../../types';
import Card from '../Card';
import { UserIcon } from '../Icons';

type KeyContactsViewProps = {
  property: Property;
  allStaff: IvolveStaff[];
  allStakeholders: Stakeholder[];
  onManageLinks: () => void;
};

type ResolvedContact = {
    id: string;
    role: string;
    name: string;
    org: string;
    photoUrl?: string;
    email: string;
    phone: string;
};

const KeyContactsView: React.FC<KeyContactsViewProps> = ({ property, allStaff, allStakeholders, onManageLinks }) => {
    const staffMap = new Map(allStaff.map(s => [s.id, s]));
    const stakeholderMap = new Map(allStakeholders.map(s => [s.id, s]));

    const resolvedContacts: ResolvedContact[] = (property.linkedContacts || []).map(linked => {
        if (linked.stakeholderId) {
            // It's a stakeholder contact
            const stakeholder = stakeholderMap.get(linked.stakeholderId);
            const contact = stakeholder?.contacts.find(c => c.id === linked.contactId);
            if (contact && stakeholder) {
                return {
                    id: linked.id,
                    role: linked.role,
                    name: contact.name,
                    org: stakeholder.name,
                    photoUrl: contact.photoUrl,
                    email: contact.email,
                    phone: contact.phone
                };
            }
        } else {
            // It's an ivolve staff member
            const staff = staffMap.get(linked.contactId);
            if (staff) {
                return {
                    id: linked.id,
                    role: linked.role,
                    name: staff.name,
                    org: 'ivolve Care & Support',
                    photoUrl: staff.photoUrl,
                    email: staff.email,
                    phone: staff.phone
                };
            }
        }
        return null;
    }).filter(c => c !== null) as ResolvedContact[];

    const cardTitle = (
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Key Contacts</h3>
            <button 
                onClick={onManageLinks}
                className="bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"
            >
                Manage Staff Links
            </button>
        </div>
    );


    return (
        <Card title={cardTitle} titleClassName="bg-ivolve-dark-green text-white" className="hover:shadow-xl hover:-translate-y-0.5">
            {resolvedContacts.length === 0 ? (
                <p className="text-app-text-gray">No key contacts have been linked to this property yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resolvedContacts.map(contact => (
                        <div key={contact.id} className="p-4 border rounded-md bg-white flex items-start space-x-3 shadow-sm">
                            {contact.photoUrl ? (
                                <img src={contact.photoUrl} alt={contact.name} className="w-14 h-14 rounded-full"/>
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <UserIcon />
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="font-bold text-solas-dark truncate">{contact.name}</p>
                                <p className="text-sm font-semibold text-ivolve-blue truncate">{contact.role}</p>
                                <p className="text-xs text-solas-gray mt-1">{contact.org}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default KeyContactsView;
