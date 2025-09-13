import React, { useState, useEffect } from 'react';
import { PersonContact } from '../../types';
import Modal from '../Modal';
import ToggleSwitch from '../ToggleSwitch';

type AddEditCircleContactModalProps = {
    onClose: () => void;
    onSave: (contact: Omit<PersonContact, 'id'> & { id?: string }) => void;
    initialData?: PersonContact | null;
};

const AddEditCircleContactModal: React.FC<AddEditCircleContactModalProps> = ({ onClose, onSave, initialData }) => {
    const [isOrganisation, setIsOrganisation] = useState(false);
    const [name, setName] = useState('');
    const [organisationName, setOrganisationName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [isNextOfKin, setIsNextOfKin] = useState(false);
    const [isAppointee, setIsAppointee] = useState(false);
    const [isDeputy, setIsDeputy] = useState(false);

    useEffect(() => {
        if (initialData) {
            setIsOrganisation(initialData.isOrganisation);
            setName(initialData.name);
            setOrganisationName(initialData.organisationName || '');
            setRelationship(initialData.relationship);
            setPhone(initialData.phone || '');
            setEmail(initialData.email || '');
            setNotes(initialData.notes || '');
            setIsNextOfKin(initialData.isNextOfKin || false);
            setIsAppointee(initialData.isAppointee || false);
            setIsDeputy(initialData.isDeputy || false);
        }
    }, [initialData]);

    const isSaveDisabled = !name.trim() || !relationship.trim() || (isOrganisation && !organisationName.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({
            id: initialData?.id,
            isOrganisation,
            name,
            organisationName: isOrganisation ? organisationName : undefined,
            relationship,
            phone,
            email,
            notes,
            isNextOfKin,
            isAppointee,
            isDeputy
        });
    };

    return (
        <Modal title={initialData ? 'Edit Contact' : 'Add Contact'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <ToggleSwitch label="This contact is an organisation" enabled={isOrganisation} onChange={setIsOrganisation} labelClassName="text-gray-700"/>

                {isOrganisation && (
                     <div>
                        <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700">Organisation Name *</label>
                        <input type="text" id="organisationName" value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                    </div>
                )}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{isOrganisation ? 'Contact Person Name' : 'Name'} *</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                 <div>
                    <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">Relationship *</label>
                    <input type="text" id="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder={isOrganisation ? 'e.g., GP Surgery, Social Work Team' : 'e.g., Mother, Advocate'} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                </div>
                
                <div className="space-y-2 pt-2">
                     <div className="flex items-center"><input id="isNextOfKin" type="checkbox" checked={isNextOfKin} onChange={e => setIsNextOfKin(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-ivolve-blue" /><label htmlFor="isNextOfKin" className="ml-2 text-sm text-gray-700">Set as Next of Kin</label></div>
                     <div className="flex items-center"><input id="isAppointee" type="checkbox" checked={isAppointee} onChange={e => setIsAppointee(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-ivolve-blue" /><label htmlFor="isAppointee" className="ml-2 text-sm text-gray-700">Set as Appointee (Benefits)</label></div>
                     <div className="flex items-center"><input id="isDeputy" type="checkbox" checked={isDeputy} onChange={e => setIsDeputy(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-ivolve-blue" /><label htmlFor="isDeputy" className="ml-2 text-sm text-gray-700">Set as Deputy (Court of Protection)</label></div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isSaveDisabled} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green disabled:bg-gray-400">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditCircleContactModal;
