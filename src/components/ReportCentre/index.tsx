import React from 'react';
import { BarChart3, ArrowLeft, Plus, FileBarChart, PieChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportCentre: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 w-full shadow-md">
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
                                <BarChart3 size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Report Centre</h1>
                                <p className="text-white/80 mt-1">
                                    Generate, view, and export reports across all areas of the business
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            New Report
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <FileBarChart size={14} />
                                Saved Reports
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <BarChart3 size={14} />
                                Scheduled
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <PieChart size={14} />
                                Report Types
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <TrendingUp size={14} />
                                This Month
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                        <BarChart3 size={32} className="text-rose-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Report Centre Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Generate comprehensive reports across all hubs - occupancy, compliance, finance,
                        referrals, voids, and more. Schedule automated reports and export to various formats.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportCentre;
