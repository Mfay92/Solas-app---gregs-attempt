# RP Branding System

Complete guide to using Registered Provider (RP) brand colours throughout Solas CRM.

## 📁 Files

| File | Purpose |
|------|---------|
| `src/data/rpBranding.ts` | RP brand colours and utility functions |
| `src/components/shared/RPBadge.tsx` | Badge/tag components |
| `housing_organization_colors.md` | Source data (16 RPs) |

---

## 🎨 Available RPs

The system includes 16 UK housing organizations:

| ID | Organization | Primary | Secondary |
|----|--------------|---------|-----------|
| `civitas` | Civitas Investment Management | Red (#CF3037) | Navy (#1A3E6F) |
| `ehsl` | EHSL (Essential Housing) | Yellow (#FFDA00) | Blue (#3D4999) |
| `qualitas` | Qualitas Housing | Navy (#1F3863) | Blue (#00A6DA) |
| `harbour-light` | Harbour Light Housing | Navy (#002D62) | Yellow (#FFCC00) |
| `inclusion` | Inclusion Housing | Navy (#00234E) | Orange (#F05A28) |
| `auckland` | Auckland Home Solutions | Navy (#002D62) | Teal (#00B1B6) |
| `windrush` | Windrush Housing | Green (#00563F) | Yellow (#F2BA1D) |
| `portus` | Portus Housing | Navy (#1F3863) | Blue (#00A6DA) |
| `ampulis` | Ampulis (Amplius Living) | Navy (#002D62) | Magenta (#C50084) |
| `encircle` | Encircle Housing | Gray (#CDCCC7) | Gray (#919082) |
| `advance` | Advance Housing | Red (#C8102E) | Navy (#00073F) |
| `reside-progress` | Reside with Progress | Navy (#00216B) | Green (#5CE500) |
| `care-housing` | Care Housing Association | Blue (#005A8B) | Green (#8DC63F) |
| `hilldale` | Hilldale Housing | Navy (#1F3863) | White (#FFFFFF) |
| `home-group` | Home Group | Magenta (#C50084) | Navy (#00216B) |
| `golden-lane` | Golden Lane Housing | Navy (#284185) | Magenta (#D9007E) |

---

## 🚀 Quick Start

### 1. Simple Badge

```tsx
import RPBadge from '../shared/RPBadge';

// Using RP ID (preferred)
<RPBadge rpId="inclusion" />

// Using RP name (if ID not available)
<RPBadge rpName="Inclusion Housing" />

// With options
<RPBadge rpId="auckland" size="lg" variant="outline" showFullName />
```

### 2. Get RP Branding Data

```tsx
import { getRPBranding, getRPBrandingByName } from '../../data/rpBranding';

// By ID
const branding = getRPBranding('inclusion');
console.log(branding.primary); // "#00234E"
console.log(branding.secondary); // "#F05A28"

// By name
const branding2 = getRPBrandingByName('Auckland Home Solutions');
```

### 3. Dynamic Theming

```tsx
import { getRPBranding } from '../../data/rpBranding';

function PropertyCard({ property }) {
    const rpBranding = getRPBranding(property.rpId);

    return (
        <div
            className="p-4 rounded-lg"
            style={{
                borderLeft: `4px solid ${rpBranding?.primary}`,
                backgroundColor: `${rpBranding?.primary}08` // 8% opacity
            }}
        >
            <h3>{property.address}</h3>
            <RPBadge rpId={property.rpId} />
        </div>
    );
}
```

---

## 📖 Component Reference

### `<RPBadge>` Component

Displays a colored badge with the RP name.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rpId` | `string` | - | RP organization ID (e.g., 'inclusion') |
| `rpName` | `string` | - | RP name (used if ID not available) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `variant` | `'solid' \| 'outline' \| 'subtle'` | `'solid'` | Badge style |
| `showFullName` | `boolean` | `false` | Show full name vs first word |
| `className` | `string` | `''` | Additional CSS classes |

**Examples:**

```tsx
// Solid badge (default)
<RPBadge rpId="inclusion" />

// Outline style
<RPBadge rpId="auckland" variant="outline" />

// Subtle background
<RPBadge rpId="windrush" variant="subtle" size="lg" />

// Full organization name
<RPBadge rpId="golden-lane" showFullName />
```

### `<RPDot>` Component

Small colored dot indicator.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rpId` | `string` | - | RP organization ID |
| `rpName` | `string` | - | RP name |
| `size` | `number` | `8` | Dot diameter (pixels) |
| `className` | `string` | `''` | Additional CSS classes |

**Examples:**

```tsx
import { RPDot } from '../shared/RPBadge';

// Small indicator
<RPDot rpId="inclusion" size={8} />

// Larger indicator
<RPDot rpId="auckland" size={12} className="mr-2" />
```

---

## 🎯 Common Use Cases

### 1. Property Cards

```tsx
function PropertyCard({ property }) {
    const rpBranding = getRPBranding(property.rpId);

    return (
        <div className="bg-white p-4 rounded-lg border-l-4"
             style={{ borderLeftColor: rpBranding?.primary }}>
            <div className="flex items-center justify-between mb-2">
                <h3>{property.address}</h3>
                <RPBadge rpId={property.rpId} variant="subtle" />
            </div>
            <p className="text-gray-600">{property.units} units</p>
        </div>
    );
}
```

### 2. Hero Banners

```tsx
function PropertyHeroBanner({ property }) {
    const rpBranding = getRPBranding(property.rpId);

    return (
        <div className="relative">
            {/* Gradient overlay with RP colours */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `linear-gradient(135deg, ${rpBranding?.primary} 0%, ${rpBranding?.secondary} 100%)`
                }}
            />

            <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <RPDot rpId={property.rpId} size={10} />
                    <span className="text-sm text-gray-600">
                        {rpBranding?.name}
                    </span>
                </div>
                <h1>{property.address}</h1>
            </div>
        </div>
    );
}
```

### 3. Contact Popovers

```tsx
function LandlordContactPopover({ contact }) {
    const rpBranding = getRPBranding(contact.rpId);

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            {/* Header with RP branding */}
            <div
                className="px-3 py-2 rounded-t -mx-3 -mt-3 mb-3"
                style={{
                    backgroundColor: rpBranding?.primary,
                    color: rpBranding?.textOnPrimary
                }}
            >
                <div className="font-semibold">{contact.name}</div>
                <div className="text-sm opacity-90">{rpBranding?.name}</div>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-sm">
                <div>📧 {contact.email}</div>
                <div>📞 {contact.phone}</div>
            </div>
        </div>
    );
}
```

### 4. Table Rows

```tsx
function PropertyTable({ properties }) {
    return (
        <table>
            <tbody>
                {properties.map(property => {
                    const rpBranding = getRPBranding(property.rpId);

                    return (
                        <tr key={property.id}
                            style={{
                                borderLeft: `3px solid ${rpBranding?.primary}`
                            }}>
                            <td>
                                <RPDot rpId={property.rpId} className="mr-2" />
                                {property.address}
                            </td>
                            <td>{property.units}</td>
                            <td>
                                <RPBadge rpId={property.rpId} size="sm" variant="subtle" />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
```

### 5. Filter Dropdowns

```tsx
import { getAllRPs } from '../../data/rpBranding';

function RPFilterDropdown({ onChange }) {
    const allRPs = getAllRPs(); // Returns sorted array

    return (
        <select onChange={e => onChange(e.target.value)}>
            <option value="">All RPs</option>
            {allRPs.map(rp => (
                <option key={rp.id} value={rp.id}>
                    {rp.name}
                </option>
            ))}
        </select>
    );
}
```

---

## 🔧 Utility Functions

### `getRPBranding(rpId: string)`

Get branding by RP ID.

```tsx
const branding = getRPBranding('inclusion');
// Returns: { id, name, primary, secondary, ... }
```

### `getRPBrandingByName(name: string)`

Get branding by organization name (fuzzy match).

```tsx
const branding = getRPBrandingByName('Inclusion');
// Also works with partial names: 'inclusion housing', 'INCLUSION', etc.
```

### `getAllRPs()`

Get all RPs as a sorted array.

```tsx
const allRPs = getAllRPs();
// Returns array sorted alphabetically by name
```

### `getContrastText(hexColor: string)`

Calculate optimal text colour (black or white) for a background.

```tsx
const textColor = getContrastText('#CF3037');
// Returns: '#FFFFFF' (white text on red background)
```

---

## 📊 Data Structure

Each RP branding object contains:

```typescript
interface RPBranding {
    id: string;              // e.g., 'inclusion'
    name: string;            // e.g., 'Inclusion Housing'
    primary: string;         // Main brand colour (hex)
    secondary: string;       // Secondary colour (hex)
    accent?: string;         // Optional accent colour
    background?: string;     // Optional background colour
    textOnPrimary?: string;  // Text colour for primary bg
    textOnSecondary?: string; // Text colour for secondary bg
}
```

---

## 🎨 SharePoint Integration Tips

When integrating with SharePoint:

1. **Store RP ID in your lists:**
   ```
   Property List columns:
   - LandlordRP (Text) → stores 'inclusion', 'auckland', etc.
   ```

2. **Use in SPFx components:**
   ```tsx
   import { getRPBranding } from '../../../data/rpBranding';

   const item = this.props.listItem;
   const rpBranding = getRPBranding(item.LandlordRP);

   return (
       <div style={{ borderColor: rpBranding?.primary }}>
           {item.Title}
       </div>
   );
   ```

3. **Dynamic list formatting:**
   - Use JSON column formatting with RP colours
   - Store hex codes in SharePoint list for reference

---

## ✅ Best Practices

1. **Always provide fallback:**
   ```tsx
   const branding = getRPBranding(rpId);
   const primaryColor = branding?.primary || '#6B7280'; // Gray fallback
   ```

2. **Use semantic IDs:**
   - Store `'inclusion'` not `'Inclusion Housing'`
   - IDs are stable, names can change

3. **Maintain contrast:**
   ```tsx
   // Good: uses textOnPrimary
   <div style={{
       backgroundColor: branding.primary,
       color: branding.textOnPrimary
   }} />

   // Better: automatic calculation
   <div style={{
       backgroundColor: branding.primary,
       color: getContrastText(branding.primary)
   }} />
   ```

4. **Keep it subtle:**
   - Use RP colours as accents, not overwhelming backgrounds
   - Border accents > full backgrounds
   - 5-15% opacity for subtle backgrounds

---

## 🚀 Next Steps

- [ ] Add RP logos to `public/assets/rp-logos/`
- [ ] Create `RPLogoImage` component
- [ ] Add RP selector to Property forms
- [ ] Style contact cards with RP branding
- [ ] Add RP filter to Property Hub

---

**Need to add more RPs?** Edit `src/data/rpBranding.ts` and add to the `RP_BRANDING` object.
