import { Project } from '../types/projects';

/**
 * Mock projects for demonstrating Projects Hub functionality.
 * Includes projects with various health statuses, priorities, and completion levels.
 */
export const mockProjects: Project[] = [
    {
        id: 'proj_1',
        name: 'Achieve CQC Outstanding Rating',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'Critical',
        status: 'In Progress',
        owner: 'Matt Fay',
        description: 'Implement new support plans, staff training, and process improvements to achieve Outstanding rating in next CQC inspection.',
        department: 'Operations',
        startDate: '2024-01-15',
        targetCompletionDate: '2026-06-30',
        budget: 75000,
        tags: ['Compliance', 'Quality Improvement', 'CQC'],
        tasks: [
            {
                id: 'task_1_1',
                projectId: 'proj_1',
                title: 'Review all care plans and update to new format',
                assignedTo: 'Sarah Johnson',
                dueDate: '2026-02-01',
                completed: false,
                createdAt: '2024-01-20T10:00:00Z'
            },
            {
                id: 'task_1_2',
                projectId: 'proj_1',
                title: 'Conduct staff training on new safeguarding procedures',
                assignedTo: 'James Wilson',
                dueDate: '2026-01-25',
                completed: false,
                createdAt: '2024-01-20T10:05:00Z'
            },
            {
                id: 'task_1_3',
                projectId: 'proj_1',
                title: 'Book mock CQC inspection with consultancy',
                assignedTo: 'Matt Fay',
                dueDate: '2026-03-15',
                completed: true,
                completedAt: '2026-01-10T14:30:00Z',
                completedBy: 'Matt Fay',
                createdAt: '2024-01-20T10:10:00Z'
            },
            {
                id: 'task_1_4',
                projectId: 'proj_1',
                title: 'Update all policies and procedures documentation',
                assignedTo: 'Emma Thompson',
                dueDate: '2026-02-28',
                completed: false,
                createdAt: '2024-01-25T09:00:00Z'
            }
        ],
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2026-01-10T14:30:00Z',
        createdBy: 'Matt Fay'
    },
    {
        id: 'proj_2',
        name: 'Refurbish Oakwood House',
        category: 'major-works',
        type: 'planned-maintenance',
        priority: 'High',
        status: 'In Progress',
        owner: 'Sarah Johnson',
        description: 'Complete refurbishment of 5-bed supported living property. New kitchen, bathrooms, redecoration throughout.',
        department: 'Property',
        startDate: '2025-11-01',
        targetCompletionDate: '2026-02-10',
        budget: 45000,
        tags: ['Property Development', 'Refurbishment', 'Oakwood'],
        tasks: [
            {
                id: 'task_2_1',
                projectId: 'proj_2',
                title: 'Get quotes from 3 contractors',
                assignedTo: 'Sarah Johnson',
                dueDate: '2025-12-01',
                completed: true,
                completedAt: '2025-11-28T16:00:00Z',
                completedBy: 'Sarah Johnson',
                createdAt: '2025-11-05T10:00:00Z'
            },
            {
                id: 'task_2_2',
                projectId: 'proj_2',
                title: 'Kitchen installation',
                assignedTo: 'Michael Brown',
                dueDate: '2026-01-15',
                completed: true,
                completedAt: '2026-01-14T17:00:00Z',
                completedBy: 'Michael Brown',
                createdAt: '2025-12-10T09:00:00Z'
            },
            {
                id: 'task_2_3',
                projectId: 'proj_2',
                title: 'Bathroom renovations (3 bathrooms)',
                assignedTo: 'Michael Brown',
                dueDate: '2026-01-31',
                completed: false,
                createdAt: '2025-12-10T09:05:00Z'
            },
            {
                id: 'task_2_4',
                projectId: 'proj_2',
                title: 'Painting and decoration all rooms',
                assignedTo: 'Sarah Johnson',
                dueDate: '2026-02-07',
                completed: false,
                createdAt: '2025-12-15T10:00:00Z'
            },
            {
                id: 'task_2_5',
                projectId: 'proj_2',
                title: 'Final inspection and snagging',
                assignedTo: 'Matt Fay',
                dueDate: '2026-02-10',
                completed: false,
                createdAt: '2025-12-20T14:00:00Z'
            }
        ],
        createdAt: '2025-11-01T09:00:00Z',
        updatedAt: '2026-01-14T17:00:00Z',
        createdBy: 'Sarah Johnson'
    },
    {
        id: 'proj_3',
        name: 'Reduce Voids by 20% (Q1 2026)',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'High',
        status: 'In Progress',
        owner: 'Matt Fay',
        description: 'Multi-department initiative to reduce void periods across all properties. Target: 20% reduction in average void days.',
        department: 'Operations',
        startDate: '2026-01-01',
        targetCompletionDate: '2026-03-31',
        budget: 15000,
        tags: ['Operations', 'Voids', 'Quick Win'],
        tasks: [
            {
                id: 'task_3_1',
                projectId: 'proj_3',
                title: 'Analyse void data from last 12 months',
                assignedTo: 'Emma Thompson',
                dueDate: '2026-01-10',
                completed: true,
                completedAt: '2026-01-09T15:00:00Z',
                completedBy: 'Emma Thompson',
                createdAt: '2026-01-02T09:00:00Z'
            },
            {
                id: 'task_3_2',
                projectId: 'proj_3',
                title: 'Speed up repairs process - implement 48hr target',
                assignedTo: 'Michael Brown',
                dueDate: '2026-01-20',
                completed: false,
                createdAt: '2026-01-02T09:05:00Z'
            },
            {
                id: 'task_3_3',
                projectId: 'proj_3',
                title: 'Improve referral response time to under 24 hours',
                assignedTo: 'James Wilson',
                dueDate: '2026-01-15',
                completed: false,
                createdAt: '2026-01-02T09:10:00Z'
            },
            {
                id: 'task_3_4',
                projectId: 'proj_3',
                title: 'Create void property dashboard for weekly monitoring',
                assignedTo: 'Matt Fay',
                dueDate: '2026-02-01',
                completed: false,
                createdAt: '2026-01-05T10:00:00Z'
            }
        ],
        createdAt: '2026-01-01T09:00:00Z',
        updatedAt: '2026-01-09T15:00:00Z',
        createdBy: 'Matt Fay'
    },
    {
        id: 'proj_4',
        name: 'Implement New Safeguarding Procedures',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'Critical',
        status: 'Planning',
        owner: 'James Wilson',
        description: 'Roll out updated safeguarding procedures following new government guidance. Includes staff training and policy updates.',
        department: 'Compliance',
        startDate: '2026-02-01',
        targetCompletionDate: '2026-04-30',
        budget: 12000,
        tags: ['Compliance', 'Safeguarding', 'Training'],
        tasks: [
            {
                id: 'task_4_1',
                projectId: 'proj_4',
                title: 'Review new government guidance document',
                assignedTo: 'James Wilson',
                dueDate: '2026-02-05',
                completed: false,
                createdAt: '2026-01-28T10:00:00Z'
            },
            {
                id: 'task_4_2',
                projectId: 'proj_4',
                title: 'Draft updated safeguarding policy',
                assignedTo: 'James Wilson',
                dueDate: '2026-02-15',
                completed: false,
                createdAt: '2026-01-28T10:05:00Z'
            },
            {
                id: 'task_4_3',
                projectId: 'proj_4',
                title: 'Book external trainer for staff workshops',
                assignedTo: 'Sarah Johnson',
                dueDate: '2026-02-20',
                completed: false,
                createdAt: '2026-01-28T10:10:00Z'
            }
        ],
        createdAt: '2026-01-28T09:00:00Z',
        updatedAt: '2026-01-28T10:10:00Z',
        createdBy: 'James Wilson'
    },
    {
        id: 'proj_5',
        name: 'Expand Services in Manchester (3 New Properties)',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'High',
        status: 'In Progress',
        owner: 'Matt Fay',
        description: 'Strategic expansion into Manchester market. Target: Open 3 new supported living properties by Q3 2026.',
        department: 'Business Development',
        startDate: '2025-09-01',
        targetCompletionDate: '2026-09-30',
        budget: 250000,
        tags: ['Business Development', 'Expansion', 'Manchester'],
        tasks: [
            {
                id: 'task_5_1',
                projectId: 'proj_5',
                title: 'Market research - Manchester supported living demand',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-10-15',
                completed: true,
                completedAt: '2025-10-10T16:00:00Z',
                completedBy: 'Emma Thompson',
                createdAt: '2025-09-05T09:00:00Z'
            },
            {
                id: 'task_5_2',
                projectId: 'proj_5',
                title: 'Identify 10 potential properties for viewing',
                assignedTo: 'Sarah Johnson',
                dueDate: '2025-11-30',
                completed: true,
                completedAt: '2025-11-25T14:00:00Z',
                completedBy: 'Sarah Johnson',
                createdAt: '2025-10-15T10:00:00Z'
            },
            {
                id: 'task_5_3',
                projectId: 'proj_5',
                title: 'Secure funding approval from board',
                assignedTo: 'Matt Fay',
                dueDate: '2025-12-20',
                completed: true,
                completedAt: '2025-12-18T15:00:00Z',
                completedBy: 'Matt Fay',
                createdAt: '2025-11-01T09:00:00Z'
            },
            {
                id: 'task_5_4',
                projectId: 'proj_5',
                title: 'Make offer on first property (Stockport Road)',
                assignedTo: 'Matt Fay',
                dueDate: '2026-01-31',
                completed: false,
                createdAt: '2025-12-20T10:00:00Z'
            },
            {
                id: 'task_5_5',
                projectId: 'proj_5',
                title: 'Recruit Manchester area manager',
                assignedTo: 'James Wilson',
                dueDate: '2026-03-31',
                completed: false,
                createdAt: '2026-01-05T09:00:00Z'
            }
        ],
        createdAt: '2025-09-01T09:00:00Z',
        updatedAt: '2025-12-18T15:00:00Z',
        createdBy: 'Matt Fay'
    },
    {
        id: 'proj_6',
        name: 'Migrate to New Compliance Tracking System',
        category: 'major-works',
        type: 'planned-maintenance',
        priority: 'Medium',
        status: 'On Hold',
        owner: 'Emma Thompson',
        description: 'Replace manual Excel tracking with dedicated compliance software. On hold pending budget approval.',
        department: 'IT',
        startDate: '2025-10-01',
        targetCompletionDate: '2026-03-31',
        budget: 35000,
        tags: ['IT', 'Compliance', 'Software'],
        tasks: [
            {
                id: 'task_6_1',
                projectId: 'proj_6',
                title: 'Evaluate 5 compliance software vendors',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-11-15',
                completed: true,
                completedAt: '2025-11-10T16:00:00Z',
                completedBy: 'Emma Thompson',
                createdAt: '2025-10-05T09:00:00Z'
            },
            {
                id: 'task_6_2',
                projectId: 'proj_6',
                title: 'Get demos from top 3 vendors',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-12-01',
                completed: true,
                completedAt: '2025-11-28T14:00:00Z',
                completedBy: 'Emma Thompson',
                createdAt: '2025-11-15T09:00:00Z'
            },
            {
                id: 'task_6_3',
                projectId: 'proj_6',
                title: 'Present business case to board',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-12-20',
                completed: false,
                createdAt: '2025-12-01T10:00:00Z'
            }
        ],
        createdAt: '2025-10-01T09:00:00Z',
        updatedAt: '2025-11-28T14:00:00Z',
        createdBy: 'Emma Thompson'
    },
    {
        id: 'proj_7',
        name: 'Update Fire Safety Plans (All Properties)',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'Critical',
        status: 'In Progress',
        owner: 'Michael Brown',
        description: 'Annual update of fire safety plans and evacuation procedures for all 45 properties. Legal requirement.',
        department: 'Compliance',
        startDate: '2025-12-01',
        targetCompletionDate: '2026-02-08',
        tags: ['Compliance', 'Fire Safety', 'Urgent'],
        tasks: [
            {
                id: 'task_7_1',
                projectId: 'proj_7',
                title: 'Commission fire risk assessments for all properties',
                assignedTo: 'Michael Brown',
                dueDate: '2025-12-31',
                completed: true,
                completedAt: '2025-12-28T16:00:00Z',
                completedBy: 'Michael Brown',
                createdAt: '2025-12-05T09:00:00Z'
            },
            {
                id: 'task_7_2',
                projectId: 'proj_7',
                title: 'Update fire evacuation plans based on assessments',
                assignedTo: 'Sarah Johnson',
                dueDate: '2026-01-15',
                completed: false,
                createdAt: '2025-12-30T09:00:00Z'
            },
            {
                id: 'task_7_3',
                projectId: 'proj_7',
                title: 'Replace fire extinguishers at 12 properties',
                assignedTo: 'Michael Brown',
                dueDate: '2026-01-31',
                completed: false,
                createdAt: '2026-01-05T10:00:00Z'
            },
            {
                id: 'task_7_4',
                projectId: 'proj_7',
                title: 'Conduct staff fire safety training',
                assignedTo: 'James Wilson',
                dueDate: '2026-02-08',
                completed: false,
                createdAt: '2026-01-05T10:05:00Z'
            },
            {
                id: 'task_7_5',
                projectId: 'proj_7',
                title: 'Update fire safety information for residents',
                assignedTo: 'Sarah Johnson',
                dueDate: '2026-02-01',
                completed: false,
                createdAt: '2026-01-05T10:10:00Z'
            }
        ],
        createdAt: '2025-12-01T09:00:00Z',
        updatedAt: '2025-12-28T16:00:00Z',
        createdBy: 'Michael Brown'
    },
    {
        id: 'proj_8',
        name: 'Paint the Office',
        category: 'property-development',
        type: 'property-adaptations-dfg',
        priority: 'Low',
        status: 'Planning',
        owner: 'Matt Fay',
        description: 'Refresh office paint - magnolia walls, white trim. Weekend project.',
        startDate: '2026-02-15',
        targetCompletionDate: '2026-02-16',
        budget: 200,
        tags: ['Office', 'Quick Win'],
        tasks: [
            {
                id: 'task_8_1',
                projectId: 'proj_8',
                title: 'Buy paint and supplies from B&Q',
                assignedTo: 'Matt Fay',
                dueDate: '2026-02-14',
                completed: false,
                createdAt: '2026-02-01T10:00:00Z'
            },
            {
                id: 'task_8_2',
                projectId: 'proj_8',
                title: 'Paint main office area',
                assignedTo: 'Matt Fay',
                dueDate: '2026-02-15',
                completed: false,
                createdAt: '2026-02-01T10:05:00Z'
            }
        ],
        createdAt: '2026-02-01T09:00:00Z',
        updatedAt: '2026-02-01T10:05:00Z',
        createdBy: 'Matt Fay'
    },
    {
        id: 'proj_9',
        name: 'Staff Wellbeing Programme Launch',
        category: 'major-works',
        type: 'major-refurbishment',
        priority: 'Medium',
        status: 'Completed',
        owner: 'Sarah Johnson',
        description: 'Launch new staff wellbeing programme including mental health support, gym memberships, and flexible working.',
        department: 'HR',
        startDate: '2025-08-01',
        targetCompletionDate: '2025-12-31',
        actualCompletionDate: '2025-12-20',
        budget: 25000,
        tags: ['HR', 'Wellbeing', 'Staff Retention'],
        tasks: [
            {
                id: 'task_9_1',
                projectId: 'proj_9',
                title: 'Survey staff on wellbeing needs',
                assignedTo: 'Sarah Johnson',
                dueDate: '2025-08-31',
                completed: true,
                completedAt: '2025-08-28T16:00:00Z',
                completedBy: 'Sarah Johnson',
                createdAt: '2025-08-05T09:00:00Z'
            },
            {
                id: 'task_9_2',
                projectId: 'proj_9',
                title: 'Negotiate gym membership deals',
                assignedTo: 'Sarah Johnson',
                dueDate: '2025-09-30',
                completed: true,
                completedAt: '2025-09-25T14:00:00Z',
                completedBy: 'Sarah Johnson',
                createdAt: '2025-09-01T09:00:00Z'
            },
            {
                id: 'task_9_3',
                projectId: 'proj_9',
                title: 'Launch mental health support helpline',
                assignedTo: 'James Wilson',
                dueDate: '2025-10-31',
                completed: true,
                completedAt: '2025-10-28T16:00:00Z',
                completedBy: 'James Wilson',
                createdAt: '2025-10-01T09:00:00Z'
            },
            {
                id: 'task_9_4',
                projectId: 'proj_9',
                title: 'Implement flexible working policy',
                assignedTo: 'Matt Fay',
                dueDate: '2025-11-30',
                completed: true,
                completedAt: '2025-11-20T15:00:00Z',
                completedBy: 'Matt Fay',
                createdAt: '2025-11-01T09:00:00Z'
            },
            {
                id: 'task_9_5',
                projectId: 'proj_9',
                title: 'Launch programme at staff conference',
                assignedTo: 'Sarah Johnson',
                dueDate: '2025-12-15',
                completed: true,
                completedAt: '2025-12-15T17:00:00Z',
                completedBy: 'Sarah Johnson',
                createdAt: '2025-12-01T09:00:00Z'
            }
        ],
        createdAt: '2025-08-01T09:00:00Z',
        updatedAt: '2025-12-20T09:00:00Z',
        createdBy: 'Sarah Johnson'
    },
    {
        id: 'proj_10',
        name: 'Property Portfolio Review (STALLED)',
        category: 'major-works',
        type: 'planned-maintenance',
        priority: 'Medium',
        status: 'In Progress',
        owner: 'Emma Thompson',
        description: 'Comprehensive review of all properties for viability and ROI. Project has stalled - no updates in 45 days.',
        department: 'Finance',
        startDate: '2025-08-01',
        targetCompletionDate: '2026-01-31',
        budget: 5000,
        tags: ['Finance', 'Property', 'Analysis'],
        tasks: [
            {
                id: 'task_10_1',
                projectId: 'proj_10',
                title: 'Gather financial data for all properties',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-09-30',
                completed: true,
                completedAt: '2025-09-28T16:00:00Z',
                completedBy: 'Emma Thompson',
                createdAt: '2025-08-05T09:00:00Z'
            },
            {
                id: 'task_10_2',
                projectId: 'proj_10',
                title: 'Analyse occupancy rates and void costs',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-10-31',
                completed: false,
                createdAt: '2025-10-01T09:00:00Z'
            },
            {
                id: 'task_10_3',
                projectId: 'proj_10',
                title: 'Create ROI dashboard for board',
                assignedTo: 'Emma Thompson',
                dueDate: '2025-11-30',
                completed: false,
                createdAt: '2025-10-15T09:00:00Z'
            }
        ],
        createdAt: '2025-08-01T09:00:00Z',
        updatedAt: '2025-09-28T16:00:00Z', // Last updated 4+ months ago - will show as stale!
        createdBy: 'Emma Thompson'
    }
];

/**
 * Load mock projects into localStorage.
 * Call this function to seed the Projects Hub with demo data.
 */
export function loadMockProjects(): void {
    localStorage.setItem('solas_projects', JSON.stringify(mockProjects));
    // Mock data loaded successfully
}

/**
 * Clear all projects from localStorage.
 */
export function clearProjects(): void {
    localStorage.removeItem('solas_projects');
    // Projects cleared from storage
}
