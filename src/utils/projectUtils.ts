import {
    Project,
    ProjectCategory,
    ProjectSubType,
    PROJECT_SUBTYPES_BY_CATEGORY,
    PROJECT_SUBTYPE_LABELS,
    getDaysUntilDue
} from '../types/projects';

/**
 * Project Category Color Coding Utilities
 *
 * Provides consistent color theming across Projects Hub to distinguish between
 * housing-sector project categories:
 * - Property Development (Blue) - Acquisitions, new builds, adaptations
 * - Major Works (Green) - Refurbishments, planned maintenance, voids
 * - Building Safety (Red) - Fire safety, asbestos, compliance (critical)
 * - Stock Management (Purple) - Landlord changes, leases, disposals
 * - Decanting (Amber) - Temporary rehousing, disruption to residents
 * - Resident Experience (Teal) - Engagement, complaints, improvements
 */

export interface ProjectCategoryColors {
    bg: string;
    text: string;
    border: string;
    primary: string;
    hover?: string;
    light?: string;
}

/**
 * Get color scheme for a project category
 */
export function getCategoryColor(category: ProjectCategory): ProjectCategoryColors {
    switch (category) {
        case 'property-development':
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-300',
                primary: '#3B82F6', // blue-500
                hover: 'hover:bg-blue-200',
                light: 'bg-blue-50'
            };
        case 'major-works':
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                primary: '#10B981', // green-500
                hover: 'hover:bg-green-200',
                light: 'bg-green-50'
            };
        case 'building-safety':
            return {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                primary: '#EF4444', // red-500
                hover: 'hover:bg-red-200',
                light: 'bg-red-50'
            };
        case 'stock-management':
            return {
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                border: 'border-purple-300',
                primary: '#8B5CF6', // purple-500
                hover: 'hover:bg-purple-200',
                light: 'bg-purple-50'
            };
        case 'decanting':
            return {
                bg: 'bg-amber-100',
                text: 'text-amber-800',
                border: 'border-amber-300',
                primary: '#F59E0B', // amber-500
                hover: 'hover:bg-amber-200',
                light: 'bg-amber-50'
            };
        case 'resident-experience':
            return {
                bg: 'bg-teal-100',
                text: 'text-teal-800',
                border: 'border-teal-300',
                primary: '#14B8A6', // teal-500
                hover: 'hover:bg-teal-200',
                light: 'bg-teal-50'
            };
    }
}

/**
 * Get project sub-types filtered by category
 */
export function getSubTypesByCategory(category: ProjectCategory): ProjectSubType[] {
    return PROJECT_SUBTYPES_BY_CATEGORY[category] || [];
}

/**
 * Get human-readable label for a sub-type
 */
export function getSubTypeLabel(subType: ProjectSubType | undefined): string {
    if (!subType) return '-';
    return PROJECT_SUBTYPE_LABELS[subType] || subType;
}

/**
 * Calculate budget variance
 * Returns amount difference, percentage, and status
 */
export function calculateBudgetVariance(project: Project): {
    amount: number;
    percentage: number;
    status: 'under' | 'on' | 'over';
} {
    const budget = project.budget || 0;
    const actualSpend = project.actualSpend || 0;

    if (budget === 0) {
        return { amount: 0, percentage: 0, status: 'on' };
    }

    const variance = actualSpend - budget;
    const percentage = (variance / budget) * 100;

    let status: 'under' | 'on' | 'over';
    if (variance < -budget * 0.05) {
        // More than 5% under budget
        status = 'under';
    } else if (variance > budget * 0.05) {
        // More than 5% over budget
        status = 'over';
    } else {
        // Within 5% tolerance
        status = 'on';
    }

    return {
        amount: variance,
        percentage: Math.abs(percentage),
        status
    };
}

/**
 * Check if project is overdue (past target completion date)
 */
export function isProjectOverdue(project: Project): boolean {
    if (!project.targetCompletionDate) return false;
    if (project.status === 'Completed' || project.status === 'Cancelled') return false;

    const daysUntilDue = getDaysUntilDue(project.targetCompletionDate);
    return daysUntilDue !== null && daysUntilDue < 0;
}

/**
 * Get decant status summary text
 */
export function getDecantStatus(project: Project): string | null {
    if (!project.requiresDecant || !project.decantDetails) {
        return null;
    }

    const { temporaryAccommodation, decantStartDate, expectedReturnDate } = project.decantDetails;
    const residentCount = temporaryAccommodation.length;

    if (residentCount === 0) {
        return 'Decant required - no residents assigned yet';
    }

    const now = new Date();
    const startDate = new Date(decantStartDate);
    const returnDate = new Date(expectedReturnDate);

    if (now < startDate) {
        return `${residentCount} ${residentCount === 1 ? 'resident' : 'residents'} to be decanted`;
    } else if (now > returnDate) {
        return `${residentCount} ${residentCount === 1 ? 'resident' : 'residents'} due to return`;
    } else {
        return `${residentCount} ${residentCount === 1 ? 'resident' : 'residents'} temporarily rehoused`;
    }
}

/**
 * Check if project has unmet compliance requirements
 */
export function hasComplianceIssues(project: Project): boolean {
    // Check if required but not approved
    if (project.buildingControlRequired && !project.buildingControlApproved) return true;
    if (project.planningPermissionRequired && !project.planningPermissionGranted) return true;
    if (project.asbestosCheckRequired && !project.asbestosClearCertificate) return true;

    // Building safety projects should have FRA updated
    if (project.category === 'building-safety' && !project.fireRiskAssessmentUpdated) return true;

    return false;
}

/**
 * Get risk summary counts by level
 */
export function getRiskSummary(project: Project): {
    high: number;
    medium: number;
    low: number;
    total: number;
} {
    const risks = project.risks || [];

    const openRisks = risks.filter(r => r.status === 'Open');

    const high = openRisks.filter(
        r => r.impact === 'High' || r.likelihood === 'High'
    ).length;

    const medium = openRisks.filter(
        r =>
            (r.impact === 'Medium' || r.likelihood === 'Medium') &&
            r.impact !== 'High' &&
            r.likelihood !== 'High'
    ).length;

    const low = openRisks.filter(
        r => r.impact === 'Low' && r.likelihood === 'Low'
    ).length;

    return {
        high,
        medium,
        low,
        total: openRisks.length
    };
}

/**
 * Get issue summary counts by severity
 */
export function getIssueSummary(project: Project): {
    major: number;
    moderate: number;
    minor: number;
    total: number;
} {
    const issues = project.issues || [];

    const openIssues = issues.filter(i => i.status !== 'Resolved');

    const major = openIssues.filter(i => i.severity === 'Major').length;
    const moderate = openIssues.filter(i => i.severity === 'Moderate').length;
    const minor = openIssues.filter(i => i.severity === 'Minor').length;

    return {
        major,
        moderate,
        minor,
        total: openIssues.length
    };
}

/**
 * Calculate milestone completion percentage
 */
export function getMilestoneCompletionPercentage(project: Project): number {
    const milestones = project.keyMilestones || [];
    if (milestones.length === 0) return 0;

    const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
    return Math.round((completedMilestones / milestones.length) * 100);
}

/**
 * Get overdue milestones count
 */
export function getOverdueMilestonesCount(project: Project): number {
    const milestones = project.keyMilestones || [];
    const now = new Date();

    return milestones.filter(m => {
        if (m.status === 'Completed') return false;
        const dueDate = new Date(m.dueDate);
        return dueDate < now;
    }).length;
}

/**
 * Determine if project is safety-critical
 * Building safety projects and any Critical priority projects
 */
export function isSafetyCritical(project: Project): boolean {
    return project.category === 'building-safety' || project.priority === 'Critical';
}

/**
 * Get visual indicator flags for a project
 * Returns which special visual treatments should be applied
 */
export function getProjectVisualFlags(project: Project): {
    isOverdue: boolean;
    requiresDecant: boolean;
    isSafetyCritical: boolean;
    hasComplianceIssues: boolean;
    hasHighRisks: boolean;
} {
    const riskSummary = getRiskSummary(project);

    return {
        isOverdue: isProjectOverdue(project),
        requiresDecant: project.requiresDecant || false,
        isSafetyCritical: isSafetyCritical(project),
        hasComplianceIssues: hasComplianceIssues(project),
        hasHighRisks: riskSummary.high > 0
    };
}

/**
 * Format budget display string
 */
export function formatBudgetDisplay(project: Project): string {
    const budget = project.budget;
    const actualSpend = project.actualSpend || 0;

    if (!budget) return '-';

    const percentSpent = budget > 0 ? Math.round((actualSpend / budget) * 100) : 0;

    return `£${(actualSpend / 1000).toFixed(0)}k / £${(budget / 1000).toFixed(0)}k (${percentSpent}%)`;
}

/**
 * Validate project category
 */
export function isValidProjectCategory(value: unknown): value is ProjectCategory {
    return (
        typeof value === 'string' &&
        [
            'property-development',
            'major-works',
            'building-safety',
            'stock-management',
            'decanting',
            'resident-experience'
        ].includes(value)
    );
}
