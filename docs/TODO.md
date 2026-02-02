# Solas CRM — Development TODO

**Last Updated:** 25 December 2024
**Current Branch:** `feature/code-quality-fixes`

---

## Current State Summary

| Area | Status | Notes |
|------|--------|-------|
| Dashboard | ✅ Working | Drag-drop widgets, greeting, stats |
| Property Hub | ✅ Working | Full table, search, filters, saved views |
| Property Profile | ✅ Working | 7 tabs, all loading correctly |
| Finance Page | ⚠️ Basic | Structure in place, needs features |
| Sidebar/Routing | ✅ Working | React Router, browser nav works |
| Brand/Fonts | ✅ Working | Volte Rounded, ivolve colours |
| UI Design System | ✅ Working | Button, Skeleton, EmptyState components |
| Compliance Hub | 🚧 Planned | Real data provided, plan documented |
| Backend | ❌ Not started | Mock data only |
| Tests | ❌ Not started | No test coverage |

---

## Phase 1: Core Flow ✅ COMPLETE

- [x] Fix Property Profile crash (React hooks order issue)
- [x] Wire up PropertyHubEnhanced with full functionality
- [x] React Router integration
- [x] Sidebar navigation with Links
- [x] Browser back/forward working
- [x] All views loading without errors

---

## Phase 2: Codebase Health ✅ COMPLETE

- [x] Major cleanup - removed ~130 unused files
- [x] Deleted legacy prototype folder
- [x] Removed 13 unused PropertyProfile tabs
- [x] Organised docs into `docs/` folder
- [x] Updated .gitignore
- [x] Down to 75 source files (from ~200+)

---

## Phase 3: Brand Alignment ✅ COMPLETE

- [x] Volte Rounded fonts installed (`public/fonts/`)
- [x] @font-face declarations in index.css
- [x] Tailwind fontFamily updated
- [x] ivolve brand colours configured:
  - Dark Green: #025A40
  - Mid Green: #008C67
  - Bright Green: #6BD052
  - Teal Blue: #009EA5
  - Off-White: #FFF6F1

---

## Phase 4: SASSHA 360 Research ✅ COMPLETE!

> **Research completed: 1 Feb 2026**
> **35 PDFs analyzed, 14 modules documented, complete data models extracted**
>
> **Key Deliverables** (in `G:\My Drive\Sassha360\`):
> - `SUMMARY_FOR_MATT.md` - Start here! Executive summary
> - `COMPREHENSIVE_ANALYSIS.md` - Full 32,000-word analysis
> - `sassha-complete.types.ts` - Complete TypeScript interfaces
>
> **Critical Findings:**
> 1. Your Compliance Hub approach is PERFECT ✅ (matches SASSHA exactly)
> 2. Solas MUST build Safeguarding module (P0 - legal requirement)
> 3. Solas MUST build Support Plans & Risk Assessments (P0 - legal requirement)
> 4. SASSHA is data-first (90% tables) - Solas should be 60% visual
>
> **Quick Wins Identified:**
> - Add `careProvider` field to Property & Person (30 mins)
> - Add `socialWorker` field to Person (30 mins)
> - Create `<StatusBadge>` component (red/yellow/green/purple/gray) (1 hour)
> - Make PropertyProfile sections collapsible (1 hour)

### 4.1 System Documentation ✅
- [x] Document Dashboard module
- [x] Document Property/Asset management module
- [x] Document Tenancy management module
- [x] Document Maintenance module (Repairs)
- [x] Document Compliance module ⭐ (validates our Phase 5 approach!)
- [x] Document Finance module
- [x] Document Person/Contact management module
- [x] Document Applications & Referrals workflow
- [x] Document Safeguarding module ⭐⭐⭐ (CRITICAL - we need this!)
- [x] Document ASB (Anti-Social Behaviour) module
- [x] Document Support Plans module ⭐⭐⭐ (CRITICAL - we need this!)
- [x] Document Voids management
- [x] Document Tasks system
- [x] Document Notes system (universal notes with attachments)

### 4.2 Data Model Extraction ✅
- [x] Create TypeScript interfaces for all entities (see `sassha-complete.types.ts`)
- [x] Map relationships between entities (documented in analysis)
- [x] Document field validation rules (documented per module)
- [x] Capture dropdown/enum values (all enums in TypeScript file)

### 4.3 UX/UI Pattern Analysis ✅
- [x] Document navigation patterns (tab-based system)
- [x] Capture form layouts (pop-up modals, sidebar actions)
- [x] Note responsive behaviour (desktop-only, not mobile)
- [x] Identify reusable components (StatusBadge, collapsible panels, filter systems)

### 4.4 Feature Prioritization ✅
- [x] Create comparison matrix (SASSHA vs Solas current vs Solas planned) - see analysis
- [x] Identify quick wins (4 quick wins documented)
- [x] Flag must-have features for Solas (P0: Safeguarding, Support Plans, Risk Assessments)
- [x] Create implementation roadmap (phased approach documented)

**Next Action:** Read `G:\My Drive\Sassha360\SUMMARY_FOR_MATT.md` to understand findings!

---

## Phase 5: Compliance Hub (PAUSED - Resume after SASSHA research)

> Full plan: [COMPLIANCE_HUB_PLAN.md](COMPLIANCE_HUB_PLAN.md)
> Real data: `Compliance Data Private Let Only/` folder (94 documents, 5 properties)

### 5.1 Data Foundation
- [ ] Convert Excel to JSON (`compliance-data.json`)
- [ ] Create TypeScript interfaces (`src/types/compliance.ts`)
- [ ] Map 15+ compliance categories (EICR, PAT, FRA, FFE, Gas, LRA, etc.)
- [ ] Organise PDF documents by property/category

### 5.2 Property Profile Compliance Tab
- [ ] Create `ComplianceStatusBadge` component
- [ ] Build compliance category cards
- [ ] Add "Compliance" tab to PropertyProfile
- [ ] Document list with view/download links

### 5.3 Compliance Hub Dashboard
- [ ] Add `/compliance` route
- [ ] Build summary cards (Compliant, Due Soon, Overdue, Remedials)
- [ ] Create compliance matrix table
- [ ] Add filters (property, status, category)

### 5.4 Alerts & Widgets
- [ ] Calculate days until expiry
- [ ] "Due Soon" warnings (30 days)
- [ ] Dashboard widget for compliance overview

---

## Phase 6: Testing & Backend

### 6.1 Testing (P1)
- [ ] Install Vitest + React Testing Library
- [ ] Smoke test: Dashboard renders
- [ ] Smoke test: PropertyHub renders with mock data
- [ ] Unit test: compliance status calculation

### 6.2 Firebase Integration (P1)
- [ ] Create Firebase project
- [ ] Configure Firebase in `src/firebase/config.ts`
- [ ] Set up Firestore database structure
- [ ] Implement Firebase Auth
- [ ] Create login page
- [ ] Protect routes

### 6.3 Finance Module (P2)
- [ ] Complete Rent Schedule table
- [ ] Implement Void Cost Calculator
- [ ] Add arrears tracking display

### 6.4 Mobile Responsiveness (P2)
- [ ] Test all views on mobile viewport
- [ ] Add hamburger menu for mobile sidebar
- [ ] Ensure PropertyHub table scrolls properly

---

## Phase 7: Future Features (P3)

### Compliance Dashboard
- [ ] "Expiring Soon" widget (30/60/90 day warnings)
- [ ] Compliance traffic lights in PropertyHub
- [ ] "At Risk Properties" view

### Care & Support
- [ ] Care Plans section
- [ ] Incident Report log with timeline
- [ ] Support Hours tracking

### Document Intelligence
- [ ] File upload to Firebase Storage
- [ ] Document viewer for PDFs
- [ ] (Future) AI document parsing

### Reporting
- [ ] Property portfolio summary PDF
- [ ] Compliance status report
- [ ] Financial overview report

---

## Key Files Reference

| Area | File |
|------|------|
| App Entry | `src/App.tsx` |
| Dashboard | `src/components/Dashboard/DashboardLayout.tsx` |
| Property Hub | `src/components/PropertyHub/PropertyHubEnhanced.tsx` |
| Property Profile | `src/components/PropertyProfile/index.tsx` |
| Data Model | `src/types.ts` |
| Mock Data | `src/data/properties.json` |
| Compliance Data | `Compliance Data Private Let Only/` (Excel + PDFs) |
| Compliance Plan | `docs/COMPLIANCE_HUB_PLAN.md` |
| Design System | `src/components/shared/` (Button, Skeleton, EmptyState) |
| Styles | `src/index.css`, `tailwind.config.js` |
| Context | `src/context/AppContext.tsx` |

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Take screenshots
node scripts/screenshot.js
```

---

*Last session: 1 Feb 2026 - Added SASSHA 360 research phase (time-sensitive demo access)*
