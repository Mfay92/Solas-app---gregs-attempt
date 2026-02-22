# Case Management Forms - Usage Examples

This document shows how to use the three new case management form components.

## Components

1. **AddSafeguardingCaseModal** - For recording safeguarding concerns
2. **AddSupportPlanModal** - For creating support plans
3. **AddRiskAssessmentModal** - For conducting risk assessments

---

## 1. AddSafeguardingCaseModal

### Import

```tsx
import { AddSafeguardingCaseModal } from '../components/Forms';
import { SafeguardingCase } from '../types';
```

### Usage

```tsx
import { useState } from 'react';
import { AddSafeguardingCaseModal } from '../components/Forms';
import { SafeguardingCase } from '../types';

function SafeguardingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [safeguardingCases, setSafeguardingCases] = useState<SafeguardingCase[]>([]);

  const handleSave = (newCase: SafeguardingCase) => {
    console.log('New safeguarding case:', newCase);
    setSafeguardingCases([...safeguardingCases, newCase]);
    // TODO: Save to backend/database
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add Safeguarding Case
      </button>

      <AddSafeguardingCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        personId="person-123" // The person this case relates to
      />
    </div>
  );
}
```

### Features

- Auto-generates case reference (e.g., "SAF2026/042")
- Supports multiple parties (victim, perpetrator, witness, reporter)
- Supports multiple incidents with dates, locations, and descriptions
- Categorizes by abuse type (Physical, Emotional, Financial, etc.)
- Severity levels (Level 1, 2, 3)
- Case status tracking (Open, Closed, Monitoring, etc.)

---

## 2. AddSupportPlanModal

### Import

```tsx
import { AddSupportPlanModal } from '../components/Forms';
import { SupportPlan } from '../types';
```

### Usage

```tsx
import { useState } from 'react';
import { AddSupportPlanModal } from '../components/Forms';
import { SupportPlan } from '../types';

function SupportPlanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);

  const handleSave = (newPlan: SupportPlan) => {
    console.log('New support plan:', newPlan);
    setSupportPlans([...supportPlans, newPlan]);
    // TODO: Save to backend/database
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add Support Plan
      </button>

      <AddSupportPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        personId="person-123" // The person this plan is for
      />
    </div>
  );
}
```

### Features

- Plan types: Care Plan, Support Plan, Move-On Plan, Rehabilitation Plan
- Dynamic goals list (add/remove as needed)
- Dynamic actions list (add/remove as needed)
- Review date tracking
- Assigned to key worker or case manager
- Status tracking (Current, Overdue, Completed, Draft)

---

## 3. AddRiskAssessmentModal

### Import

```tsx
import { AddRiskAssessmentModal } from '../components/Forms';
import { RiskAssessment } from '../types';
```

### Usage

```tsx
import { useState } from 'react';
import { AddRiskAssessmentModal } from '../components/Forms';
import { RiskAssessment } from '../types';

function RiskAssessmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);

  const handleSave = (newAssessment: RiskAssessment) => {
    console.log('New risk assessment:', newAssessment);
    setRiskAssessments([...riskAssessments, newAssessment]);
    // TODO: Save to backend/database
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add Risk Assessment
      </button>

      <AddRiskAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        personId="person-123" // The person being assessed
      />
    </div>
  );
}
```

### Features

- Assessment types: General, Fire, Moving & Handling, Safeguarding, Health & Safety, Substance Use
- Risk matrix calculation (Likelihood × Impact = Risk Level)
- Multiple risk categories with individual mitigations
- Overall risk level (Low, Medium, High)
- Color-coded risk indicators (green/amber/red)
- Review date tracking
- Overall mitigation actions

---

## Integration with PersonProfile

These forms are designed to be used within the PersonProfile component:

```tsx
// In PersonProfile/tabs/CasesTab.tsx
import {
  AddSafeguardingCaseModal,
  AddSupportPlanModal,
  AddRiskAssessmentModal
} from '../../Forms';

function CasesTab({ personId }: { personId: string }) {
  const [showSafeguardingModal, setShowSafeguardingModal] = useState(false);
  const [showSupportPlanModal, setShowSupportPlanModal] = useState(false);
  const [showRiskAssessmentModal, setShowRiskAssessmentModal] = useState(false);

  return (
    <div>
      <div className="flex gap-3">
        <Button onClick={() => setShowSafeguardingModal(true)}>
          Add Safeguarding Case
        </Button>
        <Button onClick={() => setShowSupportPlanModal(true)}>
          Add Support Plan
        </Button>
        <Button onClick={() => setShowRiskAssessmentModal(true)}>
          Add Risk Assessment
        </Button>
      </div>

      <AddSafeguardingCaseModal
        isOpen={showSafeguardingModal}
        onClose={() => setShowSafeguardingModal(false)}
        onSave={(newCase) => {
          // Handle save
          console.log('Safeguarding case created:', newCase);
        }}
        personId={personId}
      />

      <AddSupportPlanModal
        isOpen={showSupportPlanModal}
        onClose={() => setShowSupportPlanModal(false)}
        onSave={(newPlan) => {
          // Handle save
          console.log('Support plan created:', newPlan);
        }}
        personId={personId}
      />

      <AddRiskAssessmentModal
        isOpen={showRiskAssessmentModal}
        onClose={() => setShowRiskAssessmentModal(false)}
        onSave={(newAssessment) => {
          // Handle save
          console.log('Risk assessment created:', newAssessment);
        }}
        personId={personId}
      />
    </div>
  );
}
```

---

## Common Props Interface

All three components share a similar props interface:

```tsx
interface BaseModalProps {
  isOpen: boolean;           // Control modal visibility
  onClose: () => void;       // Called when user closes modal
  onSave: (data: T) => void; // Called when user saves with form data
  personId: string;          // ID of the person this relates to
}
```

---

## Validation

All forms include built-in validation:

- **Required fields** are marked with a red asterisk (*)
- **Validation errors** appear below fields with a red error message
- **Forms cannot be saved** until all required fields are filled
- **Dates** use native date pickers for browser compatibility

---

## Styling

All forms use:

- **ivolve brand colors** from Tailwind config
- **Consistent spacing** and typography
- **Focus states** for accessibility
- **Hover effects** for interactivity
- **Responsive design** (works on mobile and desktop)

---

## Auto-Generation

The forms automatically generate:

- **Unique IDs** using `crypto.randomUUID()` (with fallback)
- **Case references** (for Safeguarding: "SAF2026/XXX")
- **Timestamps** (createdAt, updatedAt)
- **Risk levels** (for Risk Assessment: calculated from likelihood × impact)

---

## Data Structure Compliance

All forms output data that exactly matches the TypeScript interfaces in `src/types.ts`:

- `SafeguardingCase`
- `SupportPlan`
- `RiskAssessment`

No manual transformation needed - the output is ready to be saved to your backend.
