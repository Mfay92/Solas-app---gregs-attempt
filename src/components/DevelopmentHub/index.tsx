import React from 'react';
import { HousePlus, ArrowLeft, Plus, Building, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DevelopmentHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-full shadow-md">
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
                                <HousePlus size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Development Hub</h1>
                                <p className="text-white/80 mt-1">
                                    New business pipeline, potential opportunities, and property development tracking
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            New Opportunity
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Target size={14} />
                                Active Leads
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Building size={14} />
                                In Pipeline
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <PieChart size={14} />
                                Conversion Rate
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <TrendingUp size={14} />
                                Potential Units
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <HousePlus size={32} className="text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Development Hub Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This area will manage new business opportunities, property pipeline frameworks,
                        and development tracking. Track leads from initial enquiry through to secured contracts.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentHub;
