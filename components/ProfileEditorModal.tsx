import React, { useState } from 'react';
import { IvolveStaff } from '../types';
import { EditIcon } from './Icons';

type ProfileEditorModalProps = {
    user: IvolveStaff;
    onClose: () => void;
};

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-app-text-gray">{label}</label>
        <p className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500">{value}</p>
    </div>
);

const EditableField: React.FC<{ label: string; initialValue: string }> = ({ label, initialValue }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    
    const handleSave = () => {
        // In a real app, you'd call an API here.
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(initialValue);
        setIsEditing(false);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-app-text-gray">{label}</label>
            {!isEditing ? (
                <div className="mt-1 flex items-center">
                    <p className="flex-grow p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500">{value}</p>
                    <button onClick={() => setIsEditing(true)} className="ml-2 p-2 text-gray-500 hover:text-ivolve-blue">
                        <EditIcon />
                    </button>
                </div>
            ) : (
                <div className="mt-1">
                    <input 
                        type="text" 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ivolve-blue focus:border-ivolve-blue"
                    />
                    <div className="mt-2 flex space-x-2">
                        <button onClick={handleSave} className="px-3 py-1 bg-ivolve-mid-green text-white text-sm font-semibold rounded-md">Save</button>
                        <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
};

const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-gray-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <header className="p-4 bg-white border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-solas-dark">Edit My Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 text-3xl">&times;</button>
                </header>

                <main className="flex-grow p-6 overflow-y-auto space-y-4">
                    <ReadOnlyField label="Full Name" value={user.name} />
                    <ReadOnlyField label="Email Address" value={user.email} />
                    <ReadOnlyField label="Role" value={user.role} />
                    <ReadOnlyField label="Team / Department" value={user.team} />

                    <div className="border-t my-4"></div>

                    <EditableField label="Phone Number" initialValue={user.phone} />
                    {/* Add other editable fields here in the future */}
                </main>

                <footer className="p-4 bg-white border-t flex justify-end items-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                        Close
                    </button>
                    <button onClick={() => { alert('Saving profile information... (demo)'); onClose(); }} className="px-6 py-2 rounded-md bg-ivolve-mid-green text-white font-semibold hover:bg-opacity-90">
                        Save All Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProfileEditorModal;