

import React, { useState } from 'react';
import Card from '../../Card';
import { FundingDetails, Person } from '../../../types';
import { AddIcon, EditIcon, TrashIcon } from '../../Icons';
import { useData } from '../../../contexts/DataContext';
import AddEditFundingModal from '../../modals/AddEditFundingModal';

type FinanceViewProps = {
    person: Person;
}

const FinanceView: React.FC<FinanceViewProps> = ({ person }) => {
    const { handleUpdatePerson } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFunding, setEditingFunding] = useState<FundingDetails | null>(null);

    const openAddModal = () => {
        setEditingFunding(null);
        setIsModalOpen(true);
    };

    const openEditModal = (fund: FundingDetails) => {
        setEditingFunding(fund);
        setIsModalOpen(true);
    };

    const handleDelete = (fundId: string) => {
        if (window.confirm('Are you sure you want to delete this funding source?')) {
            const updatedFunding = person.funding.filter(f => f.id !== fundId);
            handleUpdatePerson(person.id, { funding: updatedFunding });
        }
    };

    const handleSave = (fund: Omit<FundingDetails, 'id'> & { id?: string }) => {
        let updatedFunding: FundingDetails[];
        if (fund.id) { // Editing
            updatedFunding = person.funding.map(f => f.id === fund.id ? (fund as FundingDetails) : f);
        } else { // Adding
            const newFund: FundingDetails = { ...fund, id: `fund-${Date.now()}` };
            updatedFunding = [...person.funding, newFund];
        }
        handleUpdatePerson(person.id, { funding: updatedFunding });
        setIsModalOpen(false);
    };

    const cardTitle = (
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Finance & Benefits</h3>
            <button
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-ivolve-blue text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm"
            >
                <AddIcon />
                <span>Add Funding Source</span>
            </button>
        </div>
    );

    return (
        <>
            {isModalOpen && (
                <AddEditFundingModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingFunding}
                />
            )}
            <Card title={cardTitle} titleClassName="text-solas-dark">
                <div className="space-y-6">
                    {person.funding && person.funding.length > 0 ? person.funding.map((fund, index) => (
                        <div key={fund.id} className="p-4 bg-gray-50 border rounded-md group">
                             <div className="flex justify-between items-start">
                                <h4 className="font-bold text-solas-dark">{fund.source}</h4>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(fund)} className="p-1 text-gray-400 hover:text-ivolve-blue"><EditIcon /></button>
                                    <button onClick={() => handleDelete(fund.id)} className="p-1 text-gray-400 hover:text-status-red"><TrashIcon /></button>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500">Weekly Amount</p>
                                    <p className="text-md font-medium text-gray-800">£{fund.weeklyAmount.toFixed(2)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold text-gray-500">Details</p>
                                    <p className="text-sm text-gray-600">{fund.details || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-solas-gray text-center py-6">No funding details have been documented.</p>
                    )}
                </div>
            </Card>
        </>
    );
};

export default FinanceView;
