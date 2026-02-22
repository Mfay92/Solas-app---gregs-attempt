import { useState } from 'react';
import {
    X,
    Trash2,
    CheckCircle2,
    Circle,
    Plus,
    User,
    Calendar,
    PoundSterling,
    Tag,
    AlertCircle,
    AlertTriangle,
    Clock
} from 'lucide-react';
import {
    Project,
    Task,
    TEAM_MEMBERS,
    calculateProjectHealth,
    getHealthColor,
    getPriorityColor,
    getStatusColor,
    formatDate,
    formatCurrency,
    generateTaskId
} from '../../types/projects';
import { useToast } from '../ToastProvider';

interface ProjectDetailViewProps {
    project: Project;
    onClose: () => void;
    onUpdate: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export default function ProjectDetailView({ project, onClose, onUpdate, onDelete }: ProjectDetailViewProps) {
    const { showToast } = useToast();
    const [showAddTask, setShowAddTask] = useState(false);
    // const [showEditModal, setShowEditModal] = useState(false); // Future feature
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Add Task form state
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    const health = calculateProjectHealth(project);
    const healthColors = getHealthColor(health);
    const priorityColors = getPriorityColor(project.priority);
    const statusColors = getStatusColor(project.status);

    // Sort tasks: overdue first, then incomplete, then completed
    const sortedTasks = [...project.tasks].sort((a, b) => {
        // Completed tasks go to bottom
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // Among incomplete tasks, overdue ones come first
        if (!a.completed) {
            const now = new Date();
            const aOverdue = a.dueDate ? new Date(a.dueDate) < now : false;
            const bOverdue = b.dueDate ? new Date(b.dueDate) < now : false;

            if (aOverdue !== bOverdue) {
                return aOverdue ? -1 : 1;
            }

            // Sort by due date (earliest first)
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
        }

        return 0;
    });

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) {
            showToast('Task title is required', 'error');
            return;
        }

        const now = new Date().toISOString();
        const newTask: Task = {
            id: generateTaskId(),
            projectId: project.id,
            title: newTaskTitle.trim(),
            assignedTo: newTaskAssignedTo || undefined,
            dueDate: newTaskDueDate || undefined,
            completed: false,
            createdAt: now
        };

        const updatedProject: Project = {
            ...project,
            tasks: [...project.tasks, newTask],
            updatedAt: now
        };

        onUpdate(updatedProject);
        showToast('Task added successfully', 'success');
        setNewTaskTitle('');
        setNewTaskAssignedTo('');
        setNewTaskDueDate('');
        setShowAddTask(false);
    };

    const handleToggleTaskComplete = (taskId: string) => {
        const now = new Date().toISOString();
        const updatedTasks = project.tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? now : undefined,
                    completedBy: !task.completed ? project.owner : undefined
                };
            }
            return task;
        });

        const updatedProject: Project = {
            ...project,
            tasks: updatedTasks,
            updatedAt: now
        };

        onUpdate(updatedProject);
    };

    const handleDeleteTask = (taskId: string) => {
        const updatedProject: Project = {
            ...project,
            tasks: project.tasks.filter(t => t.id !== taskId),
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedProject);
        showToast('Task deleted', 'success');
    };

    const handleMarkComplete = () => {
        const now = new Date().toISOString();
        const updatedProject: Project = {
            ...project,
            status: 'Completed',
            actualCompletionDate: now,
            updatedAt: now
        };

        onUpdate(updatedProject);
        showToast('Project marked as complete', 'success');
    };

    const handleDeleteProject = () => {
        onDelete(project.id);
        showToast('Project deleted', 'success');
        onClose();
    };

    const getTaskDueDateColor = (task: Task): string => {
        if (!task.dueDate || task.completed) return 'text-gray-600';

        const now = new Date();
        const dueDate = new Date(task.dueDate);

        if (dueDate < now) return 'text-red-600'; // Overdue
        if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'text-amber-600'; // Due today/tomorrow
        return 'text-green-600'; // Future
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Status Badge */}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                                    {project.status}
                                </span>

                                {/* Priority Badge */}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors.bg} ${priorityColors.text} border ${priorityColors.border}`}>
                                    {project.priority}
                                </span>

                                {/* Health Badge */}
                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${healthColors.bg} ${healthColors.text} border ${healthColors.border}`}>
                                    {health === 'Healthy' && <CheckCircle2 size={12} />}
                                    {health === 'At Risk' && <AlertTriangle size={12} />}
                                    {health === 'Critical' && <AlertCircle size={12} />}
                                    <span>{health}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Future feature: Edit project
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Edit Project"
                            >
                                <Edit size={20} className="text-white" />
                            </button>
                            */}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* Overview Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-gray-600">Owner:</span>
                                    <span className="font-medium text-gray-900">{project.owner}</span>
                                </div>

                                {project.department && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Department:</span>
                                        <span className="font-medium text-gray-900">{project.department}</span>
                                    </div>
                                )}

                                {project.budget && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <PoundSterling size={16} className="text-gray-400" />
                                        <span className="text-gray-600">Budget:</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
                                    </div>
                                )}

                                {project.startDate && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-gray-600">Start Date:</span>
                                        <span className="font-medium text-gray-900">{formatDate(project.startDate)}</span>
                                    </div>
                                )}

                                {project.targetCompletionDate && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-gray-600">Target Completion:</span>
                                        <span className="font-medium text-gray-900">{formatDate(project.targetCompletionDate)}</span>
                                    </div>
                                )}

                                {project.actualCompletionDate && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium text-gray-900">{formatDate(project.actualCompletionDate)}</span>
                                    </div>
                                )}
                            </div>

                            {project.description && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-700">{project.description}</p>
                                </div>
                            )}

                            {project.tags && project.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag size={14} className="text-gray-400" />
                                        {project.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Tasks ({project.tasks.filter(t => t.completed).length}/{project.tasks.length})
                                </h3>
                                <button
                                    onClick={() => setShowAddTask(!showAddTask)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Add Task
                                </button>
                            </div>

                            {/* Add Task Form */}
                            {showAddTask && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Task title..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        autoFocus
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={newTaskAssignedTo}
                                            onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                                        >
                                            <option value="">Unassigned</option>
                                            {TEAM_MEMBERS.map(member => (
                                                <option key={member} value={member}>{member}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="date"
                                            value={newTaskDueDate}
                                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddTask}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        >
                                            Save Task
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddTask(false);
                                                setNewTaskTitle('');
                                                setNewTaskAssignedTo('');
                                                setNewTaskDueDate('');
                                            }}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Task List */}
                            {sortedTasks.length > 0 ? (
                                <div className="space-y-2">
                                    {sortedTasks.map(task => {
                                        const dueDateColor = getTaskDueDateColor(task);
                                        const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

                                        return (
                                            <div
                                                key={task.id}
                                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                                                    task.completed
                                                        ? 'bg-gray-50 border-gray-200'
                                                        : isOverdue
                                                        ? 'bg-red-50 border-red-200'
                                                        : 'bg-white border-gray-200 hover:border-indigo-300'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => handleToggleTaskComplete(task.id)}
                                                    className="flex-shrink-0 mt-0.5"
                                                >
                                                    {task.completed ? (
                                                        <CheckCircle2 size={20} className="text-green-600" />
                                                    ) : (
                                                        <Circle size={20} className="text-gray-400 hover:text-indigo-600" />
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                                        {task.assignedTo && (
                                                            <span className="flex items-center gap-1 text-gray-600">
                                                                <User size={12} />
                                                                {task.assignedTo}
                                                            </span>
                                                        )}
                                                        {task.dueDate && (
                                                            <span className={`flex items-center gap-1 ${dueDateColor}`}>
                                                                <Clock size={12} />
                                                                {formatDate(task.dueDate)}
                                                                {isOverdue && ' (overdue)'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg">
                                    No tasks yet - add your first task to get started
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete Project
                    </button>

                    {project.status !== 'Completed' && project.status !== 'Cancelled' && (
                        <button
                            onClick={handleMarkComplete}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            Mark as Complete
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project?</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (reuse AddProjectModal with edit mode - for now, just note this is future enhancement) */}
        </div>
    );
}
