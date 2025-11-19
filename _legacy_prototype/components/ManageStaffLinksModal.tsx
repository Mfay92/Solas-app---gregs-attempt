import React, { useState } from 'react';
import { Property, IvolveStaff, LinkedContact } from '../types';
import Modal from './Modal';
import { AddIcon, TrashIcon, UserIcon } from './Icons';

type ManageStaffLinksModalProps = {
    property: Property;
    allStaff: IvolveStaff[];
    onClose: () => void;
    onSave: (updatedStaffLinks: LinkedContact[]) => void;
};

const ManageStaffLinksModal: React.FC<ManageStaffLinksModalProps> = ({ property, allStaff, onClose, onSave }) => {
    // Initialize local state with only the ivolve staff links for this property
    const initialStaffLinks = property.linkedContacts?.filter(c => !c.stakeholderId) || [];
    const [staffLinks, setStaffLinks] = useState<LinkedContact[]>(initialStaffLinks);

    // State for the "add new" form
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [newRole, setNewRole] = useState('');

    const staffMap = new Map(allStaff.map(s => [s.id, s]));
    
    // Staff members who are not yet linked to this property
    const availableStaff = allStaff.filter(s => !staffLinks.some(l => l.contactId === s.id));

    const handleAddLink = () => {
        if (!selectedStaffId || !newRole.trim()) return;

        const newLink: LinkedContact = {
            id: `lc-${Date.now()}`, // Simple unique ID for the link
            role: newRole.trim(),
            contactId: selectedStaffId,
        };

        setStaffLinks(prev => [...prev, newLink]);
        // Reset form
        setSelectedStaffId('');
        setNewRole('');
    };

    const handleRemoveLink = (linkId: string) => {
        setStaffLinks(prev => prev.filter(l => l.id !== linkId));
    };

    const handleSave = () => {
        onSave(staffLinks);
    };

    return (
        <Modal title={`Manage Staff Links for ${property.address.line1}`} onClose={onClose}>
            <div className="space-y-6">
                {/* List of current links */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Current Staff Links</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {staffLinks.length > 0 ? staffLinks.map(link => {
                            const staffMember = staffMap.get(link.contactId);
                            if (!staffMember) return null;
                            return (
                                <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                            <UserIcon />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-solas-dark">{staffMember.name}</p>
                                            <p className="text-xs text-solas-gray">{link.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveLink(link.id)} className="p-2 text-gray-400 hover:text-red-600">
                                        <TrashIcon />
                                    </button>
                                </div>
                            );
                        }) : <p className="text-sm text-gray-500 text-center py-4">No staff linked yet.</p>}
                    </div>
                </div>

                {/* Add new link form */}
                <div className="pt-4 border-t">
                     <h4 className="font-semibold text-gray-800 mb-2">Add New Link</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                             <label htmlFor="staff-select" className="block text-sm font-medium text-gray-700">Staff Member</label>
                             <select
                                id="staff-select"
                                value={selectedStaffId}
                                onChange={e => setSelectedStaffId(e.target.value)}
                                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                             >
                                <option value="">Select staff...</option>
                                {availableStaff.map(staff => (
                                    <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                                ))}
                             </select>
                        </div>
                         <div>
                             <label htmlFor="role-input" className="block text-sm font-medium text-gray-700">Role at Property</label>
                             <input
                                type="text"
                                id="role-input"
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                                placeholder="e.g., Area Manager"
                             />
                        </div>
                    </div>
                     <div className="mt-4 text-right">
                        <button 
                            onClick={handleAddLink}
                            disabled={!selectedStaffId || !newRole.trim()}
                            className="inline-flex items-center space-x-1 bg-ivolve-mid-green text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400"
                        >
                            <AddIcon />
                            <span>Add Link</span>
                        </button>
                    </div>
                </div>

                 {/* Modal Actions */}
                <div className="pt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-ivolve-blue text-white py-2 px-4 border border-transparent rounded-md text-sm font-medium hover:bg-opacity-90">
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ManageStaffLinksModal;