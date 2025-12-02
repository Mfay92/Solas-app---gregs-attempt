# CLAUDE.md — Solas CRM Project Context

> This file maintains persistent context for Claude Code sessions. It ensures continuity across conversations and tracks project knowledge, decisions, and permissions.

**Last Updated:** 30 November 2025
**Primary Advisor:** Amy (CRM Development Expert persona)
**Developer:** Matt Fay (Housing Partnerships & Operations Manager, ivolve)

---

## Quick Context

**What is Solas?** A "calm, truth-holding" CRM for housing operations in the care/support sector. See [PROJECT_VISION.md](PROJECT_VISION.md) for the full mission and long-term vision.

**Why does it matter?** Vulnerable people fall through gaps because services don't communicate. Solas is the connective tissue that's missing.

**Who is Matt?** Domain expert with 10 years in supported housing (BeST → ivolve). Self-diagnosed ADHD — prefers structured, phased work.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 3.4.17 (custom ivolve brand palette)
- **Dashboard:** React Grid Layout (drag-and-drop widgets)
- **State:** Context API + localStorage persistence
- **Backend:** Firebase (installed, not yet integrated)
- **Data:** Mock JSON (real ivolve property structure, fake people for demo)

---

## Current State (30 Nov 2025)

| Metric | Status |
|--------|--------|
| Core Infrastructure | 70% complete |
| Features Functional | 40% |
| Backend Integration | 0% |
| Test Coverage | 0% |
| Production Readiness | 30% |

**Branch:** `feature/code-quality-fixes`

**Working:**
- Dashboard with drag-and-drop widgets
- Property Hub with Master/Unit hierarchy
- Property Profile (all tabs loading correctly) ✓
- Finance page (basic)
- Sidebar navigation

**Broken:**
- None currently — all P0 issues resolved

---

## Permissions Granted

| Permission | Granted By | Date | Notes |
|------------|-----------|------|-------|
| Full codebase review | Matt | 30 Nov 2025 | Initial review completed |
| Write feedback/TODO files | Matt | 30 Nov 2025 | FEEDBACK.md, TODO.md created |
| Advise on agent selection | Matt | 30 Nov 2025 | Claude vs Gemini, model choice |
| Execute plans with approval | Matt | 30 Nov 2025 | Detail plan + reasoning, Matt approves |

---

## Decisions Made

### Architecture Decisions
1. **React Router implemented** — Routes: `/`, `/properties`, `/properties/:id`, `/finance`, `/settings`. Browser back/forward works.
2. **Tailwind CSS v3** — Downgraded from v4 for stability.

### Data Governance (Confirmed 30 Nov 2025)
- **Real data allowed**: Properties, stakeholders, staff, offices, day centres, training facilities (public/low-risk)
- **Fictional only**: People we support (residents) — always use mock data for privacy
- **Property types to include**: Supported living, residential, nursing, offices, day centres, training facilities
- **Legal sign-off**: Colleague confirmed approach is compliant

### Workflow Decisions
1. **Phase-gated development** — Complete and verify each phase before moving to next.
2. **Amy persona active** — Candid, structured advice. British English. No buzzwords.
3. **TODO.md as source of truth** — All tasks tracked there with phases.

---

## Session Log

### Session 1 — 30 November 2025
**Actions Taken:**
1. Full codebase exploration via Explore agent
2. Updated `FEEDBACK.md` with comprehensive review (P0-P3 priorities)
3. Rewrote `TODO.md` with phased development roadmap
4. Reviewed existing `BEST_CRM_PRACTICES.md` (by Antigravity)
5. Created this `CLAUDE.md` for persistent context

**Findings:**
- 50+ components, 20+ TypeScript interfaces
- PropertyProfile crash is P0 blocker
- PropertyHub has advanced features built but not wired (EnhancedToolbar, AdvancedFilterBuilder, etc.)
- Dashboard widget system is sophisticated and working

**Outcome:**
- Property Profile crash **FIXED** (confirmed by Matt — loads fine)
- Ready to proceed to Phase 2 (P1 priorities)

**Next Priority:** React Router integration (Phase 2.1)

---

## Working Patterns

### How Amy Works
1. **Reviews before acting** — Always reads code before suggesting changes
2. **Details plans with reasoning** — Matt approves before execution
3. **Tracks everything** — Updates this file and TODO.md as we progress
4. **Phase gates** — Won't move to next phase until current phase is verified working
5. **Candid feedback** — Tells Matt what he needs to hear, not just what he wants to hear

### Agent Usage Guidelines
- **Claude Code Opus** — Complex reasoning, architecture decisions, debugging crashes
- **Claude Code Sonnet** — Standard implementation tasks, refactoring
- **Claude Code Haiku** — Quick lookups, simple fixes, file searches
- **Gemini** — Alternative for very large context windows (1M tokens)

### Agent Session Notes
- Each Task tool invocation is **stateless** — agents don't retain memory between calls
- Can give agents **multi-part prompts** in a single call
- For sequential dependent tasks, call agents in sequence (not parallel)
- Always specify expected outputs and success criteria in prompts

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Type definitions | `src/types.ts` |
| Mock property data | `src/data/properties.json` |
| App state | `src/context/AppContext.tsx` |
| Main layout | `src/components/Layout.tsx` |
| Sidebar nav | `src/components/Sidebar.tsx` |
| Dashboard | `src/components/Dashboard/DashboardLayout.tsx` |
| Property list | `src/components/PropertyHub/PropertyHub.tsx` |
| Property detail | `src/components/PropertyProfile/index.tsx` |
| Error handling | `src/components/ErrorBoundary.tsx` |

## Project Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file — session context, permissions, decisions |
| `PROJECT_VISION.md` | Mission, Matt's background, long-term vision |
| `TODO.md` | Phased development roadmap with tasks |
| `FEEDBACK.md` | Codebase review with P0-P3 priorities |
| `BEST_CRM_PRACTICES.md` | Sector knowledge, what good CRMs do |

---

## Communication Preferences

| Do | Don't |
|----|-------|
| British English | American spelling |
| "People we support" | "Tenants" (unless legal context) |
| "Units" | "Beds" |
| Plain language | Jargon without explanation |
| Structured (tables, lists) | Walls of text |
| Candid feedback | Sycophancy |
| Phase-gated work | Overwhelming scope |

**Avoid these words:** navigate, embark, unlock, elevate, game-changer, synergy, leverage, tapestry

---

## Notes for Future Sessions

If starting a new session, read this file first to understand:
1. Current project state and what's working/broken
2. Permissions already granted
3. Decisions already made
4. What was done in previous sessions
5. What the next priority is

The active persona is **Amy** — see `.claude/plans/zesty-gathering-petal.md` for full persona definition.

---

## Questions to Ask Matt

(Record any pending questions here for continuity)

- None currently

---

*This file is maintained by Claude Code and should be updated at the end of each significant session.*
