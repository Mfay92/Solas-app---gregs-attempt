import { Property, ServiceType, UnitStatus, TimelineEventType, MaintenanceStatus, NominalCode, Stakeholder, StakeholderType, ContractorTrade, CommissioningInfo, IvolveStaff, ContactTier, PpmSchedule, Document, Person, PersonStatus, KeyDates, LegalEntity, ComplianceType, Framework, FrameworkStatus, Tender, TenderStatus } from '../types';

const MOCK_COMMISSIONERS = {
    harrogate: { id: 'c-hg', name: 'Susan Collins', role: 'Commissioner', phone: '01423 500 600', email: 's.collins@northyorks.gov.uk' },
    nottingham: { id: 'c-ng', name: 'David Jones', role: 'Framework Lead', phone: '0115 915 5555', email: 'd.jones@nottinghamcity.gov.uk' },
    newport: { id: 'c-np', name: 'Rhian Evans', role: 'Commissioning Officer', phone: '01633 656 656', email: 'r.evans@newport.gov.uk' }
};

export const MOCK_PPM_SCHEDULES: PpmSchedule[] = [
    {
        id: 'ppm-1',
        name: 'Annual Gas Safety Inspection',
        complianceType: ComplianceType.GasSafety,
        frequencyMonths: 12,
        leadTimeDays: 30,
        scope: { type: 'All' }
    },
    {
        id: 'ppm-2',
        name: '5-Year Electrical Check (EICR) - North',
        complianceType: ComplianceType.EICR,
        frequencyMonths: 60,
        leadTimeDays: 60,
        scope: { type: 'Region', value: 'North' }
    },
];

const MOCK_DOCS_STRE00: Document[] = [
    { id: 'doc-1', name: 'Gas Safety Certificate 2024', type: 'PDF', date: '2024-05-15', year: 2024, url: '#', linkedJobRef: 'HAR-580' },
    { id: 'doc-2', name: 'EICR Report 2022', type: 'PDF', date: '2022-08-01', year: 2022, url: '#' },
    { id: 'doc-3', name: 'Lease Agreement', type: 'PDF', date: '2021-09-01', year: 2021, url: '#' },
];

const MOCK_KEY_DATES_STRE00: KeyDates = {
    lease: {
        startDate: '2021-09-01',
        term: '25 Years',
        endDate: '2046-08-31',
        breakDate: '2031-08-31',
    },
    sla: {
        startDate: '2021-09-01',
        term: '10 Years',
        renewalDate: '2030-09-01'
    }
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'STRE00_PROP',
    address: {
      line1: '1 Street',
      city: 'Harrogate',
      county: 'North Yorkshire',
      postcode: 'HG1 1AA',
      country: 'England'
    },
    tags: {
      rp: 'Inclusion Housing',
      supportProvider: 'ivolve',
      la: 'North Yorkshire Council',
    },
    region: 'North',
    serviceType: ServiceType.SupportedLiving,
    legalEntity: LegalEntity.Heathcotes,
    propertyType: 'Terraced',
    livingType: 'Self-contained',
    handoverDate: '1995-01-01',
    handbackDate: null,
    flags: [
      { id: 'flag-1', message: 'Building site access – PPE required for all visits.', level: 'warning' }
    ],
    units: [
        { id: 'STRE00', name: 'Master', status: UnitStatus.Master },
        { id: 'STRE01', name: 'Flat 1', status: UnitStatus.Occupied },
        { id: 'STRE02', name: 'Flat 2', status: UnitStatus.Occupied, attention: true },
    ],
    contacts: [
      { id: 'c1', name: 'Jane Doe', role: 'Housing Officer', phone: '0161 123 4567', email: 'jane.doe@inclusion.com' },
      { id: 'c2', name: 'John Smith', role: 'Repairs Lead (ivolve)', phone: '07700 900123', email: 'john.s@ivolve.co.uk' },
    ],
    timeline: [
      { id: 't1', date: '2024-07-22', type: TimelineEventType.Compliance, description: 'Fire Risk Assessment posted. Next due: 2025-07-21.', actor: 'Admin' },
      { id: 't2', date: '2024-07-20', type: TimelineEventType.Repairs, description: 'Job #MCR-582 (Boiler) marked as Overdue.', actor: 'System' },
    ],
    rentData: {
      currentSchedule: {
        year: '2024/25',
        documentUrl: '/docs/rent-24-25.pdf',
        lines: [
          { category: 'Lease Rent', description: 'Base lease rent', amount: 500.00, period: 'week', rechargedToIvolve: true },
          { category: 'Core Rent', description: 'Tenant core rent', amount: 120.50, period: 'week', rechargedToIvolve: false },
        ],
      },
      previousSchedules: [],
      voidTerms: {
        initial: "Initial (Development) — Free period 90 days; Charges Lease Rent + Management Fee; Frequency every 4 weeks.",
        subsequent: "Subsequent (Operational) — Free period 28 days; Charges Core Rent only; Frequency weekly."
      }
    },
    maintenanceJobs: [
      {
        id: 'job-1', ref: 'HAR-582', propertyAddress: '1 Street, Harrogate', unit: 'Communal', category: 'Boiler Repair', nominalCode: NominalCode.BOI, priority: 'High', status: MaintenanceStatus.Assigned, reportedDate: '2024-07-10', slaDueDate: '2024-07-17', assignedTo: 'Yorkshire Sparks',
        details: { reportedBy: 'Tenant Unit 4', method: 'Phone', roomLocation: 'Boiler Room', summary: 'No hot water in building.', isTenantDamage: false, cost: { net: 150, vat: 30, gross: 180 } },
        activityLog: [
            { date: '2024-07-10', actor: 'Matt Fay', action: 'Job created.'},
            { date: '2024-07-11', actor: 'Matt Fay', action: 'Assigned to Yorkshire Sparks.'}
        ],
        jobType: 'Reactive',
      },
       {
        id: 'job-2', ref: 'HAR-583', propertyAddress: '1 Street, Harrogate', unit: 'Flat 2', category: 'Window Repair', nominalCode: NominalCode.WIN, priority: 'Medium', status: MaintenanceStatus.InProgress, reportedDate: '2024-07-15', slaDueDate: '2024-07-29', assignedTo: 'Midlands Property Care',
        details: { reportedBy: 'Housing Officer', method: 'Email', roomLocation: 'Living Room', summary: 'Window handle is broken and will not lock.', isTenantDamage: false, cost: { net: 0, vat: 0, gross: 0 } },
        activityLog: [
            { date: '2024-07-15', actor: 'Jenna Peters', action: 'Job created.'},
            { date: '2024-07-16', actor: 'Jenna Peters', action: 'Assigned to Midlands Property Care.'},
            { date: '2024-07-18', actor: 'Dave Smith (MPC)', action: 'Accepted job. Parts ordered, ETA 3 days.'}
        ],
        jobType: 'Reactive',
      },
      {
        id: 'job-3', ref: 'HAR-584', propertyAddress: '1 Street, Harrogate', unit: 'Communal', category: 'Gardening', nominalCode: NominalCode.GRD, priority: 'Low', status: MaintenanceStatus.Open, reportedDate: '2024-07-22', slaDueDate: '2024-08-19', assignedTo: '',
        details: { reportedBy: 'Area Manager', method: 'Email', roomLocation: 'Front Garden', summary: 'Hedges need trimming before next site visit.', isTenantDamage: false, cost: { net: 0, vat: 0, gross: 0 } },
        activityLog: [
            { date: '2024-07-22', actor: 'Clara Bell', action: 'Job created.'}
        ],
        jobType: 'Reactive',
      },
      {
        id: 'job-gs-1', ref: 'HAR-PPM-001', propertyAddress: '1 Street, Harrogate', unit: 'Communal', category: 'Gas Safety Inspection', nominalCode: NominalCode.BOI, priority: 'High', status: MaintenanceStatus.Open, reportedDate: '2025-04-14', slaDueDate: '2025-05-14', assignedTo: '',
        details: { reportedBy: 'System (PPM)', method: 'Email', roomLocation: 'Boiler Room', summary: 'Annual Gas Safety check automatically generated as per PPM schedule.', isTenantDamage: false, cost: { net: 0, vat: 0, gross: 0 } },
        activityLog: [
            { date: '2025-04-14', actor: 'System', action: 'Job auto-created from PPM Schedule "Annual Gas Safety Inspection"'}
        ],
        jobType: 'PPM',
        linkedComplianceId: 'comp-1',
      },
    ],
    complianceItems: [
      { id: 'comp-1', type: ComplianceType.GasSafety, lastCheck: '2024-05-15', nextCheck: '2025-05-14', status: 'Compliant', reportUrl: '/docs/gas-cert-24.pdf' },
      { id: 'comp-2', type: ComplianceType.EICR, lastCheck: '2022-08-01', nextCheck: '2027-07-31', status: 'Compliant', reportUrl: '/docs/eicr-22.pdf' },
      { id: 'comp-fra-1', type: ComplianceType.FireRiskAssessment, lastCheck: '2024-07-22', nextCheck: '2025-07-21', status: 'Compliant', reportUrl: '#' },
      { id: 'comp-epc-1', type: ComplianceType.EPC, lastCheck: '2021-09-01', nextCheck: '2031-08-31', status: 'Compliant', reportUrl: '#' },
      { id: 'comp-asb-1', type: ComplianceType.Asbestos, lastCheck: '2021-09-01', nextCheck: '2026-08-31', status: 'Compliant', reportUrl: '#' },
      { id: 'comp-fd-1', type: ComplianceType.FireDoor, lastCheck: '2024-07-22', nextCheck: '2025-01-22', status: 'Compliant', reportUrl: '#' },

    ],
    legalAgreements: [
      {
        id: 'legal-1', type: 'Lease', title: '25-Year FRI Lease with Inclusion Housing', date: '2021-09-01', documentUrl: '/docs/main-lease.pdf',
        clauses: [
          { id: 'cl-1', topic: 'Repairs', originalText: 'The Landlord shall be responsible for the maintenance, repair and renewal of the main structure of the Building...', plainText: 'The landlord must fix the building\'s main structure.', extraPlainText: 'Landlord fixes the important bits.' },
        ]
      }
    ],
    documents: MOCK_DOCS_STRE00,
    features: [],
    commissioning: {
        commissioner: MOCK_COMMISSIONERS.harrogate,
        hasWrittenSupport: true,
        documents: [
            { id: 'cd-1', name: 'Commissioner Letter of Support', url: '#' },
            { id: 'cd-2', name: 'Support Contract', url: '#' }
        ]
    },
    photos: ['https://picsum.photos/seed/prop1/800/600'],
    floorplans: ['httpsum.photos/seed/plan1/800/600'],
    linkedContacts: [
        { id: 'lc-1', role: 'RP Housing Officer', contactId: 'c-ih-ho1', stakeholderId: 'rp-ih' },
        { id: 'lc-2', role: 'ivolve Housing Lead', contactId: 'MF01' },
        { id: 'lc-3', role: 'LA Commissioner', contactId: 'c-hg', stakeholderId: 'la-nyc' },
    ],
    keyDates: MOCK_KEY_DATES_STRE00,
  },
  {
    id: 'EXAM00_PROP',
    address: {
      propertyName: 'Example House',
      line1: '123 Example Street',
      city: 'Nottingham',
      county: 'Nottinghamshire',
      postcode: 'NG1 1AJ',
      country: 'England'
    },
    tags: {
      rp: 'Harbour Light',
      supportProvider: 'ivolve',
      la: 'Nottingham City Council',
    },
    region: 'Midlands',
    serviceType: ServiceType.Residential,
    legalEntity: LegalEntity.HeathcotesM,
    propertyType: 'Semi-detached',
    livingType: 'Shared Living',
    handoverDate: '2000-02-01',
    handbackDate: null,
    flags: [],
    units: [
        { id: 'EXAM00', name: 'Master', status: UnitStatus.Master },
        { id: 'EXAM01', name: 'Room 1', status: UnitStatus.Occupied },
        { id: 'EXAM02', name: 'Room 2', status: UnitStatus.Void },
        { id: 'EXAM03', name: 'Room 3', status: UnitStatus.Occupied },
    ],
    contacts: [],
    timeline: [],
    rentData: {
      currentSchedule: { year: '2024/25', documentUrl: '#', lines: [] },
      previousSchedules: [],
      voidTerms: { initial: 'N/A', subsequent: 'N/A' }
    },
    maintenanceJobs: [
        {
            id: 'job-4', ref: 'NOT-101', propertyAddress: '123 Example Street, Nottingham', unit: 'Room 2', category: 'Full Redecoration', nominalCode: NominalCode.DEC, priority: 'Medium', status: MaintenanceStatus.AwaitingInvoice, reportedDate: '2024-06-20', slaDueDate: '2024-07-18', assignedTo: 'Midlands Property Care',
            details: { reportedBy: 'Daniel Evans', method: 'Email', roomLocation: 'Bedroom', summary: 'Void redecoration work. Paint walls magnolia, gloss skirting boards.', isTenantDamage: false, cost: { net: 400, vat: 80, gross: 480 } },
            activityLog: [
                { date: '2024-06-20', actor: 'Daniel Evans', action: 'Job created for void works.'},
                { date: '2024-06-21', actor: 'Daniel Evans', action: 'Assigned to Midlands Property Care.'},
                { date: '2024-07-05', actor: 'Dave Smith (MPC)', action: 'Work completed. Invoice to follow.'}
            ],
            jobType: 'Reactive',
        },
    ],
    complianceItems: [
        { id: 'comp-erd-1', type: ComplianceType.GasSafety, lastCheck: '2024-01-10', nextCheck: '2025-01-09', status: 'Compliant', reportUrl: '#' },
        { id: 'comp-erd-2', type: ComplianceType.FireRiskAssessment, lastCheck: '2023-08-15', nextCheck: '2024-08-14', status: 'Action Required', reportUrl: '#' },
        { id: 'comp-erd-3', type: ComplianceType.FireAlarm, lastCheck: '2024-02-01', nextCheck: '2025-01-31', status: 'Compliant', reportUrl: '#' },
    ],
    legalAgreements: [],
    documents: [],
    features: [],
    commissioning: {
        commissioner: MOCK_COMMISSIONERS.nottingham,
        hasWrittenSupport: false,
        documents: []
    },
    photos: ['httpsum.photos/seed/propERD1/800/600'],
    floorplans: [],
    keyDates: {},
  },
  {
    id: 'WALE01_PROP',
    address: {
      line1: '1 Welsh Road',
      city: 'Newport',
      county: 'Gwent',
      postcode: 'NP20 1DB',
      country: 'Wales',
    },
    tags: {
      rp: 'Bespoke Supportive Tenancies',
      supportProvider: 'ivolve',
      la: 'Newport City Council',
    },
    region: 'Wales',
    serviceType: ServiceType.NursingCare,
    legalEntity: LegalEntity.Fieldbay,
    propertyType: 'Bungalow',
    livingType: 'Shared Living',
    handoverDate: '2022-03-15',
    handbackDate: '2024-06-30',
    flags: [],
    units: [
      { id: 'WALE01', name: 'Master', status: UnitStatus.OutOfManagement },
      { id: 'WALE01-1', name: 'Room 1', status: UnitStatus.OutOfManagement },
      { id: 'WALE01-2', name: 'Room 2', status: UnitStatus.OutOfManagement },
      { id: 'WALE01-3', name: 'Room 3', status: UnitStatus.OutOfManagement },
      { id: 'WALE01-4', name: 'Room 4', status: UnitStatus.OutOfManagement },
      { id: 'WALE01-5', name: 'Room 5', status: UnitStatus.OutOfManagement },
    ],
    contacts: [],
    timeline: [],
    rentData: {
      currentSchedule: { year: '2024/25', documentUrl: '#', lines: [] },
      previousSchedules: [],
      voidTerms: { initial: 'N/A', subsequent: 'N/A' },
    },
    maintenanceJobs: [
      {
        id: 'job-5', ref: 'NEW-021', propertyAddress: '1 Welsh Road, Newport', unit: 'Communal', category: 'Leaking Pipe', nominalCode: NominalCode.PLM, priority: 'High', status: MaintenanceStatus.Completed, reportedDate: '2024-07-19', slaDueDate: '2024-07-20', assignedTo: 'Welsh Water Wizards',
        details: { reportedBy: 'On-site staff', method: 'Phone', roomLocation: 'Kitchen', summary: 'Pipe under sink is dripping water onto the floor.', isTenantDamage: false, cost: { net: 85, vat: 17, gross: 102 } },
        activityLog: [
            { date: '2024-07-19', actor: 'Matt Fay', action: 'Emergency job created.'},
            { date: '2024-07-19', actor: 'Matt Fay', action: 'Assigned to Welsh Water Wizards.'},
            { date: '2024-07-19', actor: 'Gareth Edwards (WWW)', action: 'On site. Isolated leak.'},
            { date: '2024-07-20', actor: 'Gareth Edwards (WWW)', action: 'Replaced pipe fitting. Leak resolved. Marked as complete.'}
        ],
        jobType: 'Reactive',
      },
    ],
    complianceItems: [
        { id: 'comp-wales-1', type: ComplianceType.GasSafety, lastCheck: '2023-07-30', nextCheck: '2024-07-29', status: 'Expired', reportUrl: '#' },
        { id: 'comp-wales-2', type: ComplianceType.LRA, lastCheck: '2023-07-30', nextCheck: '2024-07-29', status: 'Expired', reportUrl: '#' },
    ],
    legalAgreements: [],
    documents: [],
    features: [],
    commissioning: {
        commissioner: MOCK_COMMISSIONERS.newport,
        hasWrittenSupport: true,
        documents: [
            { id: 'cd-3', name: 'Nominations Agreement', url: '#' },
        ]
    },
    photos: ['httpsum.photos/seed/propWALE1/800/600'],
    floorplans: [],
    keyDates: {},
  },
  {
    id: 'CHES01_PROP',
    address: {
      line1: '33 High Street',
      city: 'Chester',
      county: 'Cheshire',
      postcode: 'CH1 1CH',
      country: 'England'
    },
    tags: {
      rp: 'Auckland Home Solutions',
      supportProvider: 'ivolve',
      la: 'Cheshire West and Chester Council',
    },
    region: 'North',
    serviceType: ServiceType.SupportedLiving,
    legalEntity: LegalEntity.Heathcotes,
    propertyType: 'Semi-detached',
    livingType: 'Shared Living',
    handoverDate: '2023-01-10',
    handbackDate: null,
    flags: [],
    units: [
        { id: 'CHES00', name: 'Master', status: UnitStatus.Master },
        { id: 'CHES01', name: 'Room 1', status: UnitStatus.Void },
        { id: 'CHES02', name: 'Room 2', status: UnitStatus.Occupied },
        { id: 'CHES03', name: 'Room 3', status: UnitStatus.Void },
        { id: 'CHES04', name: 'Room 4', status: UnitStatus.Void },
        { id: 'CHES05', name: 'Room 5', status: UnitStatus.Occupied },
        { id: 'CHES06', name: 'Room 6', status: UnitStatus.OutOfManagement },
    ],
    contacts: [],
    timeline: [],
    rentData: { currentSchedule: { year: '2024/25', documentUrl: '#', lines: [] }, previousSchedules: [], voidTerms: { initial: 'N/A', subsequent: 'N/A' }},
    maintenanceJobs: [],
    complianceItems: [
        { id: 'comp-ches-1', type: ComplianceType.GasSafety, lastCheck: '2024-08-01', nextCheck: '2025-07-31', status: 'Compliant', reportUrl: '#' },
    ],
    legalAgreements: [],
    documents: [],
    features: [],
    photos: ['httpsum.photos/seed/CHES01/800/600'],
    floorplans: [],
    keyDates: {},
  },
   {
    id: 'LIVP01_PROP',
    address: {
      propertyName: 'Scouse Tower',
      line1: '6 Low Street',
      city: 'Liverpool',
      county: 'Merseyside',
      postcode: 'L1 1LL',
      country: 'England'
    },
    tags: {
      rp: 'Harbour Light',
      supportProvider: 'ivolve',
      la: 'Liverpool City Council',
    },
    region: 'North',
    serviceType: ServiceType.SupportedLiving,
    legalEntity: LegalEntity.HeathcotesS,
    propertyType: 'Flat in property',
    livingType: 'Mixed',
    handoverDate: '2024-02-20',
    handbackDate: null,
    flags: [],
    units: [
        { id: 'LIVP00', name: 'Master', status: UnitStatus.Master },
        { id: 'LIVP01', name: 'Flat 1', status: UnitStatus.Occupied },
        { id: 'LIVP02', name: 'Flat 2', status: UnitStatus.Occupied },
        { id: 'LIVP03', name: 'Flat 3', status: UnitStatus.Void },
        { id: 'LIVP04', name: 'Flat 4', status: UnitStatus.Void },
        { id: 'LIVP05', 'name': 'Room 5', status: UnitStatus.Occupied }, // Shared
        { id: 'LIVP06', 'name': 'Room 6', status: UnitStatus.Occupied }, // Shared
        { id: 'LIVP07', 'name': 'Room 7', status: UnitStatus.Void },     // Shared
        { id: 'LIVP08', 'name': 'Room 8', status: UnitStatus.Void },     // Shared
        { id: 'LIVP09', name: 'Unit 9', status: UnitStatus.StaffSpace },
        { id: 'LIVP10', name: 'Flat 10', status: UnitStatus.Occupied },
        { id: 'LIVP11', name: 'Flat 11', status: UnitStatus.Occupied },
        { id: 'LIVP12', name: 'Flat 12', status: UnitStatus.Occupied },
        { id: 'LIVP13', name: 'Flat 13', status: UnitStatus.Void },
        { id: 'LIVP14', name: 'Flat 14', status: UnitStatus.Void },
        { id: 'LIVP15', name: 'Flat 15', status: UnitStatus.Occupied },
    ],
    contacts: [],
    timeline: [],
    rentData: { currentSchedule: { year: '2024/25', documentUrl: '#', lines: [] }, previousSchedules: [], voidTerms: { initial: 'N/A', subsequent: 'N/A' }},
    maintenanceJobs: [],
    complianceItems: [
        { id: 'comp-livp-1', type: ComplianceType.LiftLOLER, lastCheck: '2024-03-01', nextCheck: '2024-09-01', status: 'Compliant', reportUrl: '#' },
        { id: 'comp-livp-2', type: ComplianceType.EmergencyLighting, lastCheck: '2024-03-01', nextCheck: '2025-02-28', status: 'Compliant', reportUrl: '#' },
        { id: 'comp-livp-3', type: ComplianceType.Sprinkler, lastCheck: '2024-03-01', nextCheck: '2025-02-28', status: 'Compliant', reportUrl: '#' },
        { id: 'comp-livp-4', type: ComplianceType.FireAlarm, lastCheck: '2024-03-01', nextCheck: '2024-09-01', status: 'Compliant', reportUrl: '#' },
    ],
    legalAgreements: [],
    documents: [],
    features: [],
    photos: ['httpsum.photos/seed/LIVP01/800/600'],
    floorplans: [],
    keyDates: {},
  },
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
    // Local Authorities
    {
        id: 'la-nyc',
        name: 'North Yorkshire Council',
        subName: 'Formerly Harrogate Borough Council',
        type: StakeholderType.LocalAuthority,
        website: 'https://www.northyorks.gov.uk/',
        logoComponent: 'NorthYorkshireLogo',
        about: "North Yorkshire Council is the local authority for North Yorkshire, England. It is a unitary authority, having taken over the functions of the previous county council and the seven district councils in April 2023. It provides a wide range of services to residents and businesses across the largest county in England.",
        address: { line1: 'County Hall', city: 'Northallerton', postcode: 'DL7 8AD' },
        keyInfo: [{ label: 'Area Covered', value: 'North Yorkshire' }],
        branding: { heroBg: 'bg-nyc-blue', heroText: 'text-white', cardBg: 'bg-nyc-blue', cardText: 'text-white' },
        contacts: [
            MOCK_COMMISSIONERS.harrogate,
            { id: 'c-hg-sw', name: 'Gemma Field', role: 'Social Worker', phone: '01423 500 600', email: 'g.field@northyorks.gov.uk' },
            { id: 'c-hg-dir', name: 'Richard Webb', role: 'Corporate Director', phone: '01609 780780', email: 'richard.webb@northyorks.gov.uk'}
        ]
    },
    {
        id: 'la-ncc',
        name: 'Nottingham City Council',
        type: StakeholderType.LocalAuthority,
        website: 'https://www.nottinghamcity.gov.uk/',
        logoComponent: 'NottinghamLogo',
        about: "Nottingham City Council is the unitary authority for the city of Nottingham. It provides all local government services for the city, including education, social care, housing, planning, and waste collection. The council is committed to making Nottingham a world-class city for its citizens, businesses, and visitors.",
        address: { line1: 'Loxley House', city: 'Nottingham', postcode: 'NG2 3NG' },
        keyInfo: [{ label: 'Council Type', value: 'Unitary Authority' }],
        branding: { heroBg: 'bg-notts-gray', heroText: 'text-white', cardBg: 'bg-notts-gray', cardText: 'text-white' },
        contacts: [
            MOCK_COMMISSIONERS.nottingham,
            { id: 'c-ng-dir', name: 'Catherine Underwood', role: 'Corporate Director for People Services', phone: '0115 915 5555', email: 'c.underwood@nottinghamcity.gov.uk'}
        ]
    },
    {
        id: 'la-npt',
        name: 'Newport City Council',
        subName: 'Cyngor Dinas Casnewydd',
        type: StakeholderType.LocalAuthority,
        website: 'https://www.newport.gov.uk/',
        logoComponent: 'NewportLogo',
        about: "Newport City Council (Cyngor Dinas Casnewydd) is the governing body for Newport, one of Wales' principal cities. It provides essential services to over 150,000 residents, focusing on community well-being, economic growth, and preserving the city's rich heritage.",
        address: { line1: 'Civic Centre', city: 'Newport', postcode: 'NP20 4UR' },
        keyInfo: [{ label: 'Country', value: 'Wales' }],
        branding: { heroBg: 'bg-white', heroText: 'text-newport-green', cardBg: 'bg-white', cardText: 'text-newport-green', cardBorder: 'border-newport-green' },
        contacts: [
            MOCK_COMMISSIONERS.newport,
            { id: 'c-np-sw', name: 'Cerys Williams', role: 'Social Worker', phone: '01633 656 656', email: 'c.williams@newport.gov.uk' },
        ]
    },
    // Registered Providers
    {
        id: 'rp-ih',
        name: 'Inclusion Housing',
        type: StakeholderType.RegisteredProvider,
        website: 'https://www.inclusion-group.org.uk/inclusion-housing/',
        logoComponent: 'InclusionLogo',
        about: "Inclusion Housing is a social enterprise and registered provider of social housing. They work with a range of vulnerable people, including those with learning disabilities, mental ill-health, and older people, providing quality homes with care and support to help them live more independently.",
        address: { line1: '10 Audax Court, Audax Road', city: 'York', postcode: 'YO30 4RB' },
        keyInfo: [
            { label: 'Company No.', value: '06169583' }, 
            { label: 'Regulator of Social Housing No.', value: '4637' }
        ],
        branding: { heroBg: 'bg-white', heroText: 'text-black', cardBg: 'bg-status-red', cardText: 'text-white', cardBorder: 'border-gray-400' },
        contacts: [ 
            // Tier 1: General
            { id: 'c-ih-gen1', name: 'General Enquiries', role: 'Main Office', phone: '01904 675207', email: 'info@inclusionhousing.org.uk', tier: ContactTier.General, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-gen1' },
            { id: 'c-ih-gen2', name: 'Repairs Hotline', role: 'Facilities Desk', phone: '01904 675208', email: 'repairs@inclusionhousing.org.uk', tier: ContactTier.General, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-gen2' },
            // Tier 2: Executive
            { id: 'c-ih-exec1', name: 'Michelle Dodgson', role: 'Chief Executive Officer', phone: '01904 675207', email: 'm.dodgson@inclusionhousing.org.uk', tier: ContactTier.Executive, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-exec1', isPinned: true },
            { id: 'c-ih-exec2', name: 'Neil Brown', role: 'Chair of the Board', phone: '01904 675207', email: 'n.brown@inclusionhousing.org.uk', tier: ContactTier.Executive, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-exec2' },
            // Tier 3: Senior Management
            { id: 'c-ih-sm1', name: 'Sarah Thompson', role: 'Head of Housing', phone: '01904 675210', email: 's.thompson@inclusionhousing.org.uk', tier: ContactTier.SeniorManagement, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-sm1' },
            // Tier 4: Housing Officers
            { id: 'c-ih-ho1', name: 'David Miller', role: 'Housing Officer (North)', phone: '07711 223344', email: 'd.miller@inclusionhousing.org.uk', tier: ContactTier.Operations, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-ho1' },
            // Tier 5: Finance
            { id: 'c-ih-fin1', name: 'Finance Team', role: 'Accounts Payable', phone: '01904 675220', email: 'finance@inclusionhousing.org.uk', tier: ContactTier.Finance, photoUrl: 'https://i.pravatar.cc/150?u=c-ih-fin1' },
        ]
    },
    {
        id: 'rp-hl',
        name: 'Harbour Light',
        type: StakeholderType.RegisteredProvider,
        website: 'https://harbourlight.org.uk/',
        logoComponent: 'HarbourLightLogo',
        about: "Harbour Light is an exempt-accommodation provider that supports vulnerable adults to live independently. They aim to deliver quality housing and support services, fostering a safe and empowering environment for their tenants.",
        address: { line1: 'Suite 2A, The Quadrant', city: 'Sheffield', postcode: 'S2 5SY' },
        keyInfo: [{ label: 'Status', value: 'Community Interest Company' }],
        branding: { heroBg: 'bg-rp-harbour-bg', heroText: 'text-rp-harbour-text', cardBg: 'bg-rp-harbour-text', cardText: 'text-white', cardBorder: 'border-rp-harbour-text' },
        contacts: [
            {id: 'c-hl-gen1', name: 'Main Office', role: 'Enquiries', phone: '0114 278 7575', email: 'info@harbourlight.org.uk', tier: ContactTier.General, photoUrl: 'https://i.pravatar.cc/150?u=c-hl-1'},
            {id: 'c-hl-exec1', name: 'Peter George', role: 'Managing Director', phone: '0114 278 7575', email: 'p.george@harbourlight.org.uk', tier: ContactTier.Executive, photoUrl: 'https://i.pravatar.cc/150?u=c-hl-exec1'},
            {id: 'c-hl-ops1', name: 'Angelarinsic', role: 'Housing Manager', phone: '07812 345678', email: 'a.angela@harbourlight.org.uk', tier: ContactTier.Operations, photoUrl: 'https://i.pravatar.cc/150?u=c-hl-ops1'}
        ]
    },
    {
        id: 'rp-best',
        name: 'Bespoke Supportive Tenancies',
        subName: '(BeST)',
        type: StakeholderType.RegisteredProvider,
        website: 'https://www.bestha.co.uk/',
        logoComponent: 'BeSTLogo',
        about: "Bespoke Supportive Tenancies (BeST) is a Community Benefit Society and Registered Provider of Social Housing. They specialise in providing bespoke housing solutions for individuals with learning disabilities, autism, and mental health needs, ensuring tenants have a home for life.",
        address: { line1: 'Suite 3, The Stables, Little Droitwich', city: 'Droitwich Spa', postcode: 'WR9 0BZ' },
        keyInfo: [
            { label: 'Community Benefit Society No.', value: '7538' }, 
            { label: 'Regulator of Social Housing No.', value: '4831' }
        ],
        branding: { heroBg: 'bg-best-purple', heroText: 'text-white', cardBg: 'bg-best-green', cardText: 'text-best-purple', cardBorder: 'border-best-purple' },
        contacts: [
             {id: 'c-best-gen1', name: 'Main Office', role: 'Enquiries', phone: '0121 445 4648', email: 'info@bestha.co.uk', tier: ContactTier.General, photoUrl: 'https://i.pravatar.cc/150?u=c-best-1'},
             {id: 'c-best-exec1', name: 'Paul de Savary', role: 'Chief Executive', phone: '0121 445 4648', email: 'p.desavary@bestha.co.uk', tier: ContactTier.Executive, photoUrl: 'https://i.pravatar.cc/150?u=c-best-exec1'},
             {id: 'c-best-ops1', name: 'Gail Corden', role: 'Housing Manager', phone: '07701 987654', email: 'g.corden@bestha.co.uk', tier: ContactTier.Operations, photoUrl: 'https://i.pravatar.cc/150?u=c-best-ops1'}
        ]
    },
    {
        id: 'rp-ahs',
        name: 'Auckland Home Solutions',
        type: StakeholderType.RegisteredProvider,
        website: '#',
        logoComponent: '',
        branding: { heroBg: 'bg-gray-700', heroText: 'text-white', cardBg: 'bg-gray-200', cardText: 'text-gray-800', cardBorder: 'border-gray-400' },
        contacts: [
            {id: 'c-ahs-1', name: 'Main Office', role: 'Enquiries', phone: '01388 606 606', email: 'info@aucklandhs.co.uk', tier: ContactTier.General},
        ]
    },
    // Contractors
    {
        id: 'co-1',
        name: 'Midlands Property Care',
        type: StakeholderType.Contractor,
        areaOfOperation: 'Midlands',
        trades: [ContractorTrade.General, ContractorTrade.Decorator, ContractorTrade.Gardener],
        branding: { heroBg: '', heroText: '', cardBg: '', cardText: '' },
        contacts: [ {id: 'c-mpc1', name: 'Dave Smith', role: 'Manager', phone: '0121 456 7890', email: 'dave@mpc.com'} ],
    },
    {
        id: 'co-2',
        name: 'Yorkshire Sparks',
        type: StakeholderType.Contractor,
        areaOfOperation: 'North',
        trades: [ContractorTrade.Electrician],
        branding: { heroBg: '', heroText: '', cardBg: '', cardText: '' },
        contacts: [ {id: 'c-ys1', name: 'Sarah Jenkins', role: 'Lead Electrician', phone: '0113 987 6543', email: 's.jenkins@ysparks.co.uk'} ],
    },
    {
        id: 'co-3',
        name: 'Welsh Water Wizards',
        type: StakeholderType.Contractor,
        areaOfOperation: 'Wales',
        trades: [ContractorTrade.Plumber],
        branding: { heroBg: '', heroText: '', cardBg: '', cardText: '' },
        contacts: [ {id: 'c-www1', name: 'Gareth Edwards', role: 'Owner', phone: '029 2000 1122', email: 'g.edwards@waterwizards.wales'} ],
    },
    // Developers
    {
        id: 'dev-1',
        name: 'Oak Frame Developments',
        type: StakeholderType.Developer,
        website: '#',
        branding: { heroBg: 'bg-amber-800', heroText: 'text-white', cardBg: 'bg-amber-800', cardText: 'text-white' },
        contacts: [],
    },
    // Landlords
    {
        id: 'll-1',
        name: 'Mr. John Landlord',
        type: StakeholderType.Landlord,
        branding: { heroBg: 'bg-gray-200', heroText: 'text-black', cardBg: 'bg-gray-200', cardText: 'text-black' },
        contacts: [{id: 'c-ll1', name: 'Mr. John Landlord', role: 'Owner', phone: '07777 123456', email: 'j.landlord@email.com'}],
    }
];

export const MOCK_IVOLVE_STAFF: IvolveStaff[] = [
    // Board
    { id: 'IM01', name: 'Ian McKay', role: 'Chairman', email: 'i.mckay@ivolve.co.uk', phone: '07700900001', photoUrl: 'https://i.pravatar.cc/150?u=IM01', managerId: null, team: 'Board of Directors', tags: ['Board'], relevance: 1 },
    
    // Executive Team
    { id: 'TD01', name: 'Leo Vance', role: 'Group Chief Executive Officer', email: 'l.vance@ivolve.co.uk', phone: '07700900100', photoUrl: 'https://i.pravatar.cc/150?u=TD01', managerId: 'IM01', team: 'Executive Team', tags: ['Executive', 'Director'], relevance: 5, isPinned: true },
    { id: 'NR01', name: 'Olivia Chen', role: 'Chief Financial Officer', email: 'o.chen@ivolve.co.uk', phone: '07700900101', photoUrl: 'https://i.pravatar.cc/150?u=NR01', managerId: 'TD01', team: 'Finance Team', tags: ['Executive', 'Director'], relevance: 5 },
    { id: 'KG01', name: 'Ben Carter', role: 'Chief People Officer', email: 'b.carter@ivolve.co.uk', phone: '07700900102', photoUrl: 'https://i.pravatar.cc/150?u=KG01', managerId: 'TD01', team: 'People Team', tags: ['Executive', 'Director'], relevance: 5 },
    { id: 'LH01', name: 'Sophia Wells', role: 'Managing Director, England', email: 's.wells@ivolve.co.uk', phone: '07700900103', photoUrl: 'https://i.pravatar.cc/150?u=LH01', managerId: 'TD01', team: 'Operational Team', tags: ['Executive', 'Director', 'England'], relevance: 5 },
    { id: 'GFH01', name: 'Graham Foster', role: 'Chief Quality Officer', email: 'g.foster@ivolve.co.uk', phone: '07700900104', photoUrl: 'https://i.pravatar.cc/150?u=GFH01', managerId: 'TD01', team: 'Quality Team', tags: ['Executive', 'Director'], relevance: 5 },
    { id: 'CC01', name: 'Chloe Anderson', role: 'Commercial Director', email: 'c.anderson@ivolve.co.uk', phone: '07700900105', photoUrl: 'https://i.pravatar.cc/150?u=CC01', managerId: 'TD01', team: 'Commercial Team', tags: ['Executive', 'Director'], relevance: 5 },

    // Property Team
    { id: 'CG01', name: 'Craig Morgan', role: 'Group Director of Property', email: 'c.morgan@ivolve.co.uk', phone: '07700900200', photoUrl: 'https://i.pravatar.cc/150?u=CG01', managerId: 'TD01', team: 'Property Team', tags: ['Central Functions', 'Director'], relevance: 10, isPinned: true },
    { id: 'MF01', name: 'Matt Fay', role: 'Housing Partnerships and Operations Manager', email: 'm.fay@ivolve.co.uk', phone: '07700900201', photoUrl: 'https://i.pravatar.cc/150?u=MF01', managerId: 'CG01', team: 'Property Team', tags: ['Central Functions', 'BeST', 'Inclusion', 'Harbour Light', 'Property Team', 'Function Lead'], relevance: 100, 
      personalizationIcons: [
        { id: '1', name: 'dog', color: '#f97316' },
        { id: '2', name: 'piano', color: '#8b5cf6' },
      ], 
      cardTemplate: 'white' 
    },
    { id: 'AS01', name: 'Aaron Banks', role: 'Group Head of Facilities and Services', email: 'a.banks@ivolve.co.uk', phone: '07700900202', photoUrl: 'https://i.pravatar.cc/150?u=AS01', managerId: 'CG01', team: 'Property Team', tags: ['Facilities', 'Services', 'Function Lead'], relevance: 8 },
    { id: 'MP01', name: 'Megan Parker', role: 'Property Hub Manager', email: 'm.parker@ivolve.co.uk', phone: '07700900203', photoUrl: 'https://i.pravatar.cc/150?u=MP01', managerId: 'AS01', team: 'Property Team', tags: ['Property Hub', 'Manager'], relevance: 8 },
    { id: 'VM01', name: 'Vacancy', role: 'Facilities Manager - Wales', email: '', phone: '', photoUrl: '', managerId: 'CG01', team: 'Property Team', tags: ['Wales', 'Facilities', 'Manager'], isVacancy: true, relevance: 1 },
    { id: 'JS01', name: 'Jenna Peters', role: 'Housing Officer', email: 'j.peters@ivolve.co.uk', phone: '07700900205', photoUrl: 'https://i.pravatar.cc/150?u=JS01', managerId: 'MF01', team: 'Property Team', tags: ['Housing', 'North'], relevance: 9 },
    { id: 'DA01', name: 'Daniel Evans', role: 'Housing Officer', email: 'd.evans@ivolve.co.uk', phone: '07700900206', photoUrl: 'https://i.pravatar.cc/150?u=DA01', managerId: 'MF01', team: 'Property Team', tags: ['Housing', 'Midlands'], relevance: 9 },

    // Finance Team
    { id: 'KD01', name: 'Karen Dunn', role: 'Group Finance Director', email: 'k.dunn@ivolve.co.uk', phone: '07700900300', photoUrl: 'https://i.pravatar.cc/150?u=KD01', managerId: 'NR01', team: 'Finance Team', tags: ['Director'], relevance: 4 },
    { id: 'SW01', name: 'Sam Wallace', role: 'Group FP & A Manager', email: 's.wallace@ivolve.co.uk', phone: '07700900301', photoUrl: 'https://i.pravatar.cc/150?u=SW01', managerId: 'KD01', team: 'Finance Team', tags: ['Manager'], relevance: 3 },
    { id: 'AT01', name: 'Alice Thompson', role: 'Commercial Finance Lead', email: 'a.thompson@ivolve.co.uk', phone: '07700900302', photoUrl: 'https://i.pravatar.cc/150?u=AT01', managerId: 'KD01', team: 'Finance Team', tags: ['Function Lead'], relevance: 3 },
    { id: 'JS02', name: 'Joining Soon', role: 'Management Accountant', email: '', phone: '', photoUrl: '', managerId: 'SW01', team: 'Finance Team', tags: [], isJoiningSoon: true, relevance: 1 },

    // Operations
    { id: 'GH01', name: 'Grace Hill', role: 'Operations Director, Region 1 North', email: 'g.hill@ivolve.co.uk', phone: '07700900400', photoUrl: 'https://i.pravatar.cc/150?u=GH01', managerId: 'LH01', team: 'Operational Team', tags: ['North', 'Region 1', 'Director'], relevance: 4 },
    { id: 'HD01', name: 'Harry Doyle', role: 'Operations Director, Region 1 Midlands', email: 'h.doyle@ivolve.co.uk', phone: '07700900401', photoUrl: 'https://i.pravatar.cc/150?u=HD01', managerId: 'LH01', team: 'Operational Team', tags: ['Midlands', 'Region 1', 'Director'], relevance: 4 },
    { id: 'JM01', name: 'Jack Murphy', role: 'Area Manager - Notts & Newark', email: 'j.murphy@ivolve.co.uk', phone: '07700900402', photoUrl: 'https://i.pravatar.cc/150?u=JM01', managerId: 'HD01', team: 'Operational Team', tags: ['Nottinghamshire', 'Newark', 'Area Manager'], relevance: 2 },
    { id: 'CB01', name: 'Clara Bell', role: 'Area Manager - East Coast & Leeds', email: 'c.bell@ivolve.co.uk', phone: '07700900403', photoUrl: 'https://i.pravatar.cc/150?u=CB01', managerId: 'GH01', team: 'Operational Team', tags: ['East Coast', 'Leeds', 'Area Manager'], relevance: 2 },
    { id: 'NH01', name: 'Nora Hayes', role: 'Team Leader - Notts & Lincoln', email: 'n.hayes@ivolve.co.uk', phone: '07700900404', photoUrl: 'https://i.pravatar.cc/150?u=NH01', managerId: 'JM01', team: 'Operational Team', tags: ['STRE00_PROP', 'Team Leader'], relevance: 3 },
    
    // People Team
    { id: 'TM01', name: 'Tara Mason', role: 'Group Head of People', email: 't.mason@ivolve.co.uk', phone: '07700900500', photoUrl: 'https://i.pravatar.cc/150?u=TM01', managerId: 'KG01', team: 'People Team', tags: ['Function Lead'], relevance: 4 },

    // IT Team
    { id: 'KH01', name: 'Kevin Hall', role: 'Group IT Director', email: 'k.hall@ivolve.co.uk', phone: '07700900600', photoUrl: 'https://i.pravatar.cc/150?u=KH01', managerId: 'TD01', team: 'IT Team', tags: ['Director'], relevance: 4 },

    // Learning and Development
    { id: 'JW01', name: 'Julia Wright', role: 'Group Head of L&D', email: 'j.wright@ivolve.co.uk', phone: '07700900700', photoUrl: 'https://i.pravatar.cc/150?u=JW01', managerId: 'KG01', team: 'Learning and Development Team', tags: ['Function Lead'], relevance: 4 },
    
    // Business Development
    { id: 'RL01', name: 'Rachel Lewis', role: 'Group Head of Growth & Development', email: 'r.lewis@ivolve.co.uk', phone: '07700900800', photoUrl: 'https://i.pravatar.cc/150?u=RL01', managerId: 'CC01', team: 'Business Development Team', tags: ['Function Lead'], relevance: 4 },
];

export const MOCK_PEOPLE: Person[] = [
    // 1 Street, Harrogate
    {
        id: 'P001', preferredFirstName: 'Alice', legalFirstName: 'Alice', surname: 'Johnson', photoUrl: 'https://i.pravatar.cc/150?u=P001', dob: '1992-05-15', status: PersonStatus.Current,
        propertyId: 'STRE00_PROP', unitId: 'STRE01', moveInDate: '2022-01-20', moveOutDate: null,
        keyWorkerId: 'NH01', areaManagerId: 'CB01',
        careNeeds: [
            { id: 'cn1', category: 'Mobility', detail: 'Requires assistance with stairs.' },
            { id: 'cn2', category: 'Medication', detail: 'Prompting required for morning medication.' },
        ],
        funding: { source: 'North Yorkshire Council', weeklyAmount: 850.00, details: 'Personal Independence Payment (PIP) and Housing Benefit.' },
        tenancy: { type: 'Licence Agreement', startDate: '2022-01-20', documents: [{ id: 'doc-p1-1', name: 'Alice J - Licence Agreement', type: 'PDF', date: '2022-01-20', year: 2022, url: '#'}] },
        timeline: [
            { id: 'pt1-1', date: '2024-07-15', type: TimelineEventType.Care, description: 'Annual support plan review completed.', actor: 'Nora Hayes' },
        ],
        documents: [
             { id: 'doc-p1-1', name: 'Alice J - Licence Agreement', type: 'PDF', date: '2022-01-20', year: 2022, url: '#'},
             { id: 'doc-p1-2', name: 'Support Plan Review 2024', type: 'PDF', date: '2024-07-15', year: 2024, url: '#'},
        ],
        title: 'Miss', firstLanguage: 'English', isNonVerbal: false, maritalStatus: 'Single', ethnicity: 'White British', nationality: 'British', nationalInsuranceNumber: 'AB123456C'
    },
    {
        id: 'P002', preferredFirstName: 'Ben', legalFirstName: 'Benjamin', surname: 'Williams', photoUrl: 'https://i.pravatar.cc/150?u=P002', dob: '1988-11-30', status: PersonStatus.Current,
        propertyId: 'STRE00_PROP', unitId: 'STRE02', moveInDate: '2021-09-01', moveOutDate: null,
        keyWorkerId: 'NH01', areaManagerId: 'CB01',
        careNeeds: [{ id: 'cn3', category: 'Social Engagement', detail: 'Support to attend weekly community group.' }],
        funding: { source: 'NHS CCG', weeklyAmount: 920.50, details: 'Continuing Healthcare funding package.' },
        tenancy: { type: 'Licence Agreement', startDate: '2021-09-01', documents: [] },
        timeline: [], documents: [],
        title: 'Mr', firstLanguage: 'English', isNonVerbal: false, nationalInsuranceNumber: 'CD789012D'
    },
    // 123 Example Street, Nottingham
    {
        id: 'P003', preferredFirstName: 'Chloe', legalFirstName: 'Chloe', surname: 'Davis', photoUrl: 'https://i.pravatar.cc/150?u=P003', dob: '2001-02-10', status: PersonStatus.Current,
        propertyId: 'EXAM00_PROP', unitId: 'EXAM01', moveInDate: '2023-08-01', moveOutDate: null,
        keyWorkerId: 'NH01', areaManagerId: 'JM01',
        careNeeds: [], funding: { source: 'Nottingham City Council', weeklyAmount: 780.00, details: '' },
        tenancy: { type: 'Assured Shorthold Tenancy', startDate: '2023-08-01', documents: [] },
        timeline: [], documents: [],
        title: '', firstLanguage: 'English', isNonVerbal: false
    },
    {
        id: 'P004', preferredFirstName: 'Daniel', legalFirstName: 'Daniel', surname: 'Miller', photoUrl: 'https://i.pravatar.cc/150?u=P004', dob: '1995-07-22', status: PersonStatus.Former,
        propertyId: 'EXAM00_PROP', unitId: 'EXAM02', moveInDate: '2022-05-10', moveOutDate: '2024-06-15',
        keyWorkerId: 'NH01', areaManagerId: 'JM01',
        careNeeds: [], funding: { source: 'Nottingham City Council', weeklyAmount: 750.00, details: '' },
        tenancy: { type: 'Assured Shorthold Tenancy', startDate: '2022-05-10', documents: [] },
        timeline: [
            { id: 'pt4-1', date: '2024-06-15', type: TimelineEventType.Moves, description: 'Moved out to independent living property.', actor: 'Daniel Evans' },
        ],
        documents: [],
        title: 'Mr', firstLanguage: 'English', isNonVerbal: false
    },
    {
        id: 'P005', preferredFirstName: 'Emily', legalFirstName: 'Emily', surname: 'Brown', photoUrl: 'https://i.pravatar.cc/150?u=P005', dob: '1999-01-05', status: PersonStatus.Current,
        propertyId: 'EXAM00_PROP', unitId: 'EXAM03', moveInDate: '2024-03-12', moveOutDate: null,
        keyWorkerId: 'NH01', areaManagerId: 'JM01',
        careNeeds: [], funding: { source: 'Personal Budget', weeklyAmount: 650.00, details: '' },
        tenancy: { type: 'Assured Shorthold Tenancy', startDate: '2024-03-12', documents: [] },
        timeline: [], documents: [],
        title: 'Mrs', firstLanguage: 'BSL', isNonVerbal: true
    },
     // 1 Welsh Road, Newport
    {
        id: 'P006', preferredFirstName: 'Ffion', legalFirstName: 'Ffion', surname: 'Morgan', photoUrl: 'https://i.pravatar.cc/150?u=P006', dob: '1985-03-01', status: PersonStatus.Former,
        propertyId: 'WALE01_PROP', unitId: 'WALE01-1', moveInDate: '2022-03-15', moveOutDate: '2024-06-30',
        keyWorkerId: 'NH01', areaManagerId: 'HD01', // Placeholder manager
        careNeeds: [], funding: { source: 'Newport City Council', weeklyAmount: 1100.00, details: '' },
        tenancy: { type: 'Licence Agreement', startDate: '2022-03-15', documents: [] },
        timeline: [], documents: [],
        title: 'Miss', firstLanguage: 'Welsh', secondLanguage: 'English', isNonVerbal: false
    },
    {
        id: 'P007', preferredFirstName: 'Gareth', legalFirstName: 'Gareth', surname: 'Price', photoUrl: 'https://i.pravatar.cc/150?u=P007', dob: '1990-09-18', status: PersonStatus.Former,
        propertyId: 'WALE01_PROP', unitId: 'WALE01-2', moveInDate: '2022-04-01', moveOutDate: '2024-06-30',
        keyWorkerId: 'NH01', areaManagerId: 'HD01',
        careNeeds: [], funding: { source: 'Newport City Council', weeklyAmount: 1100.00, details: '' },
        tenancy: { type: 'Licence Agreement', startDate: '2022-04-01', documents: [] },
        timeline: [], documents: [],
        title: 'Mr', firstLanguage: 'English', isNonVerbal: false
    },
    {
        id: 'P008', preferredFirstName: 'Harri', legalFirstName: 'Harri', surname: 'Jenkins', photoUrl: 'https://i.pravatar.cc/150?u=P008', dob: '1998-12-07', status: PersonStatus.Former,
        propertyId: 'WALE01_PROP', unitId: 'WALE01-4', moveInDate: '2023-01-20', moveOutDate: '2024-06-30',
        keyWorkerId: 'NH01', areaManagerId: 'HD01',
        careNeeds: [], funding: { source: 'Newport City Council', weeklyAmount: 1100.00, details: '' },
        tenancy: { type: 'Licence Agreement', startDate: '2023-01-20', documents: [] },
        timeline: [], documents: [],
        title: 'Mr', firstLanguage: 'English', isNonVerbal: false
    },
];

export const MOCK_FRAMEWORKS: Framework[] = [
    {
        id: 'FW-NYC-001',
        name: 'North Yorkshire Supported Living Framework 2022-2026',
        type: ServiceType.SupportedLiving,
        status: FrameworkStatus.Live,
        laId: 'la-nyc',
        renewalDate: '2026-03-31',
        contractEndDate: '2026-06-30',
        notes: 'Tier 1 provider for complex needs. Strong relationship with commissioner Susan Collins.'
    },
    {
        id: 'FW-NCC-001',
        name: 'Nottingham City Residential Care Framework',
        type: ServiceType.Residential,
        status: FrameworkStatus.ExpiringSoon,
        laId: 'la-ncc',
        renewalDate: '2025-01-31',
        contractEndDate: '2025-04-30',
        notes: 'Currently on Lot 2. Bid for Lot 1 in progress for renewal.'
    },
    {
        id: 'FW-NPT-001',
        name: 'Newport Nursing & Complex Care DPS',
        type: ServiceType.NursingCare,
        status: FrameworkStatus.Expired,
        laId: 'la-npt',
        renewalDate: '2024-06-30',
        contractEndDate: '2024-06-30',
        notes: 'Framework has expired. A new tender is expected Q4 2024. Currently operating on spot purchase agreements.'
    },
    {
        id: 'FW-NYC-002',
        name: 'North Yorkshire Residential Framework',
        type: ServiceType.Residential,
        status: FrameworkStatus.OnExtension,
        laId: 'la-nyc',
        renewalDate: '2024-12-31',
        contractEndDate: '2024-09-30',
        notes: 'Currently on a 3-month extension while new framework is finalized.'
    }
];

export const MOCK_TENDERS: Tender[] = [
    {
        id: 'TEN-NCC-001',
        name: 'Nottingham City Residential Framework 2025 Renewal',
        laId: 'la-ncc',
        status: TenderStatus.InProgress,
        dueDate: '2024-11-15',
        leadUserId: 'RL01', // Rachel Lewis
    },
    {
        id: 'TEN-NYC-001',
        name: 'North Yorkshire Extra Care Bid',
        laId: 'la-nyc',
        status: TenderStatus.Submitted,
        dueDate: '2024-08-30',
        leadUserId: 'CC01', // Chloe Anderson
    },
    {
        id: 'TEN-NPT-001',
        name: 'Newport Community Support Tender',
        laId: 'la-npt',
        status: TenderStatus.Won,
        dueDate: '2024-07-01',
        leadUserId: 'RL01', // Rachel Lewis
    },
    {
        id: 'TEN-CWC-001',
        name: 'Cheshire West & Chester Mental Health Services',
        laId: 'la-nyc', // using NYC as a placeholder for Cheshire
        status: TenderStatus.Lost,
        dueDate: '2024-06-15',
        leadUserId: 'RL01',
    },
     {
        id: 'TEN-POT-001',
        name: 'Potential Tender - Liverpool LD Services',
        laId: 'la-ncc', // Placeholder
        status: TenderStatus.Potential,
        dueDate: '2025-02-01',
        leadUserId: 'RL01',
    }
];