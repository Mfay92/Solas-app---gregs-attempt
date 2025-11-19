import React, { useState, useEffect } from 'react';
import { Medication } from '../../types';
import Modal from '../Modal';

type AddEditMedicationModalProps = {
    onClose: () => void;
    onSave: (medication: Omit<Medication, 'id'> & { id?: string }) => void;
    initialData?: Medication | null;
};

const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({ onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDosage(initialData.dosage || '');
            setFrequency(initialData.frequency || '');
            setNotes(initialData.notes || '');
        }
    }, [initialData]);

    const isSaveDisabled = !name.trim() || !dosage.trim() || !frequency.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({
            id: initialData?.id,
            name,
            dosage,
            frequency,
            notes,
        });
    };

    return (
        <Modal title={initialData ? 'Edit Medication' : 'Add Medication'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Medication Name *</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage *</label>
                        <input type="text" id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., 500mg" required />
                    </div>
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency *</label>
                        <input type="text" id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., Twice daily" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., Take with food, PRN for anxiety..."></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isSaveDisabled} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green disabled:bg-gray-400">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditMedicationModal;
