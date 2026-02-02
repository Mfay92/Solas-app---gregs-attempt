import React from 'react';
import { Contact, ArrowLeft, Plus, Users, Building2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddressBook: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 w-full shadow-md">
                <div className="px-6 py-6">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to Dashboard</span>
                    </Link>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Contact size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Address Book</h1>
                                <p className="text-white/80 mt-1">
                                    Directory of internal staff and external contacts, searchable by person or organisation
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            Add Contact
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <UserCheck size={14} />
                                Internal Staff
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Users size={14} />
                                External Contacts
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Building2 size={14} />
                                Organisations
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Contact size={14} />
                                Total Contacts
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                        <Contact size={32} className="text-cyan-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Address Book Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        A complete directory for internal and external contacts. Track staff (current/former),
                        social workers, commissioners, RP partners, and council contacts.
                        Search by person, organisation, region, or property relationship.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddressBook;
