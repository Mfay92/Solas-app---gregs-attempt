# CLAUDE.md — Solas CRM

## Domain Lens (Read First — Non-Negotiable)

Everything in this project serves **UK adult social care**. Users are housing managers, support workers, and commissioners working with **vulnerable adults** (learning disabilities, autism, complex needs, mental health). Solas is the connective tissue between care providers, Registered Providers (housing associations), local authority commissioners, and the people they support.

**Language rules:** "people we support" (not tenants), "units" (not beds), "colleagues" (not staff). Plain English, no jargon. If unsure about sector context, **read `docs/PROJECT_VISION.md` before building anything.**

## Compaction Rule

If this session compacts or context is summarised, **immediately re-read this file and `docs/PROJECT_VISION.md`** to restore domain context. The sector lens above must survive any compaction. Do not build anything generic — every feature should make sense to a housing manager in a UK care provider.

## Project Summary

| | |
|---|---|
| **What** | CRM for housing operations in care/support sector |
| **Who** | Matt Fay — Housing Partnerships & Operations Manager, ivolve Care & Support |
| **Stack** | React 19 + TypeScript + Vite + Tailwind CSS 3.4 |
| **State** | Context API + localStorage (no backend yet) |
| **Backend (planned)** | Supabase (SSH key integration — Firebase dependency to be removed) |
| **Data** | Mock JSON with real property structure, fictional people |
| **Branch** | `feature/code-quality-fixes` |
| **Repo** | github.com/Mfay92/Solas-app---gregs-attempt (rename to `solas-crm` pending) |

## Current State (February 2026)

**Working:** Dashboard (drag-drop widgets), Property Hub (master/unit hierarchy, search, filters), Property Profile (all tabs), PersonProfile (12 tabs, service type colour coding), ReferralsHub (11-stage workflow), ReferralProfile (8 tabs), Development Hub (full kanban pipeline), Notice Board, Void Management, Finance (basic), 16-item sidebar navigation, Developer Settings.

**Placeholder hubs (built but generic — need sector-specific content):** Projects Hub, Report Centre, Repairs Hub, Legal Hub, The Library, Address Book.

**Not started:** Backend/auth, testing, mobile responsiveness, Compliance Hub (paused, plan exists).

**Known issues:** None critical. Development Hub and Projects Hub need sector-specific fields and workflows — they currently feel too generic for supported housing use.

## Working With Matt

- **Self-taught with AI** — not a developer, but strong domain expert with clear vision
- **ADHD** — prefers structured phases, clear checkpoints, tables over paragraphs
- **Phase-gated work** — complete and verify each phase before moving to next. Do NOT jump ahead.
- **Check in between phases** — after completing work, review CLAUDE.md, TODO.md, and code quality before starting next phase
- **Matt reviews outputs, not files** — build it and show it working rather than explaining in docs he won't read
- **British English** — always. "colour" not "color" in comments and UI text.

### Communication Style

| Do | Don't |
|----|-------|
| British English | American spelling |
| "People we support" | "Tenants" (unless legal context) |
| "Units" | "Beds" |
| Plain language | Jargon without explanation |
| Structured (tables, lists) | Walls of text |
| Candid feedback | Sycophancy |
| Phase-gated work | Overwhelming scope |

**Banned words:** navigate, embark, unlock, elevate, game-changer, synergy, leverage, tapestry

## Permissions

- Full codebase read/write ✓
- Git add, commit, push ✓
- npm install, build, dev ✓
- Create/update documentation ✓
- Execute plans after detailing reasoning — Matt approves before major changes

## File Maintenance Rules

After completing any significant work:

1. **Update this file's "Current State" section** if anything has changed
2. **Update `docs/TODO.md`** — check off completed items, add new ones
3. **Log the session** in `docs/SESSION_LOG.md` (date, what was done, outcome)
4. **Check for stale references** — dead links, missing files, outdated status
5. **Before starting a new phase**, re-read this file to confirm you have the right context
6. If you notice a repeated task you're solving inline, **consider building a reusable utility in `src/utils/`** instead

## Key Files

| Purpose | File |
|---------|------|
| **This file** | `CLAUDE.md` — current state, working patterns |
| **Vision & mission** | `docs/PROJECT_VISION.md` — the "why" behind Solas |
| **Development roadmap** | `docs/TODO.md` — phased tasks with checkboxes |
| **Session history** | `docs/SESSION_LOG.md` — what happened in each session |
| **Architecture decisions** | `docs/DECISIONS.md` — why we chose what we chose |
| **Codebase review** | `docs/FEEDBACK.md` — P0-P3 priorities from initial audit |
| **Hero banner patterns** | `docs/HERO_BANNER_GUIDE.md` — design system for profile pages |
| **Hub build briefs** | `docs/*_PROMPT.md` — sector-specific briefs for each hub |

## Tech Notes

- **Tailwind v3** (downgraded from v4 for stability) — do NOT use dynamic class construction (e.g., `bg-${color}-500`). Use full class names via lookup objects.
- **Service type theming:** Green = Supported Living, Blue = Residential Care, Rose = Nursing Care. Use `src/utils/serviceTypeUtils.ts`.
- **Type definitions** split across `src/types.ts` (core) and `src/types/*.ts` (module-specific).
- **Firebase is installed but NOT in use** — will be replaced with Supabase. Do not build Firebase integrations.
- **Mock data** in `src/data/` — real property structures, fictional people for privacy.

## Subagent Guidance

When spawning subagents for parallel tasks:
- Always include the domain lens: "This project is for UK adult social care — supported living, learning disabilities, vulnerable adults."
- Point them to specific files they need, don't make them read everything.
- Subagents are good for: research tasks, running tests, reviewing code, writing documentation.
- Subagents should NOT make architectural decisions — flag those for the main session.

---

*For full session history, see `docs/SESSION_LOG.md`. For architecture decisions, see `docs/DECISIONS.md`.*
