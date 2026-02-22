# Solas CRM — Architecture & Strategy Decisions

> Decisions that affect the whole project. Once made, these shouldn't be revisited without good reason. If a future session questions a decision here, check with Matt first.

---

## Strategic Decisions

### Product Direction (February 2026)
**Decision:** Solas is an independent product, not an ivolve-internal tool.
**Reasoning:** Matt has domain expertise from 10+ years in the sector. ivolve branding is temporary — the app will be rebranded with its own identity for sale to any UK care/support provider, RP, or commissioner. ivolve can buy it if they want.
**Impact:** Don't hard-code ivolve-specific references. Keep branding configurable. Think about what ANY supported living provider would need, not just ivolve.

### Backend: Supabase (not Firebase)
**Decision:** Supabase will be the backend when we're ready. Firebase dependency to be removed.
**Reasoning:** Matt has experience with Supabase SSH key integration via Claude Code. Google One account cancelled. Supabase aligns better with the stack and Matt's workflow.
**Impact:** Do NOT build Firebase integrations. When backend work begins, use Supabase (Postgres, Auth, Storage). Firebase package in package.json to be removed in a cleanup pass.

### Mock Data Strategy
**Decision:** Real property structures, fictional people. Always.
**Reasoning:** Property data (addresses, compliance types, lease structures) is public/low-risk. People we support are always fictional for privacy. Colleague data is also fictional for now.
**Impact:** `src/data/properties.json` uses real ivolve property structures. `src/data/people.json` is entirely fictional. Never use real names, NHS numbers, or personal details.

---

## Architecture Decisions

### React Router (Session 1)
**Decision:** React Router for client-side routing.
**Routes:** `/`, `/properties`, `/properties/:id`, `/people`, `/people/:id`, `/referrals`, `/referrals/:id`, `/development`, `/projects`, `/reports`, `/repairs`, `/legal`, `/library`, `/address-book`, `/compliance`, `/finance`, `/voids`, `/meetings`, `/settings`
**Impact:** Browser back/forward works. All hubs accessible via URL.

### Tailwind CSS v3 (not v4)
**Decision:** Downgraded from v4 to v3.4.17 for stability.
**Critical rule:** Do NOT use dynamic Tailwind class construction (e.g., `bg-${color}-500`). Classes must be full strings so they're included in the build. Use lookup objects instead.
**Impact:** All colour-based styling uses utility functions (e.g., `getServiceTypeColor()` in `src/utils/serviceTypeUtils.ts`).

### Service Type Theming
**Decision:** Three service types with consistent colour coding throughout the app.
- **Supported Living** = Green
- **Residential Care** = Blue  
- **Nursing Care** = Rose

**Impact:** Hero banners, card borders, badges, and status indicators all use these colours. Centralised in `src/utils/serviceTypeUtils.ts`.

### State Management: Context API + localStorage
**Decision:** No Redux or Zustand. Context API for app state, localStorage for persistence.
**Reasoning:** App is frontend-only for now. Complexity of external state management not justified until backend integration.
**Impact:** When Supabase is added, localStorage persistence will need to be replaced with API calls. Context API can stay as the React-side state layer.

### Type Definitions: Split Structure
**Decision:** Core types in `src/types.ts`, module-specific types in `src/types/*.ts`.
**Files:** `types.ts` (core), `types/tabs.ts` (tab IDs), `types/opportunities.ts` (Development Hub), `types/projects.ts` (Projects Hub), `types/compliance.ts` (Compliance Hub)
**Impact:** Import from the specific file, not from a barrel export. Keeps imports clean.

### Property Hierarchy: Master → Unit
**Decision:** Properties have a master record (the building) and child units (individual flats/rooms).
**Impact:** PropertyHub shows masters with expandable units. PropertyProfile loads either a master or unit. Data model in `src/types.ts` uses `PropertyAsset` with `assetType: 'Master' | 'Unit'`.

### Hub Pattern: Consistent Structure
**Decision:** Every hub follows the same pattern: hero banner, stats bar, main content area (table or kanban), filters, search.
**Reference:** ReferralsHub and DevelopmentHub are the most complete examples. New hubs should follow these patterns.
**Guide:** `docs/HERO_BANNER_GUIDE.md` documents the hero banner design system.

---

## Data Governance (Confirmed 30 November 2025)

| Data Type | Rule |
|-----------|------|
| Properties, addresses, compliance types | Real data allowed |
| Stakeholders (RPs, commissioners, LAs) | Real organisations allowed |
| Staff/offices/day centres/training facilities | Real data allowed (public/low-risk) |
| People we support (residents) | **Fictional only** — always mock data |
| Personal/medical/financial details | **Never real data** |

Legal sign-off confirmed by colleague (Nov 2025).

---

*Update this file when a significant architectural or strategic decision is made. Don't log implementation details here — those go in SESSION_LOG.md.*
