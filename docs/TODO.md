# Solas CRM — Development TODO

**Last Updated:** 30 November 2025
**Current Branch:** `feature/code-quality-fixes`

---

## Phase 1: Unblock Core Flow (P0)

> **Goal:** Get property viewing working so Solas is demo-able.

### 1.1 Fix Property Profile Crash
- [ ] Open browser DevTools, click a property, capture the exact error
- [ ] Check `src/components/PropertyProfile/index.tsx` for undefined props
- [ ] Verify all 17 tab imports resolve (check for typos/missing exports)
- [ ] Test with reduced tab set (comment out all but Overview)
- [ ] Fix data shape mismatches between `PropertyAsset` and tab props
- [ ] Confirm fix by clicking all 6 mock properties

### 1.2 Improve Dev Error Visibility
- [ ] Update `ErrorBoundary.tsx` to show stack trace when `import.meta.env.DEV`
- [ ] Add `console.error` logging in error boundary

### 1.3 Verify All Navigation
- [ ] Dashboard loads ✓
- [ ] Properties loads ✓
- [ ] Finance loads (check for errors)
- [ ] Settings/StyleGuide loads

---

## Phase 2: Infrastructure (P1)

> **Goal:** Professional-grade architecture for scaling.

### 2.1 Add React Router ✅ COMPLETE
- [x] Install `react-router-dom`
- [x] Create route structure: `/`, `/properties`, `/properties/:id`, `/finance`, `/settings`
- [x] Update Sidebar to use `<Link>` components
- [x] Replace AppContext view switching with router navigation
- [x] Handle browser back/forward

### 2.2 Wire Up Enhanced PropertyHub
- [ ] Connect `PropertyHubEnhanced.tsx` or integrate its features
- [ ] Enable AdvancedFilterBuilder in UI
- [ ] Connect SavedViewsPanel
- [ ] Wire up exportUtils (CSV/XLSX export buttons)

### 2.3 Add Basic Testing
- [ ] Install Vitest + React Testing Library
- [ ] Write smoke test: Dashboard renders
- [ ] Write smoke test: PropertyHub renders with mock data
- [ ] Write unit test: compliance status calculation

---

## Phase 3: Backend Integration (P1)

> **Goal:** Persistent data, real users.

### 3.1 Firebase Setup
- [ ] Create Firebase project
- [ ] Configure Firebase in `src/firebase/config.ts`
- [ ] Set up Firestore database structure

### 3.2 Authentication
- [ ] Implement Firebase Auth
- [ ] Create login page
- [ ] Protect routes (redirect to login if not authenticated)
- [ ] Update Sidebar to show real user info

### 3.3 Data Layer
- [ ] Create `useProperties` hook to fetch from Firestore
- [ ] Replace `properties.json` import with Firestore query
- [ ] Add loading states for data fetching
- [ ] Implement property CRUD operations

---

## Phase 4: Feature Completion (P2)

> **Goal:** Full feature parity with design intent.

### 4.1 Finance Module
- [ ] Complete Rent Schedule table with all fields
- [ ] Implement Void Cost Calculator
- [ ] Add arrears tracking display

### 4.2 Compliance Dashboard
- [ ] Create "Expiring Soon" widget (30/60/90 day warnings)
- [ ] Add compliance traffic lights to PropertyHub
- [ ] Implement "At Risk Properties" view

### 4.3 Care & Support
- [ ] Elevate care features to top-level navigation
- [ ] Build Care Plans section
- [ ] Implement Incident Report log with timeline
- [ ] Add Support Hours tracking (commissioned vs delivered)

---

## Phase 5: Polish & UX (P2)

### 5.1 Visual Refinement
- [ ] Add subtle gradients to card backgrounds
- [ ] Improve button hover/active states
- [ ] Add loading skeletons instead of spinners

### 5.2 Accessibility
- [ ] Audit ARIA labels on all interactive elements
- [ ] Ensure keyboard navigation works throughout
- [ ] Test focus management in modals

### 5.3 Mobile Responsiveness
- [ ] Test all views on mobile viewport
- [ ] Add hamburger menu for mobile sidebar
- [ ] Ensure PropertyHub table is usable on small screens

---

## Phase 6: Advanced Features (P3)

> **Goal:** Differentiating "cheat codes" for competitive advantage.

### 6.1 Document Intelligence
- [ ] Implement file upload to Firebase Storage
- [ ] Add document viewer for PDFs
- [ ] (Future) AI document parsing for compliance certificates

### 6.2 Notifications
- [ ] Set up Firebase Cloud Messaging
- [ ] Create notification centre in UI
- [ ] Trigger alerts for expiring compliance items

### 6.3 Reporting
- [ ] Property portfolio summary PDF export
- [ ] Compliance status report
- [ ] Financial overview report

---

## Quick Reference: Key Files

| Area | Primary File |
|------|--------------|
| Crash Location | `src/components/PropertyProfile/index.tsx` |
| Navigation | `src/context/AppContext.tsx`, `src/components/Sidebar.tsx` |
| Data Model | `src/types.ts` |
| Mock Data | `src/data/properties.json` |
| Unused Features | `src/components/PropertyHub/PropertyHubEnhanced.tsx` |
| Dashboard | `src/components/Dashboard/DashboardLayout.tsx` |

---

## Agent Prompts Ready

When you're ready to tackle a task, I can write prompts for:
- Claude Code (Haiku/Sonnet/Opus)
- Gemini CLI
- Cursor/Windsurf

Just tell me which task and which tool you're using.
