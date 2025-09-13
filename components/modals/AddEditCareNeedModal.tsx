import React, { useState, useEffect } from 'react';
import { CareNeed } from '../../types';
import Modal from '../Modal';

type AddEditCareNeedModalProps = {
    onClose: () => void;
    onSave: (need: Omit<CareNeed, 'id'> & { id?: string }) => void;
    initialData?: CareNeed | null;
};

const AddEditCareNeedModal: React.FC<AddEditCareNeedModalProps> = ({ onClose, onSave, initialData }) => {
    const [category, setCategory] = useState('');
    const [detail, setDetail] = useState('');
    const [supportStrategies, setSupportStrategies] = useState('');

    useEffect(() => {
        if (initialData) {
            setCategory(initialData.category || '');
            setDetail(initialData.detail || '');
            setSupportStrategies(initialData.supportStrategies || '');
        }
    }, [initialData]);

    const isSaveDisabled = !category.trim() || !detail.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({
            id: initialData?.id,
            category,
            detail,
            supportStrategies,
        });
    };

    return (
        <Modal title={initialData ? 'Edit Support Need' : 'Add Support Need'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="detail" className="block text-sm font-medium text-gray-700">Detail / Description *</label>
                    <textarea
                        id="detail"
                        rows={3}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                        required
                    ></textarea>
                </div>
                 <div>
                    <label htmlFor="supportStrategies" className="block text-sm font-medium text-gray-700">Support Strategies</label>
                    <textarea
                        id="supportStrategies"
                        rows={4}
                        value={supportStrategies}
                        onChange={(e) => setSupportStrategies(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
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

export default AddEditCareNeedModal;
