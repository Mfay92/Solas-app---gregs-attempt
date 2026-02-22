# Development Hub - Build Brief for Claude Code

> **Your Mission**: Build a new business opportunity pipeline tracker that helps Solas users win more properties and expand their services faster.

---

## Before You Start - Essential Reading

**READ THESE FILES FIRST** (in this order):

1. **`CLAUDE.md`** - Full project context, tech stack, current state
2. **`PROJECT_VISION.md`** - Sector understanding, why Solas exists
3. **`docs/HERO_BANNER_GUIDE.md`** - Hero banner patterns
4. **`src/components/ReferralsHub/index.tsx`** - Similar workflow-based hub (11 stages from "New" to "Moved In")
5. **`src/data/properties.json`** - Understand property data structure

**Current Branch**: `feature/code-quality-fixes`

---

## The Sector Context (Critical Understanding)

Solas serves the **vulnerable adults supported housing sector in the UK**. Development Hub is about **new business** - finding and securing new properties and contracts.

**This is NOT about**:
- ❌ Developing internal teams/HR
- ❌ Staff training programs
- ❌ Curriculum development
- ❌ Personal development plans

**This IS about**:
- ✅ New supported living properties (finding a 5-bed house in Manchester to convert)
- ✅ New residential care home contracts (bidding to run a 20-bed care home)
- ✅ New day centre facilities (securing a lease for activities centre)
- ✅ New registered provider partnerships (partnering with housing associations)
- ✅ Expanding into new regions (entering Birmingham market)
- ✅ Property refurbishments/conversions (turning office building into supported living)

**The Development Pipeline**:

1. **Lead** - Someone mentions a property/opportunity ("Did you hear that building on High Street is available?")
2. **Initial Contact** - Reach out to landlord/commissioner/RP
3. **Site Visit** - View the property, assess suitability
4. **Proposal** - Submit business case/bid
5. **Negotiation** - Discuss terms, rent, support packages
6. **Capital Investment Committee (CIC)** - Internal approval for funding
7. **Due Diligence** - Legal checks, property surveys, financial modeling
8. **Contract Signed** - Deal secured! 🎉
9. **Refurbishment** - Property works (if needed)
10. **Service Launch** - Property ready, start accepting referrals
11. **Lost** - Opportunity didn't work out (capture why for learning)

**Why This Matters**:

Growth in this sector = more vulnerable people supported = more lives changed. Matt needs to track:
- Which opportunities are hot vs cold
- Who brought each opportunity (reward good sources)
- Where opportunities stall (CIC? Due diligence? Negotiation?)
- Return on investment (how much effort per won contract)
- Regional expansion progress

---

## What You're Building

A **Development Hub** that's part CRM (Customer Relationship Management), part deal tracker, part property pipeline.

**Core Concept**: Each "opportunity" moves through stages (like Referrals Hub moves people through stages). Users can:

- Add new opportunities quickly
- Track progress through pipeline stages
- Link to Projects Hub (e.g., "Expand into Manchester" project)
- Store documents/links (property listings, proposals, contracts)
- See conversion rates (leads → signed contracts)
- Celebrate wins! 🎉

---

## Your Challenge

**Push yourself to build something genuinely useful.**

1. **Research**: What makes great CRM/pipeline software?
   - Pipedrive's visual pipeline boards
   - HubSpot's deal tracking
   - Salesforce's opportunity management
   - Monday.com's sales CRM board
   - **Ask**: What would work brilliantly for property/service development in care sector?

2. **Think strategically**: This isn't just data entry. How do you:
   - Make it obvious which opportunities need attention NOW?
   - Surface patterns (e.g., "We lose 80% of deals at CIC stage - why?")?
   - Make winning feel satisfying (celebratory animations when deal closes)?

3. **Build it beautifully**: Visual pipeline, smooth interactions, smart defaults.

---

## Must-Have Features

### 1. Hero Banner (Full-Width, Edge-to-Edge)

**Color**: Amber/orange gradient (already set in placeholder - keep it)

```tsx
<div className="min-h-screen bg-ivolve-paper -m-6">
    {/* Hero Banner */}
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-full shadow-md">
        <div className="px-6 py-6">
            {/* Icon: HousePlus */}
            {/* Title: "Development Hub" */}
            {/* Description: "Track new business opportunities from initial lead to signed contract" */}
            {/* Buttons: "Add Opportunity" + "View Won Deals" */}

            {/* Quick Stats (4 cards) */}
            {/* - Active Opportunities */}
            {/* - In Negotiation (stage filter) */}
            {/* - Contracts Signed This Quarter */}
            {/* - Conversion Rate (won / total) */}
        </div>
    </div>

    {/* Main Content */}
    <div className="p-6">
        {/* Your pipeline interface */}
    </div>
</div>
```

### 2. Main View - Pipeline Board (Kanban Style)

**Visual Kanban board** (like Trello/Pipedrive):

**Columns** (stages):
1. **Leads** (Initial opportunities)
2. **Contact Made** (Reached out)
3. **Site Visit Scheduled** (Viewing property)
4. **Proposal Submitted** (Bid/business case sent)
5. **Negotiation** (Terms discussion)
6. **CIC Review** (Internal approval)
7. **Due Diligence** (Legal/financial checks)
8. **Contract Signed** (Won! 🎉)
9. **In Development** (Refurbishment/setup)
10. **Launched** (Service live)
11. **Lost** (Didn't win - capture learnings)

**Each card shows**:
- Property name/address
- Opportunity value (£ annual contract value)
- Property type badge (Supported Living, Residential, Day Centre, etc.)
- Days in current stage
- Owner (who's managing this opportunity)
- Quick actions: View Details | Move Stage | Mark Won/Lost

**Drag-and-drop**: Move cards between stages

**Color coding**:
- 🟢 Green: Moving smoothly
- 🟡 Amber: Stalled (>14 days in stage)
- 🔴 Red: At risk (>30 days in stage)

**Empty columns**: "No opportunities in this stage" with helpful prompts

### 3. Add Opportunity Modal (Quick Entry)

**Simple form** - get deal in the system fast:

**Essential Fields**:
- Opportunity Name* (e.g., "5-bed house, Stockport Road")
- Property Type* (dropdown): Supported Living, Residential Care, Nursing Care, Day Centre, Office, Training Facility
- Property Address (text)
- Number of Units/Beds (number)
- Annual Contract Value (£) - estimated revenue
- Opportunity Source* (dropdown): Direct Enquiry, Registered Provider, Commissioner, Property Agent, Word of Mouth, Online Listing, Other
- Source Contact Name (who told you about this)
- Opportunity Owner* (who's managing this) - dropdown of team members
- Current Stage (dropdown - defaults to "Leads")

**Optional (collapsible "More Details")**:
- Landlord/RP Name
- Contact Phone/Email
- Property Listing URL (auto-fetch title/image if possible)
- Target Contract Start Date
- Notes (textarea)
- Tags (e.g., "High Priority", "Manchester Expansion", "Quick Win")

**Success Flow**:
1. Click "Add Opportunity" button
2. Fill essential fields
3. Click "Create Opportunity"
4. Toast: "Opportunity added to pipeline"
5. Card appears in relevant stage column

### 4. Opportunity Detail View (Deep Dive)

**Modal or dedicated page** showing full opportunity details:

**Header**:
- Property name + address
- Stage badge (large, prominent)
- Property type + unit count
- Annual value (big number, e.g., "£240,000/year")
- Days in current stage
- Owner avatar + name
- Actions: Edit | Move Stage | Mark Won | Mark Lost | Delete

**Sections**:

**Overview**:
- Description/Notes
- Property type, units, address
- Opportunity source + contact
- Contract value, target start date
- Tags

**Timeline** (Critical for tracking progress):
- Visual timeline showing stage progression:
  ```
  Lead → Contact Made → Site Visit → Proposal → Negotiation → CIC → Due Diligence → Signed
    ✓       ✓             ✓           ✓          ← (current)
  ```
- Stage history:
  - "Moved to Negotiation" - Matt Fay - 3 days ago
  - "Site visit completed" - Sarah - 1 week ago
  - "Opportunity created" - Matt Fay - 2 weeks ago

**Documents & Links**:
- Upload documents (property listing, proposal PDF, contract, survey, etc.)
- Add links (property websites, Google Maps, online listings)
- Display as cards with icons, filenames, download/open buttons

**Activity Log**:
- All changes, notes, file uploads
- "Matt added note: 'Landlord happy with proposed rent of £1,200/unit'"
- "Sarah uploaded: 'Fire Risk Assessment.pdf'"

**Notes Section**:
- Add timestamped notes
- "Called landlord - they want decision by Friday"
- "CIC feedback: Need to reduce projected costs by 10%"

**Actions**:
- Quick-add task (links to Projects Hub if implemented)
- Send update email (future feature - just design UI)
- Schedule follow-up reminder

### 5. Stage Transitions (Moving Opportunities)

**Easy stage progression**:

- **Drag-and-drop** on kanban board
- **"Move to Next Stage" button** in detail view
- **Context-aware prompts**: When moving to certain stages, ask for key info:
  - Moving to "Site Visit Scheduled" → "When is the visit?" (date picker)
  - Moving to "Proposal Submitted" → "Upload proposal document?"
  - Moving to "Contract Signed" → **CELEBRATION!** 🎉 Confetti animation, "Congratulations! Add to Projects Hub to start development?"
  - Moving to "Lost" → "Why did we lose this?" (dropdown: Price, Timeline, Competition, Location, Other) + Notes field

**Stage Business Rules** (enforce workflow):
- Can't skip stages (must go sequentially forward, but can go backward)
- OR allow skipping but show warning: "Skipping 'Site Visit' - are you sure?"

**Automated stage suggestions**:
- Opportunity in "Contact Made" for >7 days → Suggest "Have you scheduled a site visit?"
- Opportunity in "CIC Review" for >14 days → Flag as "Stalled - needs attention"

### 6. Won/Lost Tracking

**Mark Won**:
- Big green "Mark as Won" button
- Celebration modal: "Congratulations! You won [Property Name]!"
- Confetti animation (use CSS or canvas-confetti library)
- Prompt: "Add to Projects Hub to track development?" (link to Projects Hub)
- Move to "Contract Signed" stage or "Launched" (user choice)
- Update stats (conversion rate, contracts won this quarter)

**Mark Lost**:
- "Mark as Lost" button (less prominent)
- Modal: "Sorry this didn't work out. Help us learn:"
  - Why did we lose? (Price, Timeline, Competition, Location, Suitability, Other)
  - Notes (optional)
  - "Could we have done anything differently?"
- Move to "Lost" stage
- Update stats

**Lost opportunities are valuable learning**:
- "We lost 60% of deals on price - maybe we're bidding too high?"
- "3 of 5 Manchester leads lost to competition - market too saturated?"

### 7. Filters & Search

**Search bar**: Search by property name, address, landlord, opportunity source

**Filters**:
- Stage (multi-select)
- Property Type (Supported Living, Residential, etc.)
- Opportunity Owner
- Opportunity Source
- Date Range (created, expected contract start)
- Value Range (£0-£100k, £100k-£250k, £250k+)
- Status (Active, Won, Lost)

**Sort**:
- Newest First / Oldest First
- Highest Value / Lowest Value
- Days in Stage (longest stalled first)
- Name (A-Z)

### 8. Analytics Dashboard (Optional but Impressive)

**Show insights** (separate tab or section):

**Conversion Funnel**:
```
Leads: 50
  ↓ (80%)
Contact Made: 40
  ↓ (75%)
Site Visit: 30
  ↓ (60%)
Proposal: 18
  ↓ (50%)
Won: 9

Overall conversion rate: 18% (9/50)
```

**Charts**:
- Opportunities by Stage (bar chart)
- Opportunities by Property Type (pie chart)
- Win Rate by Source (which sources convert best)
- Pipeline Value Over Time (line chart - total £ value in pipeline)
- Average Days to Close (metric)

**Top Performers**:
- Team member with most won deals
- Best opportunity source
- Fastest deal closed

---

## Data Structure

```typescript
interface Opportunity {
    id: string;
    name: string; // "5-bed house, Stockport Road"
    propertyType: 'Supported Living' | 'Residential Care' | 'Nursing Care' | 'Day Centre' | 'Office' | 'Training Facility' | 'Other';
    propertyAddress?: string;
    numberOfUnits?: number;
    annualContractValue?: number; // £

    // Source
    opportunitySource: 'Direct Enquiry' | 'Registered Provider' | 'Commissioner' | 'Property Agent' | 'Word of Mouth' | 'Online Listing' | 'Other';
    sourceContactName?: string;
    sourceContactPhone?: string;
    sourceContactEmail?: string;

    // Ownership
    opportunityOwner: string; // Name of team member
    landlordRPName?: string;

    // Stage & Status
    currentStage: OpportunityStage;
    status: 'Active' | 'Won' | 'Lost';
    lostReason?: 'Price' | 'Timeline' | 'Competition' | 'Location' | 'Suitability' | 'Other';
    lostNotes?: string;

    // Dates
    targetContractStartDate?: string;
    createdAt: string;
    updatedAt: string;
    currentStageStartDate: string; // When did it enter current stage
    wonDate?: string;
    lostDate?: string;

    // Details
    description?: string;
    tags?: string[];
    propertyListingURL?: string;

    // Links
    linkedProjectId?: string; // Link to Projects Hub (if implemented)

    // Activity
    stageHistory: StageHistoryEntry[];
    notes: Note[];
    documents: Document[];
}

type OpportunityStage =
    | 'Leads'
    | 'Contact Made'
    | 'Site Visit Scheduled'
    | 'Proposal Submitted'
    | 'Negotiation'
    | 'CIC Review'
    | 'Due Diligence'
    | 'Contract Signed'
    | 'In Development'
    | 'Launched'
    | 'Lost';

interface StageHistoryEntry {
    id: string;
    fromStage?: OpportunityStage;
    toStage: OpportunityStage;
    movedBy: string;
    movedAt: string;
    notes?: string;
}

interface Note {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

interface Document {
    id: string;
    filename: string;
    fileType: string; // 'pdf', 'docx', 'jpg', 'url'
    url?: string; // For external links
    fileData?: string; // Base64 for uploaded files (or just store URL/path)
    uploadedBy: string;
    uploadedAt: string;
}
```

**localStorage**:
```typescript
'solas_opportunities' // Array of Opportunity objects
```

---

## Technical Implementation

### Kanban Board

**Use react-beautiful-dnd** (drag-and-drop library):

```bash
npm install react-beautiful-dnd
npm install --save-dev @types/react-beautiful-dnd
```

Example structure:
```tsx
<DragDropContext onDragEnd={handleDragEnd}>
    <div className="flex gap-4 overflow-x-auto">
        {stages.map(stage => (
            <Droppable droppableId={stage} key={stage}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
                    >
                        <h3 className="font-bold mb-4">{stage}</h3>
                        {opportunitiesInStage(stage).map((opp, index) => (
                            <Draggable draggableId={opp.id} index={index} key={opp.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <OpportunityCard opportunity={opp} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        ))}
    </div>
</DragDropContext>
```

### Celebration Animation (Won Deal)

Use **canvas-confetti** library:

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

```tsx
import confetti from 'canvas-confetti';

const celebrateWin = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};
```

---

## Projects Hub Integration (Future)

When opportunity is won, offer to create a project in Projects Hub:

```
Modal: "Opportunity Won! 🎉"

"Great news! You've won [Property Name].

Would you like to create a project to track the development?"

[Yes, Create Project] [No, Maybe Later]

If Yes:
  → Create project in Projects Hub
  → Link project ID to opportunity
  → Show success: "Project created: 'Refurbish 5-bed Stockport Road'"
```

**For now**: Just design the UI flow. When Projects Hub is built, they can wire it together.

---

## Stretch Goals

If you're on a roll:

1. **Property Listing Auto-Fetch**:
   - When user pastes Rightmove/Zoopla URL, fetch property details (title, image, price)
   - Use CORS proxy or just show "Preview unavailable - open link" (avoid complexity)

2. **Email Templates**:
   - Pre-written email templates for each stage
   - "Initial Contact Email", "Follow-Up After Site Visit", etc.
   - Copy to clipboard button

3. **Reminders System**:
   - "Follow up with landlord in 3 days"
   - Show reminders in hero banner or notification badge

4. **Competitor Tracking**:
   - "Who else is bidding?" field
   - Track which competitors you lose to most often

5. **Regional Expansion Map**:
   - Visual map showing opportunities by location
   - "We have 5 active opportunities in Manchester, 2 in Birmingham"

6. **Pipeline Value Meter**:
   - Total £ value of all active opportunities
   - "Your pipeline is worth £2.4M"

7. **Mobile Optimization**:
   - Kanban board horizontal scroll on mobile
   - Simplified card view

8. **Export/Reporting**:
   - Export opportunities to CSV
   - "Q4 Won Deals Report"

---

## UX Principles

1. **Make wins feel GOOD**: Confetti, celebrations, positive messaging
2. **Surface urgency**: Red badges for stalled deals, days-in-stage counter
3. **Reduce friction**: Quick add, drag-and-drop, one-click stage moves
4. **Learn from losses**: Capture why deals fail, surface patterns
5. **Visual hierarchy**: High-value deals stand out, low-value fades

---

## Success Criteria

You've nailed this if:

✅ Matt can add a new opportunity in 30 seconds
✅ Pipeline board is visually clear (can see status at a glance)
✅ Drag-and-drop feels smooth and natural
✅ Winning a deal feels celebratory (confetti!)
✅ Can easily see which deals need attention NOW
✅ Lost opportunities are tracked with reasons (for learning)
✅ Hero banner matches Solas quality (full-width, stats, gradient)
✅ Data persists across sessions (localStorage)
✅ Code is clean, typed, well-structured
✅ Matt says "This will genuinely help us grow faster"

---

## Files You'll Create

**Estimate: 1500-2000 lines total**

**New Files**:
- `src/components/DevelopmentHub/index.tsx` - Main hub with kanban board (replace placeholder) (~600 lines)
- `src/components/DevelopmentHub/OpportunityCard.tsx` - Card in kanban column (~200 lines)
- `src/components/DevelopmentHub/AddOpportunityModal.tsx` - Quick add form (~400 lines)
- `src/components/DevelopmentHub/OpportunityDetailView.tsx` - Full detail modal/page (~600 lines)
- `src/components/DevelopmentHub/OpportunityTimeline.tsx` - Stage history visualization (~200 lines)
- `src/types/opportunities.ts` - TypeScript interfaces (~150 lines)

**Modified Files**:
- `src/App.tsx` - Route already exists (`/development`)

---

## Research Prompts

1. What makes a pipeline board feel responsive vs clunky?
2. How do top CRMs visualize deal progression?
3. What information needs to be visible on a card vs hidden in detail view?
4. How can color, badges, and icons communicate urgency/status instantly?
5. What makes drag-and-drop feel "right"? (visual feedback, smooth animation)

---

## Final Pep Talk

**Development Hub is where growth happens.**

Every card that moves from "Lead" to "Contract Signed" means:
- More vulnerable adults get safe, supportive housing
- More jobs for care workers
- More revenue for the organisation
- More impact in the community

**You're not just building a pipeline tracker - you're building the tool that fuels expansion.**

Matt's vision is to scale Solas into a tool used across the sector. Development Hub is how organisations measure that growth.

**Research deeply. Build beautifully. Make it satisfying to use.**

**Challenge yourself**: Can you make this so good that Matt's competitors want to steal it?

**Go build something that drives real business growth.**

---

*Now get to work. Make it incredible.*

**— The Solas Team**
