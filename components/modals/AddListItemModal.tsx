import React, { useState } from 'react';
import Modal from '../Modal';

type AddListItemModalProps = {
    onClose: () => void;
    onSave: (item: string) => void;
    title: string;
};

const AddListItemModal: React.FC<AddListItemModalProps> = ({ onClose, onSave, title }) => {
    const [item, setItem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item.trim()) return;
        onSave(item);
    };

    return (
        <Modal title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                        type="text"
                        id="item-name"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                        autoFocus
                    />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={!item.trim()} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green disabled:bg-gray-400">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddListItemModal;
