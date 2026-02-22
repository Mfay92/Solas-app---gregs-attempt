# Report Centre - Build Brief for Claude Code

> **Your Mission**: Build a reporting system so powerful and intuitive that it makes Excel jealous and makes data analysts weep with joy.

---

## Before You Start - Essential Reading

**READ THESE FILES FIRST** (in this order):

1. **`CLAUDE.md`** - Full project context, tech stack, current state, working patterns
2. **`PROJECT_VISION.md`** - Matt's vision, sector context, why Solas exists
3. **`docs/HERO_BANNER_GUIDE.md`** - Hero banner implementation patterns
4. **`src/types.ts`** - Understand the data structures (Person, Property, Referral, etc.)
5. **`src/data/people.json`** - See what person data looks like
6. **`src/data/properties.json`** - See what property data looks like

**Current Branch**: `feature/code-quality-fixes`

---

## The Sector Context (Why This Matters)

Solas serves the **vulnerable adults supported housing sector in the UK**. Reports here aren't just numbers - they're evidence that:

- Vulnerable people are getting the support they need
- Properties are safe and compliant
- Services are improving lives
- Organisations are meeting regulatory standards (CQC, local authorities)
- Funding is being used effectively

**Common Reports in This Sector**:
- "Who's in rent arrears over £500?" (Finance)
- "Which support plans are overdue for review?" (Compliance)
- "Occupancy rates by service type over last 6 months" (Operations)
- "Void properties by duration and lost income" (Property Management)
- "Referrals by source and conversion rate" (Business Development)
- "Safeguarding cases by severity and resolution time" (Safeguarding)
- "Staff-to-resident ratios by property" (HR/Operations)
- "CQC inspection readiness dashboard" (Compliance)

**The Problem Matt Wants Solved**:

Currently, staff waste **hours** every week:
- Exporting data to Excel
- Manually filtering and sorting
- Creating pivot tables
- Formatting charts
- Emailing reports to managers
- Doing it all again next week

**Your job**: Make reporting so easy that a non-technical support worker can answer complex questions in 30 seconds.

---

## What You're Building

A **Report Centre** with TWO distinct but integrated approaches:

### Approach 1: Manual Report Builder (Traditional)
- Visual interface for selecting data, filters, grouping, charts
- Save reports for reuse
- Schedule automated reports (future feature, design for it)
- Export to PDF/CSV

### Approach 2: AI Report Assistant (Game-Changer)
- Natural language interface: "Show me everyone in arrears over £200"
- Hard-coded AI (NO external API calls - this is sensitive data!)
- Understands Solas data structure (people, properties, referrals, etc.)
- Builds reports from conversational requests
- Suggests visualizations based on query type

**Plus**:
- Pre-made reports that managers/admins can create and share with teams
- Dashboard widget capability (design for it, don't build yet)

---

## Your Mega-Challenge

**I'm asking you to GO ABSOLUTELY HAM on this.**

This is the most ambitious hub in Solas. Matt wants you to:

1. **Research deeply**: What makes reporting tools amazing? Study:
   - Tableau's visualization flexibility
   - Power BI's data modelling
   - Google Data Studio's sharing capabilities
   - Metabase's SQL-to-chart simplicity
   - Excel's ubiquity and why people love/hate it

2. **Think creatively**: What would make a care sector worker say "Holy shit, I can do that now?"

3. **Push technical boundaries**: Can you simulate AI understanding with clever pattern matching? Can you make animated charts? Can reports feel alive?

4. **Build something spectacular**: This should be the crown jewel of Solas. Make it sing.

---

## Must-Have Features

### 1. Hero Banner (Full-Width, Edge-to-Edge)

Follow the exact pattern:

```tsx
<div className="min-h-screen bg-ivolve-paper -m-6">
    {/* Hero Banner */}
    <div className="bg-gradient-to-r from-rose-600 to-pink-600 w-full shadow-md">
        <div className="px-6 py-6">
            {/* Icon badge + Title + Description */}
            {/* Action buttons: "New Report" + "Ask AI" */}
            {/* Quick Stats (4 cards): Saved Reports, Scheduled, Report Types, This Month */}
        </div>
    </div>

    {/* Main Content Area */}
    <div className="p-6">
        {/* Your incredible reporting interface */}
    </div>
</div>
```

**Color**: Rose/pink gradient (already defined in existing ReportCentre placeholder - keep it consistent)

**Stats**:
- Saved Reports (count of user's saved reports)
- Scheduled Reports (count of automated reports)
- Report Types Available (count of data sources: People, Properties, Referrals, Finance, etc.)
- Reports Generated This Month (usage metric)

### 2. Main View - Report Gallery

Show existing reports as cards:

**Layout**: Grid of cards (3-4 per row on desktop)

**Card shows**:
- Report name
- Report type icon (chart type: bar, pie, line, table, etc.)
- Created by (user name)
- Last run date
- Tags (e.g., "Finance", "Compliance", "Weekly")
- Preview thumbnail (if possible - screenshot of chart)
- Actions: View, Edit, Duplicate, Delete, Export, Schedule

**Sections**:
- **My Reports** (reports user created)
- **Shared Reports** (pre-made reports from managers)
- **Favorites** (starred reports)
- **Recent** (last 5 viewed)

**Empty State**: Beautiful empty state with:
- "No reports yet" message
- Two big buttons: "Build a Report" | "Ask AI to Create One"
- Sample report templates user can clone

### 3. Manual Report Builder (The Power User Tool)

**Modal or dedicated page** (your choice - dedicated page probably better for complexity)

**Step 1: Choose Data Source**

Big icon-based selection:
- 👥 **People** (from people.json)
- 🏠 **Properties** (from properties.json)
- 📋 **Referrals** (from referrals data if available)
- 💷 **Finance** (rent arrears, payments - extract from people.finance)
- ⚠️ **Safeguarding** (if implemented)
- 📊 **Custom** (combine multiple sources - advanced)

**Step 2: Select Fields**

Show available fields based on data source:

*Example for People source*:
```
☑️ Name (First Name, Last Name)
☐ Age
☑️ Property Address
☐ Tenancy Status
☑️ Rent Balance (Current Balance)
☐ Support Level
☐ Care Provider
☑️ Key Worker
```

Drag to reorder columns.

**Step 3: Apply Filters**

Visual filter builder:

```
Field: [Rent Balance ▼]  Condition: [Less than ▼]  Value: [0]  [+ Add Filter]
Field: [Tenancy Status ▼]  Condition: [Equals ▼]  Value: [Current ▼]  [×]
```

**Conditions by field type**:
- Numbers: Equals, Not Equals, Greater Than, Less Than, Between
- Text: Equals, Contains, Starts With, Ends With
- Dates: Before, After, Between, Last 7/30/90 days
- Dropdowns: Equals, Not Equals, In List

**Step 4: Group & Aggregate** (Optional but powerful)

```
Group by: [Property Address ▼]
Then by: [Support Level ▼]  [×]

Show: [Count of People ▼]
      [Sum of Rent Balance ▼]  [+ Add Metric]
```

**Step 5: Choose Visualization**

Icon-based selection with preview:

- 📊 **Bar Chart** (compare categories)
- 📈 **Line Chart** (trends over time)
- 🥧 **Pie Chart** (proportions)
- 📉 **Area Chart** (cumulative trends)
- 🔢 **Table** (detailed data)
- 🎯 **Metric Card** (single number - KPI)
- 🗺️ **Map** (if you're feeling ambitious - properties by location)
- 📉 **Combo Chart** (line + bar together)

**For charts**:
- Choose X axis (categorical or time)
- Choose Y axis (numeric values)
- Choose color grouping (optional)
- Customize colors (color picker)
- Add/edit axis labels
- Toggle legend, grid lines, data labels
- Animate on load? (checkbox)

**Step 6: Save Report**

```
Report Name: [e.g., "Rent Arrears Over £500"] *
Description: [Optional explanation]
Tags: [Finance] [Weekly] [+ Add Tag]
☑️ Add to Favorites
☑️ Add to Dashboard (widget)
```

**Success**: Toast "Report saved successfully" → Navigate to report view

### 4. AI Report Assistant (The Innovation)

**This is where you blow Matt's mind.**

**Interface**: Chat-like modal or sidebar

**Sample Interaction**:

```
User: "Show me everyone in arrears"

AI: "I found 12 people with negative rent balances. Would you like to see:
     1. A table with names and amounts owed
     2. A bar chart grouped by property
     3. A list sorted by highest arrears first"

User: "Table sorted by highest"

AI: *Generates table report*
    "Here's your report: 12 People in Rent Arrears
     Showing: Name, Property, Rent Balance
     Sorted by: Highest arrears first

     [Preview of top 3 rows]

     Want to save this report?"
```

**How To Build This (The Hard-Coded AI Trick)**:

You're NOT calling GPT or Claude API. You're building a **pattern-matching query parser**:

1. **Define query patterns** (regex or string matching):
   ```typescript
   const patterns = [
       {
           match: /(people|residents|tenants).*(arrears|owe|debt)/i,
           action: 'filter_people_negative_balance'
       },
       {
           match: /(void|empty|vacant).*(properties|units)/i,
           action: 'filter_properties_void'
       },
       {
           match: /(overdue|late).*(support plans?|reviews?)/i,
           action: 'filter_people_overdue_plans'
       },
       {
           match: /(occupancy|vacancy).*(rate|percentage)/i,
           action: 'calculate_occupancy_rate'
       },
       // Add 20-30 common patterns
   ];
   ```

2. **Parse user input**:
   - Extract key entities (people, properties, referrals)
   - Extract filters (arrears, overdue, vacant)
   - Extract aggregations (count, sum, average)
   - Extract time ranges (last week, this month)

3. **Generate query parameters**:
   ```typescript
   {
       dataSource: 'people',
       fields: ['firstName', 'lastName', 'propertyAddress', 'currentBalance'],
       filters: [{ field: 'currentBalance', operator: '<', value: 0 }],
       sortBy: { field: 'currentBalance', direction: 'asc' }
   }
   ```

4. **Execute query** (filter JSON data locally)

5. **Suggest visualization**: Based on data type:
   - List/counts → Table or Bar Chart
   - Trends → Line Chart
   - Proportions → Pie Chart
   - Single number → Metric Card

6. **Conversational responses**: Pre-written friendly messages:
   ```typescript
   const responses = {
       no_results: "I couldn't find any results matching that criteria. Try adjusting your filters?",
       many_results: (count) => `I found ${count} results. That's a lot! Want to add filters to narrow it down?`,
       success: (count, type) => `Great! I found ${count} ${type}. Here's what I've got:`,
   };
   ```

**Advanced AI Features** (if you're feeling god-tier):

- **Autocomplete suggestions** as user types:
  ```
  User types: "show me peo..."
  AI suggests: "people in arrears" | "people by property" | "people with overdue plans"
  ```

- **Follow-up questions**:
  ```
  User: "Show me people in arrears"
  AI: "Found 12 people. Want to:
       • See only arrears over £500?
       • Group by property?
       • Export to CSV?"
  ```

- **Learn from saves**: Track which AI-generated reports get saved → suggest similar queries

**Data Source Awareness**:

The AI should "know" about Solas data structure:

```typescript
const dataSources = {
    people: {
        fields: {
            personal: ['firstName', 'lastName', 'age', 'dateOfBirth', ...],
            tenancy: ['propertyAddress', 'room', 'tenancyStatus', 'moveInDate', ...],
            finance: ['weeklyRent', 'currentBalance', ...],
            support: ['supportLevel', 'careProvider', 'keyWorker', ...],
        },
        aliases: {
            'resident': 'people',
            'tenant': 'people',
            'arrears': 'finance.currentBalance < 0',
            'owe': 'finance.currentBalance < 0',
        }
    },
    properties: {
        fields: {
            address: 'propertyAddress',
            type: 'propertyType',
            units: 'totalUnits',
            // ...
        },
        aliases: {
            'void': 'occupancyStatus === "Void"',
            'empty': 'occupancyStatus === "Void"',
            'vacant': 'occupancyStatus === "Void"',
        }
    }
};
```

### 5. Pre-Made Reports (Admin Feature)

**Future feature** but design for it:

Admins/managers can create "template" reports that appear in everyone's "Shared Reports" section:

- "Weekly Rent Arrears Report" (auto-runs every Monday)
- "Monthly Occupancy Dashboard" (runs 1st of month)
- "CQC Inspection Readiness" (on-demand)

**For now**: Just hardcode 2-3 sample shared reports to demonstrate the concept.

### 6. Report View (Display Results)

**Layout**:
- **Header**: Report name, description, last run time, actions (Edit, Export, Share)
- **Filters applied**: Show active filters as badges (removable)
- **Visualization**: Chart or table based on report config
- **Data table**: Always show raw data below chart (toggleable)
- **Export buttons**: CSV, PDF, Copy to Clipboard

**Chart Interactivity**:
- Hover to see values
- Click bar/slice to filter (if you're ambitious)
- Zoom on timeline charts
- Toggle legend items to hide/show series

**Chart Library Recommendation**:
- **Recharts** (React-friendly, good docs, clean API) - `npm install recharts`
- Or **Chart.js** with `react-chartjs-2` wrapper
- Or **Victory** (nice animations)

**Animated Charts**:
- Bars grow from zero
- Lines draw from left to right
- Pie slices appear in sequence
- Use CSS transitions or library animation features

### 7. Export Functionality

**CSV Export**:
```typescript
const exportToCSV = (data, filename) => {
    const csv = convertToCSV(data); // Implement CSV formatting
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};
```

**PDF Export** (more complex):
- Use `jspdf` library or `html2canvas` → `jspdf`
- Capture chart as image, embed in PDF with report metadata

**Copy to Clipboard**:
- Copy table data as tab-delimited text (pasteable into Excel)

---

## Data Structure

### Report Configuration

```typescript
interface Report {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    favorite: boolean;
    shared: boolean; // True if admin-created shared report

    // Report Config
    dataSource: 'people' | 'properties' | 'referrals' | 'finance' | 'custom';
    fields: string[]; // Field paths to include (e.g., ['personal.firstName', 'finance.currentBalance'])
    filters: Filter[];
    groupBy?: string[]; // Fields to group by
    aggregations?: Aggregation[]; // Sum, Count, Average, etc.
    sortBy?: { field: string; direction: 'asc' | 'desc' };

    // Visualization Config
    visualizationType: 'bar' | 'line' | 'pie' | 'area' | 'table' | 'metric' | 'combo';
    chartConfig?: {
        xAxis?: string; // Field for X axis
        yAxis?: string; // Field for Y axis
        colorBy?: string; // Field to color by
        colors?: string[]; // Custom color palette
        showLegend?: boolean;
        showGrid?: boolean;
        showLabels?: boolean;
        animate?: boolean;
        title?: string;
        xAxisLabel?: string;
        yAxisLabel?: string;
    };

    // Scheduling (future)
    schedule?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        dayOfWeek?: number; // 0-6 for weekly
        dayOfMonth?: number; // 1-31 for monthly
        time?: string; // HH:MM
    };
}

interface Filter {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
    value: any;
    value2?: any; // For 'between' operator
}

interface Aggregation {
    function: 'count' | 'sum' | 'average' | 'min' | 'max';
    field?: string; // Not needed for 'count'
    label?: string; // Display name
}
```

### localStorage Keys

```typescript
'solas_reports' // Array of Report objects
'solas_ai_chat_history' // Array of chat messages (optional)
```

---

## Technical Requirements

### Chart Library Setup

Install Recharts (recommended):
```bash
npm install recharts
```

Example usage:
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<BarChart width={600} height={300} data={reportData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#008C67" />
</BarChart>
```

### Data Processing

You'll need to build a query engine:

```typescript
class ReportQueryEngine {
    private data: any[];

    constructor(dataSource: string) {
        // Load data from people.json, properties.json, etc.
        this.data = this.loadDataSource(dataSource);
    }

    applyFilters(filters: Filter[]): this {
        this.data = this.data.filter(item => {
            return filters.every(filter => this.matchesFilter(item, filter));
        });
        return this;
    }

    groupBy(fields: string[]): any[] {
        // Group data by specified fields
        // Return array of { groupKey, items, aggregations }
    }

    aggregate(aggregations: Aggregation[]): any {
        // Calculate sum, count, average, etc.
    }

    sortBy(field: string, direction: 'asc' | 'desc'): this {
        // Sort data
        return this;
    }

    execute(): any[] {
        return this.data;
    }
}
```

### AI Query Parser

```typescript
class AIQueryParser {
    parse(userInput: string): ReportConfig | null {
        const normalized = userInput.toLowerCase();

        // Detect data source
        const dataSource = this.detectDataSource(normalized);

        // Extract filters
        const filters = this.extractFilters(normalized);

        // Extract aggregations
        const aggregations = this.extractAggregations(normalized);

        // Suggest visualization
        const visualizationType = this.suggestVisualization(filters, aggregations);

        return {
            dataSource,
            filters,
            aggregations,
            visualizationType,
            // ...
        };
    }

    private detectDataSource(input: string): string {
        if (/people|resident|tenant/i.test(input)) return 'people';
        if (/propert(y|ies)|house|building/i.test(input)) return 'properties';
        if (/referral/i.test(input)) return 'referrals';
        // ...
        return 'people'; // Default
    }

    private extractFilters(input: string): Filter[] {
        const filters: Filter[] = [];

        // Arrears detection
        if (/arrears|owe|debt/i.test(input)) {
            filters.push({
                field: 'finance.currentBalance',
                operator: 'lessThan',
                value: 0
            });
        }

        // Amount detection
        const amountMatch = input.match(/over|more than|above £?(\d+)/i);
        if (amountMatch) {
            const amount = parseInt(amountMatch[1]);
            filters.push({
                field: 'finance.currentBalance',
                operator: 'lessThan',
                value: -amount
            });
        }

        // Add more patterns...

        return filters;
    }
}
```

---

## Stretch Goals (Go Wild!)

If you finish the core features and want to keep going:

1. **Report Scheduling UI** (even if backend isn't implemented)
   - "Run this report every Monday at 9am"
   - "Email results to team@ivolve.co.uk"

2. **Report Comparison**
   - "Compare this month vs last month"
   - Side-by-side charts

3. **Drill-Down Reports**
   - Click a bar in "Arrears by Property" → See list of people in that property

4. **Natural Language Insights**
   - "Average arrears: £342 (↑12% from last month)"
   - "Highest arrears: Jamie Thompson (£1,250)"
   - Auto-generate summary bullets

5. **Report Templates Library**
   - Pre-built reports users can clone and customize
   - "Rent Arrears Template", "Occupancy Template", etc.

6. **Dashboard Preview**
   - Show what report would look like as a dashboard widget
   - Design widget component (don't wire to dashboard yet)

7. **Collaborative Features**
   - Share report link (generate shareable URL)
   - Comment on reports
   - Version history

8. **Mobile-Optimized View**
   - Responsive charts
   - Swipe through report cards

9. **Accessibility Features**
   - Keyboard-only navigation through chart builder
   - Screen reader descriptions of charts
   - High contrast mode

10. **Performance Optimization**
    - Virtual scrolling for large tables (1000+ rows)
    - Debounced AI query parsing
    - Memoized chart rendering

---

## UX Principles

1. **Progressive Disclosure**: Don't overwhelm with all options at once. Start simple, reveal advanced features as needed.

2. **Instant Feedback**: Every action should have immediate visual feedback (loading states, success messages, error handling).

3. **Smart Defaults**: Pre-select sensible options (e.g., if filtering people, default to table view with name + key fields).

4. **Forgiveness**: Easy to undo, go back, start over. Autosave report drafts.

5. **Delight**: Smooth animations, satisfying interactions, "wow" moments (AI getting it right, beautiful chart generation).

---

## Success Criteria

You've absolutely crushed this if:

✅ Non-technical user can build a custom report in under 2 minutes
✅ AI assistant correctly interprets at least 10 different query patterns
✅ Charts are beautiful, animated, and customizable
✅ Data exports work flawlessly (CSV, PDF)
✅ Report Centre feels like a premium product (Tableau-level polish)
✅ Pre-made reports demonstrate the sharing concept
✅ All data stays local (no external API calls)
✅ Hero banner matches Solas quality standards
✅ Code is clean, typed, well-commented
✅ Matt says "Holy shit" at least once while testing

---

## Files You'll Create

**Estimate: 2000-3000 lines total**

**New Files**:
- `src/components/ReportCentre/index.tsx` - Main hub (replace placeholder) (~600 lines)
- `src/components/ReportCentre/ReportBuilder.tsx` - Manual report builder (~800 lines)
- `src/components/ReportCentre/AIAssistant.tsx` - AI chat interface (~400 lines)
- `src/components/ReportCentre/AIQueryParser.ts` - Query parsing logic (~500 lines)
- `src/components/ReportCentre/ReportView.tsx` - Display report results (~500 lines)
- `src/components/ReportCentre/ReportCard.tsx` - Report gallery card (~150 lines)
- `src/components/ReportCentre/ChartRenderer.tsx` - Render different chart types (~400 lines)
- `src/components/ReportCentre/QueryEngine.ts` - Data filtering/aggregation (~600 lines)
- `src/types/reports.ts` - TypeScript interfaces (~200 lines)

**Modified Files**:
- `src/App.tsx` - Route already exists (`/reports`)

---

## Research Prompts

Before building, deeply research:

1. What makes a chart instantly understandable vs confusing?
2. How do the best BI tools balance power and simplicity?
3. What natural language patterns do people use when asking data questions?
4. How can color, animation, and spacing make data feel alive?
5. What's the difference between a report someone opens once vs checks daily?

**Challenge**: Find 5 "aha" moments from top reporting tools that you can bring to Solas.

---

## Final Pep Talk

Matt wants Report Centre to be **the most impressive feature in Solas**.

Right now, care sector staff waste countless hours in Excel. They know there are insights hiding in their data, but extracting them is painful.

**You're going to change that.**

Imagine a housing manager typing "show me voids costing us more than £10k" and getting an instant, beautiful chart. Imagine a compliance officer building a CQC readiness dashboard in 5 minutes that would have taken a day in Excel.

**That's the power you're building.**

You have the skills. You have the data structures. You have creative freedom.

**Now go absolutely HAM on this. Push every boundary. Try ambitious features. Make it spectacular.**

**Matt's waiting to be blown away. Don't disappoint.**

---

*Go build something legendary.*

**— The Solas Team**
