import React, { useState } from 'react';
import {
    PoundSterling,
    FileText,
    Search,
    Filter,
    Calendar,
    Building2,
    Users,
    Plus,
    ChevronRight
} from 'lucide-react';
import DocumentViewer from '../DocumentViewer';
import { RentScheduleDocument } from '../DocumentViewer/types';
import { woodhurstRentSchedule } from '../../data/sampleRentSchedule';

// For now, we have one sample schedule - this will expand
const allRentSchedules: RentScheduleDocument[] = [
    woodhurstRentSchedule,
];

const FinancePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState<RentScheduleDocument | null>(null);
    const [filterYear, setFilterYear] = useState<string>('all');

    // Get unique financial years for filter
    const financialYears = [...new Set(allRentSchedules.map(s => s.financialYear))];

    // Filter schedules
    const filteredSchedules = allRentSchedules.filter(schedule => {
        const matchesSearch = schedule.header.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            schedule.rpName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = filterYear === 'all' || schedule.financialYear === filterYear;
        return matchesSearch && matchesYear;
    });

    // Stats
    const totalSchedules = allRentSchedules.length;
    const totalWeeklyRent = allRentSchedules.reduce((sum, s) => sum + s.totals.grossWeeklyRent, 0);
    const totalUnits = allRentSchedules.reduce((sum, s) => sum + s.header.occupancyLevel, 0);

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-ivolve-dark flex items-center gap-2">
                        <PoundSterling className="w-7 h-7 text-ivolve-mid" />
                        Finance
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage rent schedules, invoicing, and financial reporting
                    </p>
                </div>
                <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-ivolve-mid text-white rounded-xl font-medium hover:bg-ivolve-dark transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Upload Schedule</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Schedules</p>
                            <p className="text-3xl font-black text-ivolve-dark mt-1">{totalSchedules}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-ivolve-mid/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-ivolve-mid" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Weekly Rent</p>
                            <p className="text-3xl font-black text-ivolve-dark mt-1">
                                £{totalWeeklyRent.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <PoundSterling className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Units</p>
                            <p className="text-3xl font-black text-ivolve-dark mt-1">{totalUnits}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rent Schedules Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h2 className="text-lg font-bold text-ivolve-dark flex items-center gap-2">
                            <FileText className="w-5 h-5 text-ivolve-mid" />
                            Rent Schedules
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by address or RP..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid w-64"
                                />
                            </div>

                            {/* Year Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid appearance-none bg-white"
                                >
                                    <option value="all">All Years</option>
                                    {financialYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule List */}
                <div className="divide-y divide-gray-100">
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => setSelectedSchedule(schedule)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start space-x-4">
                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-lg bg-ivolve-mid/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-ivolve-mid" />
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <h3 className="font-bold text-ivolve-dark group-hover:text-ivolve-mid transition-colors">
                                                {schedule.header.address}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Building2 size={14} />
                                                    {schedule.rpName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {schedule.financialYear}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {schedule.header.occupancyLevel} units
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Amount and arrow */}
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-black text-ivolve-dark text-lg">
                                                £{schedule.totals.grossWeeklyRent.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-400">/week</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-ivolve-mid transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No schedules found</h3>
                            <p className="text-gray-500 text-sm">
                                {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first rent schedule to get started'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Coming Soon Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-ivolve-dark">Invoicing</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Generate and manage invoices for rent and service charges, track payments, and reconcile accounts.
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <PoundSterling className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-ivolve-dark">Financial Reports</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Income projections, void cost analysis, arrears tracking, and comprehensive financial dashboards.
                    </p>
                </div>
            </div>

            {/* Document Viewer Modal */}
            {selectedSchedule && (
                <DocumentViewer
                    document={selectedSchedule}
                    onClose={() => setSelectedSchedule(null)}
                    isModal={true}
                    defaultViewMode="normal"
                />
            )}
        </div>
    );
};

export default FinancePage;
