# Address Book Hub — Build Brief

## Domain Context (Read This First)

This is **NOT** a generic contacts app. This is a stakeholder relationship hub for UK adult social care housing operations. Users are housing managers, support workers, and partnership leads who manage complex webs of relationships between:

- **Registered Providers (RPs)** — housing associations who own the properties
- **Local Authority Commissioners** — who fund placements and refer people
- **Support Providers** — care companies delivering support (sometimes we are the RP, sometimes we're the provider)
- **Solicitors & Legal Representatives** — who manage Court of Protection, LPAs, property matters
- **Health Services** — NHS trusts, GP surgeries, psychiatry teams, community nurses
- **Family & Personal Contacts** — next of kin, advocates, IMCA, family members
- **Property Contacts** — landlords, facilities managers, maintenance contractors
- **Utilities & Services** — council tax, water, energy suppliers, broadband
- **Financial Services** — banks, benefits agencies, DWP, appointeeship providers
- **Regulatory Bodies** — CQC, local safeguarding boards, housing ombudsman
- **Partnership Organisations** — other care providers, peer support networks, charities

Every contact exists in a **relationship network** — an RP contact might be linked to 15 properties, 3 local authorities they have contracts with, and 2 solicitors they work with regularly. A local authority commissioner might be tagged to 40 referrals and 12 active tenancies.

**This hub must surface those relationships instantly.**

---

## User Stories

### As a Housing Manager, I need to:
- Find the right contact at an RP when a void comes up (property manager vs finance vs CEO)
- See all properties linked to a specific RP or local authority at a glance
- Tag contacts to multiple properties, people, and organisations
- Identify which local authority a commissioner works for and what their remit is (LD? MH? Older people?)
- Store mobile numbers, email addresses, direct dial numbers, and preferred contact methods
- See organisational branding instantly (RP logo colours, local authority identities)
- Flag priority contacts (e.g., "Inclusion Housing" with red border = key partner)
- Add notes to contacts (e.g., "On leave until March", "Prefers email over phone")

### As a Support Worker, I need to:
- Find emergency contacts for a person we support quickly
- See family relationships and safeguarding context
- Access solicitor details for Court of Protection matters
- Find GP surgery contact details and who the named GP is
- Store context about communication preferences (e.g., "Hard of hearing, use SMS")

### As a Partnerships Lead, I need to:
- See all contacts grouped by organisation type (RPs, LAs, legal, health, etc.)
- Filter contacts by relationship tags (e.g., "Show me all contacts linked to Inclusion Housing properties")
- Export contact lists for mail merges or partnership reports
- Track which RPs we have active relationships with vs dormant ones
- Identify gaps in our network (e.g., "We have no contact for Mencap in this region")

---

## Feature Specification

### 1. Contact Cards (The Core UI)

**Card Design:**
- **Front Side (Default View):**
  - Organisation logo or avatar (if personal contact)
  - Name (bold, large)
  - Job title / role
  - Organisation name (if applicable)
  - Primary phone number (click to call)
  - Primary email (click to email)
  - Visual branding:
    - **RP contacts** → branded with organisation's primary colour (top border or left accent stripe)
    - **Inclusion Housing** → red border + "Inclusion" tag badge
    - **Local Authority** → council branding colour
    - **Health/NHS** → NHS blue
    - **Legal** → professional dark grey/navy
    - **Family/Personal** → warm neutral tone
  - Tag badges (small pills showing relationship types: "RP", "LA Commissioner", "Solicitor", "Property Contact", etc.)
  - Quick action icons (call, email, view linked properties, view linked people)

- **Back Side (Flip to Reveal):**
  - Full contact details (multiple phone numbers, addresses, websites)
  - Linked entities:
    - Properties (clickable chips navigating to PropertyProfile)
    - People (clickable chips navigating to PersonProfile)
    - Organisations (clickable chips navigating to other contacts)
    - Local Authorities (if RP or commissioner)
    - Referrals (if commissioner or social worker)
  - Notes section (free text, timestamped, editable)
  - Last contacted date
  - Preferred contact method (phone/email/SMS/post)
  - Safeguarding flags (if applicable, e.g., "Do not contact directly — use advocate")
  - Edit button (opens full contact form)

**Card Interaction:**
- Click/tap card → smooth 3D flip animation (CSS transform, 0.6s transition)
- Click back → flip back to front
- Hover state → subtle lift shadow (not flip — only flip on click)
- Mobile: tap to flip, swipe gestures for navigation

**Card Layout:**
- Grid view (default): 3 cards per row on desktop, 2 on tablet, 1 on mobile
- List view (toggle option): compact list with key info, flip icon on right
- Masonry layout option (if cards have varying heights due to tag count)

---

### 2. Search System (Fast, Forgiving, Multi-Field)

**Search Bar:**
- Prominent position (top of page, sticky)
- Real-time search as you type (debounced, 200ms delay)
- Search across:
  - Contact name
  - Organisation name
  - Job title
  - Email address
  - Phone numbers
  - Tags
  - Notes content
  - Linked property addresses
  - Linked people names
- Fuzzy matching (handle typos, partial matches)
- Search suggestions dropdown (show matching contacts as you type)
- Clear button (X icon)

**Advanced Search (Expandable Panel):**
- Filter by contact type (dropdown multi-select):
  - Registered Provider
  - Local Authority
  - Support Provider
  - Legal/Solicitor
  - Health Service
  - Family/Personal
  - Property Contact
  - Utilities/Services
  - Financial Services
  - Regulatory Body
  - Partnership Organisation
  - Other
- Filter by tags (multi-select chips)
- Filter by relationship:
  - "Has linked properties"
  - "Has linked people"
  - "Linked to specific RP" (dropdown)
  - "Linked to specific LA" (dropdown)
- Filter by recency:
  - "Contacted in last 30 days"
  - "Not contacted in 6+ months"
- Sort options:
  - Alphabetical (A-Z, Z-A)
  - Recently contacted
  - Recently added
  - Most linked entities (most connected contacts first)
  - Organisation type

**Search Results:**
- Show result count ("Showing 12 of 487 contacts")
- Highlight search terms in results (yellow background)
- "No results" state with helpful suggestions ("Try searching by organisation name or job title")

---

### 3. Tag System (The Relationship Engine)

**Tag Types:**

1. **Organisational Tags (Auto-Applied):**
   - Registered Provider
   - Local Authority
   - Support Provider
   - Legal/Solicitor
   - Health Service (NHS)
   - Family/Personal
   - Property Contact
   - Utilities/Services
   - Financial Services
   - Regulatory Body
   - Partnership Organisation

2. **Relationship Tags (User-Applied):**
   - Linked to [Property Name] → clickable, navigates to PropertyProfile
   - Linked to [Person Name] → clickable, navigates to PersonProfile
   - Commissioner for [LA Name]
   - Contract Manager for [RP Name]
   - Emergency Contact for [Person Name]
   - Next of Kin for [Person Name]
   - Solicitor for [Person Name]
   - GP for [Person Name]
   - Social Worker for [Person Name]
   - Landlord for [Property Name]
   - Facilities Manager for [Property Name]

3. **Custom Tags (User-Defined):**
   - Allow users to create free-text tags (e.g., "VIP Partner", "On Leave", "Preferred Supplier")
   - Tag colour picker (choose from preset palette)
   - Tags are reusable across contacts

4. **Special Flags:**
   - "Inclusion Housing" → red border, red "Inclusion" badge
   - "Priority Contact" → gold star icon
   - "Safeguarding Concern" → amber warning triangle
   - "Do Not Contact" → red crossed-out phone icon

**Tag Management:**
- Click tag on card → filter Address Book to show all contacts with that tag
- Tag manager panel (accessible via settings cog):
  - View all tags
  - Edit tag names and colours
  - Merge duplicate tags
  - Delete unused tags
  - See tag usage count ("Used on 23 contacts")
- Bulk tagging: select multiple contacts, apply tag to all

**Visual Design:**
- Tags as small rounded pills/chips
- Organisational tags: muted background, dark text
- Relationship tags: branded background (colour-coded by entity type)
- Custom tags: user-defined colour
- Max 5 tags visible on card front, "+3 more" indicator if overflow

---

### 4. Relationship Mapping (The Killer Feature)

**Entity Linking:**
When viewing a contact card (flipped to back side), show:

- **Linked Properties:**
  - Display as clickable chips with property name and postcode
  - Show count badge ("12 properties")
  - Click chip → navigate to PropertyProfile
  - Inline add button: "Link another property" → opens property search modal

- **Linked People:**
  - Display as clickable chips with person name and photo avatar
  - Show count badge ("3 people")
  - Click chip → navigate to PersonProfile
  - Inline add button: "Link another person" → opens person search modal

- **Linked Organisations:**
  - If contact is at an RP, show other RPs they're connected to (e.g., via joint ventures)
  - If contact is a commissioner, show which local authority they work for
  - Show parent organisations (e.g., "Inclusion Housing" is part of "Inclusion Group")

- **Linked Referrals:**
  - If contact is a commissioner or social worker, show active referrals they're linked to
  - Click to navigate to ReferralProfile

**Relationship Context:**
- Not just "linked to" — show **why** they're linked:
  - "Property Manager for [X, Y, Z properties]"
  - "Emergency Contact for [Person A, Person B]"
  - "Commissioning Lead for [LA] — Learning Disabilities"
  - "Solicitor representing [Person C] under Court of Protection"

**Visualisation Options (Future Enhancement):**
- Relationship graph view (network diagram showing contact at centre with lines to linked entities)
- Org chart view (if multiple contacts from same organisation)

---

### 5. Add Contact Form (Pop-Out Modal)

**Trigger:**
- "Add Contact" button (top right, primary CTA)
- Quick-add icon in search bar
- Keyboard shortcut: Ctrl/Cmd + K

**Form Structure (Tabbed or Stepped):**

**Tab 1: Basic Details**
- Contact Type (dropdown): RP, LA, Legal, Health, Family, Property, Utilities, Financial, Regulatory, Partnership, Other
- Name (required)
- Job Title
- Organisation Name
- Department (if applicable)
- Profile Photo / Logo Upload (drag-drop or file picker)

**Tab 2: Contact Methods**
- Primary Phone (required)
- Mobile Phone
- Direct Dial / Extension
- Office Phone
- Email Address (required)
- Alternative Email
- Postal Address (auto-complete using postcode lookup API)
- Website URL
- Preferred Contact Method (dropdown: Phone, Email, SMS, Post)

**Tab 3: Relationships**
- Link to Properties (search & multi-select)
  - For each property, specify relationship type (dropdown: Property Manager, Landlord, Facilities Manager, Maintenance Contact, etc.)
- Link to People (search & multi-select)
  - For each person, specify relationship type (dropdown: Emergency Contact, Next of Kin, Solicitor, GP, Social Worker, Family Member, etc.)
- Link to Organisations (search & multi-select)
- Link to Local Authorities (if applicable)

**Tab 4: Tags & Flags**
- Apply tags (multi-select from existing + create new)
- Special flags (checkboxes):
  - Priority Contact
  - Inclusion Housing
  - Safeguarding Concern
  - Do Not Contact
- Custom notes (rich text editor, 1000 character limit)

**Tab 5: Context & Notes**
- Remit / Responsibilities (free text)
- Office Hours
- Out of Office / Leave Dates
- Safeguarding Context (if applicable)
- Communication Preferences (e.g., "Prefers morning calls", "Hard of hearing")
- Internal Notes (not visible to contact, only to team)

**Form Behaviour:**
- Autosave to localStorage as user types (prevent data loss)
- Validation: highlight required fields in red if blank on submit
- "Save & Add Another" button (for bulk entry)
- "Save & View Contact" button (saves and flips to contact card)
- Cancel button (confirm if unsaved changes)
- Duplicate detection: "A contact named [X] at [Organisation] already exists. View existing contact or continue?"

**Visual Design:**
- Clean, minimal form (white background, soft shadows)
- Section headings in bold
- Inline help text (grey, small font)
- Progress indicator if multi-step (1 of 5, 2 of 5, etc.)
- Responsive: full-screen modal on mobile, centred overlay on desktop

---

### 6. Filtering & Grouping

**Filter Panel (Left Sidebar, Collapsible):**

- **By Organisation Type:**
  - Registered Providers (count badge)
  - Local Authorities (count badge)
  - Legal/Solicitors (count badge)
  - Health Services (count badge)
  - Family/Personal (count badge)
  - Property Contacts (count badge)
  - Other (count badge)

- **By Tags:**
  - Show top 10 most-used tags
  - Expand to show all
  - Multi-select (checkboxes)

- **By Relationship:**
  - Has linked properties
  - Has linked people
  - Linked to specific RP (dropdown)
  - Linked to specific LA (dropdown)

- **By Activity:**
  - Contacted in last 7 days
  - Contacted in last 30 days
  - Not contacted in 6+ months
  - Never contacted

- **By Special Flags:**
  - Priority Contacts
  - Inclusion Housing
  - Safeguarding Concerns
  - Do Not Contact

**Grouping Options (Dropdown Toggle):**
- Group by Organisation Type (collapsible sections, e.g., "Registered Providers (23)", "Local Authorities (12)")
- Group by First Letter (A, B, C, etc. — like a phone book)
- Group by Tag
- Group by Linked Entity Count (most connected first)
- No Grouping (flat list)

**Active Filters Bar:**
- Show applied filters as removable chips below search bar
- "Clear all filters" button
- Show result count ("Showing 12 contacts")

---

### 7. Bulk Actions

**Selection Mode:**
- Checkbox on each card (top-right corner)
- "Select All" checkbox (top of page)
- Shift-click to select range
- Selection count indicator ("23 selected")

**Bulk Actions Toolbar (Appears When Contacts Selected):**
- Add tag to selected
- Remove tag from selected
- Link to property (opens search modal)
- Link to person (opens search modal)
- Export selected (CSV, vCard, PDF)
- Delete selected (confirm dialog with warning)
- Merge duplicates (if 2+ contacts selected with same name)

---

### 8. RP Colour Branding System

**Data Model:**
Each Registered Provider has:
- Name
- Primary Brand Colour (hex code)
- Logo (uploaded image or icon)
- Website
- HQ Address

**Visual Application:**
- Contact cards for RP contacts → top border or left accent stripe in RP's brand colour
- Hover effect → accent colour brightens
- Tag badge → background uses RP colour at 10% opacity, text uses RP colour
- Example:
  - **Inclusion Housing** → Red (#DC2626) border, red "Inclusion" tag, red accent
  - **Sanctuary Housing** → Purple (#8B5CF6) border, purple "Sanctuary" tag
  - **Anchor Hanover** → Teal (#14B8A6) border, teal tag
  - **Places for People** → Orange (#F97316) border, orange tag

**Special Case: Inclusion Housing**
- Red border (4px, solid)
- Red "Inclusion" tag badge (always visible)
- Priority contact flag (gold star)
- Slight glow effect on hover (red shadow)

**Implementation:**
- RP colour data stored in `src/data/registeredProviders.ts`
- Lookup function in `src/utils/rpBrandingUtils.ts`
- CSS custom properties applied dynamically to cards:
  ```tsx
  <div
    className="contact-card"
    style={{
      '--rp-colour': rpColour,
      borderTopColor: rpColour
    }}
  >
  ```

---

### 9. Mobile Responsiveness

- Single-column card layout
- Sticky search bar
- Collapsible filter panel (drawer slides in from left)
- Tap to flip cards
- Swipe gestures:
  - Swipe left on card → quick actions (call, email, edit, delete)
  - Swipe right → dismiss quick actions
- Bottom sheet modal for add contact form (instead of centred overlay)
- Click-to-call phone numbers (tel: links)
- Click-to-email addresses (mailto: links)

---

### 10. Data Structure (TypeScript Types)

```typescript
interface Contact {
  id: string;
  type: ContactType;
  name: string;
  jobTitle?: string;
  organisationName?: string;
  department?: string;
  avatar?: string; // URL to photo/logo

  // Contact methods
  primaryPhone: string;
  mobilePhone?: string;
  directDial?: string;
  officePhone?: string;
  email: string;
  alternativeEmail?: string;
  postalAddress?: Address;
  website?: string;
  preferredContactMethod: 'phone' | 'email' | 'sms' | 'post';

  // Relationships
  linkedProperties: PropertyLink[];
  linkedPeople: PersonLink[];
  linkedOrganisations: string[]; // Organisation IDs
  linkedLocalAuthorities: string[]; // LA IDs
  linkedReferrals: string[]; // Referral IDs

  // Tags & flags
  tags: string[];
  isPriority: boolean;
  isInclusion: boolean;
  hasSafeguardingConcern: boolean;
  doNotContact: boolean;

  // RP branding (if contact type is RP)
  rpBrandColour?: string;
  rpLogo?: string;

  // Context
  remit?: string;
  officeHours?: string;
  outOfOffice?: {
    startDate: string;
    endDate: string;
    note: string;
  };
  safeguardingContext?: string;
  communicationPreferences?: string;
  notes: Note[];

  // Metadata
  createdDate: string;
  lastContacted?: string;
  createdBy: string;
  lastUpdatedBy: string;
}

type ContactType =
  | 'rp'
  | 'local-authority'
  | 'support-provider'
  | 'legal'
  | 'health'
  | 'family'
  | 'property'
  | 'utilities'
  | 'financial'
  | 'regulatory'
  | 'partnership'
  | 'other';

interface PropertyLink {
  propertyId: string;
  relationshipType: 'property-manager' | 'landlord' | 'facilities-manager' | 'maintenance' | 'other';
  notes?: string;
}

interface PersonLink {
  personId: string;
  relationshipType: 'emergency-contact' | 'next-of-kin' | 'solicitor' | 'gp' | 'social-worker' | 'family' | 'other';
  notes?: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}
```

---

### 11. Mock Data Requirements

Create **100+ realistic contacts** across all types:

- **Registered Providers (20 contacts):**
  - Inclusion Housing (5 contacts: CEO, Operations Director, Property Manager, Finance Manager, Voids Coordinator)
  - Sanctuary Housing, Anchor Hanover, Places for People, L&Q, Clarion, etc.
  - Mix of senior leaders, property managers, contract managers, finance leads

- **Local Authorities (15 contacts):**
  - Commissioners from West Sussex, East Sussex, Brighton & Hove, Surrey, Kent
  - Mix of LD, MH, older people's commissioning teams
  - Social workers, placement officers, contracts managers

- **Legal/Solicitors (10 contacts):**
  - Court of Protection specialists
  - Property lawyers
  - Mental capacity advocates
  - IMCA services

- **Health Services (15 contacts):**
  - GP surgeries
  - Community mental health teams
  - Psychiatrists
  - Community nurses
  - NHS trusts

- **Family/Personal (20 contacts):**
  - Next of kin
  - Family members
  - Advocates
  - Friends
  - Personal representatives

- **Property Contacts (10 contacts):**
  - Landlords
  - Facilities managers
  - Maintenance contractors
  - Estate agents

- **Utilities/Services (10 contacts):**
  - Council tax offices
  - Water companies
  - Energy suppliers
  - Broadband providers

- **Other (10+ contacts):**
  - Partnership organisations
  - Charities
  - Peer support networks
  - Regulators (CQC, Housing Ombudsman)

**Linking:**
- Link RP contacts to 5-15 properties each
- Link commissioners to 10-30 active referrals
- Link solicitors to 3-8 people
- Link GPs to 10-20 people
- Link family contacts to 1-3 people
- Link property managers to their RP's properties

---

### 12. Empty States

- **No contacts yet:** "No contacts added yet. Get started by clicking 'Add Contact' above."
- **No search results:** "No contacts match your search. Try different keywords or check your filters."
- **No linked entities:** "This contact isn't linked to any properties, people, or organisations yet. Click 'Add Link' to connect them."
- **Filter returns empty:** "No contacts match these filters. Try broadening your search."

---

### 13. Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (ARIA labels, roles, live regions)
- Focus indicators (visible outline on interactive elements)
- High contrast mode support
- Text scaling (up to 200% without breaking layout)
- Alternative text for avatars/logos
- Form validation errors announced to screen readers

---

### 14. Performance Considerations

- Lazy load contact cards (render first 20, load more on scroll)
- Virtualised list for 500+ contacts (react-window or similar)
- Debounced search (200ms)
- Memoised filter/sort functions
- Image optimisation (compress avatars/logos, lazy load)
- Cache search results in memory
- Paginate if contact count > 1000

---

### 15. Future Enhancements (Out of Scope for V1)

- **Communication Tracking:**
  - Log calls, emails, meetings
  - Show timeline of interactions
  - Set reminders for follow-ups

- **Integration with Email/Calendar:**
  - Send emails from within Address Book
  - Create calendar events for meetings
  - Auto-log email interactions

- **Relationship Graph Visualisation:**
  - Network diagram showing contact connections
  - Org chart view for RP contacts

- **Duplicate Detection & Merge:**
  - Auto-detect potential duplicates
  - Merge tool with conflict resolution

- **Export & Sync:**
  - Export to CSV, vCard, Excel
  - Sync with Outlook, Google Contacts
  - QR code for contact sharing

- **Role-Based Permissions:**
  - Some contacts visible only to certain users
  - Restrict editing of sensitive contacts (e.g., safeguarding)

---

## Design System Integration

**Hero Banner (if Contact Detail Page in Future):**
- Follow `docs/HERO_BANNER_GUIDE.md`
- Background colour based on contact type (RP → RP brand colour, LA → council colour, etc.)
- Avatar/logo large and centred
- Name, job title, organisation as hero text

**Colour Palette:**
- Use existing Tailwind config + RP brand colours
- Tag colours from predefined palette (avoid user-selected neon chaos)
- Safeguarding amber: `bg-amber-100 text-amber-800 border-amber-400`
- Priority gold: `bg-yellow-100 text-yellow-800 border-yellow-400`
- Inclusion red: `bg-red-100 text-red-800 border-red-500`

**Typography:**
- Contact name: `text-lg font-semibold`
- Job title: `text-sm text-gray-600`
- Organisation: `text-sm text-gray-500`
- Tags: `text-xs font-medium`

**Spacing:**
- Card padding: `p-4`
- Card gap in grid: `gap-4`
- Section spacing: `space-y-6`

---

## Testing Checklist

- [ ] Add contact form validates required fields
- [ ] Search returns correct results across all fields
- [ ] Filters combine correctly (AND logic)
- [ ] Tags apply and remove correctly
- [ ] Card flip animation smooth on all browsers
- [ ] Linked entities navigate correctly
- [ ] Bulk actions work on selected contacts
- [ ] Mobile responsive (test on real device)
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] RP colour branding applies correctly
- [ ] Inclusion Housing gets red border
- [ ] Form autosaves on input
- [ ] Duplicate detection triggers
- [ ] Empty states show correctly
- [ ] Large dataset (1000+ contacts) performs well

---

## Success Criteria

This Address Book is successful if:

1. **Matt can find any contact in under 10 seconds** (search + filters)
2. **Relationship context is immediately visible** (no clicking through 5 screens to see "Who is this person's GP?")
3. **RP branding is unmistakable** (Matt sees red border and knows "Inclusion")
4. **Tags make filtering effortless** (click "Inclusion Housing" tag, see all Inclusion contacts + properties + people)
5. **Adding a contact is painless** (form is short, autosaves, validates)
6. **The hub feels like a living network**, not a dead list of names

---

## AI Build Instructions

When building this hub:

1. **Read `CLAUDE.md` and `docs/PROJECT_VISION.md` first** — understand the sector context
2. **Use British English** throughout (colour, organisation, realise, etc.)
3. **Reference existing patterns:**
   - PropertyProfile tabs for multi-section layouts
   - PersonProfile cards for entity cards
   - ReferralsHub filters for filter panel
   - Development Hub kanban for drag-drop (if future enhancement)
4. **Create mock data with realistic UK names, postcodes, organisations**
5. **Use Tailwind CSS 3.4** — no dynamic class construction
6. **Store data in `src/data/contacts.ts`**
7. **Create types in `src/types/contacts.ts`**
8. **Use Context API for state** (no backend yet)
9. **Make it beautiful** — this is a showcase feature, not a prototype
10. **Test on mobile** — Matt will demo this to stakeholders on his phone

---

## File Structure

```
src/
  components/
    AddressBook/
      AddressBookHub.tsx          # Main page
      ContactCard.tsx             # Flip card component
      ContactCardFront.tsx        # Card front side
      ContactCardBack.tsx         # Card back side
      AddContactModal.tsx         # Add/edit form
      ContactSearchBar.tsx        # Search input + advanced search
      ContactFilters.tsx          # Filter sidebar
      ContactBulkActions.tsx      # Bulk actions toolbar
      ContactTags.tsx             # Tag manager
      EntityLink.tsx              # Reusable linked entity chip
  data/
    contacts.ts                   # Mock contact data
    registeredProviders.ts        # RP branding data (extend existing)
  types/
    contacts.ts                   # Contact types
  utils/
    contactUtils.ts               # Search, filter, sort functions
    rpBrandingUtils.ts            # RP colour lookup (extend existing)
  context/
    ContactsContext.tsx           # Global contacts state
```

---

## Final Notes

This is not a side feature — **this is the central nervous system of Solas**. Every other hub connects to contacts: properties have landlords, people have GPs, referrals have commissioners, developments have planning officers.

Build it like the beating heart of the CRM.

Make Matt say "Bloody hell, that's exactly what I needed."

---

*When complete, update `CLAUDE.md` current state, check off this task in `docs/TODO.md`, and log session in `docs/SESSION_LOG.md`.*
