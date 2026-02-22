# Address Book - Build Brief for Claude Code

> **Your Mission**: Build a contact database so useful that users never need to hunt through emails, phones, or spreadsheets for contact information again.

---

## Before You Start - Essential Reading

**READ THESE FILES FIRST** (in this order):

1. **`CLAUDE.md`** - Full project context, tech stack, current state
2. **`PROJECT_VISION.md`** - Sector understanding
3. **`docs/HERO_BANNER_GUIDE.md`** - Hero banner patterns
4. **`src/components/PeopleHub/index.tsx`** - Excellent example of searchable, filterable database view
5. **`src/data/people.json`** - See how person data is structured (you'll build similar for contacts)

**Current Branch**: `feature/code-quality-fixes`

---

## The Sector Context

Solas serves the **vulnerable adults supported housing sector**. Address Book is where users manage contacts for **everyone** they work with:

**Internal Contacts**:
- Staff (support workers, managers, admin, finance, compliance officers)
- Board members
- Senior leadership
- HR contacts

**External Contacts**:
- **Commissioners** (local authority, NHS - they fund services)
- **Registered Providers (RPs)** (housing associations - they own properties)
- **Care Providers** (organisations delivering support)
- **GPs & healthcare** (doctors, nurses, therapists)
- **Social Workers** (case managers for residents)
- **Family Members** (emergency contacts, next of kin)
- **Contractors** (maintenance, repairs, cleaning)
- **Suppliers** (food, equipment, utilities)
- **Legal/Compliance** (solicitors, CQC inspectors)
- **Training Providers** (staff development)
- **Referral Sources** (organisations sending referrals)

**Why This Matters**:

In this sector, you're constantly calling, emailing, coordinating:
- "Who's the social worker for Jamie Thompson?"
- "What's the commissioner's email for Mental Health services in Manchester?"
- "Which plumber do we use for emergency callouts?"
- "I need the CQC inspector's contact who visited last month"

Currently, people hunt through:
- Outlook contacts (personal silos, not shared)
- Spreadsheets (outdated, no one updates)
- WhatsApp groups ("Does anyone have Sarah's number?")
- Emails ("I'll search my inbox...")

**Your job**: Build a centralised, searchable, filterable contact database that becomes the single source of truth.

---

## What You're Building

A **Contact Database** that's simple, fast, and comprehensive. Think of it as:

- Outlook Contacts + Google Contacts
- But sector-specific (tags for "Commissioner", "RP", "GP", etc.)
- Team-shared (everyone sees the same database)
- With smart filtering (Internal/External, Current/Former, by Role/Organisation)

**Core Features**:
- Add/Edit/Delete contacts
- Search by name, organisation, role, phone, email
- Filter by contact type, status, tags
- Quick actions: Call, Email, Copy Info
- Export to CSV/vCard
- Import from CSV (for bulk upload)

---

## Your Challenge

**Build a contact database that feels effortless.**

1. **Research**: What makes great contact management?
   - Google Contacts' simplicity
   - LinkedIn's profile cards
   - Outlook's search and categorization
   - Salesforce's account/contact structure

2. **Think practically**: What makes someone find a contact in 5 seconds vs 5 minutes?

3. **Build it clean**: No clutter, fast search, smart defaults.

---

## Must-Have Features

### 1. Hero Banner (Full-Width, Edge-to-Edge)

**Color**: Choose a gradient (maybe teal/cyan for "communication" vibes or indigo/purple for "organisation")

```tsx
<div className="min-h-screen bg-ivolve-paper -m-6">
    {/* Hero Banner */}
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full shadow-md">
        <div className="px-6 py-6">
            {/* Icon: Contact (from lucide-react) */}
            {/* Title: "Address Book" */}
            {/* Description: "Manage all your contacts in one place - staff, commissioners, providers, and more" */}
            {/* Buttons: "Add Contact" + "Import Contacts" */}

            {/* Quick Stats (4 cards) */}
            {/* - Total Contacts */}
            {/* - Internal Staff */}
            {/* - External Partners */}
            {/* - Active Contacts (current, not former) */}
        </div>
    </div>

    {/* Main Content */}
    <div className="p-6">
        {/* Contact database interface */}
    </div>
</div>
```

### 2. Main View - Contact List/Table

**Layout**: Table view (like PeopleHub) OR Card grid (like Google Contacts) - **your choice** (I'd suggest table for data density)

**Table View** (Recommended):

**Columns**:
- Avatar/Initials (if no photo, show initials in colored circle)
- Name (First + Last)
- Role/Job Title
- Organisation
- Contact Type (Internal/External badge)
- Phone (primary)
- Email (primary)
- Status (Current/Former badge)
- Actions (View | Edit | Delete)

**Features**:
- Sortable columns (click header to sort A-Z, Z-A)
- Hover row highlights
- Click row to open detail view
- Checkbox for bulk selection (bulk delete, bulk export)

**Alternative: Card Grid View**:
- Cards in 3-4 column grid
- Each card shows: avatar, name, role, org, phone, email
- Click card for detail view

**Empty State**:
- "No contacts yet"
- Big "Add Your First Contact" button
- Or "Import Contacts from CSV"

### 3. Search & Filters (Critical!)

**Search Bar** (top of page, prominent):
- Placeholder: "Search by name, organisation, role, phone, or email..."
- Real-time filtering as user types
- Searches across: firstName, lastName, organisation, role, phone, email

**Filters** (sidebar or collapsible panel):

**Contact Type**:
- ☑️ Internal
- ☑️ External
- (Or toggle: All | Internal Only | External Only)

**Status**:
- ☑️ Current
- ☐ Former

**Category** (multi-select):
- Commissioner
- Registered Provider (RP)
- Care Provider
- GP/Healthcare
- Social Worker
- Family/Emergency Contact
- Contractor
- Supplier
- Legal/Compliance
- Staff
- Other

**Organisation** (dropdown):
- Dynamically populate from unique organisations in database
- "All Organisations" default

**Active Filter Count**: Show "3 filters active" badge, allow clearing all with one click

### 4. Add Contact Modal (Quick Entry)

**Simple form** - capture essential info:

**Essential Fields**:
- First Name* (text)
- Last Name* (text)
- Contact Type* (radio): Internal | External
- Status (radio): Current | Former (default: Current)
- Category* (dropdown): Commissioner, RP, Care Provider, GP/Healthcare, Social Worker, Family, Contractor, Supplier, Legal, Staff, Other

**Contact Details**:
- Organisation (text) - e.g., "Manchester City Council", "NHS Greater Manchester"
- Role/Job Title (text) - e.g., "Mental Health Commissioner", "Social Worker", "Plumber"
- Primary Phone (tel input)
- Secondary Phone (tel input)
- Primary Email (email input)
- Secondary Email (email input)

**Optional (collapsible "More Details")**:
- Address (textarea or structured: Street, City, Postcode)
- Website (URL)
- Notes (textarea) - "Handles all mental health referrals for North Manchester"
- Tags (e.g., "Emergency Contact", "VIP", "Key Stakeholder")

**Success Flow**:
1. Click "Add Contact" button
2. Fill form (3-5 required fields minimum)
3. Click "Save Contact"
4. Toast: "Contact added successfully"
5. Contact appears in table/grid

### 5. Contact Detail View (Full Profile)

**Modal or dedicated page** showing all contact information:

**Header**:
- Large avatar/initials
- Full name
- Role at Organisation
- Contact Type badge + Status badge
- Actions: Edit | Delete | Add to Favorites | Export vCard

**Sections**:

**Contact Information**:
- Primary Phone (click to call if on mobile - `tel:` link)
- Secondary Phone
- Primary Email (click to email - `mailto:` link)
- Secondary Email
- Website (clickable link)

**Organisation Details**:
- Organisation name
- Address (if provided)
- Category/Tags

**Notes**:
- Display notes field
- "No notes yet" if empty

**Related Records** (Optional but valuable):
- If contact is a social worker: Show linked people they support
- If contact is RP: Show properties they manage
- If contact is staff: Show projects they own

**Activity** (Future feature, design for it):
- "Last contacted: 2 days ago"
- "Added to system: 3 months ago"
- "Updated by Matt Fay: 1 week ago"

### 6. Edit Contact

Reuse Add Contact Modal but pre-populate fields with existing data.

**Important**:
- Allow changing all fields
- Show "Last updated: [date] by [user]" at bottom
- Validate email/phone formats

### 7. Bulk Actions

**Bulk Selection** (checkboxes in table):

- Select All / Deselect All
- Select multiple contacts
- Actions appear in fixed bottom toolbar (like PeopleHub):
  - **Export Selected to CSV** (download CSV file)
  - **Export Selected to vCard** (standard contact format for Outlook/Google)
  - **Delete Selected** (with confirmation)
  - **Tag Selected** (add tag to all selected)
  - **Clear Selection**

### 8. Import Contacts (CSV Upload)

**Modal with CSV uploader**:

```
"Import Contacts from CSV"

Instructions:
1. Download our CSV template
2. Fill in your contact details
3. Upload the file below

[Download Template.csv]

[📁 Choose File] or drag and drop

CSV must include: First Name, Last Name, Contact Type
Optional: Organisation, Role, Phone, Email, etc.

[Cancel] [Upload & Import]
```

**CSV Template** (download button provides this):
```csv
First Name,Last Name,Contact Type,Status,Category,Organisation,Role,Primary Phone,Primary Email,Notes
John,Smith,External,Current,Commissioner,Manchester CC,Mental Health Lead,0161 234 5678,john.smith@manchester.gov.uk,Handles MH referrals
```

**Import Logic**:
- Parse CSV
- Validate required fields
- Show preview: "X contacts ready to import, Y errors"
- Allow fixing errors or proceeding
- Import successfully → Toast: "Imported 47 contacts"

### 9. Export Functionality

**Export All Contacts** (button in header):
- Download all contacts as CSV
- Format: Same as import template
- Filename: `solas-contacts-2026-02-03.csv`

**Export to vCard** (industry standard):
- .vcf file format
- Importable into Outlook, Apple Contacts, Google Contacts
- One vCard file per contact, or combined file (both options)

---

## Data Structure

```typescript
interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    contactType: 'Internal' | 'External';
    status: 'Current' | 'Former';
    category: 'Commissioner' | 'Registered Provider (RP)' | 'Care Provider' | 'GP/Healthcare' | 'Social Worker' | 'Family/Emergency Contact' | 'Contractor' | 'Supplier' | 'Legal/Compliance' | 'Staff' | 'Other';

    organisation?: string;
    role?: string; // Job title

    primaryPhone?: string;
    secondaryPhone?: string;
    primaryEmail?: string;
    secondaryEmail?: string;

    address?: {
        street?: string;
        city?: string;
        postcode?: string;
    };

    website?: string;
    notes?: string;
    tags?: string[];

    avatar?: string; // Photo URL or base64
    favorite?: boolean; // Star/favorite feature

    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}
```

**localStorage**:
```typescript
'solas_contacts' // Array of Contact objects
```

**Helper Function** (generate initials):
```typescript
const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
};
```

**Helper Function** (generate avatar color):
```typescript
const getAvatarColor = (name: string): string => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};
```

---

## UX Principles

1. **Speed**: Search should be instant (use `useMemo` for filtering)
2. **Simplicity**: Don't overwhelm with fields - essential info only, hide optional
3. **Accessibility**: Keyboard navigation, `tel:` and `mailto:` links for quick actions
4. **Consistency**: Match PeopleHub/PropertyHub table styling
5. **Forgiveness**: Easy to edit, undo deletes (with confirmation)

---

## Technical Implementation

### Search & Filter Logic

```typescript
const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(contact =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.organisation?.toLowerCase().includes(query) ||
            contact.role?.toLowerCase().includes(query) ||
            contact.primaryPhone?.includes(query) ||
            contact.primaryEmail?.toLowerCase().includes(query)
        );
    }

    // Apply contact type filter
    if (contactTypeFilter !== 'All') {
        filtered = filtered.filter(c => c.contactType === contactTypeFilter);
    }

    // Apply status filter
    if (statusFilter === 'Current') {
        filtered = filtered.filter(c => c.status === 'Current');
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(c => selectedCategories.includes(c.category));
    }

    return filtered;
}, [contacts, searchQuery, contactTypeFilter, statusFilter, selectedCategories]);
```

### CSV Export

```typescript
const exportToCSV = (contacts: Contact[]) => {
    const headers = ['First Name', 'Last Name', 'Contact Type', 'Status', 'Category', 'Organisation', 'Role', 'Primary Phone', 'Primary Email', 'Notes'];

    const rows = contacts.map(c => [
        c.firstName,
        c.lastName,
        c.contactType,
        c.status,
        c.category,
        c.organisation || '',
        c.role || '',
        c.primaryPhone || '',
        c.primaryEmail || '',
        c.notes || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solas-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};
```

### vCard Export

```typescript
const exportToVCard = (contact: Contact): string => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organisation || ''}
TITLE:${contact.role || ''}
TEL;TYPE=WORK,VOICE:${contact.primaryPhone || ''}
TEL;TYPE=CELL:${contact.secondaryPhone || ''}
EMAIL;TYPE=WORK:${contact.primaryEmail || ''}
URL:${contact.website || ''}
NOTE:${contact.notes || ''}
END:VCARD`;
};
```

---

## Stretch Goals

If you're ahead of schedule:

1. **Favorites/Stars**:
   - Star icon on contact cards
   - "Favorites" filter/section at top

2. **Recently Viewed**:
   - Track last 5 contacts viewed
   - Show "Recent" section

3. **Quick Actions**:
   - "Quick Dial" buttons for emergency contacts
   - "Email All Selected" (bulk mailto:)

4. **Contact Linking**:
   - Link contact to person (e.g., social worker → residents they support)
   - Link contact to property (e.g., RP → properties they own)

5. **Contact Groups**:
   - Create groups: "Emergency Contacts", "Key Stakeholders", "Manchester Team"
   - Assign contacts to groups

6. **Advanced Search**:
   - Search filters in modal
   - Save search queries

7. **Duplicate Detection**:
   - "This contact looks similar to [Existing Contact]. Merge?"

8. **Mobile Optimization**:
   - Card view on mobile (stack instead of table)
   - Click-to-call/email on mobile devices

9. **Dark Mode Support**:
   - Design with dark mode in mind (even if not implemented)

10. **Activity Tracking**:
    - Last contacted date
    - Log interactions ("Called on 2026-01-15")

---

## Success Criteria

You've nailed this if:

✅ Matt can find any contact in under 10 seconds (search + filters)
✅ Adding a contact takes 30 seconds
✅ Table/grid is clean, readable, not overwhelming
✅ Export to CSV/vCard works perfectly
✅ Import from CSV handles bulk uploads smoothly
✅ Hero banner matches Solas quality
✅ Data persists across sessions
✅ Code is clean, typed, well-organized
✅ Matt says "I'll actually use this instead of my messy spreadsheet"

---

## Files You'll Create

**Estimate: 1200-1500 lines total**

**New Files**:
- `src/components/AddressBook/index.tsx` - Main hub (~600 lines)
- `src/components/AddressBook/ContactCard.tsx` - Card/row component (~150 lines)
- `src/components/AddressBook/AddContactModal.tsx` - Add/edit form (~400 lines)
- `src/components/AddressBook/ContactDetailView.tsx` - Full profile modal (~400 lines)
- `src/components/AddressBook/ImportCSVModal.tsx` - CSV import interface (~200 lines)
- `src/types/contacts.ts` - TypeScript interfaces (~100 lines)

**Modified Files**:
- `src/App.tsx` - Route already exists (`/address-book`)

---

## Research Prompts

1. What makes contact search feel instant vs sluggish?
2. How do the best contact management tools organize contacts?
3. What's the ideal balance between data density and readability in a table?
4. How can color, badges, and icons make contact type/status immediately clear?
5. What makes CSV import feel smooth vs frustrating?

---

## Final Pep Talk

**Address Book is the connective tissue of Solas.**

Every phone call, every email, every partnership - it starts with a contact. Right now, people waste time hunting for this info.

**You're going to make that friction disappear.**

Build something so simple and fast that Matt wonders how he ever managed without it.

**Research. Build. Polish.**

**Make it effortless. Make it beautiful.**

---

*Go build a contact database that just works.*

**— The Solas Team**
