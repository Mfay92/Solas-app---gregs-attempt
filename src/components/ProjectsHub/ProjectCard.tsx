import {
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Tag
} from 'lucide-react';
import {
    Project,
    calculateProjectHealth,
    getHealthColor,
    getPriorityColor,
    getStatusColor,
    getTaskCompletionPercentage,
    getOverdueTaskCount,
    formatDate,
    getDaysUntilDue
} from '../../types/projects';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    const health = calculateProjectHealth(project);
    const healthColors = getHealthColor(health);
    const priorityColors = getPriorityColor(project.priority);
    const statusColors = getStatusColor(project.status);
    const completionPercentage = getTaskCompletionPercentage(project);
    const overdueTaskCount = getOverdueTaskCount(project);
    const daysUntilDue = getDaysUntilDue(project.targetCompletionDate);

    // Determine due date color
    let dueDateColor = 'text-gray-600';
    if (daysUntilDue !== null) {
        if (daysUntilDue < 0) {
            dueDateColor = 'text-red-600'; // Overdue
        } else if (daysUntilDue <= 7) {
            dueDateColor = 'text-amber-600'; // Due soon
        } else {
            dueDateColor = 'text-green-600'; // Plenty of time
        }
    }

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-indigo-300"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>{project.owner}</span>
                    </div>
                </div>

                {/* Health Badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${healthColors.bg} ${healthColors.text} border ${healthColors.border}`}>
                    {health === 'Healthy' && <CheckCircle2 size={12} />}
                    {health === 'At Risk' && <AlertTriangle size={12} />}
                    {health === 'Critical' && <AlertCircle size={12} />}
                    <span>{health}</span>
                </div>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                {/* Status Badge */}
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                    {project.status}
                </span>

                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors.bg} ${priorityColors.text} border ${priorityColors.border}`}>
                    {project.priority}
                </span>

                {/* Department Badge (if present) */}
                {project.department && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {project.department}
                    </span>
                )}
            </div>

            {/* Due Date (if present) */}
            {project.targetCompletionDate && (
                <div className={`flex items-center gap-2 text-sm ${dueDateColor} mb-3`}>
                    <Calendar size={14} />
                    <span>
                        Due {formatDate(project.targetCompletionDate)}
                        {daysUntilDue !== null && (
                            <span className="ml-1">
                                ({daysUntilDue < 0
                                    ? `${Math.abs(daysUntilDue)} days overdue`
                                    : daysUntilDue === 0
                                    ? 'due today'
                                    : `${daysUntilDue} days left`})
                            </span>
                        )}
                    </span>
                </div>
            )}

            {/* Progress Bar */}
            {project.tasks.length > 0 && (
                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Tasks</span>
                        <span>
                            {project.tasks.filter(t => t.completed).length} / {project.tasks.length} completed
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${
                                completionPercentage === 100
                                    ? 'bg-green-500'
                                    : completionPercentage > 0
                                    ? 'bg-indigo-600'
                                    : 'bg-gray-300'
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    {overdueTaskCount > 0 && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {overdueTaskCount} overdue {overdueTaskCount === 1 ? 'task' : 'tasks'}
                        </p>
                    )}
                </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                    <Tag size={12} className="text-gray-400" />
                    {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                            +{project.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
