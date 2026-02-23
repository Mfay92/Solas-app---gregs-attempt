# Hero Banner & Profile Settings Guide

> Design patterns and implementation guidance for profile hero banners across Solas CRM

**Last Updated:** 2 February 2026
**Applies To:** PersonProfile, PropertyProfile, ReferralProfile

---

## Design Philosophy

Hero banners serve as **contextual command centres** for each profile. They should:
1. Show critical information at a glance
2. Provide quick access to common actions
3. Maintain consistent UX patterns across profile types
4. Scale gracefully on mobile devices
5. Support future feature additions without crowding

---

## Layout Structure

### Standard Hero Banner Components

```
┌─────────────────────────────────────────────────────────────┐
│ [Back Button] + [Service Type Tag]           [Action Buttons] │
├─────────────────────────────────────────────────────────────┤
│ [Main Title/Name]                                            │
│ [Subtitle/Address]                          [Warning Icon]   │
├─────────────────────────────────────────────────────────────┤
│ [Demographics Grid - 2 columns × 4 rows]                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Measurements
- **Hero banner height**: Auto (varies by content)
- **Demographics grid**: 2 columns, up to 4 rows (8 total fields)
- **Grid item padding**: `px-4 py-2` (standard), `px-3 py-1.5` (compact)
- **Icon button size**: 16px icons in 40px containers
- **Service type tag**: Dynamic color based on service type

---

## Top Navigation Buttons

### Design Pattern: Icon-Only with Tooltips

**Rationale:**
- Saves horizontal space for future feature buttons
- Reduces visual clutter
- Maintains clarity through native browser tooltips
- Allows more actions without wrapping

### Button Structure

```tsx
<button
    onClick={handleAction}
    className="group transition-all hover:scale-110"
    title="Action Description" // Native browser tooltip
>
    <div className={`
        p-2 rounded-full border-2 transition-all
        bg-white/10 border-white/30
        group-hover:bg-blue-500 group-hover:border-blue-400
        group-hover:shadow-lg group-hover:shadow-blue-500/50
    `}>
        <IconComponent size={16} />
    </div>
</button>
```

### Hover Effect Patterns

| Button Type | Hover Scale | Hover Rotate | Glow Color | Use Case |
|-------------|-------------|--------------|------------|----------|
| Edit | 1.1× | 0° | Blue | Modify data |
| Add/Create | 1.1× | 90° | Green | Create new items |
| Open/View | 1.1× | -6° | Yellow | Navigate to section |
| Warning | 1.1× | 12° | Orange | Alert/caution actions |
| Delete | 1.1× | 0° | Red | Destructive actions |

### Active State Pattern

For toggle buttons (like Edit Mode):
```tsx
className={isActive
    ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50 animate-pulse'
    : 'bg-white/10 border-white/30 group-hover:bg-blue-500'
}
```

---

## Special Button Styles

### Post-it Note Style (Open Notes Tab)

```tsx
<button
    onClick={() => onTabChange('notes')}
    className="group transition-all hover:scale-110"
    title="Open Notes Tab"
>
    <div className="
        p-2 rounded-lg
        bg-yellow-300 border-2 border-yellow-400
        text-yellow-900
        group-hover:bg-yellow-400
        group-hover:shadow-lg group-hover:shadow-yellow-500/50
        transition-all group-hover:-rotate-6
    ">
        <MessageSquare size={16} />
    </div>
</button>
```

**When to use:**
- Document/note-related actions
- File/attachment actions
- Anything conceptually paper-based

---

## Demographics Grid

### Layout: 2 Columns × 4 Rows

**Why 2×4 instead of 3×3?**
1. Prevents third column from wrapping under Notice Board
2. Allows longer field widths (aligns with address tag above)
3. More flexible for different screen sizes
4. Easier to scan vertically

### Grid Code

```tsx
<div className="grid grid-cols-2 gap-2 text-sm text-white/80">
    {/* Row 1 */}
    <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
        <Icon size={14} />
        <span className="font-semibold text-white">Data Field</span>
    </div>
    <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md">
        <span className="opacity-70">Label:</span>
        <span className="font-semibold text-white text-xs">Value</span>
    </div>

    {/* Placeholder for future fields */}
    <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-md border border-white/10">
        <span className="text-white/40 text-xs italic">Available</span>
    </div>
</div>
```

### Placeholder Pattern

Use low-opacity placeholders to reserve space for future fields:
- Background: `bg-black/10`
- Border: `border border-white/10`
- Text: `text-white/40 text-xs italic` with "Available" label

---

## Animations

### Global CSS Approach (Preferred)

**Always define animations in `src/index.css`**, not inline in components.

**Why?**
- Better browser compatibility
- Reusable across components
- Easier to maintain and update
- Proper CSS caching

### Example: Warning Animations

```css
/* src/index.css */
@keyframes warning-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7),
                0 0 20px rgba(249, 115, 22, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(249, 115, 22, 0),
                0 0 30px rgba(234, 88, 12, 0.8);
    transform: scale(1.05);
  }
}

.animate-warning-pulse {
  animation: warning-pulse 2s ease-in-out infinite;
}
```

### Using Animations

```tsx
<div className="animate-warning-pulse shadow-warning">
    {/* Component content */}
</div>
```

---

## Service Type Theming

### Color Mapping

```typescript
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';

const colors = getServiceTypeColor(serviceType);
// Returns: { primary, secondary, tertiary, light, ring, text }
```

### Usage Pattern

```tsx
// Hero banner background
className={`bg-gradient-to-br ${colors.primary} ${colors.secondary}`}

// Borders on cards
className={`border-l-4 ${colors.tertiary.replace('600', '500')}`}

// Text
className={colors.text}
```

### Service Type Colors

| Service Type | Primary | Use Case |
|--------------|---------|----------|
| Supported Living | Green-600 | Independent adults |
| Residential Care | Blue-600 | Higher support needs |
| Nursing Care | Rose-600 | Medical/complex care |

---

## Warning System Integration

### Warning Icon Placement

```tsx
{person.hasActiveWarning && (
    <div className="absolute top-6 right-6">
        <WarningIcon
            onClick={() => setIsWarningModalOpen(true)}
            size="large"
        />
    </div>
)}
```

### Warning Banner Modal

```tsx
<WarningBannerModal
    warning={person.activeWarning}
    isOpen={isWarningModalOpen}
    onClose={() => setIsWarningModalOpen(false)}
    entityType="Person"
    entityName={`${person.personal.firstName} ${person.personal.lastName}`}
/>
```

**Key behaviour:**
- Modal requires acknowledgement checkbox
- Cannot close without ticking checkbox
- Auto-shows on profile load if warning exists
- After acknowledgement, shows pulsing icon in hero banner

---

## Responsive Behaviour

### Mobile Breakpoints

```tsx
// Button container
className="hidden md:flex gap-3" // Hide on mobile

// Demographics grid
className="grid grid-cols-1 md:grid-cols-2 gap-2" // Single column on mobile
```

### Touch-Friendly Sizes

- Minimum tap target: 44×44px
- Icon buttons: 40×40px container + 16px icon
- Spacing between buttons: 12px minimum

---

## Adding New Buttons

### Checklist

1. **Choose appropriate icon** from Lucide React
2. **Assign colour theme** (blue/green/yellow/orange/red)
3. **Write clear tooltip** (max 5 words)
4. **Add hover effect** (scale + rotate + glow)
5. **Position logically** (related actions near each other)

### Example: Adding "Export Profile" Button

```tsx
{/* Export Profile - Icon Only with Tooltip */}
<button
    onClick={handleExport}
    className="group transition-all hover:scale-110"
    title="Export Profile to PDF"
>
    <div className="
        p-2 rounded-full border-2 transition-all
        bg-white/10 border-white/30
        group-hover:bg-purple-500 group-hover:border-purple-400
        group-hover:shadow-lg group-hover:shadow-purple-500/50
        group-hover:rotate-12
    ">
        <Download size={16} />
    </div>
</button>
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This

```tsx
// Inline styles for animations (poor browser support)
<style>{`@keyframes pulse { ... }`}</style>

// Text labels on icon buttons (wastes space)
<button><Edit size={16} /> Edit Profile</button>

// 3-column grid (wraps under Notice Board)
<div className="grid grid-cols-3">

// Vague tooltips
title="Click here"
```

### ✅ Do This Instead

```tsx
// Global CSS animations
className="animate-warning-pulse" // Defined in index.css

// Icon-only with clear tooltip
<button title="Edit Profile"><Edit size={16} /></button>

// 2-column grid
<div className="grid grid-cols-2">

// Descriptive tooltips
title="Edit Profile Information"
```

---

## Testing Checklist

When modifying hero banners:

- [ ] All buttons have tooltips
- [ ] Hover effects work (scale, rotate, glow)
- [ ] Demographics grid doesn't overlap Notice Board
- [ ] Service type colours apply correctly
- [ ] Warning icon animations work (if applicable)
- [ ] Mobile view: buttons don't overflow
- [ ] Active states clearly visible
- [ ] Browser tooltips appear on hover
- [ ] All icons load correctly
- [ ] No console errors

---

## Future Enhancements

Ideas for consideration:

1. **Quick Actions Dropdown** — Group less-used actions in overflow menu
2. **Keyboard Shortcuts** — Alt+E for Edit, Alt+N for Notes, etc.
3. **Customisable Button Order** — User preferences for action layout
4. **Badge Notifications** — Red dots on buttons with pending actions
5. **Condensed Mode Toggle** — Collapse demographics grid for more screen space

---

## Files Reference

| Component | File | Purpose |
|-----------|------|---------|
| PersonProfile Hero | `src/components/PersonProfile/PersonHeroBanner.tsx` | Main person banner |
| PropertyProfile Hero | `src/components/PropertyProfile/PropertyHeroBanner.tsx` | Property banner |
| Warning Icon | `src/components/shared/WarningIcon.tsx` | Pulsing warning indicator |
| Service Type Utils | `src/utils/serviceTypeUtils.ts` | Colour mapping functions |
| Global Animations | `src/index.css` | Warning pulse/shake animations |

---

## Need Help?

If working on hero banners and stuck:

1. Check this guide for established patterns
2. Review PersonHeroBanner.tsx (lines 183-239 for buttons, 373-418 for grid)
3. Test hover effects in browser DevTools
4. Verify service type colours with getServiceTypeColor()
5. Ask Matt for UX feedback before committing major changes

---

*This guide is maintained by Claude Code sessions. Update it when new patterns emerge or decisions are made.*
