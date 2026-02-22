import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Person } from '../../types';
import peopleData from '../../data/people.json';
import PersonProfile from '../PersonProfile';
import StatusBadge from '../shared/StatusBadge';
import { PersonAvatar } from '../../utils/avatarUtils';
import { usePopOut } from '../../context/PopOutContext';
import { Users, Search, UserPlus, ArrowUpDown, AlertCircle, X, ExternalLink, Filter, Download, UserCheck, CheckSquare, Square, FileText } from 'lucide-react';

interface PeopleHubProps {
    onNavigateAway?: () => void;
}

interface SortConfig {
    key: 'name' | 'age' | 'propertyAddress' | 'tenancyStatus' | 'supportLevel' | 'careProvider';
    direction: 'asc' | 'desc';
}

interface FilterConfig {
    supportLevel: string;
    careProvider: string;
    arrearsStatus: string;
    tenancyStatus: string;
}

/**
 * PeopleHub Component
 *
 * Main hub for viewing and managing people we support across all properties.
 * Features:
 * - Table view of all people with key information
 * - Search by name (first, last, or preferred name)
 * - Click to view detailed PersonProfile
 * - Responsive design for mobile and desktop
 * - Support level and tenancy status indicators
 */
export default function PeopleHub({ }: PeopleHubProps) {
    // Temporary helper for toasts until context is available
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // In a real app, this would use a toast notification system
    };

    // State
    const [people, setPeople] = useState<Person[]>(peopleData as unknown as Person[]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'name',
        direction: 'asc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterConfig>({
        supportLevel: 'All',
        careProvider: 'All',
        arrearsStatus: 'All',
        tenancyStatus: 'All'
    });

    // Bulk selection state
    const [selectedPeopleIds, setSelectedPeopleIds] = useState<Set<string>>(new Set());
    const [showKeyWorkerDropdown, setShowKeyWorkerDropdown] = useState(false);

    const { openWindow } = usePopOut();
    const navigate = useNavigate();

    // Get unique care providers for filter dropdown
    const uniqueCareProviders = useMemo(() => {
        const providers = new Set<string>();
        people.forEach(person => {
            if (person.support.careProvider) {
                providers.add(person.support.careProvider);
            }
        });
        return Array.from(providers).sort();
    }, [people]);

    // Get unique key workers for bulk assignment
    const uniqueKeyWorkers = useMemo(() => {
        const workers = new Set<string>();
        people.forEach(person => {
            if (person.support.keyWorker) {
                workers.add(person.support.keyWorker);
            }
        });
        return Array.from(workers).sort();
    }, [people]);

    // Calculate quick stats
    const stats = useMemo(() => {
        const totalPeople = people.length;
        const peopleInArrears = people.filter(p => (p.finance.currentBalance || 0) < 0).length;
        // For overdue support plans, we would need support plan data - placeholder for now
        const overdueSupportPlans = 0; // TODO: Implement when support plan data is available
        const currentTenants = people.filter(p => p.tenancy.tenancyStatus === 'Current').length;
        const occupancyPercentage = totalPeople > 0 ? Math.round((currentTenants / totalPeople) * 100) : 0;

        return {
            totalPeople,
            peopleInArrears,
            overdueSupportPlans,
            occupancyPercentage
        };
    }, [people]);

    // Filter and sort people
    const filteredAndSortedPeople = useMemo(() => {
        // Apply filters first
        let filtered = people.filter(person => {
            // Support Level filter
            if (filters.supportLevel !== 'All' && person.support.supportLevel !== filters.supportLevel) {
                return false;
            }

            // Care Provider filter
            if (filters.careProvider !== 'All' && person.support.careProvider !== filters.careProvider) {
                return false;
            }

            // Arrears Status filter
            if (filters.arrearsStatus !== 'All') {
                const hasArrears = (person.finance.currentBalance || 0) < 0;
                if (filters.arrearsStatus === 'In Arrears' && !hasArrears) return false;
                if (filters.arrearsStatus === 'Up to Date' && hasArrears) return false;
            }

            // Tenancy Status filter
            if (filters.tenancyStatus !== 'All' && person.tenancy.tenancyStatus !== filters.tenancyStatus) {
                return false;
            }

            return true;
        });

        // Then apply search query
        filtered = filtered.filter(person => {
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const fullName = `${person.personal.firstName} ${person.personal.lastName}`.toLowerCase();
            const preferredName = person.personal.preferredName?.toLowerCase() || '';
            const propertyAddress = person.tenancy.propertyAddress.toLowerCase();

            return (
                fullName.includes(query) ||
                preferredName.includes(query) ||
                propertyAddress.includes(query)
            );
        });

        // Sort
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortConfig.key) {
                case 'name':
                    aValue = `${a.personal.firstName} ${a.personal.lastName}`.toLowerCase();
                    bValue = `${b.personal.firstName} ${b.personal.lastName}`.toLowerCase();
                    break;
                case 'age':
                    aValue = a.personal.age || 0;
                    bValue = b.personal.age || 0;
                    break;
                case 'propertyAddress':
                    aValue = a.tenancy.propertyAddress.toLowerCase();
                    bValue = b.tenancy.propertyAddress.toLowerCase();
                    break;
                case 'tenancyStatus':
                    aValue = a.tenancy.tenancyStatus;
                    bValue = b.tenancy.tenancyStatus;
                    break;
                case 'supportLevel':
                    // Sort support levels: Intensive > High > Medium > Low
                    const supportOrder = { 'Intensive': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    aValue = supportOrder[a.support.supportLevel as keyof typeof supportOrder] || 0;
                    bValue = supportOrder[b.support.supportLevel as keyof typeof supportOrder] || 0;
                    break;
                case 'careProvider':
                    aValue = (a.support.careProvider || '').toLowerCase();
                    bValue = (b.support.careProvider || '').toLowerCase();
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
    }, [people, searchQuery, sortConfig, filters]);

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            supportLevel: 'All',
            careProvider: 'All',
            arrearsStatus: 'All',
            tenancyStatus: 'All'
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.supportLevel !== 'All' ||
        filters.careProvider !== 'All' ||
        filters.arrearsStatus !== 'All' ||
        filters.tenancyStatus !== 'All';

    // Handler to toggle sort
    const handleSort = (key: SortConfig['key']) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Handler to open person in pop-out window
    const handleOpenInPopOut = (person: Person, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        openWindow({
            id: `person-${person.id}`,
            title: `${person.personal.firstName} ${person.personal.lastName}`,
            type: 'person-profile',
            content: <PersonProfile person={person} onBack={() => { }} />,
            entityId: person.id
        });
    };

    // Bulk selection handlers
    const handleSelectAll = () => {
        if (selectedPeopleIds.size === filteredAndSortedPeople.length) {
            // Deselect all
            setSelectedPeopleIds(new Set());
        } else {
            // Select all filtered people
            const allIds = new Set(filteredAndSortedPeople.map(p => p.id));
            setSelectedPeopleIds(allIds);
        }
    };

    const handleSelectPerson = (personId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        const newSelection = new Set(selectedPeopleIds);
        if (newSelection.has(personId)) {
            newSelection.delete(personId);
        } else {
            newSelection.add(personId);
        }
        setSelectedPeopleIds(newSelection);
    };

    const handleClearSelection = () => {
        setSelectedPeopleIds(new Set());
        setShowKeyWorkerDropdown(false);
    };

    // Export to CSV
    const handleExportToCSV = () => {
        try {
            const selectedPeople = people.filter(p => selectedPeopleIds.has(p.id));

            if (selectedPeople.length === 0) {
                showToast('No people selected for export', 'error');
                return;
            }

            // Create CSV header
            const headers = ['Name', 'Age', 'Property', 'Status', 'Support Level', 'Care Provider', 'Key Worker', 'Rent Balance'];

            // Create CSV rows
            const rows = selectedPeople.map(person => {
                const name = `${person.personal.firstName} ${person.personal.lastName}`;
                const age = person.personal.age || '';
                const property = person.tenancy.propertyAddress;
                const status = person.tenancy.tenancyStatus;
                const supportLevel = person.support.supportLevel || '';
                const careProvider = person.support.careProvider || '';
                const keyWorker = person.support.keyWorker || '';
                const rentBalance = person.finance.currentBalance !== undefined
                    ? `£${person.finance.currentBalance.toFixed(2)}`
                    : '';

                return [name, age, property, status, supportLevel, careProvider, keyWorker, rentBalance];
            });

            // Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `solas-people-export-${today}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            // Show success message and clear selection
            showToast(
                `Exported ${selectedPeople.length} ${selectedPeople.length === 1 ? 'person' : 'people'} to CSV`,
                'success'
            );
            handleClearSelection();
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            showToast('Failed to export CSV. Please try again.', 'error');
        }
    };

    // Assign key worker to selected people
    const handleAssignKeyWorker = (keyWorker: string) => {
        try {
            const updatedPeople = people.map(person => {
                if (selectedPeopleIds.has(person.id)) {
                    return {
                        ...person,
                        support: {
                            ...person.support,
                            keyWorker: keyWorker === 'Add New' ? '' : keyWorker
                        },
                        lastUpdated: new Date().toISOString().split('T')[0]
                    };
                }
                return person;
            });

            // Update local state
            setPeople(updatedPeople);

            // Persist to localStorage
            localStorage.setItem('solas_people', JSON.stringify(updatedPeople));

            // Close dropdown and clear selection
            setShowKeyWorkerDropdown(false);
            handleClearSelection();

            // Show success message
            showToast(
                `Assigned ${keyWorker} to ${selectedPeopleIds.size} ${selectedPeopleIds.size === 1 ? 'person' : 'people'}`,
                'success'
            );
        } catch (error) {
            console.error('Error assigning key worker:', error);
            showToast('Failed to assign key worker. Please try again.', 'error');
        }
    };

    // If a person is selected, show their profile
    if (selectedPerson) {
        return (
            <PersonProfile
                person={selectedPerson}
                onBack={() => setSelectedPerson(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 w-full shadow-md">
                <div className="px-6 py-6">
                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Users size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">People Hub</h1>
                                <p className="text-white/80 mt-1">
                                    View and manage all people we support across all properties
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search people..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-9 pr-8 py-2 bg-white/10 border-2 border-white/30 text-white placeholder-white/60 rounded-lg focus:bg-white/20 focus:border-white/50 transition-all text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-white/20 rounded-full"
                                    >
                                        <X size={14} className="text-white/60" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => navigate('/referrals')}
                                className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                            >
                                <UserPlus size={18} />
                                New Referral
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Users size={14} />
                                Total People
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">{stats.totalPeople}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <AlertCircle size={14} />
                                In Arrears
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">{stats.peopleInArrears}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <FileText size={14} />
                                Overdue Plans
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">{stats.overdueSupportPlans}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <UserCheck size={14} />
                                Occupancy
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">{stats.occupancyPercentage}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                {/* Advanced Filters Panel */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-all ${hasActiveFilters
                                ? 'bg-ivolve-mid text-white border-ivolve-mid'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            <Filter size={14} />
                            <span>
                                {hasActiveFilters ? 'Filters Active' : 'Filters'}
                            </span>
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                                    {Object.values(filters).filter(v => v !== 'All').length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel Content */}
                    {showFilters && (
                        <div className="p-4 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                {/* Support Level Filter */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                        Support Level
                                    </label>
                                    <select
                                        value={filters.supportLevel}
                                        onChange={(e) => setFilters({ ...filters, supportLevel: e.target.value })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-ivolve-mid"
                                    >
                                        <option value="All">All Levels</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Intensive">Intensive</option>
                                    </select>
                                </div>

                                {/* Care Provider Filter */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                        Care Provider
                                    </label>
                                    <select
                                        value={filters.careProvider}
                                        onChange={(e) => setFilters({ ...filters, careProvider: e.target.value })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-ivolve-mid"
                                    >
                                        <option value="All">All Providers</option>
                                        {uniqueCareProviders.map(provider => (
                                            <option key={provider} value={provider}>{provider}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Arrears Status Filter */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                        Arrears Status
                                    </label>
                                    <select
                                        value={filters.arrearsStatus}
                                        onChange={(e) => setFilters({ ...filters, arrearsStatus: e.target.value })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-ivolve-mid"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Up to Date">Up to Date</option>
                                        <option value="In Arrears">In Arrears</option>
                                    </select>
                                </div>

                                {/* Tenancy Status Filter */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                        Tenancy Status
                                    </label>
                                    <select
                                        value={filters.tenancyStatus}
                                        onChange={(e) => setFilters({ ...filters, tenancyStatus: e.target.value })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-ivolve-mid"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Current">Current</option>
                                        <option value="Former">Former</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {hasActiveFilters && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-3 py-1 text-xs font-medium text-ivolve-mid hover:underline"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="">
                {filteredAndSortedPeople.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        {/* Checkbox Column */}
                                        <th className="px-4 py-3 text-center w-12">
                                            <button
                                                onClick={handleSelectAll}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                title={selectedPeopleIds.size === filteredAndSortedPeople.length ? 'Deselect all' : 'Select all'}
                                            >
                                                {selectedPeopleIds.size === filteredAndSortedPeople.length ? (
                                                    <CheckSquare size={18} className="text-ivolve-mid" />
                                                ) : (
                                                    <Square size={18} className="text-gray-400" />
                                                )}
                                            </button>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Person
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('age')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Age
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('propertyAddress')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Property
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('tenancyStatus')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Status
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSort('supportLevel')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Support
                                                <ArrowUpDown size={14} className="text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Care Provider
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Key Worker
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAndSortedPeople.map((person) => (
                                        <tr
                                            key={person.id}
                                            onClick={() => setSelectedPerson(person)}
                                            className={`hover:bg-ivolve-paper/50 cursor-pointer transition-colors ${selectedPeopleIds.has(person.id) ? 'bg-ivolve-paper/30' : ''
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={(e) => handleSelectPerson(person.id, e)}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    {selectedPeopleIds.has(person.id) ? (
                                                        <CheckSquare size={18} className="text-ivolve-mid" />
                                                    ) : (
                                                        <Square size={18} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </td>

                                            {/* Person Name & Photo */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <PersonAvatar
                                                        firstName={person.personal.firstName}
                                                        lastName={person.personal.lastName}
                                                        photo={person.personal.photo}
                                                        size="md"
                                                        className="flex-shrink-0"
                                                    />
                                                    {/* Name */}
                                                    <div>
                                                        <div className="font-semibold text-gray-800">
                                                            {person.personal.firstName} {person.personal.lastName}
                                                        </div>
                                                        {person.personal.preferredName &&
                                                            person.personal.preferredName !== person.personal.firstName && (
                                                                <div className="text-xs text-gray-500">
                                                                    Prefers: {person.personal.preferredName}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Age */}
                                            <td className="px-4 py-4 text-gray-700 text-sm">
                                                {person.personal.age ? `${person.personal.age} yrs` : '-'}
                                            </td>

                                            {/* Property Address */}
                                            <td className="px-4 py-4 text-gray-700 text-sm">
                                                <div className="truncate max-w-xs" title={person.tenancy.propertyAddress}>
                                                    {person.tenancy.propertyAddress}
                                                </div>
                                                {person.tenancy.room && (
                                                    <div className="text-xs text-gray-500">
                                                        {person.tenancy.room}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Tenancy Status */}
                                            <td className="px-4 py-4">
                                                <StatusBadge status={person.tenancy.tenancyStatus} size="sm" />
                                            </td>

                                            {/* Support Level */}
                                            <td className="px-4 py-4">
                                                {person.support.supportLevel ? (
                                                    <StatusBadge status={`${person.support.supportLevel} Support`} size="sm" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>

                                            {/* Care Provider */}
                                            <td className="px-4 py-4 text-gray-700 text-sm max-w-xs truncate">
                                                {person.support.careProvider || '-'}
                                            </td>

                                            {/* Key Worker */}
                                            <td className="px-4 py-4 text-gray-700 text-sm max-w-xs truncate">
                                                {person.support.keyWorker || '-'}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPerson(person);
                                                        }}
                                                        className="px-3 py-1 text-sm text-ivolve-mid hover:text-white hover:bg-ivolve-mid rounded transition-all duration-200 font-medium border border-ivolve-mid/30 hover:border-ivolve-mid"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleOpenInPopOut(person, e)}
                                                        className="px-3 py-1 text-sm text-ivolve-teal hover:text-white hover:bg-ivolve-teal rounded transition-all duration-200 font-medium border border-ivolve-teal/30 hover:border-ivolve-teal flex items-center gap-1"
                                                        title="Open in pop-out window"
                                                    >
                                                        <ExternalLink size={14} />
                                                        Pop-out
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            <div className="divide-y divide-gray-100">
                                {filteredAndSortedPeople.map((person) => (
                                    <div
                                        key={person.id}
                                        onClick={() => setSelectedPerson(person)}
                                        className="p-4 hover:bg-ivolve-paper/50 cursor-pointer transition-colors"
                                    >
                                        {/* Header with name and avatar */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <PersonAvatar
                                                firstName={person.personal.firstName}
                                                lastName={person.personal.lastName}
                                                photo={person.personal.photo}
                                                size="md"
                                                className="flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">
                                                    {person.personal.firstName} {person.personal.lastName}
                                                </h3>
                                                {person.personal.preferredName &&
                                                    person.personal.preferredName !== person.personal.firstName && (
                                                        <p className="text-xs text-gray-500">
                                                            Prefers: {person.personal.preferredName}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Key Info Grid */}
                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Age</p>
                                                <p className="font-medium text-gray-800">
                                                    {person.personal.age ? `${person.personal.age} yrs` : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase mb-1">Status</p>
                                                <StatusBadge status={person.tenancy.tenancyStatus} size="sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Property</p>
                                                <p className="text-gray-800 text-sm truncate">
                                                    {person.tenancy.propertyAddress}
                                                </p>
                                                {person.tenancy.room && (
                                                    <p className="text-gray-600 text-xs">
                                                        {person.tenancy.room}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Support</p>
                                                {person.support.supportLevel ? (
                                                    <StatusBadge status={`${person.support.supportLevel} Support`} size="sm" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Care Provider</p>
                                                <p className="text-gray-800 text-sm">
                                                    {person.support.careProvider || '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPerson(person);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm text-ivolve-mid hover:text-white hover:bg-ivolve-mid rounded transition-all duration-200 font-medium border border-ivolve-mid/30 hover:border-ivolve-mid"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={(e) => handleOpenInPopOut(person, e)}
                                                className="px-3 py-2 text-sm text-ivolve-teal hover:text-white hover:bg-ivolve-teal rounded transition-all duration-200 font-medium border border-ivolve-teal/30 hover:border-ivolve-teal flex items-center gap-1"
                                                title="Open in pop-out window"
                                            >
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
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
                                    <AlertCircle className="text-ivolve-mid" size={48} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                No people found
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {searchQuery || hasActiveFilters
                                    ? 'No people match your current filters and search criteria'
                                    : 'No people have been added to the system yet'}
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

            {/* Bulk Actions Toolbar - Fixed at bottom when people are selected */}
            {selectedPeopleIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-ivolve-mid shadow-lg z-40">
                    <div className="px-4 py-3 flex items-center gap-4 overflow-x-auto">
                        {/* Selection Count */}
                        <div className="flex items-center gap-2">
                            <div className="bg-ivolve-mid text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                {selectedPeopleIds.size}
                            </div>
                            <span className="font-semibold text-gray-700">
                                {selectedPeopleIds.size === 1 ? 'person selected' : 'people selected'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-300" />

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Assign Key Worker */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowKeyWorkerDropdown(!showKeyWorkerDropdown)}
                                    className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                                >
                                    <UserCheck size={18} />
                                    Assign Key Worker
                                </button>

                                {/* Key Worker Dropdown */}
                                {showKeyWorkerDropdown && (
                                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] max-h-64 overflow-y-auto z-[100]">
                                        {uniqueKeyWorkers.map((worker) => (
                                            <button
                                                key={worker}
                                                onClick={() => handleAssignKeyWorker(worker)}
                                                className="w-full px-4 py-2 text-left hover:bg-ivolve-paper transition-colors text-sm"
                                            >
                                                {worker}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handleAssignKeyWorker('Add New')}
                                            className="w-full px-4 py-2 text-left hover:bg-ivolve-paper transition-colors text-sm font-semibold text-ivolve-mid border-t border-gray-200"
                                        >
                                            + Add New
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Export to CSV */}
                            <button
                                onClick={handleExportToCSV}
                                className="px-4 py-2 bg-ivolve-teal text-white rounded-lg hover:bg-ivolve-teal/90 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                            >
                                <Download size={18} />
                                Export to CSV
                            </button>

                            {/* Clear Selection */}
                            <button
                                onClick={handleClearSelection}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                <X size={18} />
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="py-6 border-t border-gray-100 text-center text-gray-500 text-sm">
                {filteredAndSortedPeople.length > 0 && (
                    <p>
                        Showing {filteredAndSortedPeople.length} of {people.length} people
                        {(searchQuery || hasActiveFilters) && ' (filtered)'}
                    </p>
                )}
            </div>
        </div>
    );
}
