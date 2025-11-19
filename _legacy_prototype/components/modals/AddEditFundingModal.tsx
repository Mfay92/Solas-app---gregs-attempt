import React, { useState, useEffect } from 'react';
import { FundingDetails } from '../../types';
import Modal from '../Modal';

type AddEditFundingModalProps = {
    onClose: () => void;
    onSave: (funding: Omit<FundingDetails, 'id'> & { id?: string }) => void;
    initialData?: FundingDetails | null;
};

const AddEditFundingModal: React.FC<AddEditFundingModalProps> = ({ onClose, onSave, initialData }) => {
    const [source, setSource] = useState('');
    const [weeklyAmount, setWeeklyAmount] = useState<number | ''>('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (initialData) {
            setSource(initialData.source);
            setWeeklyAmount(initialData.weeklyAmount);
            setDetails(initialData.details);
        }
    }, [initialData]);

    const isSaveDisabled = !source.trim() || weeklyAmount === '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({
            id: initialData?.id,
            source,
            weeklyAmount: Number(weeklyAmount),
            details,
        });
    };

    return (
        <Modal title={initialData ? 'Edit Funding Source' : 'Add Funding Source'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-700">Funding Source *</label>
                    <input
                        type="text"
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        placeholder="e.g., North Yorkshire Council, NHS CCG"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="weeklyAmount" className="block text-sm font-medium text-gray-700">Weekly Amount (£) *</label>
                    <input
                        type="number"
                        id="weeklyAmount"
                        value={weeklyAmount}
                        onChange={(e) => setWeeklyAmount(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
                    <textarea
                        id="details"
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        placeholder="e.g., Breakdown of costs, contact person, etc."
                    ></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isSaveDisabled} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green disabled:bg-gray-400">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditFundingModal;
