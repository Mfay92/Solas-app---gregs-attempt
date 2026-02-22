# Projects Hub - Build Brief for Claude Code

> **Your Mission**: Build a world-class project management hub for the vulnerable adults care sector that would make Asana and Monday.com jealous.

---

## Before You Start - Essential Reading

**READ THESE FILES FIRST** (in this order):

1. **`CLAUDE.md`** - Full project context, tech stack, current state, working patterns
2. **`PROJECT_VISION.md`** - Matt's vision, why Solas exists, sector background
3. **`docs/HERO_BANNER_GUIDE.md`** - How to implement hero banners correctly
4. **`src/components/ReportCentre/index.tsx`** - Example of a placeholder hub page done right

**Current Branch**: `feature/code-quality-fixes`

---

## The Sector Context (Critical Understanding)

Solas is being built for the **vulnerable adults supported housing sector in the UK**. This means:

- **Who we support**: Adults with learning disabilities, mental health conditions, autism, acquired brain injuries, dementia, physical disabilities
- **Service types**: Supported living (tenant independence), residential care (24/7 support), nursing care (medical needs)
- **Key stakeholders**: NHS, local authorities (commissioners), Registered Providers (RPs/housing associations), care providers, support workers, families
- **Regulatory environment**: CQC inspections, safeguarding duties, care plan reviews, compliance deadlines
- **Why projects exist in this sector**:
  - "Expand services in Manchester" (open 3 new supported living properties by Q4)
  - "Achieve CQC Outstanding rating" (implement new support plans, staff training, process improvements)
  - "Reduce voids by 20%" (multi-department effort - repairs, referrals, marketing)
  - "Migrate to new compliance tracking system" (internal IT/operations project)
  - "Refurbish Oakwood House" (property development, could link to Development Hub)
  - "Implement new safeguarding procedures" (compliance-driven project)

**This is NOT corporate project management**. Projects here are deeply human - they affect vulnerable people's lives, housing, support, and wellbeing.

---

## What You're Building

A **Projects Hub** that serves as the central command centre for personal and team projects. Think of it as a blend of:

- **Personal projects**: Things Matt (or any user) is working on independently
- **Team projects**: Multi-person efforts across departments
- **Company-wide initiatives**: Major strategic projects everyone needs visibility on

### Key Philosophy

Users in this sector are **time-poor** (supporting vulnerable people comes first) and often **not tech-savvy**. Projects Hub must be:

- ✅ **Visual** - See status at a glance, no hunting for information
- ✅ **Simple** - Add a project in 30 seconds, update it in 15 seconds
- ✅ **Actionable** - Clear next steps, who's responsible, what's overdue
- ✅ **Flexible** - Works for "Paint the office" and "Expand to 3 new regions" equally well

---

## Your Challenge

**I want you to absolutely nail this.**

1. **Research first**: Spend time understanding what makes great project management software. Look at:
   - Monday.com's visual boards and status colors
   - Asana's task dependencies and timeline views
   - Trello's simplicity and card-based workflow
   - Notion's flexibility and databases
   - **Then ask yourself**: What would work brilliantly in a care sector CRM where projects involve properties, people, compliance, and real human outcomes?

2. **Build something incredible**: Don't just copy a template. Think deeply about:
   - What views would be most useful? (Kanban board? Timeline? List? Calendar?)
   - How do you balance simplicity with power?
   - What makes a project feel "done"?
   - How do you surface what's urgent without overwhelming the user?

3. **Make it Solas-native**: This isn't standalone project management software. It should:
   - Link to properties ("Refurbish Oakwood House" → Property Profile)
   - Link to people ("Onboard Jamie Thompson" → Person Profile)
   - Potentially link to Compliance Hub (e.g., "Complete all fire risk assessments")
   - Eventually support dashboard widgets (but don't build widgets yet - just design with that in mind)

---

## Must-Have Features

### 1. Hero Banner (Full-Width, Edge-to-Edge)

Follow the exact pattern from other hubs:

```tsx
<div className="min-h-screen bg-ivolve-paper -m-6">
    {/* Hero Banner */}
    <div className="bg-gradient-to-r from-[COLOR1] to-[COLOR2] w-full shadow-md">
        <div className="px-6 py-6">
            {/* Icon badge + Title + Description */}
            {/* Action buttons (e.g., "New Project") */}
            {/* Quick Stats (4 stat cards in grid-cols-4) */}
        </div>
    </div>

    {/* Main Content Area */}
    <div className="p-6">
        {/* Your amazing project management interface goes here */}
    </div>
</div>
```

**Color scheme**: Choose a gradient that feels "project-y" - maybe purple/indigo (planning/strategy vibes) or blue/cyan (productivity vibes). Check what's already used in other hubs to avoid clashes.

**Stats to show** (examples):
- Active Projects
- Overdue Tasks
- Completed This Month
- Team Members Contributing

### 2. Project Creation (Quick Add)

**Modal or slide-out form** with these fields (keep it SIMPLE):

**Essential:**
- Project Name* (text)
- Project Type (dropdown): Personal, Team, Company-Wide
- Priority (dropdown): Low, Medium, High, Critical
- Status (dropdown): Planning, In Progress, On Hold, Completed, Cancelled
- Owner/Lead* (who's driving this)
- Start Date
- Target Completion Date

**Optional (collapsible "More Details" section):**
- Description (textarea)
- Department (dropdown)
- Budget (number, £)
- Linked Property (searchable dropdown - properties.json)
- Linked People (multi-select - people.json)
- Tags (e.g., "Compliance", "Property Development", "Staff Training")

**Success Flow**:
1. User clicks "New Project" in hero banner
2. Modal opens with form
3. User fills essential fields (2-3 fields minimum to save)
4. Click "Create Project" → Toast: "Project created successfully"
5. Project appears in main list/board view

### 3. Main Project View

**You decide the best interface**, but here are proven patterns:

**Option A: Kanban Board** (like Trello)
- Columns: Planning | In Progress | On Hold | Completed
- Drag-and-drop cards between columns
- Each card shows: title, owner, due date, priority badge
- Click card to open detail view

**Option B: List/Table View** (like Asana)
- Sortable columns: Name, Owner, Status, Priority, Due Date, Progress
- Color-coded status badges
- Click row to open detail view
- Filters: Status, Priority, Owner, Department

**Option C: Timeline View** (Gantt-style)
- Projects as horizontal bars across calendar
- Shows dependencies (if you're feeling ambitious)
- Good for seeing what's coming up

**Option D: All Three** (with view switcher)
- Tabs: Board | List | Timeline
- State persists in localStorage

**My Recommendation**: Start with **List View** (quickest to build, most familiar to users). Add Board View if you have time. Timeline is nice-to-have.

### 4. Project Detail View

When user clicks a project, show detailed information:

**Layout**: Modal or dedicated page (your choice)

**Sections**:
- **Header**: Project name, status badge, priority indicator, owner avatar
- **Overview**: Description, dates, budget, tags
- **Tasks/Actions** (Critical!):
  - List of tasks within this project
  - Add task button (quick add: task name, assigned to, due date)
  - Mark tasks complete (checkbox)
  - Show overdue tasks in red
- **Activity Timeline** (if time permits):
  - "Matt created this project" - 2 days ago
  - "Sarah added a task: Book CQC inspection" - 1 day ago
  - "Jamie completed task: Send compliance report" - 2 hours ago
- **Linked Items**:
  - Properties (with links to Property Profiles)
  - People (with links to Person Profiles)
- **Actions**:
  - Edit Project
  - Mark Complete / Reopen
  - Archive / Delete

### 5. Filters & Search

Users need to find projects quickly:

- **Search bar**: Search by project name
- **Filter by**:
  - Status (Active, Completed, All)
  - Priority (High, Medium, Low)
  - Owner (dropdown of team members)
  - Department
  - Tags
- **Sort by**:
  - Due Date (ascending/descending)
  - Created Date
  - Priority
  - Name (A-Z)

**Active filter indicators**: Show "3 filters active" badge, allow clearing all filters with one click.

---

## Data Structure

Projects should be stored in **localStorage** for now (following Solas pattern):

```typescript
interface Project {
    id: string; // Unique ID (use Date.now().toString() or UUID)
    name: string;
    description?: string;
    type: 'Personal' | 'Team' | 'Company-Wide';
    status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    owner: string; // Name of person leading the project
    department?: string;
    startDate?: string; // ISO date string
    targetCompletionDate?: string;
    actualCompletionDate?: string;
    budget?: number;
    linkedProperties?: string[]; // Array of property IDs
    linkedPeople?: string[]; // Array of person IDs
    tags?: string[];
    tasks?: Task[];
    createdAt: string;
    updatedAt: string;
    createdBy: string; // Username
}

interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    completed: boolean;
    completedAt?: string;
    completedBy?: string;
    createdAt: string;
}
```

**localStorage keys**:
- `solas_projects` - Array of Project objects
- `solas_project_tasks` - Array of Task objects (or embed tasks in projects)

---

## Research Prompts (Do This!)

Before you build, **research these questions**:

1. What makes a project feel visually "healthy" vs "at risk"? (Think color coding, progress indicators)
2. How do the best PM tools handle task dependencies? (Do we need this?)
3. What's the optimal balance between detail and simplicity for a non-technical user?
4. How do care sector professionals think about projects? (Outcome-focused? Compliance-driven? People-centred?)
5. What would make someone WANT to use this instead of a spreadsheet or WhatsApp group?

**Challenge**: Can you find 3 innovative features from top PM tools that would blow Matt's mind if you included them?

---

## Dashboard Widget (Future-Proofing)

**Don't build the widget yet**, but design Projects Hub with this in mind:

Users will eventually want a "My Projects" widget on their Dashboard showing:
- Active projects they own
- Overdue tasks
- Quick add project button
- Click to open full Projects Hub

**Design consideration**: Make sure your project list components are modular (e.g., `<ProjectCard>` that could be reused in a widget).

---

## UX Principles for This Sector

1. **Speed over perfection**: Users need to log a project and get back to supporting someone in crisis
2. **Visual hierarchy**: Status should jump out - green = good, amber = caution, red = urgent
3. **Forgiveness**: Easy to edit, undo, reopen projects (mistakes happen under pressure)
4. **Mobile-friendly** (eventually): Might check projects on phone between support visits
5. **Accessibility**: ARIA labels, keyboard navigation, screen reader friendly

---

## Success Criteria

You've absolutely crushed this if:

✅ Matt can create a new project in under 30 seconds
✅ The interface feels intuitive to a non-tech-savvy care worker
✅ Projects with overdue tasks are immediately visible
✅ The hero banner matches the quality of other hubs (full-width, stats, gradient)
✅ Filters/search work smoothly with 50+ projects
✅ Data persists across page refreshes (localStorage)
✅ The design feels like it belongs in Solas (consistent with PropertyHub, PeopleHub, etc.)
✅ You've included at least ONE innovative feature that makes Matt go "Wow, I didn't think of that!"

---

## Code Quality Expectations

- **TypeScript**: Strongly typed, no `any` types
- **React best practices**: Functional components, proper hooks usage, clean state management
- **Tailwind CSS**: Follow Solas conventions (ivolve-* colors, consistent spacing)
- **Reusable components**: Extract `<ProjectCard>`, `<ProjectModal>`, `<TaskList>`, etc.
- **Error handling**: Validate inputs, show user-friendly error messages
- **Performance**: Use `useMemo` for filtered/sorted lists
- **Accessibility**: Keyboard navigation, focus management, ARIA labels

---

## Files You'll Create/Modify

**New Files** (estimate):
- `src/components/ProjectsHub/index.tsx` - Main hub component (~400-600 lines)
- `src/components/ProjectsHub/ProjectCard.tsx` - Reusable project card (~150 lines)
- `src/components/ProjectsHub/AddProjectModal.tsx` - Project creation form (~400 lines)
- `src/components/ProjectsHub/ProjectDetailView.tsx` - Detailed project view (~500 lines)
- `src/components/ProjectsHub/TaskList.tsx` - Task management component (~300 lines)
- `src/types/projects.ts` - TypeScript interfaces (~100 lines)

**Modified Files**:
- `src/App.tsx` - Route already exists (`/projects`), just ensure it's wired correctly

---

## Inspiration & References

**Look at these existing Solas components for patterns**:
- `src/components/PeopleHub/index.tsx` - Great example of list view with filters
- `src/components/PropertyHub/PropertyHubEnhanced.tsx` - Advanced filtering, search
- `src/components/Dashboard/DashboardLayout.tsx` - Hero banner pattern
- `src/components/ReferralsHub/index.tsx` - Status workflow, badges

**Study these external tools** (conceptually, don't copy code):
- Monday.com - Visual status indicators, board views
- Asana - Task lists, clean UI
- Notion - Flexible properties, tagging system
- Trello - Simplicity, card-based interface

---

## Final Pep Talk

Matt built Solas because he saw vulnerable people falling through gaps when services don't communicate. Projects Hub is where teams coordinate to prevent those gaps.

**This isn't just a feature - it's where:**
- A housing manager tracks "Refurbish 10 void properties" to get people off waiting lists faster
- A compliance officer manages "Achieve CQC Outstanding" to prove they're delivering excellent care
- A support worker coordinates "Improve mental health support pathways" to help people thrive

**You have the skills, the context, and the creative freedom to build something genuinely useful.**

**Push yourself**. Research deeply. Think critically. Build beautifully.

**Matt's counting on you to make this amazing. Don't hold back.**

---

*Good luck. Go build something incredible.*

**— The Solas Team**
