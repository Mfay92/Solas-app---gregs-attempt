import React, { useState } from 'react';
import { NoteCategory } from '../../types';
import Modal from '../Modal';
import { NOTE_CATEGORIES_DATA } from '../../services/noteCategories';

type AddNoteModalProps = {
    onClose: () => void;
    onSave: (noteData: {
        title: string;
        category: NoteCategory;
        subCategory: string;
        description: string;
        isSensitive: boolean;
    }) => void;
};

const AddNoteModal: React.FC<AddNoteModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<NoteCategory>('General');
    const [subCategory, setSubCategory] = useState<string>(NOTE_CATEGORIES_DATA[0].subCategories[0].name);
    const [customSubCategory, setCustomSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isSensitive, setIsSensitive] = useState(false);

    const subCategoryOptions = NOTE_CATEGORIES_DATA.find(c => c.name === category)?.subCategories || [];
    const finalSubCategory = subCategory === 'Other' ? customSubCategory : subCategory;

    const isSaveDisabled = !title.trim() || !description.trim() || !finalSubCategory.trim();

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as NoteCategory;
        setCategory(newCategory);
        // Reset subcategory when main category changes
        const defaultSub = NOTE_CATEGORIES_DATA.find(c => c.name === newCategory)?.subCategories[0]?.name || '';
        setSubCategory(defaultSub);
        setCustomSubCategory('');
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSubCategory(value);
        if (value !== 'Other') {
            setCustomSubCategory('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({ title, category, subCategory: finalSubCategory, description, isSensitive });
    };

    return (
        <Modal title="Add New Note" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                        required
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                        <select
                            id="category"
                            value={category}
                            onChange={handleCategoryChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue sm:text-sm rounded-md"
                        >
                            {NOTE_CATEGORIES_DATA.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700">Sub-Category *</label>
                        <select
                            id="sub-category"
                            value={subCategory}
                            onChange={handleSubCategoryChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue sm:text-sm rounded-md"
                        >
                            {subCategoryOptions.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                            <option value="Other">Other (custom)...</option>
                        </select>
                    </div>
                </div>
                 {subCategory === 'Other' && (
                    <div>
                        <label htmlFor="customSubCategory" className="block text-sm font-medium text-gray-700">Custom Sub-Category *</label>
                        <input
                            type="text"
                            id="customSubCategory"
                            value={customSubCategory}
                            onChange={e => setCustomSubCategory(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                            placeholder="Type custom tags, comma separated"
                            required
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea
                        id="description"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                        required
                    ></textarea>
                </div>
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="isSensitive"
                            type="checkbox"
                            checked={isSensitive}
                            onChange={(e) => setIsSensitive(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="isSensitive" className="font-medium text-gray-700">Mark as Sensitive</label>
                        <p className="text-gray-500">Sensitive notes will be highlighted and may have restricted visibility in the future.</p>
                    </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isSaveDisabled} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green disabled:bg-gray-400">Save Note</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddNoteModal;