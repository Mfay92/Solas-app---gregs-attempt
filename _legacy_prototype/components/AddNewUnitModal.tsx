import React, { useState } from 'react';
import { Property, ServiceType } from '../types';
import Modal from './Modal';

type AddNewUnitModalProps = {
    properties: Property[];
    onClose: () => void;
    onSave: (newUnit: {
        propertyId: string;
        unitName: string;
        serviceType: ServiceType;
        activeFrom: string;
        notes: string;
    }) => void;
};

const AddNewUnitModal: React.FC<AddNewUnitModalProps> = ({ properties, onClose, onSave }) => {
    const [propertyId, setPropertyId] = useState('');
    const [unitName, setUnitName] = useState('');
    const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.SupportedLiving);
    const [activeFrom, setActiveFrom] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const isSaveDisabled = !propertyId || !unitName.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        onSave({ propertyId, unitName, serviceType, activeFrom, notes });
    };

    return (
        <Modal title="Add New Unit" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="property" className="block text-sm font-medium text-gray-700">
                        Property <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="property"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue sm:text-sm rounded-md"
                    >
                        <option value="">Select a property...</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.address.line1}, {p.address.city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="unit-name" className="block text-sm font-medium text-gray-700">
                        Unit Name / Label <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="unit-name"
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                    />
                </div>

                <div>
                    <label htmlFor="service-type" className="block text-sm font-medium text-gray-700">
                        Service Type
                    </label>
                    <select
                        id="service-type"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value as ServiceType)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue sm:text-sm rounded-md"
                    >
                        {Object.values(ServiceType).map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="active-from" className="block text-sm font-medium text-gray-700">
                        Active From
                    </label>
                    <input
                        type="date"
                        id="active-from"
                        value={activeFrom}
                        onChange={(e) => setActiveFrom(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                    />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes / Background
                    </label>
                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                    ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivolve-blue"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaveDisabled}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ivolve-mid-green hover:bg-ivolve-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivolve-dark-green disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddNewUnitModal;
