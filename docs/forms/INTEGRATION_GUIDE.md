# Integration Guide: AddPersonModal

This guide shows you how to integrate the AddPersonModal into existing components in the Solas app.

## Quick Start: Add to PeopleHub

Here's how to add the "Add Person" functionality to the PeopleHub component:

### 1. Import the Modal

```tsx
// At the top of src/components/PeopleHub/index.tsx
import { AddPersonModal } from '../Forms';
```

### 2. Add State for Modal

```tsx
// In the PeopleHub component
function PeopleHub() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // ... existing code
}
```

### 3. Create Save Handler

```tsx
// Add this handler function
const handleSavePerson = (newPerson: Person) => {
    // Save to localStorage
    const existingPeople = localStorage.getItem('people');
    const peopleArray = existingPeople ? JSON.parse(existingPeople) : [];
    peopleArray.push(newPerson);
    localStorage.setItem('people', JSON.stringify(peopleArray));

    // Refresh the people list
    setPeople([...people, newPerson]);

    // Optional: Show success toast
    console.log('Person added:', newPerson);
};
```

### 4. Add Button to Toolbar

```tsx
// In the toolbar/header section of PeopleHub
<Button
    variant="primary"
    size="md"
    leftIcon={<UserPlus size={18} />}
    onClick={() => setIsAddModalOpen(true)}
>
    Add Person
</Button>
```

### 5. Add Modal Component

```tsx
// At the end of the PeopleHub return statement, before the closing div
<AddPersonModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onSave={handleSavePerson}
    properties={properties}
/>
```

### Complete Example for PeopleHub

```tsx
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { AddPersonModal } from '../Forms';
import { Person } from '../../types';
import { Button } from '../shared/Button';

export default function PeopleHub() {
    const [people, setPeople] = useState<Person[]>([]);
    const [properties, setProperties] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Load properties from localStorage or context
    useEffect(() => {
        const storedProps = localStorage.getItem('properties');
        if (storedProps) {
            const props = JSON.parse(storedProps);
            setProperties(props.map(p => ({
                id: p.id,
                address: p.address,
                postcode: p.postcode
            })));
        }
    }, []);

    const handleSavePerson = (newPerson: Person) => {
        // Save to localStorage
        const existingPeople = localStorage.getItem('people');
        const peopleArray = existingPeople ? JSON.parse(existingPeople) : [];
        peopleArray.push(newPerson);
        localStorage.setItem('people', JSON.stringify(peopleArray));

        // Update state
        setPeople([...people, newPerson]);

        console.log('Successfully added:', newPerson);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between p-6 bg-white border-b">
                <h1 className="text-2xl font-bold">People We Support</h1>
                <Button
                    variant="primary"
                    leftIcon={<UserPlus size={18} />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Person
                </Button>
            </div>

            {/* People List */}
            <div className="flex-1 overflow-auto p-6">
                {/* Your existing people list code */}
            </div>

            {/* Add Person Modal */}
            <AddPersonModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSavePerson}
                properties={properties}
            />
        </div>
    );
}
```

## Integration with PropertyProfile

You can also add this modal to PropertyProfile to add people directly to a property:

```tsx
// In PropertyProfile/tabs/UnitsOccupancyTab.tsx
import { AddPersonModal } from '../../Forms';

function UnitsOccupancyTab({ property }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSavePerson = (newPerson: Person) => {
        // Save person
        const people = JSON.parse(localStorage.getItem('people') || '[]');
        people.push(newPerson);
        localStorage.setItem('people', JSON.stringify(people));

        // Refresh property data to show new occupant
    };

    return (
        <div>
            {/* Add button in tab */}
            <Button onClick={() => setIsAddModalOpen(true)}>
                Add Occupant
            </Button>

            {/* Modal - pre-filled with current property */}
            <AddPersonModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSavePerson}
                properties={[{
                    id: property.id,
                    address: property.address,
                    postcode: property.postcode
                }]}
            />
        </div>
    );
}
```

## Integration with App Context

If you're using React Context for state management:

```tsx
// In context/AppContext.tsx
interface AppContextType {
    people: Person[];
    addPerson: (person: Person) => void;
    // ... other state
}

// In the provider
const addPerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
    localStorage.setItem('people', JSON.stringify([...people, person]));
};

// In your component
const { addPerson, properties } = useContext(AppContext);

<AddPersonModal
    isOpen={isOpen}
    onClose={onClose}
    onSave={addPerson}
    properties={properties}
/>
```

## Data Persistence Options

### Option 1: localStorage (Current)
```tsx
const handleSavePerson = (person: Person) => {
    const people = JSON.parse(localStorage.getItem('people') || '[]');
    people.push(person);
    localStorage.setItem('people', JSON.stringify(people));
};
```

### Option 2: Firebase (Future)
```tsx
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const handleSavePerson = async (person: Person) => {
    try {
        const docRef = await addDoc(collection(db, 'people'), person);
        console.log('Person added with ID:', docRef.id);
    } catch (error) {
        console.error('Error adding person:', error);
    }
};
```

### Option 3: REST API
```tsx
const handleSavePerson = async (person: Person) => {
    try {
        const response = await fetch('/api/people', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(person)
        });

        if (response.ok) {
            const savedPerson = await response.json();
            console.log('Person saved:', savedPerson);
        }
    } catch (error) {
        console.error('Error saving person:', error);
    }
};
```

## Loading Properties Data

The modal needs a list of properties for the Property dropdown. Here's how to provide that:

### From localStorage
```tsx
const [properties, setProperties] = useState([]);

useEffect(() => {
    const props = JSON.parse(localStorage.getItem('properties') || '[]');
    setProperties(props.map(p => ({
        id: p.id,
        address: p.address,
        postcode: p.postcode
    })));
}, []);
```

### From Context
```tsx
const { properties } = useContext(AppContext);

// Properties from context already have correct shape
const propertyOptions = properties.map(p => ({
    id: p.id,
    address: p.address,
    postcode: p.postcode
}));
```

### From Static Import
```tsx
import propertiesData from '../../data/properties.json';

const properties = propertiesData.map(p => ({
    id: p.id,
    address: p.address,
    postcode: p.postcode
}));
```

## Styling Customization

The modal uses ivolve brand colors by default. To customize:

```tsx
// Change button variant
<Button variant="secondary">  {/* instead of "primary" */}

// Custom button styling
<button
    onClick={() => setIsAddModalOpen(true)}
    className="px-4 py-2 bg-ivolve-bright text-white rounded-lg hover:bg-ivolve-mid"
>
    Add Person
</button>
```

## Testing the Modal

Quick test checklist:
1. Click "Add Person" button - modal opens
2. Fill required fields (First Name, Last Name, Property)
3. Click "Next" through all steps
4. Add an emergency contact
5. Click "Save Person"
6. Check localStorage: `JSON.parse(localStorage.getItem('people'))`
7. Verify person appears in list

## Troubleshooting

**Modal doesn't open:**
- Check `isOpen` prop is controlled by state
- Verify `setIsAddModalOpen(true)` is called

**Properties dropdown is empty:**
- Verify `properties` prop is passed correctly
- Check properties array has `id`, `address`, `postcode` fields

**Save doesn't work:**
- Check `onSave` handler is defined
- Verify localStorage permissions in browser
- Check console for errors

**Styling looks wrong:**
- Ensure Tailwind CSS is configured
- Check `tailwind.config.js` has ivolve colors
- Verify Button component is imported from shared

## Next Steps

After integration:
1. Test the full workflow
2. Add success/error toast notifications
3. Implement proper error handling
4. Add data validation rules
5. Connect to backend API when ready

## Need Help?

See:
- `README.md` - Full component documentation
- `AddPersonModalExample.tsx` - Complete working example
- `src/types.ts` - Person interface definition
