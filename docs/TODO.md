# Solas CRM — Development Roadmap

**Last Updated:** 7 February 2026
**Current Branch:** `feature/code-quality-fixes`

---

## Current State

| Area | Status | Notes |
|------|--------|-------|
| Dashboard | ✅ Working | Drag-drop widgets, greeting, stats |
| Property Hub | ✅ Working | Master/unit hierarchy, search, filters, saved views |
| Property Profile | ✅ Working | All tabs loading, service type theming |
| PersonProfile | ✅ Working | 12 tabs, service type colour coding, hero banner polish |
| ReferralsHub | ✅ Working | 11-stage workflow |
| ReferralProfile | ✅ Working | 8 tabs |
| Development Hub | ✅ Working | Full kanban pipeline, drag-drop, stats |
| Void Management | ✅ Working | Basic |
| Finance | ⚠️ Basic | Structure in place, needs features |
| Sidebar/Navigation | ✅ Working | 16-item, 2-column collapsed grid |
| UI Design System | ✅ Working | Shared components, service type theming |
| Projects Hub | 🟡 Placeholder | Built but generic — needs sector content |
| Report Centre | 🟡 Placeholder | Built but generic — needs sector content |
| Repairs Hub | 🟡 Placeholder | Built but generic — needs sector content |
| Legal Hub | 🟡 Placeholder | Built but generic — needs sector content |
| The Library | 🟡 Placeholder | Built but generic — needs sector content |
| Address Book | 🟡 Placeholder | Built but generic — needs sector content |
| Compliance Hub | 🔵 Planned | Detailed plan exists, paused |
| Backend/Auth | ❌ Not started | Supabase planned |
| Tests | ❌ Not started | No coverage |

---

## Completed Phases

### Phase 1: Core Flow ✅
React Router, PropertyHub wired up, Property Profile crash fixed, all views loading.

### Phase 2: Codebase Health ✅
Removed ~130 unused files, legacy prototype deleted, down to 75 source files.

### Phase 2.5: PersonProfile & People Hub ✅
12 tabs with service type colour coding, hero banner with icon-only buttons, Notice Board redesign, coloured borders on all cards.

### Phase 2.6: UI Polish & Service Type Theming ✅
Consistent green/blue/rose theming throughout. Demographics grid optimised.

### Phase 2.7: Navigation Overhaul ✅
16 hub areas, 7 new placeholder pages, 2-column collapsed sidebar.

### Phase 2.8: Hero Banner UX Polish ✅
Icon-only buttons with tooltips, hover effects, warning animations, post-it note styling.

### Phase 2.9: Major Cleanup & Refactoring ✅
156 files audited, 2 critical Tailwind bugs fixed, ContactPopover extracted, TabId types centralised, 200+ lines of duplicate code removed.

### Phase 3: Brand Alignment ✅
Volte Rounded fonts, ivolve brand colours in Tailwind config. (Note: branding will be updated when product is rebranded from ivolve to Solas standalone identity.)

### Phase 4: SASSHA 360 Research ✅
35 PDFs analysed, 14 modules documented, complete TypeScript interfaces extracted. Critical findings: need Safeguarding module, Support Plans, Risk Assessments.

### Phase 4.5: Development Hub ✅
Full kanban pipeline (11 stages), drag-drop, opportunity management, confetti on wins, localStorage persistence. Needs sector-specific refinement.

---

## Current Priority: Phase 5 — Documentation & Cleanup

> Triggered by claude.ai project review (7 Feb 2026)

- [x] Slim CLAUDE.md (was ~450 lines, now ~120)
- [x] Extract session history to docs/SESSION_LOG.md
- [x] Extract decisions to docs/DECISIONS.md
- [x] Add domain lens and compaction rules to CLAUDE.md
- [x] Update this TODO.md to reflect reality
- [x] Remove Amy persona references
- [ ] **Matt to do:** Move sensitive data folders out of repo directory (Compliance Data Private Let Only, IVOLVE LEGALS, RENTS & SERVICES)
- [ ] **Matt to do:** Delete empty `plans/` folder
- [ ] Remove Firebase dependency from package.json (when ready — don't break build)
- [ ] Rename repo from "Solas-app---gregs-attempt" to "solas-crm" (GitHub rename + package.json)

---

## Next: Phase 6 — Sector-Specific Hub Refinement

> The placeholder hubs (Projects, Report Centre, Repairs, Legal, Library, Address Book) are built but generic. They need sector-specific fields, workflows, and data models that make sense for supported housing / care providers.

### 6.1 Development Hub Refinement
- [ ] Add commissioner relationship fields (which LA, which ICB, contact details)
- [ ] Add RP partnership fields (which RP, their requirements, void terms)
- [ ] Add regulatory context (CQC registration needed? Planning permission?)
- [ ] Property type-specific checklists (supported living vs residential vs nursing)
- [ ] Financial modelling fields (rent levels, HB eligibility, service charge structure)

### 6.2 Legal Hub Build-Out
- [ ] SLA tracker (which RP, review date, key terms, escalation contacts)
- [ ] Lease/licence agreement library
- [ ] Section 117 aftercare tracking
- [ ] Tenancy type classifier (AST vs Excluded Licence vs RP lease)
- [ ] Plain English summaries of legal clauses

### 6.3 Compliance Hub (resume from Phase 4 research)
- [ ] Build from existing plan in docs/COMPLIANCE_HUB_PLAN.md
- [ ] 15+ compliance categories (EICR, PAT, FRA, FFE, Gas, LRA, etc.)
- [ ] Traffic light status across portfolio
- [ ] Alerts for expiring certificates
- [ ] Link to Property Profile compliance tab

### 6.4 Repairs Hub
- [ ] Handback vs provider responsibility classifier
- [ ] Contractor management (who does what, contact details, SLAs)
- [ ] Job lifecycle (reported → assigned → in progress → completed → invoiced)
- [ ] Cost tracking and budget vs actual

### 6.5 Projects Hub Refinement
- [ ] Sector-relevant project types (property conversion, service mobilisation, deregistration, handback)
- [ ] Link to Development Hub opportunities where relevant
- [ ] Milestone tracking with RAG status

### 6.6 Report Centre
- [ ] Quarterly Housing Board report template
- [ ] Void rate dashboard
- [ ] Compliance overview
- [ ] Financial summary (rent collected vs target)

### 6.7 The Library
- [ ] Knowledge base for housing law (Section 21, Section 8, Excluded Licences, etc.)
- [ ] Easy Read template library
- [ ] Policy document storage
- [ ] Training materials

### 6.8 Address Book
- [ ] RP contacts (housing officers, asset managers, compliance leads)
- [ ] Commissioner contacts (social workers, placement teams, ICB leads)
- [ ] Contractor contacts
- [ ] Internal contacts (ops managers, regional directors)
- [ ] Role-based grouping, not just alphabetical

---

## Phase 7: Backend & Auth (Supabase)

- [ ] Set up Supabase project
- [ ] Design database schema (informed by current TypeScript types)
- [ ] Implement authentication (email/password, possibly SSO)
- [ ] Migrate from localStorage to Supabase
- [ ] Role-based access control (housing manager vs support worker vs admin)
- [ ] File storage for documents/certificates

---

## Phase 8: Testing

- [ ] Install Vitest + React Testing Library
- [ ] Smoke tests: each hub renders without errors
- [ ] Unit tests: compliance status calculation, service type theming
- [ ] Integration tests: navigation, data persistence

---

## Phase 9: Product Identity & Rebranding

- [ ] Replace ivolve branding with Solas identity
- [ ] New colour palette (keep calm, professional — not corporate)
- [ ] Update fonts if needed (Volte Rounded may need licensing check)
- [ ] Logo design
- [ ] Landing page / marketing site

---

## Future Phases (Parking Lot)

These are important but not yet prioritised:

- **Safeguarding module** (P0 from SASSHA research — legal requirement)
- **Support Plans & Risk Assessments** (P0 from SASSHA research)
- **Mobile responsiveness**
- **Finance module build-out** (rent schedules, void cost calculator, arrears)
- **Document intelligence** (upload, viewer, AI parsing)
- **External portals** (RP portal, contractor portal, commissioner portal, family portal)
- **Tool Belt AI** (in-app assistant trained on Solas data)
- **Sector variants** (RP version, social services version, NHS version)

---

## Quick Commands

```bash
npm run dev        # Start dev server
npm run build      # Build (includes TypeScript check)
npx tsc --noEmit   # Type check only
```

---

*Update this file when phases are completed or priorities change. Keep it as the single source of truth for "what's done and what's next."*
