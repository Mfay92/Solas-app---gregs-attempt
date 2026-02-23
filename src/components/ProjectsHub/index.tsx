import { useState, useEffect, useMemo } from 'react';
import {
    FolderKanban,
    Plus,
    TrendingUp,
    AlertTriangle,
    ListTodo,
    CheckCircle2,
    Search,
    X,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import {
    Project,
    ProjectStatus,
    ProjectPriority,
    ProjectCategory,
    PROJECT_CATEGORIES,
    PROJECT_CATEGORY_LABELS,
    calculateProjectHealth
} from '../../types/projects';
import AddProjectModal from './AddProjectModal';
import ProjectCard from './ProjectCard';
import ProjectDetailView from './ProjectDetailView';
import { loadMockProjects } from '../../data/mockProjects';
import { useToast } from '../ToastProvider';

const STORAGE_KEY = 'solas_projects';

type SortField = 'name' | 'priority' | 'dueDate' | 'createdAt' | 'health';
type SortDirection = 'asc' | 'desc';

interface FilterConfig {
    category: ProjectCategory | 'All';
    status: ProjectStatus | 'All';
    priority: ProjectPriority | 'All';
    owner: string;
    department: string;
    health: 'Healthy' | 'At Risk' | 'Critical' | 'All';
}

export default function ProjectsHub() {
    const { showToast } = useToast();

    // State
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const [filters, setFilters] = useState<FilterConfig>({
        category: 'All',
        status: 'All',
        priority: 'All',
        owner: 'All',
        department: 'All',
        health: 'All'
    });

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setProjects(parsed);
            } catch (error) {
                console.error('Failed to parse projects from localStorage:', error);
            }
        }
    }, []);

    // Save to localStorage whenever projects change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }, [projects]);

    // Calculate stats
    const stats = useMemo(() => {
        const activeProjects = projects.filter(
            p => p.status === 'Planning' || p.status === 'In Progress'
        ).length;

        const atRiskProjects = projects.filter(p => {
            const health = calculateProjectHealth(p);
            return health === 'At Risk' || health === 'Critical';
        }).length;

        const now = new Date();
        const overdueTasks = projects.reduce((count, project) => {
            const overdue = project.tasks.filter(task => {
                if (task.completed || !task.dueDate) return false;
                return new Date(task.dueDate) < now;
            });
            return count + overdue.length;
        }, 0);

        const completedThisMonth = projects.filter(p => {
            if (!p.actualCompletionDate) return false;
            const completed = new Date(p.actualCompletionDate);
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return completed >= monthStart && completed <= monthEnd;
        }).length;

        return {
            activeProjects,
            atRiskProjects,
            overdueTasks,
            completedThisMonth
        };
    }, [projects]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== 'All');
    }, [filters]);

    // Filter and sort projects
    const filteredAndSortedProjects = useMemo(() => {
        let result = [...projects];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(project => {
                const searchableFields = [
                    project.name,
                    project.owner,
                    project.department || '',
                    project.description || '',
                    ...(project.tags || [])
                ];
                return searchableFields.some(field =>
                    field.toLowerCase().includes(query)
                );
            });
        }

        // Apply filters
        if (filters.category !== 'All') {
            result = result.filter(p => p.category === filters.category);
        }
        if (filters.status !== 'All') {
            result = result.filter(p => p.status === filters.status);
        }
        if (filters.priority !== 'All') {
            result = result.filter(p => p.priority === filters.priority);
        }
        if (filters.owner !== 'All') {
            result = result.filter(p => p.owner === filters.owner);
        }
        if (filters.department !== 'All') {
            result = result.filter(p => p.department === filters.department);
        }
        if (filters.health !== 'All') {
            result = result.filter(p => calculateProjectHealth(p) === filters.health);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'priority':
                    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    aValue = priorityOrder[a.priority];
                    bValue = priorityOrder[b.priority];
                    break;
                case 'dueDate':
                    aValue = a.targetCompletionDate ? new Date(a.targetCompletionDate).getTime() : 0;
                    bValue = b.targetCompletionDate ? new Date(b.targetCompletionDate).getTime() : 0;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'health':
                    const healthOrder = { 'Critical': 3, 'At Risk': 2, 'Healthy': 1 };
                    aValue = healthOrder[calculateProjectHealth(a)];
                    bValue = healthOrder[calculateProjectHealth(b)];
                    break;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [projects, searchQuery, filters, sortField, sortDirection]);

    // Handlers
    const handleAddProject = (project: Project) => {
        setProjects([...projects, project]);
    };

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));

        // Update selected project if it's the one being edited
        if (selectedProject?.id === updatedProject.id) {
            setSelectedProject(updatedProject);
        }
    };

    const handleDeleteProject = (projectId: string) => {
        setProjects(projects.filter(p => p.id !== projectId));
        setSelectedProject(null);
    };

    const handleClearFilters = () => {
        setFilters({
            category: 'All',
            status: 'All',
            priority: 'All',
            owner: 'All',
            department: 'All',
            health: 'All'
        });
    };

    // Future feature: column sorting
    // const handleSort = (field: SortField) => {
    //     if (sortField === field) {
    //         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         setSortField(field);
    //         setSortDirection('asc');
    //     }
    // };

    // Get unique owners and departments for filter dropdowns
    const uniqueOwners = useMemo(() => {
        const owners = new Set(projects.map(p => p.owner));
        return ['All', ...Array.from(owners).sort()];
    }, [projects]);

    const uniqueDepartments = useMemo(() => {
        const departments = new Set(projects.map(p => p.department).filter(Boolean) as string[]);
        return ['All', ...Array.from(departments).sort()];
    }, [projects]);

    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 w-full shadow-md">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <FolderKanban className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Projects Hub</h1>
                                <p className="text-white/80 mt-1">
                                    Manage personal, team, and company-wide projects from one central location
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    loadMockProjects();
                                    const stored = localStorage.getItem(STORAGE_KEY);
                                    if (stored) {
                                        setProjects(JSON.parse(stored));
                                    }
                                    showToast('Loaded 10 demo projects', 'success');
                                }}
                                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 font-medium border border-white/30"
                            >
                                <FolderKanban size={18} />
                                Load Demo Data
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-white/90 transition-all duration-200 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                            >
                                <Plus size={20} />
                                New Project
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Active Projects */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                                <TrendingUp size={14} />
                                Active Projects
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                        </div>

                        {/* At Risk Projects */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                                <AlertTriangle size={14} />
                                At Risk Projects
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.atRiskProjects}</p>
                        </div>

                        {/* Overdue Tasks */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                                <ListTodo size={14} />
                                Overdue Tasks
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.overdueTasks}</p>
                        </div>

                        {/* Completed This Month */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                                <CheckCircle2 size={14} />
                                Completed This Month
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.completedThisMonth}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Controls Row */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    {/* Left side - Filters and Sort */}
                    <div className="flex items-center gap-3">
                        {/* Filters Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                                hasActiveFilters
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            <Filter size={14} />
                            <span>{hasActiveFilters ? 'Filters Active' : 'Filters'}</span>
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                                    {Object.values(filters).filter(v => v !== 'All').length}
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="px-3 py-1 text-xs font-medium text-indigo-600 hover:underline"
                            >
                                Clear All Filters
                            </button>
                        )}

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={`${sortField}-${sortDirection}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split('-') as [SortField, SortDirection];
                                    setSortField(field);
                                    setSortDirection(direction);
                                }}
                                className="appearance-none pl-8 pr-8 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="priority-desc">Priority (High to Low)</option>
                                <option value="priority-asc">Priority (Low to High)</option>
                                <option value="dueDate-asc">Due Date (Soonest)</option>
                                <option value="dueDate-desc">Due Date (Latest)</option>
                                <option value="health-desc">Health (Critical First)</option>
                                <option value="health-asc">Health (Healthy First)</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Right side - Search */}
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value as FilterConfig['category'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    <option value="All">All Categories</option>
                                    {PROJECT_CATEGORIES.map(category => (
                                        <option key={category} value={category}>
                                            {PROJECT_CATEGORY_LABELS[category]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterConfig['status'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    <option value="All">All</option>
                                    <option value="Pipeline">Pipeline</option>
                                    <option value="Planning">Planning</option>
                                    <option value="Procurement">Procurement</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Snagging">Snagging</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={filters.priority}
                                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as FilterConfig['priority'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    <option value="All">All</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>

                            {/* Owner Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
                                <select
                                    value={filters.owner}
                                    onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    {uniqueOwners.map(owner => (
                                        <option key={owner} value={owner}>{owner}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Department Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Health Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Health</label>
                                <select
                                    value={filters.health}
                                    onChange={(e) => setFilters({ ...filters, health: e.target.value as FilterConfig['health'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                >
                                    <option value="All">All</option>
                                    <option value="Healthy">Healthy</option>
                                    <option value="At Risk">At Risk</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects List */}
                {filteredAndSortedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAndSortedProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="p-4 bg-indigo-100 rounded-full">
                                    <FolderKanban className="text-indigo-600" size={48} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {projects.length === 0
                                    ? 'Start tracking your projects by adding your first one'
                                    : 'Try adjusting your search or filters to find what you\'re looking for'}
                            </p>
                            {projects.length === 0 && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 font-semibold mx-auto"
                                >
                                    <Plus size={20} />
                                    Add First Project
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Project Modal */}
            <AddProjectModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProject}
            />

            {/* Project Detail View */}
            {selectedProject && (
                <ProjectDetailView
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onUpdate={handleUpdateProject}
                    onDelete={handleDeleteProject}
                />
            )}
        </div>
    );
}
