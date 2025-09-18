import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '../Icons';

type Stage = { 
    id: string; 
    title: string; 
    status: string; 
    tasks: { id: string; text: string; owner: string; ac: string; }[];
    isProject?: false;
};
type Project = { 
    id: string; 
    title: string; 
    status: string; 
    isProject: true; 
    stages: Stage[];
};
type ArchivedItem = Project | Stage;

// The individual stages are now part of a completed project
const project1Stages: Stage[] = [
    { 
        id: 'stage9', 
        title: 'Stage 9 — A11y, performance, regression',
        status: 'Done',
        tasks: [
            { id: '9a', text: 'Test keyboard paths for all new pop-outs (ESC close, focus return).', owner: 'AI Studio', ac: 'All new interactive elements are fully keyboard accessible.' },
            { id: '9b', text: 'Check color contrast against WCAG AA standards.', owner: 'AI Studio', ac: 'Contrast ratios pass accessibility checks.' },
            { id: '9c', text: 'Add snapshot tests for new pop-out components.', owner: 'AI Studio', ac: 'Snapshot tests for View Type, Panel Position, and Quick Stats are stable.' },
        ]
    },
    { 
        id: 'stage8', 
        title: 'Stage 8 — Footer mini status block (personal glance)',
        status: 'Done',
        tasks: [
            { id: '8a', text: 'Add configurable personal status badges next to the counter.', owner: 'AI Studio', ac: 'User can select up to two badges to display.' },
            { id: '8b', text: 'Available badges: Tagged to you, Updated today, Your open actions.', owner: 'AI Studio', ac: 'Badges show correct counts based on (mock) data.' },
            { id: '8c', text: 'Save preference and ensure responsiveness.', owner: 'AI Studio', ac: 'Badge choices are remembered; badges hide on small screens.' },
        ]
    },
    { 
        id: 'stage7', 
        title: 'Stage 7 — Quick Stats (tabbed, time-framed, expandable)',
        status: 'Done',
        tasks: [
            { id: '7a', text: 'Build wider pop-out for Quick Stats with tabs (General, Voids, RPs, Occupancy).', owner: 'AI Studio', ac: 'Tabs are present and load correct data.' },
            { id: '7b', text: 'Add a single timeframe filter (W/M/Q/Y) that applies to all tabs.', owner: 'AI Studio', ac: 'Switching timeframe updates figures on all tabs.' },
            { id: '7c', text: 'Add an "Expand table" toggle to show all timeframes at once.', owner: 'AI Studio', ac: 'Expanded table shows correct data without changing selected timeframe.' },
        ]
    },
    { 
        id: 'stage6', 
        title: 'Stage 6 — Manage Property-Staff Links',
        status: 'Done',
        tasks: [
            { id: '6a', text: 'Add "Manage Staff Links" button to the "Key Contacts" tab in the property profile.', owner: 'AI Studio', ac: 'Button is visible and functional on the Key Contacts tab.' },
            { id: '6b', text: 'Create a modal for adding, viewing, and removing staff linked to a property.', owner: 'AI Studio', ac: 'Modal allows searching all staff, adding a link with a specified role, and removing existing links.' },
            { id: '6c', text: 'Ensure the "Key Contacts" tab immediately updates upon saving changes.', owner: 'AI Studio', ac: 'Contact list reflects changes without needing a page refresh.' },
        ]
    },
    { 
        id: 'stage5', 
        title: 'Stage 5 — Profile panel position selector (with preview)',
        status: 'Done',
        tasks: [
            { id: '5a', text: 'Create pop-up for "Change Profile Panel Position" button.', owner: 'AI Studio', ac: 'Pop-up opens to select panel position.' },
            { id: '5b', text: 'Offer choices: Side panel, Bottom drawer, Pop-up window, with previews.', owner: 'AI Studio', ac: 'Previews are visible for each option.' },
            { id: '5c', text: 'Save user preference to local storage.', owner: 'AI Studio', ac: 'Choice persists across sessions.' },
        ]
    },
    { 
        id: 'stage4', 
        title: 'Stage 4 — New “Collapsible Masters” view',
        status: 'Done',
        tasks: [
            { id: '4a', text: 'Implement new view mode showing Master rows only by default.', owner: 'AI Studio', ac: 'Initial render shows only Master rows.' },
            { id: '4b', text: 'Add per-row expand/collapse button to show/hide units inline.', owner: 'AI Studio', ac: 'Button expands/collapses units without requiring row click.' },
            { id: '4c', text: 'Implement filter guard to prompt user if Masters are hidden.', owner: 'AI Studio', ac: 'User is prompted to show Masters if they are filtered out.' },
        ]
    },
    { 
        id: 'stage3', 
        title: 'Stage 3 — View Types as a pop-out with explanations',
        status: 'Done',
        tasks: [
            { id: '3a', text: 'Make "Change Database View Type" button open a slide-in pop-out.', owner: 'AI Studio', ac: 'Pop-out opens from the right and closes via button/ESC.' },
            { id: '3b', text: 'Display 3 view types (Stacked, Cards, Collapsible) with descriptions and thumbnails.', owner: 'AI Studio', ac: 'All three view types are presented clearly with text and images.' },
        ]
    },
    { 
        id: 'stage2', 
        title: 'Stage 2 — Search bar placement and styling (footer)',
        status: 'Done',
        tasks: [
            { id: '2a', text: 'Centre the search input horizontally above the counter in the footer.', owner: 'AI Studio', ac: 'Search input is visually centred in the footer area.' },
            { id: '2b', text: 'Style search input with ivolve colours and visible focus ring.', owner: 'AI Studio', ac: 'Colours match spec (#025A40); focus ring is visible on tab.' },
        ]
    },
    { 
        id: 'stage1', 
        title: 'Stage 1 — Move Developer button; promote admin actions; tidy footer layout',
        status: 'Done',
        tasks: [
            { id: '1a', text: 'Move floating Developer button to the side panel, over the user avatar.', owner: 'AI Studio', ac: 'Dev button sits on/over avatar, never overlaps page controls.' },
            { id: '1b', text: 'Add "Add New Property" and "Add New Unit" buttons to the header.', owner: 'AI Studio', ac: 'Header buttons render; "Add Unit" validates "Property" before save.' },
            { id: '1c', text: 'Reorganize footer controls into a single tool row (left) and counter (right).', owner: 'AI Studio', ac: 'Footer shows the ordered tool row (left) and the counter (right).' },
        ]
    },
];

// New top-level structure for archived items
const archivedItems: ArchivedItem[] = [
    {
        id: 'project1',
        title: 'Project: Property Database UI Overhaul (Q3 2024)',
        status: 'Done',
        isProject: true,
        stages: project1Stages,
    }
    // Future bespoke requests will be added here as objects without `isProject: true`
];

const activeStages: Stage[] = [
    // All stages are now complete.
];

const changelog = [
     { version: 'v1.9.0', date: 'Current', changes: [
        'Completed the "Property Database UI Overhaul" project.',
        'Bundled all 9 project stages into a single collapsible archive entry in the Dev Hub for better organization.',
        'Refactored the Action Plan to support future "Bespoke Requests" alongside structured projects.',
    ]},
    { version: 'v1.8.0', date: 'Previous', changes: [
        'Completed Stage 9: Finalized accessibility and regression testing.',
        'All modals and pop-ups are now keyboard-accessible and can be closed with the Escape key.',
        'Improved screen reader support for modals by adding appropriate ARIA attributes.',
        'Fixed a color contrast issue on the footer mini-stats badges to meet WCAG AA standards.',
    ]},
    { version: 'v1.7.0', date: 'Previous', changes: [
        'Completed Stage 8: Added a personal mini-stats block to the Property Database footer.',
        'Users can now configure up to two badges (Tagged to you, Updated today, Your open actions).',
        'Choices are saved locally and badges are responsive, hiding on smaller screens.',
    ]},
    { version: 'v1.6.0', date: 'Previous', changes: [
        'Completed Stage 7: Replaced the simple Quick Stats pop-up with an advanced, multi-tabbed modal.',
        'The new modal includes General, Voids, Registered Provider, and Occupancy statistics.',
        'Added a timeframe filter (Week, Month, Quarter, Year) to view recent activity.',
        'Implemented an "Expand" view to see all timeframe data in a single table.',
    ]},
    { version: 'v1.5.0', date: 'Previous', changes: [
        'Completed Stage 6: Implemented the ability to manage staff links directly from a property\'s "Key Contacts" tab via a new modal.',
        'The modal allows adding/removing staff, assigning property-specific roles, and persists changes.',
        'Updated data context to handle property link updates, ensuring UI consistency.',
    ]},
    { version: 'v1.4.0', date: 'Previous', changes: [
        'Stage 6 In Progress: Began work on managing property-staff links.',
    ]},
    { version: 'v1.3.0', date: 'Previous', changes: [
        'Completed Stages 1-5 of the Property Database UI update plan.',
        'Implemented new footer layout with a prominent, centered search bar.',
        'Added a slide-in panel for selecting database view types (Table, Cards, Collapsible Masters).',
        'Built the new "Collapsible Masters" view with inline unit expansion and filter guard.',
        'Implemented a profile panel position selector (Side Panel vs. Bottom Sheet) with persistent settings.',
    ]},
    { version: 'v1.2.0', date: 'Previous', changes: [
        'Themed the Developer Hub with a burnt orange color scheme and gradient status cards.',
        'Replaced the inaccurate "Key" icon with a correct representation.',
        'Fixed text overflow in the Asset Library for icon names.',
        'Added a proof-of-concept image uploader and local storage cache to the UI Library.',
    ]},
    { version: 'v1.1.0', date: 'Previous', changes: [
        'Added Developer Hub with Action Plan, UI Library, Asset Library, and Notes tabs.',
        'Refactored `RpTag` component to be driven by a central configuration object for improved consistency and maintainability.',
        'Restored missing "Stakeholder Hub" and "Contact Hub" links to the main sidebar navigation.',
    ]},
    { version: 'v1.0.0', date: 'Initial Version', changes: [
        'Initial prototype build including Property Database, People View, Hubs, and core UI components.',
    ]},
];

const statusStyles = {
    'To Do': 'bg-gray-200 text-gray-800',
    'In Progress': 'bg-blue-100 text-ivolve-blue',
    'Done': 'bg-green-100 text-ivolve-mid-green',
};

const columnBgStyles = {
    'To Do': 'bg-gradient-to-br from-devhub-grad-yellow-from to-devhub-grad-yellow-to',
    'In Progress': 'bg-gradient-to-br from-devhub-grad-blue-from to-devhub-grad-blue-to',
    'Done': 'bg-gradient-to-br from-devhub-grad-green-from to-devhub-grad-green-to',
};

const StageCard: React.FC<{ stage: Stage }> = ({ stage }) => (
    <div className={`p-4 rounded-lg border ${columnBgStyles[stage.status as keyof typeof columnBgStyles]}`}>
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-solas-dark mb-3">{stage.title}</h4>
            <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[stage.status as keyof typeof statusStyles]}`}>{stage.status}</span>
        </div>
        <div className="space-y-3">
            {stage.tasks.map(task => (
                <div key={task.id} className="p-3 bg-white/80 backdrop-blur-sm rounded-md border border-black/10 shadow-sm">
                    <p className="font-semibold text-sm text-solas-dark">{task.text}</p>
                    <div className="mt-2 pt-2 border-t border-black/10 text-xs text-solas-gray">
                        <p><span className="font-bold">Owner:</span> {task.owner}</p>
                        <p><span className="font-bold">Acceptance Criteria:</span> {task.ac}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className={`p-4 rounded-lg border ${columnBgStyles[project.status as keyof typeof columnBgStyles]}`}>
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    <h4 className="font-bold text-solas-dark ml-2">{project.title}</h4>
                </div>
                <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[project.status as keyof typeof statusStyles]}`}>{project.status}</span>
            </div>
            {isOpen && (
                <div className="mt-4 pl-8 space-y-4 border-l-2 border-ivolve-blue/30 ml-2">
                    {project.stages.map(stage => <StageCard key={stage.id} stage={stage} />)}
                </div>
            )}
        </div>
    );
};

const ActionPlanTab: React.FC = () => {
    const [showArchived, setShowArchived] = useState(true);
    return (
        <div>
            <h2 className="text-2xl font-bold text-solas-dark pb-2 border-b-2 border-devhub-orange">Action Plan / PDR</h2>
            <p className="text-solas-gray mt-1">A high-level overview of development tasks and a log of significant changes for the Property Database UI update project.</p>

            <section className="mt-6">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Project Stages</h3>
                <div className="mt-4 space-y-4">
                    {activeStages.length > 0 ? (
                        activeStages.map(stage => <StageCard key={stage.id} stage={stage} />)
                    ) : (
                        <div className="p-4 bg-green-100 text-ivolve-mid-green rounded-md border border-green-200">
                            <p className="font-bold">All project stages are complete!</p>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <button onClick={() => setShowArchived(!showArchived)} className="font-semibold text-solas-dark flex items-center p-2 -ml-2 rounded-md hover:bg-gray-200">
                        {showArchived ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        <span className="ml-2">Archived Items ({archivedItems.length})</span>
                    </button>
                    {showArchived && (
                        <div className="mt-4 space-y-4">
                           {archivedItems.map(item =>
                                'stages' in item
                                    ? <ProjectCard key={item.id} project={item} />
                                    : <StageCard key={item.id} stage={item} />
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Incident & Fix Log</h3>
                <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                        <h4 className="text-lg font-bold text-solas-dark">Issue: Persistent Application Crash on Load</h4>
                        <p className="text-sm text-solas-gray mt-1"><b className="text-solas-dark">Date Resolved:</b> Current</p>
                        <div className="mt-2 text-sm space-y-2">
                            <div>
                                <h5 className="font-semibold">Root Cause Analysis:</h5>
                                <p className="text-solas-gray">The application was crashing on startup due to stale and malformed data stored in the browser's `localStorage` from previous sessions. Initial attempts to sanitize data only applied to fresh API fetches, but the app was loading the old, corrupted local data first, bypassing the fix and causing components to fail when they received data that didn't match the expected structure (e.g., missing arrays like `maintenanceJobs`).</p>
                            </div>
                            <div>
                                <h5 className="font-semibold">Resolution:</h5>
                                <ul className="list-disc list-inside text-solas-gray space-y-1">
                                    <li><b>Forced Data Refresh:</b> The data loading logic in `DataContext.tsx` was modified to call `storage.clearState()` on every application start. This purges any old data from `localStorage`.</li>
                                    <li><b>Disabled Persistence:</b> The `useEffect` hook that saved application state back to `localStorage` was removed. The app now exclusively loads fresh, sanitized mock data on every session, ensuring a consistent, clean start and preventing data corruption issues.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                        <h4 className="text-lg font-bold text-solas-dark">Issue: Module Resolution Error for `@/Icons`</h4>
                        <p className="text-sm text-solas-gray mt-1"><b className="text-solas-dark">Date Resolved:</b> Current</p>
                        <div className="mt-2 text-sm space-y-2">
                            <div>
                                <h5 className="font-semibold">Root Cause Analysis:</h5>
                                <p className="text-solas-gray">Multiple components were using a non-standard path alias (`@/Icons`) to import icon components. While common in frameworks with build tools (like Vite or Webpack), this alias is not natively understood by the browser's module loader, leading to a `TypeError` as it couldn't resolve the path.</p>
                            </div>
                            <div>
                                <h5 className="font-semibold">Resolution:</h5>
                                <p className="text-solas-gray">Manually updated the import paths in all affected files (`LegalHubView.tsx`, `AnalyzerTool.tsx`, etc.) from the alias (`@/Icons`) to the correct relative path (e.g., `../Icons` or `./Icons`). This allows the browser to correctly locate and load the icon modules.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Changelog</h3>
                <div className="mt-4 space-y-4">
                    {changelog.map(log => (
                        <div key={log.version} className="p-4 bg-white rounded-lg border">
                            <div className="flex items-baseline space-x-3">
                                <h4 className="text-lg font-bold text-solas-dark">{log.version}</h4>
                                <p className="text-sm text-solas-gray">{log.date}</p>
                            </div>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-solas-gray">
                                {log.changes.map((change, index) => <li key={index}>{change}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ActionPlanTab;
