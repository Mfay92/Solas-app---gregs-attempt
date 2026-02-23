import React from 'react';
import { Gavel, ArrowLeft, Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 w-full shadow-md">
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
                                <Gavel size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Legal Hub</h1>
                                <p className="text-white/80 mt-1">
                                    Manage contracts, leases, SLAs, deeds, and legal documentation
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            Add Document
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <FileText size={14} />
                                Total Documents
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Clock size={14} />
                                Expiring Soon
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <AlertCircle size={14} />
                                Requires Action
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Gavel size={14} />
                                Active Contracts
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                        <Gavel size={32} className="text-indigo-700" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Legal Hub Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This area will store and manage legal documents including care contracts,
                        Service Level Agreements, leases, under-leases, deeds, and variations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalHub;
