/**
 * Projects Hub - Type Definitions
 *
 * Data structures for managing housing-sector-specific projects in UK adult social care.
 * Each project represents property development, major works, building safety, compliance,
 * decanting, or resident experience initiatives.
 */

// ============================================
// HOUSING-SPECIFIC PROJECT TAXONOMY
// ============================================

export type ProjectCategory =
    | 'property-development'
    | 'major-works'
    | 'building-safety'
    | 'stock-management'
    | 'decanting'
    | 'resident-experience';

export type ProjectSubType =
    // Property Development
    | 'new-acquisition'
    | 'change-of-use'
    | 'new-build-development'
    | 'extensions-conversions'
    | 'property-adaptations-dfg'
    // Major Works & Refurbishment
    | 'major-refurbishment'
    | 'planned-maintenance'
    | 'void-turnaround'
    | 'energy-efficiency-epc'
    | 'me-upgrades'
    | 'kitchen-replacement'
    | 'bathroom-replacement'
    | 'electrical-rewiring'
    | 'roof-repairs'
    | 'decoration-programme'
    | 'garden-improvements'
    // Building Safety & Compliance
    | 'fire-safety-remediation'
    | 'asbestos-removal'
    | 'legionella-control'
    | 'building-safety-act'
    | 'gas-electrical-compliance'
    | 'fire-risk-assessment-actions'
    | 'emergency-lighting'
    | 'compartmentation-works'
    | 'fire-alarm-upgrade'
    // Stock Management
    | 'change-of-landlord'
    | 'stock-transfer'
    | 'lease-renegotiation'
    | 'property-disposal'
    | 'portfolio-restructure'
    // Decanting & Rehousing
    | 'planned-decant'
    | 'emergency-decant'
    | 'property-closure'
    | 'supported-move'
    // Resident Experience
    | 'resident-engagement'
    | 'complaints-resolution'
    | 'accessibility-improvements'
    | 'outdoor-space-improvements';

export type ProjectStatus =
    | 'Pipeline' // Proposed, awaiting approval
    | 'Planning' // Approved, planning phase
    | 'Procurement' // Tendering, contractor selection
    | 'In Progress' // Works underway
    | 'On Hold' // Paused (budget, delays, etc.)
    | 'Snagging' // Substantially complete, fixing defects
    | 'Completed' // Finished, certificates received
    | 'Cancelled'; // Project abandoned

export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ProjectHealth = 'Healthy' | 'At Risk' | 'Critical';

export type BudgetSource =
    | 'Capital'
    | 'Revenue'
    | 'RP Funding'
    | 'Grant'
    | 'DFG'
    | 'Mixed';

export type ImpactLevel = 'Low' | 'Medium' | 'High';

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';

export type RiskStatus = 'Open' | 'Mitigated' | 'Closed';

export type IssueSeverity = 'Minor' | 'Moderate' | 'Major';

export type CommunicationMethod = 'Email' | 'Letter' | 'Phone' | 'Face-to-Face' | 'Text';

export type DocumentType = 'Survey' | 'Quote' | 'Contract' | 'Certificate' | 'Drawing' | 'Photo' | 'Other';

// ============================================
// HOUSING-SPECIFIC INTERFACES
// ============================================

export interface Milestone {
    id: string;
    title: string;
    dueDate: string; // ISO date string
    completedDate?: string;
    status: MilestoneStatus;
    responsibleParty: string; // Who's doing it
}

export interface TemporaryAccommodation {
    personId: string;
    personName: string;
    temporaryAddress: string;
    moveOutDate?: string;
    moveBackDate?: string;
    supportArrangements?: string;
}

export interface DecantDetails {
    decantStartDate: string;
    expectedReturnDate: string;
    temporaryAccommodation: TemporaryAccommodation[];
    decantCoordinator: string;
    residentAgreement: boolean; // Have residents agreed?
}

export interface CommunicationLog {
    id: string;
    date: string;
    method: CommunicationMethod;
    recipients: string[]; // Person IDs or names
    subject: string;
    summary: string;
    loggedBy: string;
}

export interface ProjectDocument {
    id: string;
    title: string;
    type: DocumentType;
    uploadDate: string;
    uploadedBy: string;
    fileUrl?: string; // Future: actual file storage
}

export interface RiskRegisterItem {
    id: string;
    description: string;
    impact: ImpactLevel;
    likelihood: ImpactLevel;
    mitigation: string;
    owner: string;
    status: RiskStatus;
}

export interface IssueLog {
    id: string;
    description: string;
    severity: IssueSeverity;
    dateRaised: string;
    raisedBy: string;
    status: IssueStatus;
    resolution?: string;
    resolvedDate?: string;
}

export interface ContractorRating {
    quality: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
    timeManagement: 1 | 2 | 3 | 4 | 5;
    communication: 1 | 2 | 3 | 4 | 5;
    wouldRecommend: boolean;
    notes?: string;
}

// ============================================
// TASK INTERFACE (Kept from original)
// ============================================

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string; // ISO date string
    completed: boolean;
    completedAt?: string;
    completedBy?: string;
    createdAt: string;
}

// ============================================
// MAIN PROJECT INTERFACE
// ============================================

export interface Project {
    id: string;

    // Essential fields
    name: string;
    category: ProjectCategory;
    type?: ProjectSubType; // Specific type within category
    priority: ProjectPriority;
    status: ProjectStatus;
    owner: string; // Person leading the project

    // Optional fields
    description?: string;
    department?: string;
    startDate?: string; // ISO date string
    targetCompletionDate?: string;
    actualCompletionDate?: string;

    // Budget & finance
    budget?: number; // In £
    actualSpend?: number; // Spend to date
    budgetSource?: BudgetSource;
    rpFundingConfirmed?: boolean;

    // Team & contractors
    projectManager?: string; // External PM if applicable
    contractor?: string; // Main contractor
    consultant?: string; // Architect/surveyor/engineer
    rpContact?: string; // RP contact (if RP-funded)
    contractorPerformance?: ContractorRating;

    // Timeline & milestones
    keyMilestones?: Milestone[];

    // Links to other entities
    linkedProperties?: string[]; // Property IDs
    linkedPeople?: string[]; // Person IDs

    // Decant management
    requiresDecant?: boolean;
    decantDetails?: DecantDetails;

    // Compliance & safety
    buildingControlRequired?: boolean;
    buildingControlApproved?: boolean;
    planningPermissionRequired?: boolean;
    planningPermissionGranted?: boolean;
    fireRiskAssessmentUpdated?: boolean;
    asbestosCheckRequired?: boolean;
    asbestosClearCertificate?: boolean;

    // Risk management
    risks?: RiskRegisterItem[];
    issues?: IssueLog[];

    // Documents & communication
    documents?: ProjectDocument[];
    residentCommunication?: CommunicationLog[];

    // Organisation
    tags?: string[];

    // Tasks (embedded for simplicity - kept for backward compatibility)
    tasks: Task[];

    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

// ============================================
// HELPER CONSTANTS
// ============================================

export const PROJECT_CATEGORIES: ProjectCategory[] = [
    'property-development',
    'major-works',
    'building-safety',
    'stock-management',
    'decanting',
    'resident-experience'
];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
    'property-development': 'Property Development',
    'major-works': 'Major Works & Refurbishment',
    'building-safety': 'Building Safety & Compliance',
    'stock-management': 'Stock Management',
    'decanting': 'Decanting & Rehousing',
    'resident-experience': 'Resident Experience'
};

export const PROJECT_SUBTYPES_BY_CATEGORY: Record<ProjectCategory, ProjectSubType[]> = {
    'property-development': [
        'new-acquisition',
        'change-of-use',
        'new-build-development',
        'extensions-conversions',
        'property-adaptations-dfg'
    ],
    'major-works': [
        'major-refurbishment',
        'planned-maintenance',
        'void-turnaround',
        'energy-efficiency-epc',
        'me-upgrades',
        'kitchen-replacement',
        'bathroom-replacement',
        'electrical-rewiring',
        'roof-repairs',
        'decoration-programme',
        'garden-improvements'
    ],
    'building-safety': [
        'fire-safety-remediation',
        'asbestos-removal',
        'legionella-control',
        'building-safety-act',
        'gas-electrical-compliance',
        'fire-risk-assessment-actions',
        'emergency-lighting',
        'compartmentation-works',
        'fire-alarm-upgrade'
    ],
    'stock-management': [
        'change-of-landlord',
        'stock-transfer',
        'lease-renegotiation',
        'property-disposal',
        'portfolio-restructure'
    ],
    'decanting': [
        'planned-decant',
        'emergency-decant',
        'property-closure',
        'supported-move'
    ],
    'resident-experience': [
        'resident-engagement',
        'complaints-resolution',
        'accessibility-improvements',
        'outdoor-space-improvements'
    ]
};

export const PROJECT_SUBTYPE_LABELS: Record<ProjectSubType, string> = {
    // Property Development
    'new-acquisition': 'New Property Acquisition',
    'change-of-use': 'Change of Use Application',
    'new-build-development': 'New Build Development',
    'extensions-conversions': 'Extensions & Conversions',
    'property-adaptations-dfg': 'Property Adaptations (DFG)',
    // Major Works
    'major-refurbishment': 'Major Refurbishment Programme',
    'planned-maintenance': 'Planned Maintenance Programme',
    'void-turnaround': 'Void Turnaround',
    'energy-efficiency-epc': 'Energy Efficiency (EPC Upgrade)',
    'me-upgrades': 'M&E Upgrades (Boilers/Electrics)',
    'kitchen-replacement': 'Kitchen Replacement',
    'bathroom-replacement': 'Bathroom Replacement',
    'electrical-rewiring': 'Electrical Rewiring',
    'roof-repairs': 'Roof Repairs',
    'decoration-programme': 'Decoration Programme',
    'garden-improvements': 'Garden/Outdoor Space Improvements',
    // Building Safety
    'fire-safety-remediation': 'Fire Safety Remediation',
    'asbestos-removal': 'Asbestos Removal',
    'legionella-control': 'Legionella Control',
    'building-safety-act': 'Building Safety Act Compliance',
    'gas-electrical-compliance': 'Gas/Electrical Compliance',
    'fire-risk-assessment-actions': 'Fire Risk Assessment Actions',
    'emergency-lighting': 'Emergency Lighting Upgrade',
    'compartmentation-works': 'Compartmentation Works',
    'fire-alarm-upgrade': 'Fire Alarm Upgrade',
    // Stock Management
    'change-of-landlord': 'Change of Landlord/RP',
    'stock-transfer': 'Stock Transfer',
    'lease-renegotiation': 'Lease Renegotiation',
    'property-disposal': 'Property Disposal',
    'portfolio-restructure': 'Portfolio Restructure',
    // Decanting
    'planned-decant': 'Planned Decant (Major Works)',
    'emergency-decant': 'Emergency Decant (Fire/Flood/Structure)',
    'property-closure': 'Property Closure/Decommission',
    'supported-move': 'Supported Move',
    // Resident Experience
    'resident-engagement': 'Resident Engagement/Consultation',
    'complaints-resolution': 'Complaints Resolution Programme',
    'accessibility-improvements': 'Accessibility Improvements',
    'outdoor-space-improvements': 'Outdoor Space Improvements'
};

export const PROJECT_STATUSES: ProjectStatus[] = [
    'Pipeline',
    'Planning',
    'Procurement',
    'In Progress',
    'On Hold',
    'Snagging',
    'Completed',
    'Cancelled'
];

export const PROJECT_PRIORITIES: ProjectPriority[] = ['Low', 'Medium', 'High', 'Critical'];

// Legacy support for generic project types (for AddProjectModal compatibility)
export const PROJECT_TYPES = PROJECT_CATEGORIES;

export const DEPARTMENTS = [
    'Operations',
    'Finance',
    'Compliance',
    'Property',
    'HR',
    'IT',
    'Business Development',
    'Other'
];

export const TEAM_MEMBERS = [
    'Matt Fay',
    'Sarah Johnson',
    'James Wilson',
    'Emma Thompson',
    'Michael Brown'
];

export const BUDGET_SOURCES: BudgetSource[] = ['Capital', 'Revenue', 'RP Funding', 'Grant', 'DFG', 'Mixed'];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique project ID
 */
export function generateProjectId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique task ID
 */
export function generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique milestone ID
 */
export function generateMilestoneId(): string {
    return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique risk ID
 */
export function generateRiskId(): string {
    return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique issue ID
 */
export function generateIssueId(): string {
    return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique document ID
 */
export function generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique communication log ID
 */
export function generateCommunicationId(): string {
    return `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate project health based on multiple risk factors
 *
 * Risk factors:
 * - Overdue tasks (1-2 tasks = +2 points, 3+ tasks = +4 points)
 * - Stale project (14+ days = +1 point, 30+ days = +3 points)
 * - Deadline pressure (due in 7 days with <50% complete = +2 points)
 * - Overdue project (past target date = +3 points)
 * - On Hold status (+1 point)
 * - High/Critical risks open (+2 points)
 * - Major issues open (+2 points)
 *
 * Health levels:
 * - Healthy: 0-1 risk points
 * - At Risk: 2-3 risk points
 * - Critical: 4+ risk points
 */
export function calculateProjectHealth(project: Project): ProjectHealth {
    if (project.status === 'Completed' || project.status === 'Cancelled') {
        return 'Healthy';
    }

    let riskScore = 0;
    const now = new Date();

    // Factor 1: Overdue tasks
    const overdueTasks = project.tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        return new Date(task.dueDate) < now;
    });
    if (overdueTasks.length > 0) riskScore += 2;
    if (overdueTasks.length > 2) riskScore += 2;

    // Factor 2: Time since last update (stale projects)
    const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate > 14) riskScore += 1;
    if (daysSinceUpdate > 30) riskScore += 2;

    // Factor 3: Approaching deadline with low completion
    if (project.targetCompletionDate) {
        const daysUntilDue = Math.floor(
            (new Date(project.targetCompletionDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(t => t.completed).length;
        const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 1;

        // Due within 7 days with less than 50% done
        if (daysUntilDue > 0 && daysUntilDue <= 7 && completionRate < 0.5) {
            riskScore += 2;
        }

        // Overdue project
        if (daysUntilDue < 0) {
            riskScore += 3;
        }
    }

    // Factor 4: On Hold status
    if (project.status === 'On Hold') {
        riskScore += 1;
    }

    // Factor 5: High/Critical risks open
    const highRisks = project.risks?.filter(
        r => r.status === 'Open' && (r.impact === 'High' || r.likelihood === 'High')
    );
    if (highRisks && highRisks.length > 0) {
        riskScore += 2;
    }

    // Factor 6: Major issues open
    const majorIssues = project.issues?.filter(
        i => i.status !== 'Resolved' && i.severity === 'Major'
    );
    if (majorIssues && majorIssues.length > 0) {
        riskScore += 2;
    }

    // Determine health level
    if (riskScore >= 4) return 'Critical';
    if (riskScore >= 2) return 'At Risk';
    return 'Healthy';
}

/**
 * Get color classes for project health badge
 */
export function getHealthColor(health: ProjectHealth): {
    bg: string;
    text: string;
    border: string;
} {
    switch (health) {
        case 'Healthy':
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
        case 'At Risk':
            return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
        case 'Critical':
            return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    }
}

/**
 * Get color classes for priority badge
 */
export function getPriorityColor(priority: ProjectPriority): {
    bg: string;
    text: string;
    border: string;
} {
    switch (priority) {
        case 'Critical':
            return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
        case 'High':
            return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
        case 'Medium':
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
        case 'Low':
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
}

/**
 * Get color classes for status badge
 */
export function getStatusColor(status: ProjectStatus): {
    bg: string;
    text: string;
    border: string;
} {
    switch (status) {
        case 'Pipeline':
            return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' };
        case 'Planning':
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
        case 'Procurement':
            return { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' };
        case 'In Progress':
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
        case 'On Hold':
            return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
        case 'Snagging':
            return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' };
        case 'Completed':
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
        case 'Cancelled':
            return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    }
}

/**
 * Calculate task completion percentage for a project
 */
export function getTaskCompletionPercentage(project: Project): number {
    if (project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
}

/**
 * Get overdue task count for a project
 */
export function getOverdueTaskCount(project: Project): number {
    const now = new Date();
    return project.tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        return new Date(task.dueDate) < now;
    }).length;
}

/**
 * Format date for display (British format: DD/MM/YYYY)
 */
export function formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

/**
 * Format currency for display (British format: £X,XXX)
 */
export function formatCurrency(amount: number | undefined): string {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Calculate days until target completion date
 * Returns negative number if overdue
 */
export function getDaysUntilDue(targetDate: string | undefined): number | null {
    if (!targetDate) return null;
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
