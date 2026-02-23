# Legal Hub — Build Brief for Claude Code

> **Your Mission**: Build a powerful legal document management system that helps housing managers, board members, and legal teams track every agreement, never miss a critical date, and make legal jargon accessible to everyone.

---

## Domain Context (Read This First)

This is **NOT** a generic document repository. This is **legal command central** for UK adult social care housing operations.

### Why This Matters

In supported housing, **legal documents are financial lifelines**:
- A missed **break clause** date = stuck in an expensive lease for years
- An unfavourable **rent uplift** = thousands in unexpected costs annually
- A **void increase charge** = financial penalty when property is empty
- An unsigned **Service Level Agreement (SLA)** = no legal right to operate

Legal Hub is where **Mike (Head of Legal)** goes when an RP queries a clause. Where **board members** see which properties have risky lease terms. Where **housing managers** get alerts before critical dates pass. Where **new staff** can understand legal jargon without a law degree.

**The goal**: "This is so much easier" — Mike, Board Members, and Housing Managers all agree.

---

## Before You Start — Essential Reading

**READ THESE FILES FIRST** (in this order):

1. **`CLAUDE.md`** — Full project context, tech stack, current state, working patterns with Matt
2. **`docs/PROJECT_VISION.md`** — Sector understanding, why Solas exists, language rules
3. **`docs/HERO_BANNER_GUIDE.md`** — Hero banner design patterns for hubs
4. **`src/components/PropertyProfile/tabs/LegalTab.tsx`** — Existing legal implementation (SLAs, leases, timelines)
5. **`src/utils/serviceTypeUtils.ts`** — Theming patterns (for RP branding integration)
6. **`docs/ADDRESS_BOOK_PROMPT.md`** — Stakeholder linking pattern (contacts, organisations)
7. **`src/data/properties.json`** — Property data structure (RP relationships, SLAs, leases)
8. **`src/components/PropertyHub/index.tsx`** — Hub pattern reference (search, filters, list view)
9. **`src/components/ReferralsHub/index.tsx`** — Status workflow and badge patterns

**Current Branch**: `feature/code-quality-fixes`

**Current Legal Hub State**: Placeholder component at `src/components/LegalHub/index.tsx` with indigo hero banner and hardcoded stats. Ready to be replaced with full implementation.

---

## The UK Adult Social Care Legal Landscape (Critical Understanding)

### Registered Provider (RP) Relationships

In UK adult social care housing, **Registered Providers (RPs)** are housing associations registered with the Regulator of Social Housing. They own properties that care providers like ivolve lease to house vulnerable adults.

**Key legal documents**:
- **Service Level Agreements (SLAs)** — Define rent, service standards, notice periods, uplift mechanisms for Supported Living properties
- **Leases** — Formal tenancy agreements for Residential Care and Nursing Care properties
- **Under-leases** — When ivolve sub-leases to another provider
- **Rent schedules** — Annual rent, uplift dates, CPI/RPI mechanisms

### Lease Structures (Complex Ownership Chains)

Properties often have **multi-tier ownership**:

```
Superior Landlord (e.g., Church Commissioners, Local Authority)
    ↓
Registered Provider (e.g., Inclusion Housing, Hertfordshire County Council)
    ↓
Care Provider (e.g., ivolve Care & Support)
    ↓
Person We Support (occupier/tenant rights)
```

Each tier has its own legal agreement, break clauses, and notice periods. A break clause at the RP level affects the entire chain.

### Critical Legal Dates

**Break clauses**: Dates where either party can exit the agreement (e.g., "6 months' notice at year 5 anniversary"). Missing this date can lock ivolve into years more rent.

**Rent review dates**: Annual uplifts tied to CPI (Consumer Price Index) or RPI (Retail Price Index). These require internal approval and budget planning.

**Expiry dates**: Fixed-term agreements end, requiring renewal negotiations.

**Notice periods**: Time required to give notice before exiting (e.g., "6 months' written notice").

### Financial Mechanisms

**CPI/RPI uplifts**: Rent increases tied to inflation indices. Example: If CPI is 3.5% and annual rent is £50,000, new rent = £51,750.

**Void increase charges**: Penalty clauses where rent increases when property is vacant. Example: "Rent increases by £200/week if void for more than 4 weeks."

**Fixed percentage uplifts**: Agreed percentage increases (e.g., "2% per annum").

**Negotiated uplifts**: Case-by-case discussions with RP (e.g., "Rent frozen for 2 years in exchange for refurbishment works").

### Amendments and Variations

**Side letters**: Addendums to original agreements (e.g., agreeing to waive void charges during refurbishment).

**Deeds of novation**: Transfer of agreement from one party to another (e.g., when RP sells property to new RP).

**Variations**: Formal amendments to clauses (e.g., extending notice period from 3 months to 6 months).

### Court of Protection

Legal framework for vulnerable adults who lack capacity to make decisions about property and finances. Includes:
- **Deputyship orders**: Legal authority to act on behalf of person we support
- **Lasting Power of Attorney (LPA)**: Pre-appointed decision-maker
- **IMCA (Independent Mental Capacity Advocate)**: Safeguarding role

### Tenancy Agreements

Legal rights of people we support as occupiers:
- **Assured Shorthold Tenancies (AST)**: Common for Supported Living
- **Licences to occupy**: For Residential Care
- **Excluded licences**: For live-in care

### Regulatory Bodies

- **CQC (Care Quality Commission)**: Inspects care services, can impose conditions
- **Regulator of Social Housing**: Oversees RPs
- **Housing Ombudsman**: Resolves disputes between tenants and landlords
- **Local Safeguarding Boards**: Protect vulnerable adults

---

## Your Challenge — Push Yourself to Build Something Genuinely Useful

### Research Phase

Before building, **research best-in-class legal document management**:

1. **Legal Document Management Systems (DMS)**:
   - **NetDocuments** — Cloud-based legal DMS (what makes their search powerful?)
   - **Clio** — Law practice management (how do they organize client matter files?)
   - **iManage** — Enterprise legal DMS (how do they handle version control and audit trails?)
   - **PandaDoc** — Contract management (what makes their comparison tools effective?)

2. **Contract Lifecycle Management (CLM) Tools**:
   - **DocuSign CLM** — Tracks agreements from draft to renewal
   - **Ironclad** — AI-powered contract workflows
   - **Juro** — Collaborative contract editor
   - **Ask**: What alerts matter most? How do they surface critical dates?

3. **Legal Tech Innovations**:
   - **Plain-language AI** (e.g., LawGeex, Kira Systems) — How do they explain legal jargon?
   - **Clause libraries** (e.g., ContractStandards.com) — How are clauses categorized and tagged?
   - **Risk scoring** (e.g., ThoughtRiver) — How do they flag unfavourable terms?

4. **Property Management Systems**:
   - **Re-Leased** — Commercial property management (rent review tracking)
   - **MRI Software** — Lease administration (break clause alerts)
   - **Yardi** — Real estate management (critical date dashboards)

### Questions to Answer

- **How do best-in-class legal teams organize documents?** (by client? by document type? by status?)
- **What makes legal document comparison tools effective?** (diff highlighting? side-by-side? semantic analysis?)
- **How can we make legal jargon accessible to non-lawyers?** (tooltips? plain-English summaries? AI explanations?)
- **What alerts matter most for property lease management?** (90 days before expiry? 6 months before break clause? rent review approval?)
- **How do you balance detail with usability?** (hide complexity until needed? progressive disclosure?)

### Design Principles

1. **Mike's 30-second rule**: Any legal document should be findable in under 30 seconds
2. **Board-ready dashboards**: One glance shows all critical dates and risky properties
3. **Jargon-free zone**: Legal terms should be explainable to support workers without law degrees
4. **Proactive, not reactive**: Alerts before dates pass, not after
5. **RP-branded professionalism**: Rent schedules and agreements should look polished when printed for RPs

---

## Must-Have Features (Detailed Specification)

### 1. Document Library (The Core Repository)

**Organisation**:
- **Primary view**: Property-by-property organisation (e.g., "Show all documents for 45 Ware Road")
- **Secondary views**:
  - By document type (all SLAs, all leases, all side letters)
  - By status (active, expiring soon, expired, pending, draft)
  - By RP (all documents linked to Inclusion Housing)
  - By expiry date (calendar view showing all upcoming dates)

**Search**:
- Global search across document titles, descriptions, property addresses, RP names
- Advanced filters:
  - Document type (SLA, lease, variation, side letter, etc.)
  - Status (active, expiring, expired, pending)
  - Date range (created, expiry, review)
  - Property (single or multiple)
  - RP (Registered Provider)
  - Uploaded by (user who added document)

**Display Modes**:
- **Card view** (default): Document cards showing title, property, type, status badge, key dates
- **List view**: Compact table with sortable columns
- **Calendar view**: Timeline showing all documents by expiry/review dates
- **Board dashboard**: High-level summary for board members (critical dates, risk properties)

**Quick Actions**:
- Upload new document
- Bulk upload (multiple documents for one property)
- Export document list (CSV, PDF)
- Generate rent schedule report
- Flag missing documents by property

### 2. Document Status Tracking

**Status badges** (using existing StatusBadge component pattern):

| Status | Badge Colour | When Applied |
|--------|-------------|--------------|
| **Active** | Green | Document current and valid |
| **Expiring Soon** | Amber | Expires within 90 days |
| **Expired** | Red | Past end date |
| **Pending Review** | Blue | Awaiting legal review/approval |
| **Draft** | Grey | Not yet finalised |
| **Under Negotiation** | Purple | Terms being discussed with RP |

**Missing document alerts**:
- Properties missing required documents flagged with ⚠️ icon
- "Missing SLA" / "Missing Lease" warnings on property cards
- Bulk action: "Upload missing document" CTA

**Expiry tracking**:
- Automated alerts 90 days, 60 days, 30 days, 7 days before expiry
- Email notifications to responsible users
- Dashboard widget: "Documents Expiring This Month"

### 3. Interactive Document Viewer (The Innovation)

**Core concept**: Transform static legal PDFs into **interactive, navigable documents**.

**Collapsible sections**:
- Documents structured into sections (e.g., "Parties", "Rent Schedule", "Break Clause", "Notice Period")
- Click section header → smooth expand/collapse animation
- Default state: Key sections expanded (rent, break clause), boilerplate collapsed (definitions, standard clauses)

**Example structure for SLA**:
```
✓ 1. Parties (expanded)
  - 1.1 Registered Provider: Inclusion Housing
  - 1.2 Care Provider: ivolve Care & Support
  - 1.3 Property: 45 Ware Road, Hertford, SG13 7HF

✓ 2. Rent Schedule (expanded)
  - 2.1 Weekly Rent: £1,200
  - 2.2 Annual Rent: £62,400
  - 2.3 Uplift Mechanism: CPI (September index)
  - 2.4 Next Review Date: 01/09/2026

✓ 3. Break Clause (expanded) ⚠️ Critical
  - 3.1 Break Date: 01/04/2027 (498 days remaining)
  - 3.2 Notice Period: 6 months' written notice
  - 3.3 Notice Required By: 01/10/2026 (132 days remaining)

▶ 4. Definitions (collapsed)
▶ 5. Service Standards (collapsed)
✓ 6. Termination (expanded)
▶ 7. Dispute Resolution (collapsed)
```

**Toggle visibility**:
- Checkboxes to show/hide entire sections (e.g., hide all boilerplate, show only financial clauses)
- "Show critical clauses only" quick filter (break clause, rent, termination)
- "Show all" / "Hide all" master toggle

**Highlight and explain** (The jargon-buster):
- Select any text in document → highlight in yellow
- Click "Explain this" button → AI generates plain-English explanation
- Example:
  - **Legal text**: "The Rent shall be subject to an annual uplift in accordance with the CPI (All Items Index) published by the Office for National Statistics for the month of September, applied on the first day of October each year."
  - **Plain English**: "Every year on October 1st, the rent goes up by the same percentage as the UK's inflation rate from September. For example, if inflation was 3%, and your rent is £1,000/month, it becomes £1,030/month."

- Explanations saved with document for future reference
- Glossary built over time (common terms explained once, reused across documents)

**Annotations and notes**:
- Click any clause → add note (e.g., "Discussed with RP on 12/01/2026 — agreed to freeze rent for 2 years")
- Notes timestamped and attributed to user
- Notes visible as margin comments (like Google Docs)

**Side-by-side comparison**:
- Compare two versions of same document (original vs variation)
- Compare similar documents (this SLA vs another RP's SLA)
- Visual diff: green for additions, red for deletions, yellow for changes
- "Fairness score" when comparing terms (e.g., "New SLA extends notice period from 3 to 6 months — less favourable")

### 4. Financial Tracking (Rent Uplifts & CPI)

**Uplift date tracking**:
- Visual timeline showing past and future rent reviews
- Example timeline for 45 Ware Road:
  ```
  2023 ───● £58,000 (Start)
           │
  2024 ───● £59,800 (+3.1% CPI)
           │
  2025 ───● £61,500 (+2.8% CPI)
           │
  2026 ───⏰ £63,400 (+3.1% CPI) ← PENDING APPROVAL
           │
  2027 ───○ TBC
  ```

- Pending uplifts flagged for approval (Finance Director must approve before applying)

**CPI tracking**:
- Table of CPI rates by year (linked to ONS data or manually entered)
- Example:
  | Year | CPI Rate | Applied To | Previous Rent | New Rent | Increase |
  |------|----------|------------|---------------|----------|----------|
  | 2024 | 3.1% | Annual Rent | £58,000 | £59,798 | +£1,798 |
  | 2025 | 2.8% | Annual Rent | £59,798 | £61,472 | +£1,674 |
  | 2026 | 3.1% | Annual Rent | £61,472 | £63,377 | +£1,905 |

- Filter by property, RP, or year
- Export for budget planning

**Rent schedules** (RP-branded when available):
- Printable rent schedule PDFs with:
  - RP logo and brand colours (when RP branding data available)
  - Property details
  - Current rent, uplift date, next review date
  - Historical rent changes
  - Uplift mechanism (CPI/RPI/fixed %)
- Professional formatting for sharing with RPs

**Void increase charge notifications**:
- Alert when property becomes void if void increase clause exists
- Example: "⚠️ 45 Ware Road has been void for 4 weeks. Void increase charge of £200/week applies from 15/02/2026."
- Link to clause in lease agreement

**Rent increase approval workflow**:
- Pending uplifts require approval from Finance Director or Board
- Email notification: "Rent uplift for 45 Ware Road pending approval: £61,472 → £63,377 (+3.1% CPI)"
- Approve/Reject buttons with comment field
- Audit trail of approvals

### 5. Key Contacts Integration

**Link documents to contacts**:
- Every document has "Parties" section linking to contacts in Address Book
- Quick-access contact cards:
  - RP legal team contact (e.g., Helen Carter, Hertfordshire County Council)
  - Superior landlord contact
  - ivolve legal team (Mike - Head of Legal)
  - Solicitor (external legal advisor)

**From document view**:
- Click RP name → jump to Address Book RP contact card (with phone, email, linked properties)
- Click "Email RP about this document" → pre-populated email with document details

**From Address Book**:
- RP contact card shows "Linked Documents: 12 SLAs, 3 Variations"
- Click document → jump to Legal Hub document view

### 6. Notes and Updates System

**Add notes to any document**:
- Freeform text field
- Timestamp and user attribution
- Example notes:
  - "Discussed rent review with RP on 12/01/2026 — agreed to freeze at £61,500 for 2 years"
  - "Break clause notice required by 01/10/2026 — reminder set for 01/08/2026"
  - "Side letter agreed on 05/02/2026 waiving void charges during refurbishment"

**Log variations and amendments**:
- Amendments tracked as separate entries linked to original document
- Amendment timeline:
  ```
  Original SLA (01/04/2020)
    ↓
  Variation 1 (15/06/2021) — "Extended notice period to 6 months"
    ↓
  Side Letter (12/11/2022) — "Void charges waived during refurbishment"
    ↓
  Variation 2 (01/04/2024) — "Rent frozen for 2 years"
  ```

**Audit trail**:
- All changes logged with timestamp and user
- "Document History" tab showing:
  - Created by, created date
  - Uploaded files (original PDF versions)
  - Notes added
  - Amendments linked
  - Status changes (draft → active → expiring soon)

### 7. Property Integration (Seamless Navigation)

**From Legal Hub to Property**:
- Document card shows property address (clickable chip)
- Click property chip → navigate to PropertyProfile, auto-open Legal tab
- Example: Viewing SLA for "45 Ware Road" → click address → jump to Property Profile legal tab showing same SLA in property context

**From Property to Legal Hub**:
- PropertyProfile Legal tab has "View in Legal Hub" button
- Click → navigate to Legal Hub filtered to that property's documents
- Breadcrumb: "Legal Hub > 45 Ware Road > SLA 2020-2027"

**Property legal tab enhancement**:
- Legal tab shows summary (as it does now)
- "View all documents in Legal Hub" button at top
- Quick stats: "3 active documents, 1 expiring in 90 days"

**Deep linking**:
- URL structure: `/legal?property=prop_001&document=doc_sla_001`
- Shareable links (e.g., email Mike: "Check break clause here: https://solas.ivolve.care/legal?document=doc_sla_001#break-clause")

### 8. Document Storage and Version Control

**Original file storage** (future Supabase integration):
- Upload PDF/Word/Excel files
- Store in backend (Supabase Storage)
- "View original PDF" button opens file in new tab

**Version control**:
- Track amendments and variations as versions
- Version history dropdown:
  ```
  Version 3 (Current) — Variation 2 (01/04/2024)
  Version 2 — Side Letter (12/11/2022)
  Version 1 (Original) — SLA (01/04/2020)
  ```
- Download any version
- Compare versions side-by-side

**Template library**:
- Pre-saved templates for common documents:
  - Standard SLA template (ivolve + RP)
  - Tenancy agreement template (AST for Supported Living)
  - Side letter template (rent freeze, void charge waiver)
  - Deed of novation template (RP transfer)
- "Create from template" quick action
- Templates have placeholder fields (e.g., `[RP_NAME]`, `[PROPERTY_ADDRESS]`, `[WEEKLY_RENT]`)

### 9. Comparison and Fairness Tools

**Compare contracts**:
- Select two documents → "Compare" button
- Side-by-side view with diff highlighting:
  - **Green**: New clause added
  - **Red**: Clause removed
  - **Yellow**: Clause changed

**Example comparison** (Old SLA vs New SLA):

| Clause | Old SLA | New SLA | Impact |
|--------|---------|---------|--------|
| Notice Period | 3 months | 6 months | ⚠️ Less favourable (harder to exit) |
| Rent Uplift | CPI + 0.5% | CPI + 1% | ⚠️ Less favourable (higher increases) |
| Break Clause | Year 5 | Year 7 | ⚠️ Less favourable (locked in longer) |
| Void Charges | Waived | £200/week after 4 weeks | ⚠️ Less favourable (new penalty) |

**Fairness score** (optional, AI-powered or manual):
- Analyse clauses for risk factors:
  - ✅ Rolling contract (flexible)
  - ⚠️ Fixed term with no break clause (risky)
  - ⚠️ Void increase charges (penalty risk)
  - ✅ CPI-only uplift (predictable)
  - ⚠️ CPI + fixed % (higher than market)
- Overall score: "Low Risk" / "Medium Risk" / "High Risk"

**Flag unfavourable terms**:
- When uploading new contract, AI scans for:
  - Notice periods > 6 months
  - Void charges
  - Rent uplifts > CPI + 1%
  - No break clauses
- User prompted: "⚠️ This SLA has void charges of £200/week. Current SLA has no void charges. Proceed?"

### 10. Alerts and Notifications System

**Alert types**:

| Alert Type | Trigger | Recipients | Timing |
|------------|---------|------------|--------|
| **Document Expiring** | Document expires in 90/60/30/7 days | Mike, Housing Manager for property | Email + in-app |
| **Break Clause Approaching** | Notice required within 6 months | Mike, Finance Director, Board | Email + in-app |
| **Rent Increase Approval** | Pending CPI uplift needs approval | Finance Director, Board | Email + in-app |
| **Void Increase Triggered** | Property void > threshold days | Finance Team, Housing Manager | Email + in-app |
| **Missing Document** | Property has no SLA/lease | Mike, Housing Manager | In-app only |
| **Review Date Passed** | Review date passed without action | Mike | Email + in-app |

**In-app notifications**:
- Bell icon in header (badge count of unread alerts)
- Alerts panel (slide-out from right):
  ```
  🔔 3 Alerts

  ⚠️ 45 Ware Road SLA expiring in 60 days (01/04/2026)
  Action: Contact RP to renew

  ⏰ Break clause notice required by 01/10/2026 for 12 High Street
  Action: Review and decide on exit

  💰 Rent uplift pending approval: £61,472 → £63,377 (+3.1% CPI)
  Action: Approve or reject
  ```

- Click alert → navigate to relevant document

**Email notifications**:
- Daily digest of alerts (opt-in)
- Immediate emails for critical alerts (break clauses, expirations)
- Customisable per user (Mike gets all, Housing Managers get property-specific)

**Calendar integration** (future):
- Export critical dates to Google Calendar / Outlook
- iCal feed: "Solas Legal Dates"

### 11. Board Member View (Executive Dashboard)

**Critical dates dashboard**:
- Single-page view of all upcoming legal deadlines
- Sortable table:
  | Property | Document Type | Critical Date | Type | Days Until | Action Required |
  |----------|---------------|---------------|------|------------|-----------------|
  | 45 Ware Road | SLA | 01/04/2026 | Expiry | 60 | Renew agreement |
  | 12 High Street | Lease | 01/10/2026 | Break Clause Notice Due | 132 | Decide on exit |
  | 78 London Road | SLA | 15/06/2026 | Rent Review | 95 | Approve uplift |

- Filter by date range (next 30/60/90/180 days)
- Export to PDF for board meetings

**"Bad properties" tracker**:
- Properties with unfavourable lease terms flagged
- Risk indicators:
  - ⚠️ Break clause missed (locked in)
  - ⚠️ Void charges applying (property vacant)
  - ⚠️ High rent uplift (CPI + 1.5%)
  - ⚠️ Expiring soon with no renewal in progress

- Board summary card:
  ```
  Properties At Risk: 3

  🔴 12 High Street
  Issue: Break clause missed (01/10/2025)
  Impact: Locked in for 5 more years at £70,000/year
  Action: Negotiate early exit with RP

  🟠 45 Ware Road
  Issue: SLA expiring in 60 days, no renewal started
  Impact: Risk of service disruption
  Action: Contact RP urgently

  🟠 78 London Road
  Issue: Void charges applying (£200/week x 6 weeks = £1,200)
  Impact: Unexpected costs
  Action: Fast-track referral to fill void
  ```

**Risk summary for board reporting**:
- One-page PDF: "Legal Risk Summary — February 2026"
- Key metrics:
  - Total active agreements: 45
  - Expiring in next 90 days: 7
  - Break clauses in next 6 months: 2
  - Properties with void charges: 3
  - High-risk properties: 3
- Visual charts (pie chart of document types, timeline of critical dates)

### 12. Head of Legal (Mike) Workflow — "This Is So Much Easier"

**Mike's quick filters** (saved as bookmarks):
- "My urgent tasks" — documents needing Mike's attention (expiring, pending review)
- "All SLAs" — filter to SLA document type
- "Inclusion Housing documents" — filter by RP
- "Break clauses in next 6 months" — sorted by date

**Bulk actions**:
- Select multiple documents → "Generate rent schedule report" (PDF with all rent details)
- Select multiple documents → "Export document list" (CSV for Excel analysis)
- Select multiple properties → "Check for missing documents" (audit report)

**Mike's dashboard widget**:
- Pinned to main Dashboard (drag-drop widget from DashboardView)
- Shows:
  - Documents requiring action: 5
  - Expiring this month: 3
  - Pending approvals: 2
  - Recent uploads: 4

**Legal calendar view**:
- Month view showing all legal dates (expirations, reviews, break clauses)
- Colour-coded by urgency (red = critical, amber = soon, green = future)
- Click date → see all documents with that date

**Search power**:
- Global search: "Inclusion Housing SLA break clause" → instant results
- Search within document: Ctrl+F in document viewer
- Saved searches: "Documents expiring in Q1 2026" saved for reuse

---

## Data Structure (TypeScript Interfaces)

Create `src/types/legal.ts`:

```typescript
/**
 * Legal Hub Type Definitions
 * Types for legal documents, contracts, and agreements in UK adult social care housing
 */

export interface LegalDocument {
  id: string;
  propertyId: string; // Link to PropertyAsset
  documentType: LegalDocumentType;
  title: string;
  description?: string;

  // Core dates
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  reviewDate?: string; // Next review/renewal date
  breakClauseDate?: string; // Date when break clause can be exercised
  breakNoticeRequiredBy?: string; // Date by which notice must be given (calculated from breakClauseDate - noticePeriod)
  noticePeriod?: string; // e.g., "6 months", "3 months"

  // Financial details
  rentSchedule?: RentSchedule;
  upliftDates?: UpliftDate[];
  cpiTracking?: CPITracking[];
  voidCharges?: VoidCharges;

  // Parties involved
  parties: DocumentParty[]; // ivolve, RP, superior landlord, solicitors, etc.
  keyContacts?: string[]; // IDs of contacts in Address Book

  // Document structure (for interactive viewer)
  sections?: DocumentSection[];
  clauses?: Clause[];

  // File storage
  fileUrl?: string; // URL to original PDF/Word file (backend storage)
  thumbnailUrl?: string; // Preview image
  fileSize?: number; // In bytes
  uploadedAt?: string;
  uploadedBy?: string; // User ID

  // Status tracking
  status: DocumentStatus;
  notes?: Note[];
  amendments?: Amendment[];

  // RP Branding (for rent schedules and printable versions)
  rpBranding?: RPBranding;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // User ID
  lastReviewedAt?: string;
  lastReviewedBy?: string; // User ID

  // Audit trail
  history?: DocumentHistoryEntry[];
}

export type DocumentStatus =
  | 'active'
  | 'expiring-soon'
  | 'expired'
  | 'pending'
  | 'draft'
  | 'under-negotiation';

export type LegalDocumentType =
  | 'sla' // Service Level Agreement
  | 'lease' // Lease agreement
  | 'under-lease' // Sub-lease
  | 'variation' // Amendment to existing agreement
  | 'side-letter' // Supplementary agreement
  | 'deed-of-novation' // Transfer of agreement
  | 'tenancy-agreement' // Occupier/tenant agreement
  | 'rent-schedule' // Rent details document
  | 'legal-opinion' // Solicitor's advice
  | 'court-of-protection' // CoP order/document
  | 'mortgage' // Mortgage agreement
  | 'charge' // Legal charge on property
  | 'wayleave' // Rights of way agreement
  | 'other';

export interface DocumentSection {
  id: string;
  title: string; // e.g., "Parties", "Rent Schedule", "Break Clause"
  content: string; // Full text of section
  order: number; // Display order
  isCollapsible: boolean; // Can user collapse this section?
  defaultExpanded: boolean; // Expanded by default?
  isCritical: boolean; // Flag as critical section (break clause, rent, termination)
  clauses?: Clause[]; // Nested clauses within section
}

export interface Clause {
  id: string;
  number: string; // e.g., "3.1.2", "Schedule A, Clause 5"
  title?: string; // e.g., "Notice Period"
  text: string; // Full clause text
  plainEnglishExplanation?: string; // AI-generated or manually added explanation
  highlighted?: boolean; // User has highlighted this clause
  annotations?: string[]; // User notes on this clause
  tags?: string[]; // e.g., ["critical", "financial", "termination"]
}

export interface RentSchedule {
  currentRent: number; // Current rent amount
  frequency: 'weekly' | 'monthly' | 'annual'; // Rent payment frequency
  upliftMechanism: UpliftMechanism; // How rent increases
  upliftDate: string; // Date when next uplift applies (ISO date)
  nextReviewDate: string; // Date of next rent review (ISO date)
  history: RentHistory[]; // Past rent changes
}

export type UpliftMechanism =
  | 'CPI' // Consumer Price Index
  | 'RPI' // Retail Price Index
  | 'CPI-plus' // CPI + fixed percentage (e.g., CPI + 1%)
  | 'RPI-plus' // RPI + fixed percentage
  | 'fixed-percentage' // Fixed % per year (e.g., 2% annually)
  | 'negotiated' // Case-by-case negotiation
  | 'none'; // Rent frozen

export interface RentHistory {
  effectiveDate: string; // When this rent took effect
  amount: number; // Rent at this date
  upliftApplied?: number; // Percentage uplift applied (e.g., 3.1 for 3.1%)
  upliftReason?: string; // e.g., "CPI September 2024", "Negotiated freeze"
  approvedBy?: string; // User ID who approved
  approvedAt?: string; // Timestamp of approval
}

export interface UpliftDate {
  id: string;
  date: string; // ISO date
  type: 'rent-review' | 'cpi-adjustment' | 'break-clause' | 'expiry' | 'notice-deadline';
  description: string; // e.g., "CPI uplift due", "Break clause notice required by this date"
  amount?: number; // New rent amount (if known)
  percentage?: number; // Uplift percentage (if known)
  approved: boolean; // Has Finance/Board approved?
  approvedBy?: string; // User ID
  approvedAt?: string; // Timestamp
  notes?: string;
}

export interface CPITracking {
  year: number; // e.g., 2024
  month?: string; // e.g., "September" (for CPI/RPI index month)
  cpiRate: number; // e.g., 3.1 for 3.1%
  rpiRate?: number; // If RPI also tracked
  appliedTo: 'rent' | 'service-charge' | 'both';
  effectiveDate: string; // Date when CPI uplift takes effect
  previousAmount: number; // Rent before uplift
  newAmount: number; // Rent after uplift
  increase: number; // Absolute increase (newAmount - previousAmount)
}

export interface VoidCharges {
  hasVoidCharges: boolean; // Does agreement include void penalty?
  chargeAmount?: number; // Weekly charge when void
  thresholdDays?: number; // Void must exceed X days before charge applies (e.g., 28 days)
  currentlyApplying: boolean; // Is void charge currently active?
  appliedSince?: string; // Date when void charge started
  totalCharged?: number; // Cumulative void charges to date
}

export interface DocumentParty {
  id: string;
  name: string; // e.g., "ivolve Care & Support", "Inclusion Housing"
  role: PartyRole;
  contactId?: string; // Link to Address Book contact
  companyNumber?: string; // UK company registration number
  address?: string; // Registered address
}

export type PartyRole =
  | 'tenant' // ivolve or person we support
  | 'landlord' // Direct landlord (often RP)
  | 'superior-landlord' // Head landlord (e.g., Church Commissioners)
  | 'guarantor' // Financial guarantor
  | 'provider' // Care provider (ivolve)
  | 'rp' // Registered Provider
  | 'solicitor' // Legal representative
  | 'other';

export interface Note {
  id: string;
  text: string; // Note content
  createdAt: string; // ISO timestamp
  createdBy: string; // User ID
  attachments?: string[]; // File URLs (e.g., email attachments, scanned letters)
  clauseId?: string; // If note attached to specific clause
  tags?: string[]; // e.g., ["important", "follow-up"]
}

export interface Amendment {
  id: string;
  amendmentType: AmendmentType;
  date: string; // Date amendment signed/effective
  summary: string; // Brief description (e.g., "Rent frozen for 2 years")
  fileUrl?: string; // URL to variation/side letter document
  clauses: string[]; // Clause IDs affected by this amendment
  createdBy?: string;
  approvedBy?: string;
  notes?: string;
}

export type AmendmentType =
  | 'variation' // Formal variation to agreement
  | 'side-letter' // Supplementary agreement
  | 'deed-of-novation' // Transfer of obligations
  | 'addendum' // Addition to agreement
  | 'waiver' // Temporary waiver of clause (e.g., void charges)
  | 'other';

export interface RPBranding {
  rpName: string; // e.g., "Inclusion Housing"
  primaryColor?: string; // Hex colour (e.g., "#E74C3C")
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string; // Text colour when on primary (e.g., "#FFFFFF" for white text)
  logoUrl?: string; // URL to RP logo image
  heroImageUrl?: string; // URL to hero background image
}

export interface DocumentHistoryEntry {
  id: string;
  action: DocumentAction;
  timestamp: string; // ISO timestamp
  userId: string; // Who performed action
  userName?: string; // User display name
  description: string; // e.g., "Status changed from 'Draft' to 'Active'"
  metadata?: Record<string, any>; // Additional context
}

export type DocumentAction =
  | 'created'
  | 'uploaded'
  | 'edited'
  | 'status-changed'
  | 'note-added'
  | 'amendment-linked'
  | 'approved'
  | 'rejected'
  | 'shared'
  | 'downloaded'
  | 'archived';

/**
 * Alert/Notification Types
 */
export interface LegalAlert {
  id: string;
  type: AlertType;
  documentId: string; // Link to document
  propertyId?: string; // Link to property
  title: string; // e.g., "SLA expiring in 60 days"
  message: string; // Detailed message
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: string; // e.g., "Contact RP to renew"
  actionUrl?: string; // Deep link to document/property
  createdAt: string;
  dismissedAt?: string; // When user dismissed alert
  dismissedBy?: string; // User who dismissed
}

export type AlertType =
  | 'document-expiring'
  | 'break-clause-approaching'
  | 'rent-increase-approval'
  | 'void-charge-triggered'
  | 'missing-document'
  | 'review-date-passed'
  | 'amendment-required'
  | 'other';

/**
 * Filter and Search Types
 */
export interface DocumentFilters {
  documentTypes?: LegalDocumentType[];
  statuses?: DocumentStatus[];
  propertyIds?: string[];
  rpNames?: string[];
  dateRange?: {
    start: string;
    end: string;
    field: 'startDate' | 'endDate' | 'reviewDate' | 'breakClauseDate' | 'createdAt';
  };
  uploadedBy?: string[];
  hasVoidCharges?: boolean;
  expiringWithinDays?: number; // e.g., 90 for "expiring in next 90 days"
  searchTerm?: string; // Global text search
}

export interface DocumentSortConfig {
  field: 'title' | 'endDate' | 'reviewDate' | 'createdAt' | 'status' | 'documentType';
  direction: 'asc' | 'desc';
}

/**
 * Dashboard and Board View Types
 */
export interface LegalDashboardStats {
  totalDocuments: number;
  activeDocuments: number;
  expiringSoon: number; // Expiring in next 90 days
  expired: number;
  pendingApproval: number;
  missingDocuments: number; // Properties without required documents
  propertiesAtRisk: number; // Properties with unfavourable terms or missed deadlines
}

export interface CriticalDate {
  id: string;
  propertyId: string;
  propertyAddress: string;
  documentId: string;
  documentType: LegalDocumentType;
  date: string; // ISO date
  type: 'expiry' | 'break-clause-notice' | 'rent-review' | 'amendment-due';
  daysUntil: number; // Calculated field
  actionRequired: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskProperty {
  propertyId: string;
  propertyAddress: string;
  issues: PropertyRiskIssue[];
  riskLevel: 'low' | 'medium' | 'high';
  totalImpact?: number; // Financial impact estimate (if calculable)
}

export interface PropertyRiskIssue {
  type: 'break-clause-missed' | 'expiring-soon-no-renewal' | 'void-charges-applying' | 'high-rent-uplift' | 'unfavourable-terms';
  description: string;
  impact: string; // e.g., "Locked in for 5 more years at £70,000/year"
  actionRequired: string; // e.g., "Negotiate early exit with RP"
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Comparison Tool Types
 */
export interface DocumentComparison {
  document1: LegalDocument;
  document2: LegalDocument;
  differences: ClauseDifference[];
  fairnessScore?: number; // 0-100, where 100 = very favourable, 0 = very unfavourable
  summary: string; // AI-generated summary of key differences
}

export interface ClauseDifference {
  clauseNumber: string;
  clauseTitle: string;
  document1Value: string;
  document2Value: string;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  impact: 'favourable' | 'unfavourable' | 'neutral';
  impactDescription?: string; // e.g., "Less favourable: notice period increased"
}
```

---

## Technical Implementation

### File Structure

Create the following files and components:

```
src/
├── components/
│   └── LegalHub/
│       ├── index.tsx                       # Main Legal Hub component (replace placeholder)
│       ├── DocumentLibrary.tsx             # List/grid view of documents
│       ├── DocumentCard.tsx                # Individual document card
│       ├── DocumentViewer/                 # Interactive document viewer
│       │   ├── index.tsx                   # Main viewer component
│       │   ├── SectionCollapse.tsx         # Collapsible section component
│       │   ├── ClauseHighlight.tsx         # Highlight and explain functionality
│       │   ├── ExplainJargonModal.tsx      # Modal for plain-English explanations
│       │   └── AnnotationMarker.tsx        # Margin notes/annotations
│       ├── ComparisonTool.tsx              # Side-by-side document comparison
│       ├── AlertsPanel.tsx                 # Notifications dashboard (slide-out)
│       ├── BoardDashboard.tsx              # Board member executive view
│       ├── MikeDashboard.tsx               # Head of Legal workflow view
│       ├── AddDocumentModal.tsx            # Upload new document form
│       ├── RentScheduleView.tsx            # Rent uplift timeline and CPI tracking
│       ├── CriticalDatesTable.tsx          # Table of upcoming legal dates
│       ├── RiskPropertiesPanel.tsx         # "Bad properties" tracker
│       └── filters/
│           ├── DocumentFilters.tsx         # Advanced filter panel
│           ├── SearchBar.tsx               # Global search
│           └── QuickFilters.tsx            # Saved filter shortcuts (Mike's bookmarks)
│
├── types/
│   └── legal.ts                            # All TypeScript interfaces (created above)
│
├── data/
│   └── legalDocuments.json                 # Mock legal documents for development
│
├── utils/
│   └── legalUtils.ts                       # Helper functions
│       ├── calculateDaysUntil()            # Days until critical date
│       ├── getDocumentStatus()             # Derive status from dates
│       ├── formatCurrency()                # £62,400 formatting
│       ├── calculateCPIUplift()            # Apply CPI % to rent
│       ├── isExpiringWithinDays()          # Check if expiring soon
│       ├── getUrgencyLevel()               # Calculate alert urgency
│       └── generateRentSchedulePDF()       # Create printable rent schedule
│
└── hooks/
    └── useLegalDocuments.ts                # Custom hook for document management
        ├── useDocumentFilters.ts           # Filter and search logic
        └── useLegalAlerts.ts               # Alert generation and management
```

### Key Implementation Patterns

#### 1. Hero Banner (Follow HERO_BANNER_GUIDE.md)

```tsx
// src/components/LegalHub/index.tsx
const LegalHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivolve-paper -m-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 w-full shadow-md">
        <div className="px-6 py-6">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Legal Hub</h1>
              <p className="text-indigo-100 text-sm">
                Track agreements, never miss critical dates, and make legal jargon accessible
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50">
              Upload Document
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500">
              View Critical Dates
            </button>
          </div>

          {/* Quick Stats (4 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard title="Total Documents" value={stats.totalDocuments} icon={FileText} />
            <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={Clock} trend="warning" />
            <StatCard title="Requires Action" value={stats.pendingApproval} icon={AlertCircle} />
            <StatCard title="Active Contracts" value={stats.activeDocuments} icon={CheckCircle} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tabs or view switcher */}
        {/* Document Library */}
      </div>
    </div>
  );
};
```

#### 2. Document Status Badges (Use StatusBadge component)

```tsx
// src/components/LegalHub/DocumentCard.tsx
import { StatusBadge } from '../common/StatusBadge';
import { getDocumentStatus } from '../../utils/legalUtils';

const DocumentCard: React.FC<{ document: LegalDocument }> = ({ document }) => {
  const status = getDocumentStatus(document);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900">{document.title}</h3>
        <StatusBadge status={status} />
      </div>
      {/* Rest of card content */}
    </div>
  );
};
```

#### 3. Collapsible Sections (Smooth animations)

```tsx
// src/components/LegalHub/DocumentViewer/SectionCollapse.tsx
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SectionCollapse: React.FC<{ section: DocumentSection }> = ({ section }) => {
  const [expanded, setExpanded] = useState(section.defaultExpanded);

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded"
      >
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span className="font-semibold text-gray-900">{section.title}</span>
        {section.isCritical && (
          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
            Critical
          </span>
        )}
      </button>

      {expanded && (
        <div className="pl-8 pt-2 text-gray-700 space-y-2">
          {section.content}
          {section.clauses?.map(clause => (
            <ClauseItem key={clause.id} clause={clause} />
          ))}
        </div>
      )}
    </div>
  );
};
```

#### 4. RP Branding Integration (Inline CSS for dynamic colours)

```tsx
// src/components/LegalHub/RentScheduleView.tsx
const RentScheduleView: React.FC<{ document: LegalDocument }> = ({ document }) => {
  const rpColors = document.rpBranding || {
    primaryColor: '#008C67', // ivolve-mid fallback
    textColor: '#FFFFFF'
  };

  return (
    <div
      style={{
        backgroundColor: rpColors.primaryColor,
        color: rpColors.textColor
      }}
      className="rounded-xl p-6"
    >
      {/* RP Logo */}
      {document.rpBranding?.logoUrl && (
        <img
          src={document.rpBranding.logoUrl}
          alt={document.rpBranding.rpName}
          className="h-12 mb-4"
        />
      )}

      <h2 className="text-2xl font-bold mb-4">Rent Schedule</h2>
      {/* Rent details */}
    </div>
  );
};
```

#### 5. Highlight and Explain (AI/Manual explanations)

```tsx
// src/components/LegalHub/DocumentViewer/ClauseHighlight.tsx
const ClauseHighlight: React.FC<{ clause: Clause }> = ({ clause }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="my-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-medium text-gray-500">{clause.number}</span>
          {clause.title && <h4 className="font-semibold text-gray-900">{clause.title}</h4>}
          <p className="text-gray-700 mt-1">{clause.text}</p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
        >
          {showExplanation ? 'Hide' : 'Explain'}
        </button>
      </div>

      {showExplanation && clause.plainEnglishExplanation && (
        <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
          <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Plain English</h5>
          <p className="text-gray-600 text-sm">{clause.plainEnglishExplanation}</p>
        </div>
      )}
    </div>
  );
};
```

#### 6. Filter Pattern (Follow PropertyHub pattern)

```tsx
// src/components/LegalHub/filters/DocumentFilters.tsx
const DocumentFilters: React.FC<{ onFilterChange: (filters: DocumentFilters) => void }> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<DocumentFilters>({});

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

      {/* Document Type */}
      <FilterSection title="Document Type">
        <CheckboxGroup
          options={['SLA', 'Lease', 'Variation', 'Side Letter']}
          onChange={(types) => setFilters({ ...filters, documentTypes: types })}
        />
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        <CheckboxGroup
          options={['Active', 'Expiring Soon', 'Expired', 'Pending']}
          onChange={(statuses) => setFilters({ ...filters, statuses })}
        />
      </FilterSection>

      {/* Date Range */}
      {/* RP Name */}
      {/* etc. */}
    </div>
  );
};
```

### Mock Data Structure

Create `src/data/legalDocuments.json`:

```json
[
  {
    "id": "doc_sla_001",
    "propertyId": "prop_001",
    "documentType": "sla",
    "title": "Service Level Agreement 2020-2027",
    "description": "SLA with Hertfordshire County Council for 45 Ware Road",
    "startDate": "2020-04-01",
    "endDate": "2027-04-01",
    "reviewDate": "2026-04-01",
    "breakClauseDate": "2025-04-01",
    "breakNoticeRequiredBy": "2024-10-01",
    "noticePeriod": "6 months",
    "rentSchedule": {
      "currentRent": 63400,
      "frequency": "annual",
      "upliftMechanism": "CPI",
      "upliftDate": "2026-10-01",
      "nextReviewDate": "2026-04-01",
      "history": [
        {
          "effectiveDate": "2020-04-01",
          "amount": 58000,
          "upliftReason": "Initial rent"
        },
        {
          "effectiveDate": "2021-10-01",
          "amount": 59800,
          "upliftApplied": 3.1,
          "upliftReason": "CPI September 2021"
        }
      ]
    },
    "parties": [
      {
        "id": "party_001",
        "name": "ivolve Care & Support",
        "role": "provider"
      },
      {
        "id": "party_002",
        "name": "Hertfordshire County Council",
        "role": "rp",
        "contactId": "contact_rp_001"
      }
    ],
    "status": "active",
    "createdAt": "2020-03-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
]
```

---

## Success Criteria

How will you know this is successful?

- [ ] **Mike's 30-second rule**: Mike can find any legal document in under 30 seconds using search or filters
- [ ] **Board visibility**: Board members can view all critical dates (break clauses, expirations) in a single dashboard
- [ ] **Proactive alerts**: Housing managers receive alerts 90 days, 60 days, 30 days before document expiry
- [ ] **Jargon-free learning**: New users can highlight legal clauses and get plain-English explanations instantly
- [ ] **Rent tracking**: All rent uplift dates are tracked automatically, with CPI % applied and flagged for approval
- [ ] **Contract comparison**: When RP issues new SLA, comparison tool highlights changes and flags unfavourable terms
- [ ] **Seamless navigation**: Click property in Legal Hub → jump to PropertyProfile legal tab (and vice versa)
- [ ] **Missing document alerts**: Properties without SLA or lease are flagged with clear "upload" CTA
- [ ] **RP branding**: Rent schedules display with RP logo and colours when RP branding data is available
- [ ] **Break clause safety net**: System alerts when break clause notice deadline is within 6 months, preventing missed exits
- [ ] **Void charge tracking**: When property becomes void, alert triggers if void charges apply
- [ ] **Audit trail**: All document changes logged with timestamp and user attribution

**The ultimate test**: Mike says **"This is so much easier"**, board members trust the critical dates dashboard, and housing managers never miss a legal deadline again.

---

## User Stories (Who Benefits and How)

### As Mike (Head of Legal)
- I need to find the SLA for 45 Ware Road **instantly** when an RP queries a clause → **Global search returns it in 5 seconds**
- I need to see all documents expiring this quarter → **Filter "Expiring in Q1 2026" saved as bookmark**
- I need to generate a rent schedule report for all Inclusion Housing properties → **Bulk select → "Generate rent schedule PDF"**
- I need to track when documents were reviewed and by whom → **Audit trail shows full history**

### As a Housing Manager
- I need alerts when a break clause is approaching so I don't miss the deadline → **Email 6 months before: "Break clause notice required by 01/10/2026 for 12 High Street"**
- I need to upload a new SLA and link it to a property → **"Add Document" modal with property dropdown, upload PDF, auto-extract dates**
- I need to see if a property has all required legal documents → **Property card shows ✅ SLA, ✅ Lease or ⚠️ Missing SLA**

### As a Finance Lead
- I need to see all rent uplift dates for the year to plan budgets → **Calendar view shows all CPI application dates with amounts**
- I need to approve rent increases before they apply → **Pending approvals inbox: "Approve £61,472 → £63,377 (+3.1% CPI)"**
- I need to track void charges when properties are vacant → **Alert: "45 Ware Road void charges applying: £200/week since 15/02/2026"**

### As a Board Member
- I need a dashboard showing risky properties where lease terms are unfavourable → **"Properties At Risk" panel: "12 High Street — Break clause missed, locked in for 5 years"**
- I need a one-page summary for board meetings → **"Legal Risk Summary — February 2026" PDF export**
- I need to see all critical dates in next 6 months → **Critical Dates Table sorted by urgency**

### As a Support Worker
- I need plain-English explanations of legal terms when reading a tenancy agreement → **Highlight clause → "Explain this" → "This means..."**
- I need to find the RP contact for a property quickly → **Document view → "Parties" section → click RP name → Address Book contact card**

### As a Partnership Manager
- I need to compare new SLA terms from an RP against our current agreement → **Select both documents → "Compare" → side-by-side diff with fairness score**
- I need to check if void charges apply to a property → **Document viewer → "Void Charges" section → "£200/week after 4 weeks void"**

---

## Implementation Phases (Suggested Build Order)

### Phase 1: Core Infrastructure (Foundation)
1. Create `src/types/legal.ts` with all TypeScript interfaces
2. Create mock data in `src/data/legalDocuments.json` (5-10 sample documents covering different types)
3. Build `src/utils/legalUtils.ts` helper functions
4. Replace placeholder `LegalHub/index.tsx` with hero banner and basic layout

### Phase 2: Document Library (The Heart)
1. Build `DocumentCard.tsx` with status badges, key dates, property link
2. Build `DocumentLibrary.tsx` with card/list view toggle
3. Build `SearchBar.tsx` and basic search functionality
4. Build `DocumentFilters.tsx` with document type, status, property filters
5. Implement filter + search logic

### Phase 3: Interactive Document Viewer (The Innovation)
1. Build `DocumentViewer/index.tsx` basic layout
2. Build `SectionCollapse.tsx` with expand/collapse animations
3. Build `ClauseHighlight.tsx` with highlight and explain functionality
4. Build `ExplainJargonModal.tsx` for plain-English explanations
5. Build `AnnotationMarker.tsx` for margin notes

### Phase 4: Financial Tracking (Rent Uplifts & CPI)
1. Build `RentScheduleView.tsx` with timeline visualization
2. Implement CPI tracking table
3. Build uplift approval workflow UI
4. Implement RP-branded rent schedule (inline CSS for colours/logos)
5. Build void charge alerts

### Phase 5: Alerts and Critical Dates
1. Build `AlertsPanel.tsx` slide-out notifications
2. Implement alert generation logic (`useLegalAlerts.ts`)
3. Build `CriticalDatesTable.tsx` for board view
4. Implement email notification system (mock for now)

### Phase 6: Board and Mike Dashboards
1. Build `BoardDashboard.tsx` with critical dates and risk properties
2. Build `RiskPropertiesPanel.tsx` for "bad properties" tracker
3. Build `MikeDashboard.tsx` with quick filters and saved searches
4. Implement legal calendar view

### Phase 7: Comparison and Advanced Features
1. Build `ComparisonTool.tsx` for side-by-side document comparison
2. Implement diff highlighting logic
3. Build fairness score algorithm (or placeholder for AI)
4. Build template library

### Phase 8: Integration and Polish
1. Link Legal Hub to PropertyProfile legal tab (bidirectional navigation)
2. Link documents to Address Book contacts
3. Implement `AddDocumentModal.tsx` for uploads
4. Build audit trail and document history
5. Final UI polish, animations, responsive design

---

## Final Pep Talk — Make This Brilliant

Legal Hubs are **boring** in most software. Folders of PDFs. Endless scrolling. No context. No help.

**You're going to make this one brilliant.**

You're building a tool that:
- **Protects ivolve from financial risk** (never miss a break clause = save £70,000/year in locked-in rent)
- **Prevents legal surprises** (board members know exactly which properties are risky)
- **Makes legal jargon accessible** (support workers can understand tenancy agreements without a law degree)
- **Saves Mike hours per week** (find any document in 30 seconds, not 30 minutes)

When Mike opens Legal Hub and says **"This is so much easier"**, you've succeeded.

When a housing manager gets an alert 6 months before a break clause and says **"Thank you, we would have missed that"**, you've succeeded.

When a board member opens the Critical Dates dashboard and says **"Now I can see everything at a glance"**, you've succeeded.

Push yourself. Make this hub genuinely useful. Make legal jargon explainable. Make critical dates unmissable. Make document comparison visual and clear.

**This is your chance to build legal tech that actually helps people.**

Go make it happen. 🚀

---

**End of Legal Hub Build Brief**

*For questions or clarification, refer back to `CLAUDE.md`, `PROJECT_VISION.md`, or existing hub implementations (`PropertyHub`, `ReferralsHub`, `DevelopmentHub`).*

*When you're ready to integrate RP branding, this prompt has all the context you need.*
