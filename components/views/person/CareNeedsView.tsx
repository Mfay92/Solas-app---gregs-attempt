


import React, { useState } from 'react';
import { CareNeed, Person, PersonStatus, ServiceType } from '../../../types';
import Card from '../../Card';
import { usePersona } from '../../../contexts/PersonaContext';
import { AddIcon, EditIcon, TrashIcon } from '../../Icons';
import AddEditCareNeedModal from '../../modals/AddEditCareNeedModal';
import { useData } from '../../../contexts/DataContext';

type CareNeedsViewProps = {
  person: Person;
};

const CareNeedsView: React.FC<CareNeedsViewProps> = ({ person }) => {
  const { t } = usePersona();
  const { properties, handleUpdatePerson } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<CareNeed | null>(null);

  const property = properties.find(p => p.id === person.propertyId);
  const serviceType = property?.serviceType;

  const openAddModal = () => {
    setEditingNeed(null);
    setIsModalOpen(true);
  };

  const openEditModal = (need: CareNeed) => {
    setEditingNeed(need);
    setIsModalOpen(true);
  };

  const handleDelete = (needId: string) => {
    if (window.confirm('Are you sure you want to delete this support need?')) {
        const updatedNeeds = person.careNeeds.filter(n => n.id !== needId);
        handleUpdatePerson(person.id, { careNeeds: updatedNeeds });
    }
  };
  
  const handleSave = (need: Omit<CareNeed, 'id'> & { id?: string }) => {
    let updatedNeeds: CareNeed[];
    if (need.id) { // Editing existing
        updatedNeeds = person.careNeeds.map(n => n.id === need.id ? (need as CareNeed) : n);
    } else { // Adding new
        const newNeed: CareNeed = { ...need, id: `cn-${Date.now()}`};
        updatedNeeds = [...person.careNeeds, newNeed];
    }
    handleUpdatePerson(person.id, { careNeeds: updatedNeeds });
    setIsModalOpen(false);
  };

  const isFormer = person.status === PersonStatus.Former;
  const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

  const cardTitleText = serviceType === ServiceType.SupportedLiving ? 'Support Needs' : 'Care Needs';

  const cardTitle = (
    <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{cardTitleText}</h3>
        <button 
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"
        >
            <AddIcon />
            <span>Add Support Need</span>
        </button>
    </div>
  );


  return (
    <>
      {isModalOpen && (
        <AddEditCareNeedModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={editingNeed}
        />
      )}
      <Card title={cardTitle} titleClassName={cardTitleClass}>
        {person.careNeeds.length > 0 ? (
          <div className="space-y-4">
            {person.careNeeds.map((need) => (
              <div key={need.id} className="p-4 bg-gray-50 border rounded-md group">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-solas-dark">{need.category}</h4>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openEditModal(need)} className="p-1 text-gray-400 hover:text-ivolve-blue"><EditIcon /></button>
                         <button onClick={() => handleDelete(need.id)} className="p-1 text-gray-400 hover:text-status-red"><TrashIcon /></button>
                    </div>
                </div>
                <p className="text-sm text-solas-gray mt-1">{need.detail}</p>
                {need.supportStrategies && (
                  <div className="mt-3 pt-3 border-t">
                      <h5 className="text-xs font-bold text-ivolve-dark-green uppercase tracking-wider">Support Strategies</h5>
                      <p className="text-sm text-solas-gray mt-1 whitespace-pre-wrap">{need.supportStrategies}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-solas-gray text-center py-6">No specific care needs have been documented for this person.</p>
        )}
      </Card>
    </>
  );
};

export default CareNeedsView;