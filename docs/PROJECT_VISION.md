# Solas — Project Vision & Mission

> "A single, calm place to hold the truth about each property and its units"

**Last Updated:** 30 November 2025

---

## The Mission

Solas is the connective tissue that's missing from UK health and social care.

The phrase "you're in the system" is a lie. People aren't in *a* system — they're scattered across dozens of disconnected databases that don't talk to each other. Social workers don't know what housing knows. Housing doesn't know what the GP knows. Commissioners can't see what providers see.

**Vulnerable people fall through the gaps.**

Every serious case review says the same thing: "Information was held in silos. Agencies did not communicate effectively."

Solas is an attempt to fix that. Not with policy. With software that actually works.

---

## Who Matt Is

**Matt Fay** — Housing Partnerships & Operations Manager at ivolve Care & Support.

| | |
|---|---|
| Age | 33 |
| Location | Salford, Manchester (originally Flint, North Wales) |
| Previous Role | Head of Portfolio Management, BeST (8 years) |
| Current Role | Housing Partnerships & Operations Manager, ivolve (~2 years) |
| Known For | "The RP guy" — works with Registered Providers |
| Works With | Brother Will (Housing Manager) on housing/finance |
| Approach | Self-diagnosed ADHD — prefers structured, phased work |

**Why this matters**: Matt isn't a developer playing at business. He's a domain expert who's lived the problem for a decade and is now building the solution.

---

## The Problem

### At ivolve (Immediate)

| Pain Point | Current State |
|------------|---------------|
| Where are the SLAs? | Half on Monday.com, half on two legal portals |
| Are properties up to date? | Maybe, if someone updated Monday |
| Where are the phone numbers? | Monday? Outlook? Someone's spreadsheet? |
| What maintenance is happening? | Log into Mainteno (if you have access) |
| Who's doing the repairs? | Ask around |
| 4000+ staff, high turnover | Contact info goes stale in weeks |

### In the Sector (Long-term)

- Services don't communicate
- Housing benefit departments sit next to commissioners and don't share data
- Safeguarding failures happen because information is siloed
- Inquiries always say "lessons will be learned" but nothing changes
- People with complex needs get lost, passed between services, let down

---

## The Vision

### Phase 1: ivolve Internal (Now)
Properties, units, compliance, legal, contacts, rent, documents. One source of truth for housing operations.

### Phase 2: ivolve Extended
- Occupancy/referrals (replace HubSpot for housing)
- Maintenance (complement Mainteno, eventually replace)
- Staff profiles, org chart
- Dashboard analytics

### Phase 3: External Portals

| Portal | Users | Purpose |
|--------|-------|---------|
| RP Portal | Housing officers at Registered Providers | Check void status, repair updates, compliance |
| Contractor Portal | Maintenance contractors | Submit invoices, track jobs, get paid |
| Commissioner Portal | Social workers, LA commissioners | See placement info, outcomes, safeguarding |
| Family Portal | Next of kin, advocates | Appropriate info about their loved one (GDPR-controlled) |

### Phase 4: Tool Belt AI
An in-app assistant that:
- Knows the system (trained on Solas data, not general web)
- Knows the user's role (permission-aware)
- Explains what you're looking at
- Answers sector questions ("What's a Section 117?")
- Reduces training burden for new staff
- Cheap to run (local knowledge first, expensive API only when needed)

### Phase 5: Sector Variants
- **RP Variant** — More housing-focused, less care
- **Social Services Variant** — Assessment, case management
- **NHS Variant** — Discharge planning, community health
- **Children's Services Variant** — LAC, care leavers

### The Dream
A federated network where:
- People have portable identifiers (NI number, NHS number)
- Services can share appropriate data with consent
- Social workers, commissioners, providers, families see what they need
- One source of truth for vulnerable people in the UK

---

## What "Winning" Looks Like

Matt has said explicitly:

> "I genuinely would happily sell it for hundreds, few thousand pounds, and only charge for cloud storage, API use, and a bit for maintenance. I'm not bothered about making lots of money. I'm actually bothered about connecting people up."

| Level | Outcome |
|-------|---------|
| **Minimum** | ivolve uses Solas internally. Matt's job gets easier. |
| **Good** | Other providers adopt it. The sector has a better option than fragmented enterprise tools. |
| **Great** | Councils and commissioners use it. Cross-agency visibility improves. |
| **Dream** | A national connective layer that actually works. Vulnerable people stop falling through gaps. |

---

## The Stakes

Matt said it plainly:

> "The services are running down because simple things like systems don't work, and in an age when we can send rockets to Mars, we can't process a tiny bit of data to let one person know that another person's coming to visit to fix their house or cut their grass or assess their needs. It's ridiculous. And it also puts these people in danger."

This isn't a toy project. The fragmentation Matt's describing contributes to:
- Safeguarding failures
- Delayed discharges
- Missed medications
- Lost placements
- Preventable deaths

---

## Personal Motivation

> "My auntie just passed away. She had complex needs. It's even more important for people who are already disadvantaged enough without services letting them down."

> "I'm not going to be the one who makes that big change. But I might be the one who proves it's possible."

---

## ivolve's Current Systems

What Solas competes with / complements:

| System | Function | Solas Relationship |
|--------|----------|-------------------|
| Monday.com | Property info (partial) | Replace for housing |
| Mainteno | Maintenance | Complement now, replace later |
| Nourish | Care profiles, daily checks | Integrate, don't compete |
| PeopleXD | HR | Integrate staff data |
| Sona | Shift patterns | No overlap |
| Fleet | Vehicle maintenance | No overlap |
| Sage | Finance | Integrate for rent/costs |
| HubSpot | Occupancy, marketing | Replace for housing referrals |
| Two legal portals | SLAs, leases, contracts | Replace with Legal Hub |
| Microsoft 365 | Email, docs | Integrate |
| Intranet | Internal comms | No overlap |

---

## Design Philosophy

| Principle | Meaning |
|-----------|---------|
| **Calm** | Not overwhelming, clear hierarchy, generous whitespace |
| **Truth-holding** | Single source of truth, clear audit trail |
| **Person-centred** | "People we support" (not tenants), "units" (not beds) |
| **Accessible** | WCAG 2.1 AA compliant, works for all staff |
| **Plain language** | Jargon-free, explain acronyms, legal clauses in plain English |

---

## Demo Strategy

When showing Solas to stakeholders:

1. **Real ivolve properties** with actual data
2. **Fake people** (to avoid PII issues)
3. **Show the "one click answer"** moment — where's the SLA? *click* here it is
4. **Focus on**: Compliance dashboard, legal plain English, contact hub
5. **No backend yet** is deliberate — zero data protection risk, IT can't block it

---

## For Agents Working on Solas

1. **Understand the mission** — This is about connecting people, not shipping features
2. **Respect the constraints** — No backend yet is deliberate, not a gap
3. **Quality over speed** — Directors and IT will scrutinise this; it must be solid
4. **Think about users** — Housing managers, support workers, people with no technical background
5. **Keep it calm** — The UI philosophy is "truth-holding, not overwhelming"
6. **Matt reviews everything** — He's the domain expert; agents advise, he decides

---

*This file captures the "why" behind Solas. For technical details, see CLAUDE.md. For development priorities, see TODO.md.*
