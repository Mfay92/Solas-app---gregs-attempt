# Projects Hub — Build Brief

## Domain Context (Read This First)

This is **NOT** generic corporate project management. This is a **housing operations project hub** for UK adult social care supported housing. Users are housing managers, property managers, facilities leads, and operations directors managing complex **property-centric projects** that affect vulnerable adults' homes.

**This sector runs on projects. Everything is a project:**

### Property Development & Acquisition
- **New property acquisitions** — finding, surveying, acquiring new supported living properties
- **Change of use applications** — converting residential to C3(b) or C2 care homes
- **Property adaptations** — DFGs, accessibility works, sensory rooms, hoists
- **New build developments** — purpose-built supported living schemes
- **Extensions & conversions** — creating additional units, ensuite bathrooms, staff offices

### Major Works & Refurbishment
- **Major refurbishment programmes** — full property overhauls (kitchens, bathrooms, heating, rewiring)
- **Planned maintenance programmes** — cyclical works across multiple properties
- **Void turnaround projects** — bringing empty properties to lettable standard
- **Energy efficiency programmes** — EPC upgrades, insulation, solar panels, heat pumps
- **M&E upgrades** — boilers, electrics, fire alarms, emergency lighting

### Building Safety & Compliance
- **Fire safety remediation** — cladding removal, compartmentation, fire doors, sprinklers (post-Grenfell)
- **Asbestos removal projects** — surveys, encapsulation, removal
- **Legionella control programmes** — water system upgrades, TMVs, monitoring
- **Building safety compliance** — Golden Thread, Building Safety Act 2022, BSM appointments
- **Gas & electrical compliance** — CP12 programmes, EICR remedial works

### Stock Transfers & Landlord Changes
- **Change of landlord** — transferring properties between RPs, TUPE, contract novations
- **Stock rationalisation** — disposing of unviable properties, portfolio restructuring
- **Lease renegotiations** — rent reviews, lease extensions, service charge negotiations
- **RP relationship management** — moving from one housing association to another

### Decanting & Rehousing
- **Decanting projects** — temporary rehousing of residents during major works
- **Supported moves** — relocating vulnerable people with care needs
- **Property closures** — decommissioning services, finding alternative placements
- **Emergency decants** — fire, flood, structural damage, boiler failures

### Resident Experience
- **Resident engagement projects** — consultation on major works, co-production
- **Complaints resolution programmes** — fixing systemic issues (damp, repairs backlogs)
- **Accessibility improvements** — level access showers, ramps, stairlifts
- **Garden & outdoor space projects** — sensory gardens, accessible patios, fencing

**Every project has:**
- **Properties affected** (1 property or 50 properties)
- **Residents impacted** (people living there, their support needs, their anxieties)
- **Budgets** (capital works, revenue, grants, RP funding)
- **Contractors** (builders, surveyors, project managers, M&E specialists)
- **Compliance deadlines** (Building Control, Fire Risk Assessment actions, CQC requirements)
- **Stakeholders** (RPs, local authorities, residents, families, support workers)
- **Risk** (cost overruns, delays, resident safeguarding, compliance breaches)

**This hub must make all of that visible, trackable, and manageable.**

---

## User Stories

### As a Housing Manager, I need to:
- Track all major works projects across my portfolio at a glance
- See which properties are affected by each project (and avoid double-booking contractors)
- Monitor budgets vs actual spend (capital budgets are tight, overruns are painful)
- Track decant logistics (who's being moved, where, when they're moving back)
- Manage landlord change projects (TUPE dates, contract handovers, property surveys)
- See upcoming compliance deadlines (FRA actions due, gas safety certs expiring)
- Link projects to properties (click "Oakwood House Refurb" → see PropertyProfile)
- Log resident concerns and communications (decant anxieties, disruption complaints)

### As a Facilities Manager, I need to:
- Manage planned maintenance programmes across 20+ properties
- Track contractor performance (on time? on budget? quality issues?)
- Coordinate access for surveys, inspections, and works (residents need notice)
- Manage building safety projects (fire doors, emergency lighting, compartmentation)
- Store completion certificates and compliance documents
- Escalate risks (asbestos found, structural issues discovered, cost overruns)

### As an Operations Director, I need to:
- See all active projects by status (pipeline, in progress, at risk, completed)
- Track total capital spend vs budget across all projects
- Identify projects at risk (red RAG, overdue milestones, budget overruns)
- Report to Board/RPs on major works progress
- Prioritise projects (fire safety first, energy efficiency second, cosmetic later)
- Link projects to strategic goals (reduce voids, improve EPC ratings, achieve Outstanding)

### As a Support Worker, I need to:
- Know when works are happening at properties I support people in
- See decant plans (if my residents are moving temporarily)
- Log impact of works on residents (noise, anxiety, routine disruption)
- Access resident communication logs (what they've been told, what they agreed to)

---

## Feature Specification

### 1. Project Types (Sector-Specific Taxonomy)

**Core Project Categories:**

1. **Property Development**
   - New Acquisition
   - Change of Use
   - New Build Development
   - Extensions & Conversions
   - Property Adaptations (DFG/Accessibility)

2. **Major Works & Refurbishment**
   - Major Refurbishment Programme
   - Planned Maintenance Programme
   - Void Turnaround
   - Energy Efficiency Programme (EPC/Insulation)
   - M&E Upgrades (Boilers/Electrics)
   - Kitchen/Bathroom Replacement

3. **Building Safety & Compliance**
   - Fire Safety Remediation (Cladding/Doors/Sprinklers)
   - Asbestos Removal
   - Legionella Control
   - Building Safety Act Compliance
   - Gas/Electrical Compliance (CP12/EICR)
   - Fire Risk Assessment Actions

4. **Stock Management**
   - Change of Landlord/RP
   - Stock Transfer
   - Lease Renegotiation
   - Property Disposal
   - Portfolio Restructure

5. **Decanting & Rehousing**
   - Planned Decant (Major Works)
   - Emergency Decant (Fire/Flood/Structure)
   - Property Closure/Decommission
   - Supported Move

6. **Resident Experience**
   - Resident Engagement/Consultation
   - Complaints Resolution Programme
   - Accessibility Improvements
   - Garden/Outdoor Space Improvements

7. **Other**
   - Custom project types

**Why This Matters:**
- Filters by category (e.g., "Show me all Fire Safety projects")
- Category-specific fields (decant projects need resident rehousing details)
- Reporting (e.g., "£2.3M spent on Building Safety this year")

---

### 2. Project Data Model (Housing-Specific)

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;

  // Project classification
  category: ProjectCategory;
  type: ProjectType; // Specific type within category
  status: ProjectStatus;
  priority: ProjectPriority;
  healthStatus: 'Healthy' | 'At Risk' | 'Critical'; // RAG rating

  // Ownership & team
  projectLead: string; // Person responsible
  projectManager?: string; // External PM if applicable
  contractor?: string; // Main contractor
  consultant?: string; // Architect/surveyor/engineer
  rpContact?: string; // RP contact (if RP-funded)

  // Timeline
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  keyMilestones: Milestone[];

  // Budget & finance
  budget?: number; // Total approved budget
  actualSpend?: number; // Spend to date
  budgetSource: 'Capital' | 'Revenue' | 'RP Funding' | 'Grant' | 'DFG' | 'Mixed';
  rpFundingConfirmed: boolean;

  // Property & resident impact
  linkedProperties: string[]; // Property IDs affected
  linkedPeople: string[]; // Residents affected/involved
  requiresDecant: boolean;
  decantDetails?: DecantDetails;
  residentCommunication: CommunicationLog[];

  // Compliance & safety
  buildingControlRequired: boolean;
  buildingControlApproved?: boolean;
  planningPermissionRequired: boolean;
  planningPermissionGranted?: boolean;
  fireRiskAssessmentUpdated: boolean;
  asbestosCheckRequired: boolean;
  asbestosClearCertificate?: boolean;

  // Contractor management
  contractorPerformance?: ContractorRating;
  siteAccessArranged: boolean;
  keyHolderDetails?: string;

  // Documents
  documents: ProjectDocument[];

  // Risk & issues
  risks: RiskRegisterItem[];
  issues: IssueLog[];

  // Tags & metadata
  tags: string[];
  department?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastUpdatedBy: string;
}

type ProjectCategory =
  | 'property-development'
  | 'major-works'
  | 'building-safety'
  | 'stock-management'
  | 'decanting'
  | 'resident-experience'
  | 'other';

type ProjectStatus =
  | 'Pipeline' // Proposed, awaiting approval
  | 'Planning' // Approved, planning phase
  | 'Procurement' // Tendering, contractor selection
  | 'In Progress' // Works underway
  | 'On Hold' // Paused (budget, delays, etc.)
  | 'Snagging' // Substantially complete, fixing defects
  | 'Completed' // Finished, certificates received
  | 'Cancelled'; // Project abandoned

type ProjectPriority =
  | 'Critical' // Life safety, legal obligation
  | 'High' // Important, time-sensitive
  | 'Medium' // Standard priority
  | 'Low'; // Nice-to-have, flexible timing

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  responsibleParty: string; // Who's doing it
}

interface DecantDetails {
  decantStartDate: string;
  expectedReturnDate: string;
  temporaryAccommodation: {
    personId: string;
    personName: string;
    temporaryAddress: string;
    moveOutDate?: string;
    moveBackDate?: string;
    supportArrangements?: string;
  }[];
  decantCoordinator: string;
  residentAgreement: boolean; // Have residents agreed?
}

interface CommunicationLog {
  id: string;
  date: string;
  method: 'Email' | 'Letter' | 'Phone' | 'Face-to-Face' | 'Text';
  recipients: string[]; // Person IDs or names
  subject: string;
  summary: string;
  loggedBy: string;
}

interface ProjectDocument {
  id: string;
  title: string;
  type: 'Survey' | 'Quote' | 'Contract' | 'Certificate' | 'Drawing' | 'Photo' | 'Other';
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string; // (Future: actual file storage)
}

interface RiskRegisterItem {
  id: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  likelihood: 'Low' | 'Medium' | 'High';
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

interface IssueLog {
  id: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Major';
  dateRaised: string;
  raisedBy: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  resolution?: string;
  resolvedDate?: string;
}

interface ContractorRating {
  quality: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
  timeManagement: 1 | 2 | 3 | 4 | 5;
  communication: 1 | 2 | 3 | 4 | 5;
  wouldRecommend: boolean;
  notes?: string;
}
```

---

### 3. Project Cards (Main View)

**Card Design:**

**Front (Summary View):**
- Project name (bold, large)
- Category badge (colour-coded by type)
  - Property Development: Blue
  - Major Works: Green
  - Building Safety: Red
  - Stock Management: Purple
  - Decanting: Amber
  - Resident Experience: Teal
- Status badge (Pipeline/Planning/In Progress/On Hold/Snagging/Completed)
- Health indicator (RAG: Green/Amber/Red)
- Progress bar (% complete based on milestones)
- Key info:
  - Project lead name + avatar
  - Target completion date (or "Overdue by X days" in red)
  - Budget: £X / £Y (spend vs budget)
  - Properties affected: "3 properties"
  - Residents impacted: "12 people"
- Quick actions: View, Edit, Mark Complete

**Expandable Detail (Click to Expand Card):**
- Full description
- Linked properties (clickable chips → PropertyProfile)
- Linked people (clickable chips → PersonProfile)
- Recent activity (last 3 updates)
- Next milestone (due date, responsible party)
- Risk summary ("2 high risks, 1 open issue")
- Documents count ("5 documents attached")

**Visual Indicators:**
- **Overdue projects:** Red border glow
- **Decant projects:** Amber accent (people are displaced)
- **Building safety projects:** Red "Safety Critical" badge
- **RP-funded projects:** RP brand colour accent (if applicable)

---

### 4. Views & Layouts

**View 1: Card Grid (Default)**
- Grid of project cards (3 per row desktop, 2 tablet, 1 mobile)
- Sorted by: Priority (Critical first), then Status (In Progress first), then Due Date
- Expandable cards for quick detail view

**View 2: Kanban Board**
- Columns: Pipeline | Planning | Procurement | In Progress | Snagging | Completed
- Drag-drop to change status
- Colour-coded by category
- Show property count on each card

**View 3: Timeline/Gantt**
- Projects as horizontal bars across calendar
- Show overlaps (avoid double-booking contractors/properties)
- Milestones as diamonds on timeline
- Filter by property (e.g., "Show me all projects affecting Oakwood House")

**View 4: Budget Dashboard**
- Table view sorted by budget size
- Columns: Name, Budget, Spend, Remaining, % Spent, Status
- Total spend summary at top
- Filter by budget source (Capital, RP Funding, DFG, etc.)

**View Toggle:** Tabs or dropdown in top-right ("View: Cards | Board | Timeline | Budget")

---

### 5. Add/Edit Project Form (Comprehensive)

**Form Structure: Multi-Tab Modal**

**Tab 1: Project Basics**
- Project Name* (text)
- Category* (dropdown: Property Development, Major Works, Building Safety, etc.)
- Specific Type (dropdown, filtered by category)
- Description (rich text, 500 char limit)
- Status* (dropdown: Pipeline → Completed)
- Priority* (Critical/High/Medium/Low)
- Tags (multi-select or custom)

**Tab 2: Timeline & Milestones**
- Start Date (date picker)
- Target Completion Date* (date picker)
- Key Milestones (add multiple):
  - Milestone name (e.g., "Planning permission granted")
  - Due date
  - Responsible party
  - Status (Pending/In Progress/Completed)

**Tab 3: Budget & Funding**
- Total Budget (£, number input)
- Budget Source (Capital/Revenue/RP Funding/Grant/DFG/Mixed)
- RP Funding Confirmed? (toggle)
- Actual Spend to Date (£, number input)
- Budget Notes (text area)

**Tab 4: Team & Contractors**
- Project Lead* (dropdown: internal staff)
- Project Manager (text: external PM name)
- Main Contractor (text or contact lookup)
- Consultant (architect/surveyor)
- RP Contact (contact lookup)
- Contractor Performance Rating (1-5 stars, optional)

**Tab 5: Properties & Residents**
- Linked Properties* (search & multi-select from properties.json)
  - Show property cards with address, service type, current occupancy
  - Allow selecting 1 or 50 properties
- Linked Residents (search & multi-select from people.json)
  - Auto-populate based on selected properties (current residents)
  - Allow manual additions (e.g., prospective residents)
- Requires Decant? (toggle)
  - If yes, show Decant Details section:
    - Decant start date
    - Expected return date
    - Decant coordinator (staff member)
    - Temporary accommodation details (per resident)

**Tab 6: Compliance & Safety**
- Building Control Required? (checkbox)
  - If yes: Approval received? (checkbox)
- Planning Permission Required? (checkbox)
  - If yes: Permission granted? (checkbox)
- Fire Risk Assessment Updated? (checkbox)
- Asbestos Check Required? (checkbox)
  - If yes: Clear certificate received? (checkbox)
- Compliance Notes (text area)

**Tab 7: Risks & Issues**
- Risk Register (add multiple):
  - Risk description
  - Impact (Low/Medium/High)
  - Likelihood (Low/Medium/High)
  - Mitigation plan
  - Risk owner
  - Status (Open/Mitigated/Closed)
- Issue Log (add multiple):
  - Issue description
  - Severity (Minor/Moderate/Major)
  - Date raised
  - Raised by
  - Status (Open/In Progress/Resolved)
  - Resolution notes

**Tab 8: Documents & Communication**
- Documents (upload/link):
  - Document type (Survey/Quote/Contract/Certificate/Drawing/Photo)
  - Title
  - Upload file (or paste URL for now)
- Resident Communication Log (add entries):
  - Date
  - Method (Email/Letter/Phone/Face-to-Face/Text)
  - Recipients (linked residents)
  - Subject
  - Summary

**Form Behaviour:**
- Autosave to localStorage as user types
- Validation: Required fields highlighted in red
- "Save & Close" button
- "Save & Add Another" button (for bulk project entry)
- Progress indicator (Tab 1 of 8, Tab 2 of 8, etc.)
- "Previous" and "Next" buttons to navigate tabs
- Cancel button (confirm if unsaved changes)

---

### 6. Search & Filtering

**Search Bar (Prominent):**
- Real-time search across:
  - Project name
  - Description
  - Linked property addresses
  - Linked resident names
  - Contractor names
  - Tags
- Debounced (200ms)
- Show result count

**Filter Panel (Left Sidebar, Collapsible):**

**By Category:**
- Property Development (count)
- Major Works (count)
- Building Safety (count)
- Stock Management (count)
- Decanting (count)
- Resident Experience (count)
- Other (count)

**By Status:**
- Pipeline
- Planning
- Procurement
- In Progress
- On Hold
- Snagging
- Completed
- (Multi-select checkboxes)

**By Priority:**
- Critical (count)
- High (count)
- Medium (count)
- Low (count)

**By Health:**
- Healthy (green)
- At Risk (amber)
- Critical (red)

**By Budget Source:**
- Capital
- Revenue
- RP Funding
- Grant/DFG
- Mixed

**By Property:**
- Dropdown: search and select property
- Shows all projects affecting that property

**By Date Range:**
- Due in next 30 days
- Due in next 90 days
- Overdue
- Custom date range (start/end picker)

**By Compliance Status:**
- Awaiting Building Control
- Awaiting Planning Permission
- Asbestos works required
- Fire safety projects

**Active Filters Bar:**
- Show applied filters as chips below search bar
- "Clear all filters" button
- Result count ("Showing 8 of 47 projects")

---

### 7. Project Detail Page/Modal

**When clicking a project card:**

**Header:**
- Project name (large, bold)
- Category badge + Status badge + Health indicator (RAG)
- Actions: Edit | Mark Complete | Duplicate | Archive | Delete

**Section 1: Overview**
- Description
- Project lead (avatar + name)
- Timeline: Start date → Target completion date
- Progress bar (% complete based on milestones)
- Budget: £X spent of £Y (X% of budget)

**Section 2: Properties & Residents**
- Linked properties (clickable cards)
  - Property name, address, photo
  - Click → navigate to PropertyProfile
- Linked residents (clickable cards)
  - Resident name, photo, current property
  - Click → navigate to PersonProfile
- Decant status (if applicable):
  - "3 residents temporarily rehoused"
  - Decant timeline (start/end dates)
  - Temporary accommodation details

**Section 3: Timeline & Milestones**
- Visual timeline (horizontal bar)
- Milestones plotted on timeline
- Checklist of milestones:
  - ✅ Planning permission granted (completed 12/01/2026)
  - 🔄 Building Control approval (in progress, due 28/02/2026)
  - ⏳ Works start on site (pending, due 10/03/2026)
- Add milestone button

**Section 4: Budget & Spend**
- Budget breakdown:
  - Total approved: £150,000
  - Spent to date: £87,500 (58%)
  - Remaining: £62,500
  - Forecast final cost: £155,000 (3% over budget) ⚠️
- Budget source: RP Funding (Inclusion Housing confirmed)
- Budget notes (if any)

**Section 5: Team & Contractors**
- Project lead: Matt Fay
- Project manager: John Smith (external)
- Main contractor: ABC Builders Ltd
- Consultant: XYZ Surveyors
- RP contact: Jane Doe (Inclusion Housing)
- Contractor performance rating: ★★★★☆ (4/5)

**Section 6: Compliance & Safety**
- Building Control: ✅ Approved
- Planning Permission: ✅ Granted
- Fire Risk Assessment: ✅ Updated
- Asbestos Check: ✅ Clear certificate received
- Compliance documents: 3 attached

**Section 7: Risks & Issues**
- Risk register:
  - 🔴 High risk: Cost overrun due to material price increase (mitigation: negotiate with supplier)
  - 🟡 Medium risk: Resident anxiety during works (mitigation: weekly comms, support worker briefings)
- Issue log:
  - 🔴 Open issue: Asbestos found in ceiling (raised 15/02/2026, specialist survey booked)
  - ✅ Resolved issue: Planning objection from neighbour (resolved 10/01/2026)

**Section 8: Documents**
- Document library:
  - 📄 Property survey (uploaded 01/12/2025)
  - 📄 Contractor quote (uploaded 15/12/2025)
  - 📄 Contract signed (uploaded 05/01/2026)
  - 📷 Before photos (uploaded 20/01/2026)
- Upload new document button

**Section 9: Resident Communication**
- Communication log:
  - 📧 Email to all residents: "Works starting 10 March" (sent 01/02/2026)
  - 📞 Phone call with Jamie's family: discussed decant plans (logged 05/02/2026)
  - 📝 Letter: noise mitigation measures (sent 12/02/2026)
- Log new communication button

**Section 10: Activity Timeline**
- Reverse-chronological log:
  - Matt updated budget (2 hours ago)
  - Sarah added milestone "Building Control approval" (1 day ago)
  - Jamie uploaded document "Fire door spec" (3 days ago)
  - Matt created this project (1 month ago)

---

### 8. Dashboard Widgets (Future-Proofing)

**Widget 1: My Projects**
- Shows projects where user is the lead
- Quick stats: X active, Y overdue, Z completed this month
- List of next 5 projects by due date

**Widget 2: Projects At Risk**
- Shows projects with RAG status = Red
- Click to view project detail

**Widget 3: Budget Summary**
- Total capital spend this year: £X
- Pie chart: spend by category
- Click to open Budget Dashboard view

**Widget 4: Upcoming Milestones**
- Next 10 milestones across all projects
- Due date, project name, responsible party

---

### 9. Reporting & Exports

**Export Options:**
- Export all projects to CSV
- Export filtered projects to CSV
- Export project detail to PDF (single project)
- Export budget dashboard to Excel

**Reports (Future):**
- Capital spend by quarter
- Projects completed on time vs overdue
- Average contractor performance ratings
- Properties affected by active projects
- Resident impact summary (how many people affected by works)

---

### 10. Mobile Responsiveness

- Single-column card layout
- Sticky search bar
- Drawer filter panel (slides in from left)
- Bottom sheet modal for project detail (instead of centred overlay)
- Swipe gestures:
  - Swipe left on card → quick actions (edit, mark complete)
  - Swipe right → dismiss actions
- Tap cards to expand inline detail (no modal on mobile)

---

### 11. Permissions & Access (Future)

- **View all projects** (managers, directors)
- **View own projects** (staff can only see projects they lead)
- **Edit all projects** (managers)
- **Edit own projects** (project leads)
- **Read-only** (support workers, board members)

---

### 12. Integration with Other Hubs

**PropertyHub Integration:**
- Property Profile → "Projects" tab showing all projects affecting this property
- Click project → navigate to Projects Hub with project detail open

**PersonProfile Integration:**
- Person Profile → "Projects" tab showing projects affecting their home
- Show decant status if applicable

**Address Book Integration:**
- Store contractors, RPs, consultants as contacts
- Link projects to contacts
- Click contact name → navigate to Address Book

**Development Hub Integration:**
- New build projects could appear in both Development Hub (pipeline) and Projects Hub (active)
- Sync status between hubs

---

### 13. Success Criteria

This Projects Hub is successful if:

1. **Matt can see all active major works at a glance** (no hunting through spreadsheets)
2. **Decant projects are immediately identifiable** (amber accent, residents listed)
3. **Building safety projects are flagged as critical** (red badges, compliance tracking)
4. **Budget tracking is clear** (spend vs budget, visual indicators)
5. **Property and resident impact is visible** (linked entities, decant status)
6. **Compliance milestones are tracked** (Building Control, Planning, FRA, Asbestos)
7. **The hub feels housing-specific**, not generic PM software
8. **Matt can run reports** (capital spend, projects by category, contractor performance)

---

### 14. Mock Data Requirements

Create **30+ realistic housing projects:**

**Property Development (5 projects):**
- New Acquisition: 3-bed bungalow, Brighton (£350k, Planning stage)
- Change of Use: Convert office to 4-unit supported living, Lewes (£120k, In Progress)
- Extension: Add 2 ensuite bedrooms to Oakwood House (£80k, Procurement)
- DFG Adaptation: Install wet room for wheelchair user, Manor Gardens (£15k, Completed)
- New Build: Purpose-built 6-unit scheme, Worthing (£1.2M, Pipeline)

**Major Works & Refurbishment (10 projects):**
- Major Refurb: Full refurb of Riverside House (£180k, In Progress, 3 residents decanted)
- Void Turnaround: Bring 5 void units to lettable standard (£50k, In Progress)
- Kitchen Replacement: Replace kitchens in 8 properties (£40k, Planning)
- EPC Upgrade: Install insulation in 12 properties (£60k, Procurement)
- Boiler Replacement: Replace 6 faulty boilers (£18k, Snagging)
- Bathroom Adaptations: Level access showers in 4 properties (£32k, Completed)
- Electrical Rewiring: Full rewire of 2 properties (£25k, In Progress)
- Roof Repairs: Fix leaking roofs in 3 properties (£22k, On Hold - budget)
- Garden Improvements: Accessible patios in 5 properties (£15k, Planning)
- Decoration Programme: Redecorate 10 communal areas (£12k, Procurement)

**Building Safety & Compliance (8 projects):**
- Fire Door Replacement: Install FD30 doors in 15 properties (£90k, In Progress)
- Asbestos Removal: Remove asbestos ceiling in Hillside House (£12k, Planning, awaiting survey)
- Emergency Lighting Upgrade: Install addressable system, 8 properties (£35k, Procurement)
- Compartmentation Works: Fire-stop loft spaces, 6 properties (£28k, In Progress)
- Legionella Control: Install TMVs in 20 properties (£40k, Completed)
- Fire Alarm Upgrade: Replace conventional with L1 system, 4 properties (£50k, Planning)
- Electrical Testing: EICR remedial works, 12 properties (£18k, Snagging)
- Gas Safety Compliance: CP12 remedials, 8 properties (£8k, In Progress)

**Stock Management (3 projects):**
- Change of Landlord: Transfer 12 properties from Sanctuary to Inclusion (£0, Planning, TUPE March 2026)
- Lease Renegotiation: Renew 5 leases with L&Q (£0, In Progress, rent review)
- Property Disposal: Sell 2 unviable properties (£0, Pipeline, board approval pending)

**Decanting & Rehousing (2 projects):**
- Emergency Decant: Fire damage at Cedar Lodge (£25k, In Progress, 4 residents in temp accommodation)
- Planned Decant: Major works at Willows (£0, Planning, 3 residents, decant coordinator assigned)

**Resident Experience (2 projects):**
- Resident Consultation: Co-produce garden designs (£0, In Progress)
- Complaints Resolution: Fix persistent damp issues in 3 flats (£15k, In Progress)

**Linking:**
- Link projects to 1-50 properties (realistic spread)
- Link residents to projects affecting their homes
- Link contractors/RPs/consultants from Address Book
- Assign project leads (Matt, Sarah, Jamie, etc.)
- Add realistic budgets (£5k to £1.2M)
- Add milestones, risks, issues for 5-10 key projects

---

### 15. Testing Checklist

- [ ] Add project form validates required fields
- [ ] Search returns correct results across all fields
- [ ] Filters combine correctly (AND logic)
- [ ] Card grid, kanban board, and timeline views all work
- [ ] Budget tracking calculates correctly
- [ ] Linked properties navigate to PropertyProfile
- [ ] Linked residents navigate to PersonProfile
- [ ] Decant projects show amber accent
- [ ] Building safety projects show red "Safety Critical" badge
- [ ] Overdue projects show red border
- [ ] Mobile responsive (single-column cards, drawer filters)
- [ ] Form autosaves on input
- [ ] Export to CSV works
- [ ] Drag-drop works in kanban view
- [ ] Timeline view shows project overlaps

---

### 16. Design System Integration

**Hero Banner:**
- Gradient: Purple to indigo (planning/strategy vibes)
- Icon: FolderKanban (from lucide-react)
- Title: "Projects Hub"
- Description: "Manage property developments, major works, compliance projects, and more"
- Stats: Active Projects, At Risk, Overdue, Completed This Month

**Colour Coding:**
- Property Development: Blue (#3B82F6)
- Major Works: Green (#10B981)
- Building Safety: Red (#EF4444)
- Stock Management: Purple (#8B5CF6)
- Decanting: Amber (#F59E0B)
- Resident Experience: Teal (#14B8A6)

**Typography:**
- Project name: `text-lg font-semibold`
- Category badge: `text-xs font-medium uppercase`
- Budget: `text-sm font-mono` (monospace for numbers)

**Spacing:**
- Card padding: `p-4`
- Card gap: `gap-4`
- Section spacing: `space-y-6`

---

### 17. AI Build Instructions

When building this hub:

1. **Read `CLAUDE.md`, `docs/PROJECT_VISION.md`, and this file** — understand the housing sector context
2. **Use British English** (colour, organisation, programme, licence, etc.)
3. **Reference existing patterns:**
   - Development Hub kanban for drag-drop
   - PropertyProfile for linked entity cards
   - ReferralsHub for filters and status workflows
4. **Create mock data with realistic housing projects** (see Mock Data section)
5. **Use Tailwind CSS 3.4** — no dynamic class construction
6. **Store data in `src/data/mockProjects.ts`** (extend existing)
7. **Create types in `src/types/projects.ts`** (extend existing)
8. **Use Context API for state** (no backend yet)
9. **Make it beautiful and functional** — this is a core operational hub
10. **Test on mobile** — housing managers check projects on phones while on site

---

### 18. File Structure

```
src/
  components/
    ProjectsHub/
      index.tsx                 # Main hub (already exists, needs rebuild)
      ProjectCard.tsx           # Card component (already exists, needs enhancement)
      AddProjectModal.tsx       # Add/edit form (already exists, needs tabs)
      ProjectDetailView.tsx     # Detail page (already exists, needs sections)
      ProjectKanbanBoard.tsx    # Kanban view (new)
      ProjectTimeline.tsx       # Gantt timeline (new)
      ProjectBudgetDashboard.tsx # Budget view (new)
      DecantStatusPanel.tsx     # Decant tracking (new)
      RiskRegister.tsx          # Risk management (new)
      DocumentLibrary.tsx       # Document upload (new)
      CommunicationLog.tsx      # Resident comms (new)
  data/
    mockProjects.ts             # Mock project data (extend existing)
  types/
    projects.ts                 # Project types (extend existing)
  utils/
    projectUtils.ts             # Search, filter, sort, calculations
```

---

## Final Notes

Projects Hub is where **housing operations meets project delivery**. Every major works programme, every fire safety upgrade, every decant, every landlord change — it's all tracked here.

This is not about corporate KPIs. This is about:
- **Keeping vulnerable people safe in their homes** (building safety compliance)
- **Minimising disruption to people's lives** (decant coordination, resident communication)
- **Managing tight budgets** (capital spend, RP funding, grants)
- **Meeting legal obligations** (Building Control, Planning, Fire Safety)
- **Delivering quality housing** (refurbs, adaptations, EPC upgrades)

Build it like you're helping Matt manage 50 properties, £2M capital budget, 200 residents affected by works, and 30 active projects simultaneously.

**Make it housing-specific. Make it powerful. Make it indispensable.**

---

*When complete, update `CLAUDE.md` current state, check off this task in `docs/TODO.md`, and log session in `docs/SESSION_LOG.md`.*
