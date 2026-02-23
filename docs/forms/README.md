# Add Person Modal Component

A comprehensive, multi-step form modal for adding new people to the Solas CRM system.

## Features

- **Multi-step form** with 4 sections: Personal Details, Tenancy, Support & Care, and Emergency Contacts
- **Visual progress indicator** showing current step and completion status
- **Form validation** with error messages for required fields
- **Responsive design** that works on desktop and mobile
- **Keyboard navigation** (Escape to close)
- **Auto-calculated fields** (age from DOB, total charges from rent components)
- **Dynamic emergency contacts** - add multiple contacts, set primary contact
- **ivolve brand styling** with proper colors and design system
- **TypeScript typed** with full type safety

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { AddPersonModal } from './components/Forms';
import { Person } from './types';

function MyComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSavePerson = (person: Person) => {
        console.log('New person:', person);
        // Save to localStorage, API, or app state
        localStorage.setItem('people', JSON.stringify([person]));
    };

    const properties = [
        { id: 'prop_1', address: '86-88 Woodhurst Avenue', postcode: 'WD24 5PN' },
        { id: 'prop_2', address: '42 Station Road', postcode: 'AL1 5HE' }
    ];

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>
                Add Person
            </button>

            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePerson}
                properties={properties}
            />
        </>
    );
}
```

### With App Context

```tsx
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { AddPersonModal } from './components/Forms';

function PeopleHub() {
    const { people, setPeople, properties } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSavePerson = (newPerson: Person) => {
        setPeople([...people, newPerson]);

        // Also save to localStorage
        localStorage.setItem('people', JSON.stringify([...people, newPerson]));
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>
                Add Person
            </button>

            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePerson}
                properties={properties}
            />
        </>
    );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Called when modal should close |
| `onSave` | `(person: Person) => void` | Yes | Called when form is saved |
| `properties` | `Array<{id, address, postcode}>` | No | List of properties for dropdown |

## Form Sections

### 1. Personal Details
Required fields:
- First Name *
- Last Name *

Optional fields:
- Title (dropdown)
- Preferred Name
- Date of Birth (auto-calculates age)
- NI Number
- Occupant Type (Main Tenant, Joint Tenant, etc.)
- Email
- Phone
- Mobile

### 2. Tenancy
Required fields:
- Property * (dropdown from properties prop)

Optional fields:
- Unit ID
- Room
- Tenancy Type (Assured, AST, License, etc.)
- Tenancy Status (Current, Former, Pending)
- Move In Date
- Move Out Date
- Finance Details:
  - Rent Amount
  - Service Charge
  - Support Charge
  - Housing Benefit (checkbox)

### 3. Support & Care
All fields optional:
- Care Provider
- Social Worker
- Key Worker
- Case Manager
- Care Hours (per week)
- Support Level (Low, Medium, High, Intensive)
- Medication Needs (textarea)
- Dietary Requirements (textarea)
- Mobility Needs (textarea)

### 4. Emergency Contacts
- Add multiple contacts
- Set primary contact
- Fields per contact:
  - Name
  - Relationship
  - Phone
  - Email

## Generated Person Object

The modal generates a complete `Person` object with this structure:

```typescript
{
    id: string; // Auto-generated UUID
    personal: {
        title: Title;
        firstName: string;
        lastName: string;
        preferredName?: string;
        dateOfBirth?: string;
        age?: number; // Auto-calculated
        niNumber?: string;
        occupantType: OccupantType;
        email?: string;
        phone?: string;
        mobile?: string;
    };
    tenancy: {
        propertyId: string;
        unitId?: string;
        propertyAddress: string; // Auto-populated from selected property
        room?: string;
        tenancyType: TenancyType;
        tenancyStatus: TenancyStatus;
        moveInDate?: string;
        moveOutDate?: string;
    };
    support: {
        careProvider?: string;
        socialWorker?: string;
        keyWorker?: string;
        caseManager?: string;
        careHours?: number;
        supportLevel?: 'Low' | 'Medium' | 'High' | 'Intensive';
        medicationNeeds?: string;
        dietaryRequirements?: string;
        mobilityNeeds?: string;
    };
    emergencyContacts?: EmergencyContact[];
    finance: {
        rentAmount?: number;
        serviceCharge?: number;
        supportCharge?: number;
        totalCharges?: number; // Auto-calculated
        housingBenefit?: boolean;
    };
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
}
```

## Validation

The form validates:
- First Name is required
- Last Name is required
- Property is required

Error messages appear below invalid fields with a red border and error icon.

## Styling

The component uses:
- **ivolve brand colors** from Tailwind config
- **Lucide React icons**
- **Shared Button component** for consistency
- **Responsive grid layouts** (adapts to mobile)
- **Smooth transitions** and hover effects
- **Focus states** for accessibility

## Keyboard Support

- **Escape**: Close modal
- **Tab/Shift+Tab**: Navigate between fields
- **Enter**: Submit current step (if valid)

## Accessibility

- Proper label associations
- Focus management
- Semantic HTML
- ARIA attributes for screen readers
- Keyboard navigation
- Error announcements

## Browser Compatibility

Works in all modern browsers. Uses:
- `crypto.randomUUID()` with fallback to `Date.now()`
- CSS Grid and Flexbox
- ES6+ JavaScript features

## Example Integration Points

### With PeopleHub
```tsx
// In PeopleHub component
import { AddPersonModal } from './components/Forms';

// Add button to toolbar
<Button onClick={() => setAddPersonModalOpen(true)}>
    Add Person
</Button>
```

### With PropertyProfile
```tsx
// In PropertyProfile Units tab
import { AddPersonModal } from './components/Forms';

// Pre-fill property when adding from property view
<AddPersonModal
    isOpen={isOpen}
    onClose={onClose}
    onSave={handleSave}
    properties={[{ id: property.id, address: property.address, postcode: property.postcode }]}
/>
```

### With Context/State Management
```tsx
// Save to app context
const handleSavePerson = (person: Person) => {
    // Update context
    updateAppContext({
        people: [...appContext.people, person]
    });

    // Persist to localStorage
    localStorage.setItem('people', JSON.stringify([...appContext.people, person]));

    // Show toast notification
    showToast('Person added successfully', 'success');
};
```

## Future Enhancements

Possible improvements:
- [ ] Photo upload for person avatar
- [ ] Address autocomplete
- [ ] Property unit dropdown (filtered by selected property)
- [ ] Duplicate detection (warn if similar name exists)
- [ ] Save as draft functionality
- [ ] Import from CSV
- [ ] Validation for NI number format
- [ ] Integration with care provider API
- [ ] Document upload (ID, contracts, care plans)

## See Also

- `src/types.ts` - Full Person interface definition
- `AddPersonModalExample.tsx` - Complete working example
- `src/components/shared/Button.tsx` - Button component used in modal
- `tailwind.config.js` - ivolve brand colors

## Support

For questions or issues with this component, contact the development team or refer to the project documentation in `CLAUDE.md`.
