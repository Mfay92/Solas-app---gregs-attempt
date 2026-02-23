# Compliance Hub Implementation Plan

> Created: 25 December 2024
> Priority: High (regulatory requirement)
> Estimated Effort: Medium-Large feature

---

## Overview

Build a Compliance Hub that provides:
1. **Portfolio-wide compliance dashboard** - See all properties at a glance
2. **Property-level compliance tab** - Detailed view per property
3. **Document management** - View and track compliance certificates
4. **Expiry alerts** - Proactive warnings before deadlines

---

## Data Structure

### Compliance Categories (from real ivolve data)

| Category | Code | Typical Cycle | Documents |
|----------|------|---------------|-----------|
| Electrical Installation | EICR | 5 years | Certificate |
| Portable Appliance Testing | PAT | 1 year | Report |
| Fire Risk Assessment | FRA | Annual review | Report |
| Fire Fighting Equipment | FFE | Annual | Service report |
| Fire Alarm & Emergency Lighting | FA_EL | Quarterly/Annual | Certificates |
| Fire Door Inspection | FIRE_DOOR | Annual | Report |
| Asbestos Survey | ASBESTOS | As required | Survey report |
| Heating & Hot Water | HEATING_HW | Annual | Service report |
| Gas Safety | GAS_SAFE | Annual | Certificate |
| Legionella Risk Assessment | LRA | 2 years | Report |
| Water Sampling | WATER_SAMPLE | Quarterly | Lab results |
| TMV Service | TMV | 6 months | Service report |
| Lift Inspection | LIFT | 6 months | LOLER certificate |
| Energy Performance | EPC | 10 years | Certificate |
| Lightning Protection | LIGHTNING | Annual | Certificate |
| Sprinkler System | SPRINKLER | Annual | Service report |
| Dry Riser | DRY_RISER | Annual | Certificate |

### Status Values

```typescript
type ComplianceStatus =
  | 'compliant'           // Valid and up to date
  | 'due-soon'            // Expires within 30 days
  | 'overdue'             // Past expiry date
  | 'remedials-required'  // Compliant but actions needed
  | 'not-applicable'      // Category doesn't apply to property
  | 'no-data';            // No record exists
```

### TypeScript Interface

```typescript
interface ComplianceRecord {
  id: string;
  propertyId: string;
  category: ComplianceCategory;
  status: ComplianceStatus;
  lastInspectionDate: Date | null;
  expiryDate: Date | null;
  nextDueDate: Date | null;
  contractor: string | null;
  documents: ComplianceDocument[];
  remedialActions: RemedialAction[];
  notes: string;
}

interface ComplianceDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'other';
  uploadedDate: Date;
  filePath: string;
}

interface RemedialAction {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: Date | null;
  status: 'open' | 'in-progress' | 'completed';
  completedDate: Date | null;
}
```

---

## UI Components

### 1. Compliance Hub Page (`/compliance`)

**Header:**
- Title: "Compliance Hub"
- Filters: Property, Status, Category, Date Range
- Actions: Export report, Print

**Dashboard Cards:**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ✓ Compliant    │ │  ⚠ Due Soon     │ │  ✗ Overdue      │ │  🔧 Remedials   │
│      42         │ │       8         │ │       3         │ │       5         │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Main Table:**
| Property | EICR | PAT | FRA | FFE | Gas | LRA | ... |
|----------|------|-----|-----|-----|-----|-----|-----|
| 86-88 Woodhurst | ✓ | ✓ | ⚠ | ✓ | ✓ | ✓ | ... |
| Sovereign House | ✓ | ✓ | ✓ | ✗ | ✓ | ⚠ | ... |

- Click cell → Opens document/details
- Click property → Navigate to property compliance tab
- Status icons with tooltip showing dates

### 2. Property Profile Compliance Tab

**Compliance Summary Card:**
- Overall status (Compliant / Issues Found)
- Next expiring item
- Outstanding remedials count

**Category Cards Grid:**
```
┌──────────────────────────────┐
│ 🔌 EICR - Electrical         │
│ Status: ✓ Compliant          │
│ Last: 15 Mar 2024            │
│ Expires: 15 Mar 2029         │
│ [View Certificate]           │
└──────────────────────────────┘
```

**Documents Section:**
- List all compliance documents for property
- Filter by category
- Preview PDF inline or open in new tab

**Remedials Section:**
- Outstanding actions with priority badges
- Mark complete functionality

### 3. Shared Components

**ComplianceStatusBadge:**
```tsx
<ComplianceStatusBadge status="compliant" />      // Green ✓
<ComplianceStatusBadge status="due-soon" />       // Amber ⚠
<ComplianceStatusBadge status="overdue" />        // Red ✗
<ComplianceStatusBadge status="remedials" />      // Orange 🔧
```

**ComplianceCard:**
- Reusable card for each compliance category
- Shows status, dates, documents

**DocumentViewer:**
- Modal/drawer to preview PDFs
- Download button

---

## Implementation Phases

### Phase 1: Data Foundation (Priority: Critical)
1. Convert Excel to JSON format
2. Create TypeScript interfaces
3. Set up mock data matching real structure
4. Map PDF documents to property/category

### Phase 2: Property Compliance Tab
1. Add "Compliance" tab to PropertyProfile
2. Create ComplianceStatusBadge component
3. Build compliance category cards
4. Add document list with view/download

### Phase 3: Compliance Hub Dashboard
1. Add `/compliance` route
2. Build dashboard summary cards
3. Create compliance matrix table
4. Add filters (property, status, category)

### Phase 4: Alerts & Notifications
1. Calculate days until expiry
2. Add "Due Soon" warnings (30 days)
3. Dashboard widget for compliance overview
4. (Future) Email notifications

### Phase 5: Document Management
1. PDF preview component
2. Document upload (when Firebase ready)
3. Version history

---

## File Structure

```
src/
├── components/
│   └── Compliance/
│       ├── ComplianceHub.tsx           # Main hub page
│       ├── ComplianceMatrix.tsx        # Matrix table
│       ├── ComplianceCard.tsx          # Category card
│       ├── ComplianceStatusBadge.tsx   # Status indicator
│       ├── ComplianceDocuments.tsx     # Document list
│       ├── ComplianceFilters.tsx       # Filter controls
│       ├── PropertyComplianceTab.tsx   # Property profile tab
│       └── index.ts
├── data/
│   └── compliance/
│       ├── compliance-data.json        # Converted from Excel
│       └── documents/                  # PDF files by property
├── types/
│   └── compliance.ts                   # TypeScript interfaces
└── utils/
    └── compliance.ts                   # Date calculations, status logic
```

---

## Colour Coding (matches ivolve brand)

| Status | Colour | Tailwind Classes |
|--------|--------|------------------|
| Compliant | Green | `bg-ivolve-mid/10 text-ivolve-mid border-ivolve-mid` |
| Due Soon (30 days) | Amber | `bg-amber-50 text-amber-700 border-amber-300` |
| Overdue | Red | `bg-ivolve-rouge/10 text-ivolve-rouge border-ivolve-rouge` |
| Remedials Required | Orange | `bg-orange-50 text-orange-700 border-orange-300` |
| Not Applicable | Grey | `bg-slate-50 text-slate-400 border-slate-200` |
| No Data | Light Grey | `bg-slate-50 text-slate-300 border-slate-100` |

---

## Data Migration Notes

The Excel spreadsheet uses:
- Excel serial dates (e.g., 45442 = 30 May 2024)
- Text status values: "Compliant", "Remedials Outstanding", "Due within 30 days", "n/a"
- Property names that need mapping to `properties.json` IDs

**Conversion script needed to:**
1. Parse Excel dates to ISO format
2. Normalize status values to our enum
3. Map property names to existing property IDs
4. Structure documents by property/category

---

## Questions for Matt

1. Should remedial actions be tracked in detail, or just noted?
2. Do you want contractor details visible to all users?
3. Priority: Start with Property tab or Hub dashboard first?
4. Are there any compliance categories missing from the list?

---

## Success Criteria

- [ ] All 15+ compliance categories displayed
- [ ] Status badges show correct colours
- [ ] PDF documents viewable inline
- [ ] Expiry dates calculated correctly
- [ ] "Due Soon" warnings at 30 days
- [ ] Property profile shows compliance summary
- [ ] Hub dashboard shows portfolio overview
- [ ] Filters work correctly
- [ ] Mobile responsive

---

*Plan created by Amy (Claude Code) - 25 December 2024*
