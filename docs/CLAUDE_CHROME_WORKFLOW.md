# Using Claude in Chrome for SASSHA 360 Research

**Purpose:** Step-by-step guide for using Claude (claude.ai) in Chrome to systematically document SASSHA 360 for Solas development.

---

## Setup (One-Time)

1. **Open Multiple Chrome Windows:**
   - Window 1: SASSHA 360 demo (your working window)
   - Window 2: Claude.ai (your AI assistant)
   - Window 3: VSCode (this codebase) — for quick reference

2. **File Preparation:**
   - Open `docs/SASSHA360_RESEARCH.md` in VSCode
   - Keep it visible in a split pane for easy copy/paste

3. **Screenshot Tool Ready:**
   - Windows: Win + Shift + S (Snipping Tool)
   - Save screenshots to a folder: `docs/sassha360-screenshots/`
   - Name them clearly: `dashboard-overview.png`, `property-details.png`, etc.

---

## The Research Workflow

### Step 1: Navigate to a SASSHA Screen

Example: Dashboard, Property Details, Tenancy Record, etc.

### Step 2: Take a Screenshot

- Capture the full screen or relevant area
- Save with descriptive name
- Optional: Upload to Claude in Chrome if you want AI analysis

### Step 3: Ask Claude to Analyze

In your Claude.ai tab, you can:

**Upload the screenshot** and ask:
```
Analyze this SASSHA 360 screen. Tell me:
1. What module/function is this?
2. What data fields are visible?
3. What interactions are available (buttons, links, tabs)?
4. What layout patterns are used?
5. What should we learn from this for Solas?
```

**Or describe what you see** and ask:
```
I'm looking at the SASSHA 360 property details page. It has:
- A header with property address
- Tabs for: Details, Tenancy, Maintenance, Compliance, Finance
- A sidebar with quick stats
- A timeline of recent activity

Can you help me structure documentation for this? What questions should I answer?
```

### Step 4: Document in SASSHA360_RESEARCH.md

Copy Claude's analysis into the relevant section of [SASSHA360_RESEARCH.md](SASSHA360_RESEARCH.md).

Expand with your own observations:
- Business context you understand from your ivolve experience
- How this compares to current Solas functionality
- Priority for implementation

### Step 5: Iterate

Move to the next screen and repeat.

---

## Efficient Claude Prompts for This Task

### For Feature Documentation
```
I'm documenting SASSHA 360's [MODULE NAME] for competitive analysis.

From this screen, I can see:
- [List visible features]
- [List data fields]
- [List actions available]

Help me:
1. Structure this as comprehensive documentation
2. Identify the underlying data model
3. Suggest what Solas should adopt/improve/avoid
4. Estimate implementation complexity (simple/medium/complex)
```

### For Data Model Extraction
```
Based on this SASSHA 360 form/screen, what entities and relationships exist?

Fields I see:
- [List all fields with their labels and types]

Create a TypeScript interface for this data structure.
```

### For Workflow Analysis
```
This is the workflow for [TASK] in SASSHA 360:

1. [Step 1]
2. [Step 2]
3. [Step 3]

Analyze:
- What business logic is happening?
- What validation might exist?
- What could go wrong?
- How would we implement this in React?
```

### For UX/UI Pattern Analysis
```
Describe this UI pattern I'm seeing:
- [Screenshot or description]

What's good about it?
What's problematic?
How could Solas implement this better?
```

---

## What to Capture for Each Module

Use this checklist as you move through SASSHA:

### ✅ Visual/Layout
- [ ] Screenshot saved
- [ ] Header/navigation structure noted
- [ ] Tab structure documented
- [ ] Sidebar/panel layout described
- [ ] Responsive behaviour observed (if you resize window)

### ✅ Data Fields
- [ ] All field labels listed
- [ ] Field types identified (text, dropdown, date, number, etc.)
- [ ] Required vs optional noted
- [ ] Default values observed
- [ ] Validation hints captured (e.g., "Must be valid postcode")

### ✅ Interactions
- [ ] All buttons documented (label + purpose)
- [ ] Links captured (where they go)
- [ ] Dropdown options listed
- [ ] Modal/popup behaviours noted
- [ ] Keyboard shortcuts observed (if any)

### ✅ Business Logic
- [ ] Calculations identified (e.g., "Rent per week auto-calculates from monthly")
- [ ] Workflow steps mapped
- [ ] Conditional logic noted (e.g., "Finance tab only shows if tenancy active")
- [ ] Integrations mentioned (e.g., "Email tenant button")

### ✅ Data Relationships
- [ ] How this record links to others (e.g., Property → Units → Tenancies → People)
- [ ] Hierarchies understood
- [ ] Lookups identified (e.g., "Tenant dropdown pulls from Person table")

### ✅ Solas Implications
- [ ] Priority assigned (P0/P1/P2/P3)
- [ ] Implementation notes written
- [ ] "Must have" vs "nice to have" decided
- [ ] Quick wins identified

---

## Example Session

### Real Example: Documenting Property Details Page

**Step 1:** Navigate to a property in SASSHA 360

**Step 2:** Take screenshot → save as `property-details-overview.png`

**Step 3:** In Claude.ai:
```
[Upload screenshot]

I'm analyzing SASSHA 360 (a competitor housing management system) to inform our Solas CRM development. This is the Property Details page.

Please analyze:
1. What data fields are captured?
2. What tabs are available?
3. What's the layout structure?
4. What should we adopt for Solas?
5. Create a TypeScript interface for this data model
```

**Step 4:** Claude responds with structured analysis

**Step 5:** Copy Claude's response into `SASSHA360_RESEARCH.md` under "Property/Asset Management" section

**Step 6:** Add your own notes:
```
**Learnings for Solas:**
- They use a tabbed interface (we already have this ✓)
- They show a property "health score" (we should add this - P1)
- Their compliance panel is very prominent (validates our compliance hub priority)
- Address validation is built-in (we should use UK postcode API)

**Priority for Solas Implementation:**
- [x] P0 - Property details form (we have basics)
- [ ] P1 - Health score widget
- [ ] P1 - Compliance quick-view panel
- [ ] P2 - Address autocomplete
```

---

## Tips for Success

### 1. Work Module by Module
Don't jump around randomly. Complete one module fully before moving to the next:
- Dashboard
- Properties
- Tenancies
- Maintenance
- Compliance
- Finance
- People

### 2. Use Claude for Pattern Recognition
After documenting 3-4 screens, ask Claude:
```
I've documented these SASSHA 360 screens: [list them]

What common patterns do you see across them?
What design system principles are they using?
What should our Solas design system adopt?
```

### 3. Extract Data Models Early
As soon as you see forms/tables, get Claude to help you create TypeScript interfaces. This will inform our database schema later.

### 4. Prioritize Ruthlessly
Not everything SASSHA does is relevant to Solas. Focus on:
- Supported housing features (your domain)
- Compliance (your current phase)
- Person-centred design (your philosophy)
- Things that make your job at ivolve harder right now

### 5. Take Breaks
This is dense work. Do 30-45 minute focused sessions, then step away.

---

## Folder Structure for Outputs

Create this structure:

```
docs/
  sassha360-screenshots/       # All screenshots
    01-dashboard/
    02-properties/
    03-tenancies/
    04-maintenance/
    05-compliance/
    06-finance/
    07-people/
  SASSHA360_RESEARCH.md        # Main documentation file
  SASSHA360_DATA_MODELS.ts     # Extracted TypeScript interfaces
  SASSHA360_IMPLEMENTATION_PLAN.md  # What to build next based on research
```

---

## When You're Done

After completing SASSHA 360 documentation:

1. **Review with Claude Code (this CLI):**
   - Open this terminal
   - Ask Claude Code: "Review docs/SASSHA360_RESEARCH.md and create an implementation roadmap"

2. **Update TODO.md:**
   - Add new phases based on SASSHA learnings
   - Reprioritize existing tasks

3. **Create Feature Specs:**
   - For each P0/P1 feature from SASSHA, create a mini spec
   - Include: Purpose, Data Model, UI mockup, Acceptance Criteria

4. **Build Incrementally:**
   - Pick ONE feature from SASSHA to build first
   - Build it fully
   - Verify it works
   - Then pick the next one

---

## Quick Reference: Claude.ai Capabilities

When using Claude in Chrome, you CAN:
- ✅ Upload screenshots for analysis
- ✅ Have long conversations (200K context)
- ✅ Ask follow-up questions
- ✅ Request code generation (TypeScript interfaces, React components)
- ✅ Get design feedback
- ✅ Brainstorm implementation approaches

When using Claude in Chrome, you CANNOT:
- ❌ Read files from your computer directly (you must copy/paste)
- ❌ Make changes to your codebase (use Claude Code CLI for that)
- ❌ Run commands on your machine

---

## Integration with Claude Code CLI

**Claude in Chrome = Research & Planning Assistant**
- Analyze screenshots
- Draft documentation
- Design data models
- Brainstorm approaches

**Claude Code CLI (this terminal) = Implementation Assistant**
- Write actual code
- Edit files in Solas codebase
- Run commands
- Commit changes
- Execute plans

**Workflow:**
1. Use Claude in Chrome to document SASSHA
2. Bring learnings back to Claude Code CLI
3. Claude Code CLI implements features into Solas

---

*This guide created: 1 Feb 2026. Access SASSHA 360 while you can — demo access is time-limited!*
