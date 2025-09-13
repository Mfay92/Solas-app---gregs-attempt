
import React, { useState } from 'react';
import { Person, PersonStatus } from '../types';
import Modal from './Modal';
import { useData } from '../contexts/DataContext';

type AddPersonModalProps = {
    onClose: () => void;
};

const STEPS = ["Personal Details", "Support Needs", "Housing", "Funding", "Review & Save"];

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onClose }) => {
    const { handleAddNewPerson } = useData();
    const [currentStep, setCurrentStep] = useState(0);
    const [personData, setPersonData] = useState<Partial<Person>>({
        status: PersonStatus.Applicant,
    });

    const handleNext = () => {
        // Here you would add validation for the current step
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSave = () => {
        // In a real app, you'd perform final validation
        handleAddNewPerson(personData as Person); // For demo, we cast
        onClose();
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonData(prev => ({ ...prev, [name]: value }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Personal Details
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="preferredFirstName" className="block text-sm font-medium text-gray-700">Preferred First Name *</label>
                                <input type="text" name="preferredFirstName" id="preferredFirstName" value={personData.preferredFirstName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                            </div>
                             <div>
                                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname *</label>
                                <input type="text" name="surname" id="surname" value={personData.surname || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                            <input type="date" name="dob" id="dob" value={personData.dob || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Initial Status</label>
                            <select name="status" id="status" value={personData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100">
                                <option value={PersonStatus.Applicant}>Applicant / Referral</option>
                            </select>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center p-8 bg-gray-100 rounded-md">
                        <p className="font-semibold text-gray-700">{STEPS[currentStep]}</p>
                        <p className="text-sm text-gray-500">This section is under construction.</p>
                    </div>
                );
        }
    };
    
    return (
        <Modal title="Add New Person" onClose={onClose} className="max-w-3xl">
            {/* Stepper */}
            <div className="mb-6 border-b pb-4">
                <ol className="flex items-center w-full">
                    {STEPS.map((step, index) => (
                        <li key={step} className={`flex w-full items-center ${index < STEPS.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ""} ${index <= currentStep ? 'text-ivolve-blue after:border-ivolve-blue' : 'text-gray-400 after:border-gray-200'}`}>
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index <= currentStep ? 'bg-ivolve-blue' : 'bg-gray-200'}`}>
                                {index < currentStep ? (
                                    <svg className="w-4 h-4 text-white lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <span className={`font-bold ${index <= currentStep ? 'text-white' : 'text-gray-600'}`}>{index + 1}</span>
                                )}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            
            {renderStepContent()}

            {/* Footer */}
            <div className="pt-6 mt-6 border-t flex justify-between items-center">
                 <button
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Save & Close
                </button>
                <div className="space-x-3">
                    <button onClick={handleBack} disabled={currentStep === 0} className="bg-gray-200 py-2 px-4 border rounded-md text-sm font-medium text-gray-700 disabled:opacity-50">Back</button>
                    {currentStep < STEPS.length - 1 ? (
                        <button onClick={handleNext} className="bg-ivolve-blue text-white py-2 px-4 rounded-md text-sm font-medium">Next</button>
                    ) : (
                        <button onClick={handleSave} className="bg-ivolve-mid-green text-white py-2 px-4 rounded-md text-sm font-medium">Finish & Save</button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AddPersonModal;
