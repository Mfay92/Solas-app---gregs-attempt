

import { Property, ServiceType, UnitStatus, TimelineEventType, MaintenanceStatus, NominalCode, Stakeholder, StakeholderType, IvolveStaff, PpmSchedule, Person, PersonStatus, LegalEntity, ComplianceType, GrowthOpportunity } from '../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'DEMO01_PROP',
    address: {
      propertyName: 'Demo House',
      line1: '123 Demonstration Road',
      city: 'Demo City',
      county: 'Demofolk',
      postcode: 'DM1 1EX',
      country: 'England'
    },
    tags: {
      rp: 'Demo Housing',
      supportProvider: 'ivolve',
      la: 'Demo Council',
    },
    region: 'North',
    serviceType: ServiceType.SupportedLiving,
    legalEntity: LegalEntity.Heathcotes,
    propertyType: 'Detached',
    livingType: 'Self-contained',
    handoverDate: '2023-01-01',
    handbackDate: null,
    flags: [],
    units: [
        { id: 'DEMO01', name: 'The Flat', status: UnitStatus.Occupied },
    ],
    contacts: [],
    timeline: [
      { id: 't1', date: '2024-01-01', type: TimelineEventType.System, description: 'Property created for demonstration purposes.', actor: 'System' },
    ],
    rentData: {
      currentSchedule: { year: '2024/25', documentUrl: '#', lines: [] },
      previousSchedules: [],
      voidTerms: { initial: "N/A", subsequent: "N/A" }
    },
    maintenanceJobs: [
       {
        id: 'job-demo-1', ref: 'DEM-001', propertyAddress: '123 Demonstration Road', unit: 'The Flat', category: 'Window Repair', nominalCode: NominalCode.WIN, priority: 'Medium', status: MaintenanceStatus.Open, reportedDate: '2024-07-15', slaDueDate: '2024-07-29', assignedTo: '',
        details: { reportedBy: 'Matt Fay', method: 'Email', roomLocation: 'Living Room', summary: 'Window handle is broken.', isTenantDamage: false, cost: { net: 0, vat: 0, gross: 0 } },
        activityLog: [{ date: '2024-07-15', actor: 'Matt Fay', action: 'Job created.'}],
        jobType: 'Reactive',
      },
    ],
    complianceItems: [
      { id: 'comp-demo-1', type: ComplianceType.GasSafety, lastCheck: '2024-05-15', nextCheck: '2025-05-14', status: 'Compliant', reportUrl: '#' },
    ],
    legalAgreements: [],
    documents: [],
    features: [],
    photos: ['https://picsum.photos/seed/DEMO01/800/600'],
    floorplans: [],
    linkedContacts: [],
    keyDates: {},
  }
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
    {
        id: 'la-demo',
        name: 'Demo Council',
        type: StakeholderType.LocalAuthority,
        branding: { heroBg: 'bg-blue-800', heroText: 'text-white', cardBg: 'bg-blue-800', cardText: 'text-white' },
        contacts: [
            { id: 'c-demo-1', name: 'Jane Smith', role: 'Commissioner', phone: '01234 567890', email: 'j.smith@democouncil.gov.uk' },
        ]
    },
    {
        id: 'rp-demo',
        name: 'Demo Housing',
        type: StakeholderType.RegisteredProvider,
        branding: { heroBg: 'bg-purple-800', heroText: 'text-white', cardBg: 'bg-purple-800', cardText: 'text-white' },
        contacts: [
            { id: 'c-demo-2', name: 'Peter Jones', role: 'Housing Officer', phone: '09876 543210', email: 'p.jones@demohousing.org.uk' },
        ]
    }
];

export const MOCK_IVOLVE_STAFF: IvolveStaff[] = [
    {
        id: 'MF01', name: 'Matt Fay', role: 'Head of Property & Growth', email: 'matt.fay@ivolve.co.uk', phone: '07700 900001', managerId: 'DE01', team: 'Property Team',
        tags: ['Property Lead', 'Development', 'Repairs'], relevance: 10, isPinned: true,
    },
    {
        id: 'JP01', name: 'Jenna Peters', role: 'Housing Officer', email: 'jenna.peters@ivolve.co.uk', phone: '07700 900002', managerId: 'MF01', team: 'Property Team',
        tags: ['Tenancy', 'North'], relevance: 8,
    },
    {
        id: 'CB01', name: 'Clara Bell', role: 'Area Manager', email: 'clara.bell@ivolve.co.uk', phone: '07700 900003', managerId: 'DE01', team: 'Operational Team',
        tags: ['North', 'Management'], relevance: 9,
    },
    {
        id: 'DE01', name: 'Daniel Evans', role: 'Director of Operations', email: 'daniel.evans@ivolve.co.uk', phone: '07700 900004', managerId: null, team: 'Executive Team',
        tags: ['Leadership', 'Operations'], relevance: 10, isPinned: true,
    },
];

export const MOCK_PEOPLE: Person[] = [
    {
        id: 'P_DOE_01',
        preferredFirstName: 'John',
        legalFirstName: 'Johnathan',
        surname: 'Doe',
        dob: '1992-08-20',
        status: PersonStatus.Current,
        propertyId: 'DEMO01_PROP',
        unitId: 'DEMO01',
        moveInDate: '2023-02-15',
        moveOutDate: null,
        keyWorkerId: 'JP01',
        areaManagerId: 'CB01',
        careNeeds: [{ id: 'cn1', category: 'Primary Need', detail: 'Learning Disability' }],
        funding: [{id: 'f1', source: 'Demo Council', weeklyAmount: 750.00, details: 'Personal budget.'}],
        tenancy: { type: 'Licence Agreement', startDate: '2023-02-15', documents: [] },
        timeline: [],
        documents: [],
        flags: [],
        contacts: [],
        title: 'Mr',
        firstLanguage: 'English',
        isNonVerbal: false,
    }
];

export const MOCK_GROWTH_OPPORTUNITIES: GrowthOpportunity[] = [];

export const MOCK_PPM_SCHEDULES: PpmSchedule[] = [
    {
        id: 'ppm-1',
        name: 'Annual Gas Safety Inspection',
        complianceType: ComplianceType.GasSafety,
        frequencyMonths: 12,
        leadTimeDays: 30,
        scope: { type: 'All' }
    }
];
