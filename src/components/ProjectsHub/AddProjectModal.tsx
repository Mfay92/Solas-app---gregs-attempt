import { useState } from 'react';
import {
    X,
    ChevronDown,
    ChevronUp,
    FolderKanban,
    User,
    Calendar,
    PoundSterling,
    Tag,
    Building
} from 'lucide-react';
import {
    Project,
    PROJECT_TYPES,
    PROJECT_STATUSES,
    PROJECT_PRIORITIES,
    DEPARTMENTS,
    TEAM_MEMBERS,
    generateProjectId
} from '../../types/projects';
import { useToast } from '../ToastProvider';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (project: Project) => void;
}

export default function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
    const { showToast } = useToast();
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    // Form state - Essential fields
    const [name, setName] = useState('');
    const [type, setType] = useState(PROJECT_TYPES[1]); // Default: 'Team'
    const [priority, setPriority] = useState(PROJECT_PRIORITIES[1]); // Default: 'Medium'
    const [status, setStatus] = useState(PROJECT_STATUSES[0]); // Default: 'Planning'
    const [owner, setOwner] = useState(TEAM_MEMBERS[0]); // Default: 'Matt Fay'
    const [startDate, setStartDate] = useState('');
    const [targetCompletionDate, setTargetCompletionDate] = useState('');

    // Form state - Optional fields
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('');
    const [budget, setBudget] = useState<number | ''>('');
    const [tags, setTags] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        setName('');
        setType(PROJECT_TYPES[1]);
        setPriority(PROJECT_PRIORITIES[1]);
        setStatus(PROJECT_STATUSES[0]);
        setOwner(TEAM_MEMBERS[0]);
        setStartDate('');
        setTargetCompletionDate('');
        setDescription('');
        setDepartment('');
        setBudget('');
        setTags('');
        setShowMoreDetails(false);
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Project name is required';
        }
        if (!owner.trim()) {
            newErrors.owner = 'Project owner is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const now = new Date().toISOString();
        const newProject: Project = {
            id: generateProjectId(),
            name: name.trim(),
            type,
            priority,
            status,
            owner: owner.trim(),
            description: description.trim() || undefined,
            department: department || undefined,
            startDate: startDate || undefined,
            targetCompletionDate: targetCompletionDate || undefined,
            budget: budget === '' ? undefined : budget,
            tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
            tasks: [],
            createdAt: now,
            updatedAt: now,
            createdBy: owner.trim()
        };

        onAdd(newProject);
        showToast('Project created successfully', 'success');
        resetForm();
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <FolderKanban size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Project</h2>
                                <p className="text-white/80 text-sm">Track a new project from planning to completion</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="p-6 space-y-6">
                        {/* Essential Fields Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Essential Information
                            </h3>

                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FolderKanban size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Achieve CQC Outstanding Rating"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all ${
                                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Type & Priority Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as typeof type)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    >
                                        {PROJECT_TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as typeof priority)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    >
                                        {PROJECT_PRIORITIES.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Status & Owner Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Initial Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as typeof status)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    >
                                        {PROJECT_STATUSES.filter(s => s !== 'Completed' && s !== 'Cancelled').map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Owner <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={owner}
                                            onChange={(e) => setOwner(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all ${
                                                errors.owner ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        >
                                            {TEAM_MEMBERS.map(member => (
                                                <option key={member} value={member}>{member}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.owner && <p className="mt-1 text-sm text-red-600">{errors.owner}</p>}
                                </div>
                            </div>

                            {/* Dates Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Completion Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={targetCompletionDate}
                                            onChange={(e) => setTargetCompletionDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* More Details Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            {showMoreDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            {showMoreDetails ? 'Hide' : 'Show'} More Details
                        </button>

                        {/* Optional Fields Section */}
                        {showMoreDetails && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Additional Details
                                </h3>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description / Notes
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Any additional details about this project..."
                                        rows={3}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Department & Budget Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Department
                                        </label>
                                        <div className="relative">
                                            <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                            >
                                                <option value="">None</option>
                                                {DEPARTMENTS.map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Budget
                                        </label>
                                        <div className="relative">
                                            <PoundSterling size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                step="100"
                                                value={budget}
                                                onChange={(e) => setBudget(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                placeholder="e.g., 50000"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Estimated project budget in £</p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags
                                    </label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="Compliance, Property Development, Quick Win (comma separated)"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all font-semibold shadow-sm hover:shadow-md"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
