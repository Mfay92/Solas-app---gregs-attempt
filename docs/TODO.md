# Solas CRM — Development TODO

**Last Updated:** 24 December 2024
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

## Phase 4: Next Priorities

### 4.1 Testing (P1)
- [ ] Install Vitest + React Testing Library
- [ ] Smoke test: Dashboard renders
- [ ] Smoke test: PropertyHub renders with mock data
- [ ] Unit test: compliance status calculation

### 4.2 Firebase Integration (P1)
- [ ] Create Firebase project
- [ ] Configure Firebase in `src/firebase/config.ts`
- [ ] Set up Firestore database structure
- [ ] Implement Firebase Auth
- [ ] Create login page
- [ ] Protect routes

### 4.3 Finance Module (P2)
- [ ] Complete Rent Schedule table
- [ ] Implement Void Cost Calculator
- [ ] Add arrears tracking display

### 4.4 Mobile Responsiveness (P2)
- [ ] Test all views on mobile viewport
- [ ] Add hamburger menu for mobile sidebar
- [ ] Ensure PropertyHub table scrolls properly

---

## Phase 5: Future Features (P3)

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

*Last session: Dec 2024 - Fixed hooks error, wired PropertyHubEnhanced, major cleanup*
