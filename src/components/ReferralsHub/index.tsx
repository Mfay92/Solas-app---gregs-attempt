import { useState, useMemo } from 'react';
import { Referral, ServiceType } from '../../types';
import referralsData from '../../data/referrals.json';
import ReferralProfile from '../ReferralProfile';
import StatusBadge from '../shared/StatusBadge';
import { UserPlus, Search, Plus, X, Filter, FileText, Clock, CheckCircle, Users } from 'lucide-react';

interface SortConfig {
    key: 'referralRef' | 'name' | 'referralDate' | 'status' | 'serviceType';
    direction: 'asc' | 'desc';
}

interface FilterConfig {
    status: string;
    serviceType: string;
    source: string;
}

/**
 * ReferralsHub Component
 *
 * Main hub for managing referrals and applications before people move in.
 * Features:
 * - List view of all referrals
 * - Stats cards for key metrics
 * - Filters by status, service type, and source
 * - Search by name or referrer
 * - Color-coded badges by service type
 */
export default function ReferralsHub() {
    // State
    const [referrals] = useState<Referral[]>(referralsData as unknown as Referral[]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'referralDate',
        direction: 'desc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterConfig>({
        status: 'All',
        serviceType: 'All',
        source: 'All'
    });

    // Get unique sources for filter dropdown
    const uniqueSources = useMemo(() => {
        const sources = new Set<string>();
        referrals.forEach(ref => {
            sources.add(ref.source);
        });
        return Array.from(sources).sort();
    }, [referrals]);

    // Calculate quick stats
    const stats = useMemo(() => {
        const newReferrals = referrals.filter(r => r.status === 'New Referral').length;
        const underAssessment = referrals.filter(r => r.status === 'Under Assessment').length;
        const awaitingFunding = referrals.filter(r => r.status === 'Awaiting Funding Approval').length;
        const readyToMoveIn = referrals.filter(r => r.status === 'Ready to Move In').length;

        return {
            newReferrals,
            underAssessment,
            awaitingFunding,
            readyToMoveIn
        };
    }, [referrals]);

    // Filter and sort referrals
    const filteredAndSortedReferrals = useMemo(() => {
        // Apply filters first
        let filtered = referrals.filter(referral => {
            // Status filter
            if (filters.status !== 'All' && referral.status !== filters.status) {
                return false;
            }

            // Service Type filter
            if (filters.serviceType !== 'All' && referral.serviceType !== filters.serviceType) {
                return false;
            }

            // Source filter
            if (filters.source !== 'All' && referral.source !== filters.source) {
                return false;
            }

            return true;
        });

        // Then apply search query
        filtered = filtered.filter(referral => {
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const fullName = `${referral.personal.firstName} ${referral.personal.lastName}`.toLowerCase();
            const referrerName = referral.referrerName.toLowerCase();
            const referralRef = referral.referralRef.toLowerCase();

            return (
                fullName.includes(query) ||
                referrerName.includes(query) ||
                referralRef.includes(query)
            );
        });

        // Sort
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortConfig.key) {
                case 'referralRef':
                    aValue = a.referralRef.toLowerCase();
                    bValue = b.referralRef.toLowerCase();
                    break;
                case 'name':
                    aValue = `${a.personal.firstName} ${a.personal.lastName}`.toLowerCase();
                    bValue = `${b.personal.firstName} ${b.personal.lastName}`.toLowerCase();
                    break;
                case 'referralDate':
                    aValue = new Date(a.referralDate).getTime();
                    bValue = new Date(b.referralDate).getTime();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'serviceType':
                    aValue = a.serviceType;
                    bValue = b.serviceType;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [referrals, searchQuery, sortConfig, filters]);

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            status: 'All',
            serviceType: 'All',
            source: 'All'
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.status !== 'All' ||
                            filters.serviceType !== 'All' ||
                            filters.source !== 'All';

    // Get service type color
    const getServiceTypeColor = (serviceType: ServiceType) => {
        switch (serviceType) {
            case 'Supported Living':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Residential Care':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Nursing Care':
                return 'bg-rose-100 text-rose-800 border-rose-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // If a referral is selected, show their profile
    if (selectedReferral) {
        return (
            <ReferralProfile
                referral={selectedReferral}
                onBack={() => setSelectedReferral(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivolve-paper via-white to-ivolve-paper">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 md:px-8 py-6">
                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                            <UserPlus className="text-ivolve-mid" size={32} />
                            Referrals & Applications
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            {filteredAndSortedReferrals.length} of {referrals.length} referrals
                            {searchQuery && ` (filtered by "${searchQuery}")`}
                            {hasActiveFilters && ' (filters active)'}
                        </p>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {/* New Referrals */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-blue-700 uppercase mb-1">New Referrals</p>
                                    <p className="text-2xl font-bold text-blue-800">{stats.newReferrals}</p>
                                </div>
                                <FileText className="text-blue-600 opacity-70" size={28} />
                            </div>
                        </div>

                        {/* Under Assessment */}
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Under Assessment</p>
                                    <p className="text-2xl font-bold text-amber-800">{stats.underAssessment}</p>
                                </div>
                                <Users className="text-amber-600 opacity-70" size={28} />
                            </div>
                        </div>

                        {/* Awaiting Funding */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Awaiting Funding</p>
                                    <p className="text-2xl font-bold text-purple-800">{stats.awaitingFunding}</p>
                                </div>
                                <Clock className="text-purple-600 opacity-70" size={28} />
                            </div>
                        </div>

                        {/* Ready to Move In */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Ready to Move In</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.readyToMoveIn}</p>
                                </div>
                                <CheckCircle className="text-green-600 opacity-70" size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    <div className="mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                hasActiveFilters
                                    ? 'bg-ivolve-mid text-white border-ivolve-mid shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={18} />
                            <span className="font-medium">
                                {hasActiveFilters ? 'Filters Active' : 'Show Filters'}
                            </span>
                            {hasActiveFilters && (
                                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {Object.values(filters).filter(v => v !== 'All').length}
                                </span>
                            )}
                        </button>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg relative z-50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="New Referral">New Referral</option>
                                            <option value="Under Assessment">Under Assessment</option>
                                            <option value="Awaiting Funding Approval">Awaiting Funding Approval</option>
                                            <option value="Funding Approved">Funding Approved</option>
                                            <option value="RP Approval Required">RP Approval Required</option>
                                            <option value="RP Approved">RP Approved</option>
                                            <option value="Ready to Move In">Ready to Move In</option>
                                            <option value="Moved In">Moved In</option>
                                            <option value="Declined">Declined</option>
                                            <option value="Withdrawn">Withdrawn</option>
                                        </select>
                                    </div>

                                    {/* Service Type Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                            Service Type
                                        </label>
                                        <select
                                            value={filters.serviceType}
                                            onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                        >
                                            <option value="All">All Service Types</option>
                                            <option value="Supported Living">Supported Living</option>
                                            <option value="Residential Care">Residential Care</option>
                                            <option value="Nursing Care">Nursing Care</option>
                                        </select>
                                    </div>

                                    {/* Source Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                                            Referral Source
                                        </label>
                                        <select
                                            value={filters.source}
                                            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all text-sm"
                                        >
                                            <option value="All">All Sources</option>
                                            {uniqueSources.map(source => (
                                                <option key={source} value={source}>{source}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Clear Filters Button */}
                                {hasActiveFilters && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-4 py-2 text-sm font-medium text-ivolve-mid hover:text-white hover:bg-ivolve-mid border border-ivolve-mid rounded-lg transition-all duration-200"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search & Actions Bar */}
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by name, referrer, or reference..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Clear search"
                                >
                                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Add Referral Button */}
                        <button
                            className="px-4 py-2.5 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
                            title="Add a new referral"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Referral</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Referrals Table */}
            <div className="px-4 md:px-8 py-6">
                {filteredAndSortedReferrals.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Reference
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Person
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Service Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Referrer
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Referral Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Linked Property
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAndSortedReferrals.map((referral) => (
                                        <tr
                                            key={referral.id}
                                            onClick={() => setSelectedReferral(referral)}
                                            className="hover:bg-ivolve-paper/50 cursor-pointer transition-colors"
                                        >
                                            {/* Reference */}
                                            <td className="px-4 py-4">
                                                <span className="font-mono text-sm font-semibold text-gray-800">
                                                    {referral.referralRef}
                                                </span>
                                            </td>

                                            {/* Person Name */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        {referral.personal.firstName} {referral.personal.lastName}
                                                    </div>
                                                    {referral.personal.preferredName &&
                                                        referral.personal.preferredName !== referral.personal.firstName && (
                                                            <div className="text-xs text-gray-500">
                                                                Prefers: {referral.personal.preferredName}
                                                            </div>
                                                        )}
                                                </div>
                                            </td>

                                            {/* Service Type */}
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getServiceTypeColor(referral.serviceType)}`}>
                                                    {referral.serviceType}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <StatusBadge status={referral.status} size="sm" />
                                            </td>

                                            {/* Referrer */}
                                            <td className="px-4 py-4 text-gray-700 text-sm max-w-xs">
                                                <div className="truncate" title={referral.referrerName}>
                                                    {referral.referrerName}
                                                </div>
                                                {referral.referrerOrganization && (
                                                    <div className="text-xs text-gray-500 truncate" title={referral.referrerOrganization}>
                                                        {referral.referrerOrganization}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Referral Date */}
                                            <td className="px-4 py-4 text-gray-700 text-sm">
                                                {formatDate(referral.referralDate)}
                                            </td>

                                            {/* Linked Property */}
                                            <td className="px-4 py-4 text-gray-700 text-sm max-w-xs">
                                                {referral.linkedProperty ? (
                                                    <div className="truncate" title={referral.linkedProperty.propertyAddress}>
                                                        {referral.linkedProperty.propertyAddress}
                                                        {referral.linkedProperty.room && (
                                                            <div className="text-xs text-gray-500">
                                                                {referral.linkedProperty.room}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Not yet assigned</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedReferral(referral);
                                                    }}
                                                    className="px-3 py-1 text-sm text-ivolve-mid hover:text-white hover:bg-ivolve-mid rounded transition-all duration-200 font-medium border border-ivolve-mid/30 hover:border-ivolve-mid"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            <div className="divide-y divide-gray-100">
                                {filteredAndSortedReferrals.map((referral) => (
                                    <div
                                        key={referral.id}
                                        onClick={() => setSelectedReferral(referral)}
                                        className="p-4 hover:bg-ivolve-paper/50 cursor-pointer transition-colors"
                                    >
                                        {/* Header with name and service type */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {referral.personal.firstName} {referral.personal.lastName}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    {referral.referralRef}
                                                </p>
                                            </div>
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getServiceTypeColor(referral.serviceType)}`}>
                                                {referral.serviceType}
                                            </span>
                                        </div>

                                        {/* Key Info Grid */}
                                        <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Status</p>
                                                <StatusBadge status={referral.status} size="sm" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Referrer</p>
                                                <p className="text-gray-800 text-sm">{referral.referrerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Referral Date</p>
                                                <p className="text-gray-800 text-sm">{formatDate(referral.referralDate)}</p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedReferral(referral);
                                            }}
                                            className="w-full px-3 py-2 text-sm text-ivolve-mid hover:text-white hover:bg-ivolve-mid rounded transition-all duration-200 font-medium border border-ivolve-mid/30 hover:border-ivolve-mid"
                                        >
                                            View Referral
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="p-4 bg-ivolve-paper rounded-full">
                                    <UserPlus className="text-ivolve-mid" size={48} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                No referrals found
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {searchQuery || hasActiveFilters
                                    ? 'No referrals match your current filters and search criteria'
                                    : 'No referrals have been added to the system yet'}
                            </p>
                            {(searchQuery || hasActiveFilters) && (
                                <div className="flex gap-3 justify-center">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="px-4 py-2 text-ivolve-mid border border-ivolve-mid rounded-lg hover:bg-ivolve-paper transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    {hasActiveFilters && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-4 py-2 text-ivolve-mid border border-ivolve-mid rounded-lg hover:bg-ivolve-paper transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
