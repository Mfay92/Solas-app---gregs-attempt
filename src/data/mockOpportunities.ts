import { Opportunity } from '../types/opportunities';

/**
 * Mock opportunities data for testing the Development Hub
 * Includes a variety of stages, property types, and urgency levels
 */
export const mockOpportunities: Opportunity[] = [
    // Active opportunities in various stages
    {
        id: 'opp_1',
        name: '5-bed house, Stockport Road, Manchester',
        opportunityType: 'Single Property',
        propertyType: 'Supported Living',
        propertyAddress: '142 Stockport Road, Manchester, M13 0RB',
        numberOfUnits: 5,
        annualContractValue: 240000,
        opportunitySource: 'Property Agent',
        sourceContactName: 'David Wilson',
        sourceContactPhone: '07789 123456',
        sourceContactEmail: 'd.wilson@estates.co.uk',
        opportunityOwner: 'Matt Fay',
        landlordRPName: 'Great Places Housing',
        stakeholders: {
            registeredProvider: {
                name: 'Great Places Housing',
                type: 'Registered Provider',
                contactName: 'Jane Cooper',
                relationshipStrength: 'Warm'
            }
        },
        marketContext: {
            whyAvailable: 'RP Portfolio Sale',
            urgencyLevel: 'Medium',
            competitorCount: 2,
            competitorNames: ['Sanctuary Care', 'Local Care Provider']
        },
        currentStage: 'Negotiation',
        status: 'Active',
        targetContractStartDate: '2026-04-01',
        createdAt: '2026-01-15T09:30:00Z',
        updatedAt: '2026-02-01T14:20:00Z',
        currentStageStartDate: '2026-01-28T11:00:00Z',
        description: 'Large Victorian property, recently refurbished. Ground floor wheelchair accessible. Good transport links.',
        tags: ['High Priority', 'Manchester Expansion', 'Quick Win'],
        propertyListingURL: 'https://rightmove.co.uk/property/142-stockport',
        stageHistory: [
            {
                id: 'hist_1_1',
                toStage: 'Leads',
                movedBy: 'Matt Fay',
                movedAt: '2026-01-15T09:30:00Z'
            },
            {
                id: 'hist_1_2',
                fromStage: 'Leads',
                toStage: 'Contact Made',
                movedBy: 'Matt Fay',
                movedAt: '2026-01-17T10:15:00Z'
            },
            {
                id: 'hist_1_3',
                fromStage: 'Contact Made',
                toStage: 'Site Visit Scheduled',
                movedBy: 'Matt Fay',
                movedAt: '2026-01-20T14:30:00Z',
                notes: 'Site visit booked for 25th Jan with landlord'
            },
            {
                id: 'hist_1_4',
                fromStage: 'Site Visit Scheduled',
                toStage: 'Proposal Submitted',
                movedBy: 'Matt Fay',
                movedAt: '2026-01-25T16:45:00Z',
                notes: 'Property in excellent condition. Submitted proposal at £48k/year per unit'
            },
            {
                id: 'hist_1_5',
                fromStage: 'Proposal Submitted',
                toStage: 'Negotiation',
                movedBy: 'Matt Fay',
                movedAt: '2026-01-28T11:00:00Z',
                notes: 'Landlord wants £50k/unit - negotiating down'
            }
        ],
        notes: [
            {
                id: 'note_1_1',
                content: 'Landlord is motivated to let quickly - property has been empty for 3 months',
                createdBy: 'Matt Fay',
                createdAt: '2026-01-26T09:15:00Z'
            },
            {
                id: 'note_1_2',
                content: 'Discussed with finance team - can stretch to £49k/unit max',
                createdBy: 'Matt Fay',
                createdAt: '2026-01-30T11:30:00Z'
            }
        ],
        documents: []
    },
    {
        id: 'opp_2',
        name: 'Residential care home, Didsbury',
        opportunityType: 'Service Transfer',
        propertyType: 'Residential Care',
        propertyAddress: 'Oak Lodge, 28 Wilmslow Road, Didsbury, M20 2UW',
        numberOfUnits: 15,
        annualContractValue: 720000,
        opportunitySource: 'CQC Alert',
        sourceContactName: 'Sarah Mitchell',
        sourceContactEmail: 's.mitchell@manchester.gov.uk',
        opportunityOwner: 'Emma Thompson',
        landlordRPName: 'Manchester City Council',
        stakeholders: {
            localAuthority: {
                name: 'Manchester City Council',
                type: 'Local Authority',
                contactName: 'Sarah Mitchell',
                contactEmail: 's.mitchell@manchester.gov.uk',
                relationshipStrength: 'Hot'
            },
            registeredProvider: {
                name: 'Manchester City Council',
                type: 'Registered Provider',
                contactName: 'Paul Davies',
                relationshipStrength: 'Partner'
            },
            commissioner: {
                name: 'Greater Manchester ICB',
                type: 'Commissioner',
                contactName: 'Dr. Helen Roberts',
                relationshipStrength: 'Warm'
            }
        },
        marketContext: {
            whyAvailable: 'Provider Failed CQC',
            urgencyLevel: 'Critical',
            competitorCount: 1,
            competitorNames: ['Care UK'],
            additionalContext: 'Existing provider got "Inadequate" rating - urgent replacement needed'
        },
        currentStage: 'CIC Review',
        status: 'Active',
        targetContractStartDate: '2026-06-01',
        createdAt: '2025-12-10T10:00:00Z',
        updatedAt: '2026-02-03T09:45:00Z',
        currentStageStartDate: '2026-01-20T14:00:00Z',
        description: 'Existing care home with CQC Good rating. Commissioner wants to extend contract with additional autism support provision.',
        tags: ['Large Contract', 'Commissioner Led', 'Autism Specialisation'],
        stageHistory: [
            {
                id: 'hist_2_1',
                toStage: 'Leads',
                movedBy: 'Emma Thompson',
                movedAt: '2025-12-10T10:00:00Z'
            },
            {
                id: 'hist_2_2',
                fromStage: 'Leads',
                toStage: 'Contact Made',
                movedBy: 'Emma Thompson',
                movedAt: '2025-12-15T11:20:00Z'
            },
            {
                id: 'hist_2_3',
                fromStage: 'Contact Made',
                toStage: 'Proposal Submitted',
                movedBy: 'Emma Thompson',
                movedAt: '2026-01-05T15:30:00Z',
                notes: 'Submitted detailed proposal including autism training plan for all staff'
            },
            {
                id: 'hist_2_4',
                fromStage: 'Proposal Submitted',
                toStage: 'CIC Review',
                movedBy: 'Emma Thompson',
                movedAt: '2026-01-20T14:00:00Z',
                notes: 'CIC meeting scheduled for 15th Feb'
            }
        ],
        notes: [
            {
                id: 'note_2_1',
                content: 'Need to demonstrate autism expertise - arranging meetings with current service users and families',
                createdBy: 'Emma Thompson',
                createdAt: '2026-01-22T10:00:00Z'
            }
        ],
        documents: []
    },
    {
        id: 'opp_3',
        name: '3-bed bungalow, Wythenshawe',
        opportunityType: 'Single Property',
        propertyType: 'Supported Living',
        propertyAddress: '45 Hollyhedge Road, Wythenshawe, M23 0BT',
        numberOfUnits: 3,
        annualContractValue: 135000,
        opportunitySource: 'Online Listing',
        sourceContactName: '',
        opportunityOwner: 'James Wilson',
        currentStage: 'Leads',
        status: 'Active',
        createdAt: '2026-02-04T08:45:00Z',
        updatedAt: '2026-02-04T08:45:00Z',
        currentStageStartDate: '2026-02-04T08:45:00Z',
        description: 'Single-storey property, ideal for physical disabilities. Garden and parking.',
        tags: ['Physical Disabilities', 'South Manchester'],
        stageHistory: [
            {
                id: 'hist_3_1',
                toStage: 'Leads',
                movedBy: 'James Wilson',
                movedAt: '2026-02-04T08:45:00Z'
            }
        ],
        notes: [],
        documents: []
    },
    {
        id: 'opp_4',
        name: 'Salford LA Framework Agreement',
        opportunityType: 'Framework Agreement',
        propertyType: 'Day Centre',
        propertyAddress: 'Former community centre, Chapel Street, Salford, M3 5LE',
        numberOfUnits: 40,
        annualContractValue: 180000,
        opportunitySource: 'Commissioner',
        sourceContactName: 'John Davies',
        opportunityOwner: 'Sarah Johnson',
        landlordRPName: 'Salford City Partnership',
        stakeholders: {
            localAuthority: {
                name: 'Salford City Council',
                type: 'Local Authority',
                contactName: 'John Davies',
                relationshipStrength: 'Warm'
            }
        },
        marketContext: {
            whyAvailable: 'LA New Tender',
            urgencyLevel: 'Medium',
            competitorCount: 5,
            competitorNames: ['Turning Point', 'Mencap', 'Together Trust']
        },
        currentStage: 'Site Visit Scheduled',
        status: 'Active',
        targetContractStartDate: '2026-07-01',
        createdAt: '2026-01-20T13:00:00Z',
        updatedAt: '2026-01-28T16:30:00Z',
        currentStageStartDate: '2026-01-25T09:00:00Z',
        description: 'Opportunity to get on Salford approved provider framework for day services. Opens doors to multiple service contracts.',
        tags: ['Day Services', 'Framework', 'Salford', 'Strategic'],
        stageHistory: [
            {
                id: 'hist_4_1',
                toStage: 'Leads',
                movedBy: 'Sarah Johnson',
                movedAt: '2026-01-20T13:00:00Z'
            },
            {
                id: 'hist_4_2',
                fromStage: 'Leads',
                toStage: 'Contact Made',
                movedBy: 'Sarah Johnson',
                movedAt: '2026-01-22T10:30:00Z'
            },
            {
                id: 'hist_4_3',
                fromStage: 'Contact Made',
                toStage: 'Site Visit Scheduled',
                movedBy: 'Sarah Johnson',
                movedAt: '2026-01-25T09:00:00Z',
                notes: 'Site visit booked for 8th Feb'
            }
        ],
        notes: [],
        documents: []
    },
    {
        id: 'opp_5',
        name: 'NHS Dementia Care Partnership, Bolton',
        opportunityType: 'Partnership Agreement',
        propertyType: 'Nursing Care',
        propertyAddress: 'Riverside Care Home, 156 Church Road, Bolton, BL1 4HG',
        numberOfUnits: 25,
        annualContractValue: 950000,
        opportunitySource: 'Existing Relationship',
        sourceContactName: 'Dr. Patricia Chen',
        opportunityOwner: 'Michael Brown',
        landlordRPName: 'Bolton NHS Trust',
        stakeholders: {
            commissioner: {
                name: 'Bolton NHS ICB',
                type: 'Commissioner',
                contactName: 'Dr. Patricia Chen',
                relationshipStrength: 'Hot'
            },
            registeredProvider: {
                name: 'Bolton NHS Trust',
                type: 'Registered Provider',
                contactName: 'Alan Foster',
                relationshipStrength: 'Partner'
            }
        },
        marketContext: {
            whyAvailable: 'Expansion Opportunity',
            urgencyLevel: 'Low',
            competitorCount: 0,
            additionalContext: 'Exclusive partnership - no competitive tender'
        },
        currentStage: 'Due Diligence',
        status: 'Active',
        targetContractStartDate: '2026-05-01',
        createdAt: '2025-11-01T11:30:00Z',
        updatedAt: '2026-02-02T14:15:00Z',
        currentStageStartDate: '2026-01-15T10:00:00Z',
        description: 'NHS partnership for dementia care. Existing facility, high-quality standards required. Long-term strategic partnership opportunity.',
        tags: ['NHS Partnership', 'Dementia Specialisation', 'High Value', 'Strategic'],
        stageHistory: [
            {
                id: 'hist_5_1',
                toStage: 'Leads',
                movedBy: 'Michael Brown',
                movedAt: '2025-11-01T11:30:00Z'
            },
            {
                id: 'hist_5_2',
                fromStage: 'Leads',
                toStage: 'Contact Made',
                movedBy: 'Michael Brown',
                movedAt: '2025-11-10T09:00:00Z'
            },
            {
                id: 'hist_5_3',
                fromStage: 'Contact Made',
                toStage: 'Site Visit Scheduled',
                movedBy: 'Michael Brown',
                movedAt: '2025-11-20T14:00:00Z'
            },
            {
                id: 'hist_5_4',
                fromStage: 'Site Visit Scheduled',
                toStage: 'Proposal Submitted',
                movedBy: 'Michael Brown',
                movedAt: '2025-12-05T16:00:00Z'
            },
            {
                id: 'hist_5_5',
                fromStage: 'Proposal Submitted',
                toStage: 'Negotiation',
                movedBy: 'Michael Brown',
                movedAt: '2025-12-20T11:00:00Z'
            },
            {
                id: 'hist_5_6',
                fromStage: 'Negotiation',
                toStage: 'CIC Review',
                movedBy: 'Michael Brown',
                movedAt: '2026-01-08T10:00:00Z'
            },
            {
                id: 'hist_5_7',
                fromStage: 'CIC Review',
                toStage: 'Due Diligence',
                movedBy: 'Michael Brown',
                movedAt: '2026-01-15T10:00:00Z',
                notes: 'CIC approved - proceeding with legal and financial checks'
            }
        ],
        notes: [
            {
                id: 'note_5_1',
                content: 'Legal review of NHS contract terms in progress',
                createdBy: 'Michael Brown',
                createdAt: '2026-01-18T09:00:00Z'
            },
            {
                id: 'note_5_2',
                content: 'Financial audit scheduled for 12th Feb',
                createdBy: 'Michael Brown',
                createdAt: '2026-01-25T14:30:00Z'
            }
        ],
        documents: []
    },
    {
        id: 'opp_6',
        name: '4-bed house, Oldham (STALLED)',
        opportunityType: 'Single Property',
        propertyType: 'Supported Living',
        propertyAddress: '89 Yorkshire Street, Oldham, OL1 1SH',
        numberOfUnits: 4,
        annualContractValue: 180000,
        opportunitySource: 'Direct Enquiry',
        sourceContactName: 'Brian Foster',
        opportunityOwner: 'Matt Fay',
        landlordRPName: 'Private Landlord',
        currentStage: 'Proposal Submitted',
        status: 'Active',
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: '2025-12-22T15:00:00Z',
        currentStageStartDate: '2025-12-15T14:00:00Z',
        description: 'Property needs some work but good location. Landlord has gone quiet after receiving proposal.',
        tags: ['At Risk', 'Follow Up Needed'],
        stageHistory: [
            {
                id: 'hist_6_1',
                toStage: 'Leads',
                movedBy: 'Matt Fay',
                movedAt: '2025-12-01T10:00:00Z'
            },
            {
                id: 'hist_6_2',
                fromStage: 'Leads',
                toStage: 'Contact Made',
                movedBy: 'Matt Fay',
                movedAt: '2025-12-05T11:00:00Z'
            },
            {
                id: 'hist_6_3',
                fromStage: 'Contact Made',
                toStage: 'Site Visit Scheduled',
                movedBy: 'Matt Fay',
                movedAt: '2025-12-08T09:30:00Z'
            },
            {
                id: 'hist_6_4',
                fromStage: 'Site Visit Scheduled',
                toStage: 'Proposal Submitted',
                movedBy: 'Matt Fay',
                movedAt: '2025-12-15T14:00:00Z',
                notes: 'Submitted proposal but no response yet'
            }
        ],
        notes: [
            {
                id: 'note_6_1',
                content: 'Called landlord - left voicemail',
                createdBy: 'Matt Fay',
                createdAt: '2026-01-05T10:30:00Z'
            },
            {
                id: 'note_6_2',
                content: 'Emailed again - still no response. May have found another tenant.',
                createdBy: 'Matt Fay',
                createdAt: '2026-01-20T14:00:00Z'
            }
        ],
        documents: []
    },
    // Won deals
    {
        id: 'opp_7',
        name: '6-bed house, Chorlton - WON!',
        opportunityType: 'Single Property',
        propertyType: 'Supported Living',
        propertyAddress: '234 Beech Road, Chorlton, M21 9EG',
        numberOfUnits: 6,
        annualContractValue: 300000,
        opportunitySource: 'Registered Provider',
        sourceContactName: 'Linda Grant',
        opportunityOwner: 'Emma Thompson',
        landlordRPName: 'One Manchester',
        currentStage: 'Contract Signed',
        status: 'Won',
        targetContractStartDate: '2026-03-01',
        wonDate: '2026-01-25T15:30:00Z',
        createdAt: '2025-10-15T09:00:00Z',
        updatedAt: '2026-01-25T15:30:00Z',
        currentStageStartDate: '2026-01-25T15:30:00Z',
        description: 'Excellent property in desirable area. RP partnership working brilliantly.',
        tags: ['Won Deal', 'Chorlton', 'RP Partnership'],
        stageHistory: [
            {
                id: 'hist_7_1',
                toStage: 'Leads',
                movedBy: 'Emma Thompson',
                movedAt: '2025-10-15T09:00:00Z'
            },
            {
                id: 'hist_7_2',
                fromStage: 'Leads',
                toStage: 'Contract Signed',
                movedBy: 'Emma Thompson',
                movedAt: '2026-01-25T15:30:00Z',
                notes: 'Opportunity won! Contract signed.'
            }
        ],
        notes: [],
        documents: []
    },
    {
        id: 'opp_8',
        name: 'Shared living house, Levenshulme - WON!',
        opportunityType: 'Single Property',
        propertyType: 'Supported Living',
        propertyAddress: '67 Albert Road, Levenshulme, M19 2DQ',
        numberOfUnits: 5,
        annualContractValue: 225000,
        opportunitySource: 'Property Agent',
        opportunityOwner: 'Sarah Johnson',
        landlordRPName: 'Great Places Housing',
        currentStage: 'In Development',
        status: 'Won',
        wonDate: '2025-12-20T11:00:00Z',
        targetContractStartDate: '2026-02-15',
        createdAt: '2025-09-01T10:00:00Z',
        updatedAt: '2026-02-01T09:00:00Z',
        currentStageStartDate: '2026-01-10T10:00:00Z',
        description: 'Minor refurbishment work underway. Target opening mid-Feb.',
        tags: ['Won Deal', 'In Refurb'],
        stageHistory: [
            {
                id: 'hist_8_1',
                toStage: 'Leads',
                movedBy: 'Sarah Johnson',
                movedAt: '2025-09-01T10:00:00Z'
            },
            {
                id: 'hist_8_2',
                fromStage: 'Leads',
                toStage: 'Contract Signed',
                movedBy: 'Sarah Johnson',
                movedAt: '2025-12-20T11:00:00Z',
                notes: 'Opportunity won! Contract signed.'
            },
            {
                id: 'hist_8_3',
                fromStage: 'Contract Signed',
                toStage: 'In Development',
                movedBy: 'Sarah Johnson',
                movedAt: '2026-01-10T10:00:00Z',
                notes: 'Refurbishment started - kitchen and bathrooms'
            }
        ],
        notes: [],
        documents: []
    },
    // Lost deal
    {
        id: 'opp_9',
        name: 'Stockport 3-Property Portfolio - LOST',
        opportunityType: 'Portfolio Acquisition',
        propertyType: 'Residential Care',
        propertyAddress: '45 Wellington Road, Stockport, SK3 0EU',
        numberOfUnits: 24,
        annualContractValue: 1200000,
        opportunitySource: 'Registered Provider',
        opportunityOwner: 'James Wilson',
        stakeholders: {
            registeredProvider: {
                name: 'Stockport Homes',
                type: 'Registered Provider',
                contactName: 'Angela Price',
                relationshipStrength: 'Cold'
            }
        },
        marketContext: {
            whyAvailable: 'RP Portfolio Sale',
            urgencyLevel: 'High',
            competitorCount: 4,
            competitorNames: ['Sanctuary Care', 'Care UK', 'Four Seasons']
        },
        currentStage: 'Lost',
        status: 'Lost',
        lostReason: 'Competition',
        lostNotes: 'Sanctuary Care offered lower price and had existing relationship with RP. Lost by 15% on price.',
        lostDate: '2026-01-15T14:00:00Z',
        createdAt: '2025-11-20T09:00:00Z',
        updatedAt: '2026-01-15T14:00:00Z',
        currentStageStartDate: '2026-01-15T14:00:00Z',
        description: 'Strong bid for 3-property portfolio (24 units total) but could not compete on price without compromising quality standards.',
        tags: ['Lost Deal', 'Pricing Issue', 'Large Portfolio'],
        stageHistory: [
            {
                id: 'hist_9_1',
                toStage: 'Leads',
                movedBy: 'James Wilson',
                movedAt: '2025-11-20T09:00:00Z'
            },
            {
                id: 'hist_9_2',
                fromStage: 'Leads',
                toStage: 'Lost',
                movedBy: 'James Wilson',
                movedAt: '2026-01-15T14:00:00Z',
                notes: 'Lost - Competition: Another provider offered lower price and had existing relationship with commissioner'
            }
        ],
        notes: [],
        documents: []
    }
];
