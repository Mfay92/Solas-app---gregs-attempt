import React, { useState } from 'react';
import Card from '../../Card';
import { Person, Medication, PersonStatus } from '../../../types';
import { AddIcon, EditIcon, TrashIcon } from '../../Icons';
import AddEditMedicationModal from '../../modals/AddEditMedicationModal';
import { useData } from '../../../contexts/DataContext';
import AddListItemModal from '../../modals/AddListItemModal';

type HealthViewProps = {
    person: Person;
}

const HealthView: React.FC<HealthViewProps> = ({ person }) => {
    const { handleUpdatePerson } = useData();
    const [isMedModalOpen, setIsMedModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);

    const [isListModalOpen, setIsListModalOpen] = useState<'allergies' | 'conditions' | null>(null);

    const openMedModal = (med: Medication | null) => {
        setEditingMed(med);
        setIsMedModalOpen(true);
    };

    const handleSaveMedication = (med: Omit<Medication, 'id'> & { id?: string }) => {
        let updatedMeds: Medication[];
        if (med.id) { // Editing
            updatedMeds = (person.medications || []).map(m => m.id === med.id ? (med as Medication) : m);
        } else { // Adding
            const newMed: Medication = { ...med, id: `med-${Date.now()}`};
            updatedMeds = [...(person.medications || []), newMed];
        }
        handleUpdatePerson(person.id, { medications: updatedMeds });
        setIsMedModalOpen(false);
    };

    const handleDeleteMedication = (medId: string) => {
        if (window.confirm('Are you sure you want to delete this medication?')) {
            const updatedMeds = (person.medications || []).filter(m => m.id !== medId);
            handleUpdatePerson(person.id, { medications: updatedMeds });
        }
    };
    
    const handleSaveListItem = (listType: 'allergies' | 'conditions', item: string) => {
        const currentList = person[listType] || [];
        const updatedList = [...currentList, item];
        handleUpdatePerson(person.id, { [listType]: updatedList });
        setIsListModalOpen(null);
    };

    const handleDeleteListItem = (listType: 'allergies' | 'conditions', item: string) => {
        if (window.confirm(`Are you sure you want to remove "${item}"?`)) {
            const currentList = person[listType] || [];
            const updatedList = currentList.filter(i => i !== item);
            handleUpdatePerson(person.id, { [listType]: updatedList });
        }
    };

    const isFormer = person.status === PersonStatus.Former;
    const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';


  return (
    <div className="space-y-6">
        {isMedModalOpen && (
            <AddEditMedicationModal
                onClose={() => setIsMedModalOpen(false)}
                onSave={handleSaveMedication}
                initialData={editingMed}
            />
        )}
        {isListModalOpen && (
            <AddListItemModal
                title={`Add New ${isListModalOpen === 'allergies' ? 'Allergy' : 'Medical Condition'}`}
                onClose={() => setIsListModalOpen(null)}
                onSave={(item) => handleSaveListItem(isListModalOpen, item)}
            />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card 
                title={
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Medical Conditions</h3>
                        <button onClick={() => setIsListModalOpen('conditions')} className="flex items-center space-x-1 text-xs font-bold bg-ivolve-blue text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"><AddIcon /><span>Add</span></button>
                    </div>
                } 
                titleClassName={cardTitleClass}
            >
                <div className="flex flex-wrap gap-2">
                    {(person.medicalConditions && person.medicalConditions.length > 0) ? person.medicalConditions.map(item => (
                        <span key={item} className="group flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                            {item}
                            <button onClick={() => handleDeleteListItem('conditions', item)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-3 h-3" /></button>
                        </span>
                    )) : <p className="text-sm text-gray-500">No conditions recorded.</p>}
                </div>
            </Card>
             <Card 
                title={
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Allergies</h3>
                         <button onClick={() => setIsListModalOpen('allergies')} className="flex items-center space-x-1 text-xs font-bold bg-ivolve-blue text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"><AddIcon /><span>Add</span></button>
                    </div>
                } 
                titleClassName={cardTitleClass}
            >
                <div className="flex flex-wrap gap-2">
                    {(person.allergies && person.allergies.length > 0) ? person.allergies.map(item => (
                         <span key={item} className="group flex items-center bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                            {item}
                            <button onClick={() => handleDeleteListItem('allergies', item)} className="ml-2 text-red-400 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-3 h-3" /></button>
                        </span>
                    )) : <p className="text-sm text-gray-500">No allergies recorded.</p>}
                </div>
            </Card>
        </div>

        <Card 
            title={
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Medications</h3>
                    <button onClick={() => openMedModal(null)} className="flex items-center space-x-2 bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"><AddIcon /><span>Add Medication</span></button>
                </div>
            } 
            titleClassName={cardTitleClass}
        >
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Dosage</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Frequency</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Notes</th>
                            <th className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(person.medications && person.medications.length > 0) ? person.medications.map(med => (
                            <tr key={med.id} className="group">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{med.notes}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openMedModal(med)} className="p-1 text-gray-400 hover:text-ivolve-blue"><EditIcon /></button>
                                        <button onClick={() => handleDeleteMedication(med.id)} className="p-1 text-gray-400 hover:text-status-red"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-sm text-gray-500">No medications recorded.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
        
        <Card title="Pets" titleClassName={cardTitleClass}>
            <p className="text-md text-gray-900">{person.pets || <span className="text-gray-400 italic">No pets recorded.</span>}</p>
        </Card>
    </div>
  );
};

export default HealthView;
