import React from 'react';
import { Wrench, ArrowLeft, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RepairsHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 w-full shadow-md">
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
                                <Wrench size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Repairs Hub</h1>
                                <p className="text-white/80 mt-1">
                                    Full CAFM system for managing repairs, maintenance, and contractor works
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            Log Repair
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Wrench size={14} />
                                Open Jobs
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <AlertTriangle size={14} />
                                Urgent
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Clock size={14} />
                                Awaiting Parts
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <CheckCircle size={14} />
                                Completed This Month
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Wrench size={32} className="text-slate-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Repairs Hub Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This will be a full CAFM (Computer-Aided Facilities Management) system.
                        Log repairs, track contractor works, manage planned maintenance schedules, and monitor completion rates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RepairsHub;
