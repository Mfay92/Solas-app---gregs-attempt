import { NotePrimaryCategory } from '../types';

export const NOTE_CATEGORIES_DATA: NotePrimaryCategory[] = [
    {
        name: 'General',
        subCategories: [ { name: 'General Note' }, { name: 'Observation' }, { name: 'Meeting' } ]
    },
    {
        name: 'Tenancy & Rent',
        subCategories: [
            { name: 'Rent Increase' },
            { name: 'Tenancy Warning', isFlag: true, flagLevel: 'warning' },
            { name: 'Notice Served', isFlag: true, flagLevel: 'danger' },
            { name: 'Rent Arrears Discussion' }
        ]
    },
    {
        name: 'RP/Landlord',
        subCategories: [
            { name: 'Housing Officer Visit' },
            { name: 'Managing Agent Visit' },
            { name: 'Rent Increase Letter' },
            { name: 'Tenant Meeting' }
        ]
    },
    {
        name: 'Safeguarding',
        subCategories: [
            { name: 'Concern Raised', isFlag: true, flagLevel: 'danger' },
            { name: 'Safeguarding Meeting' },
            { name: 'Strategy Discussion' }
        ]
    },
    {
        name: 'Incident',
        subCategories: [
            { name: 'Minor Incident' },
            { name: 'Major Incident', isFlag: true, flagLevel: 'danger' },
            { name: 'Near Miss' }
        ]
    },
    {
        name: 'Health',
        subCategories: [ { name: 'GP Visit' }, { name: 'Medication Change' }, { name: 'Hospital Admission' } ]
    },
    { name: 'Positive', subCategories: [{ name: 'Achievement' }, { name: 'Positive Feedback' }] },
    { name: 'Finance', subCategories: [{ name: 'Benefits Review' }, { name: 'Debt Discussion' }] },
    { name: 'Housing', subCategories: [{ name: 'Repair Request' }, { name: 'Complaint' }] },
    { name: 'Family Contact', subCategories: [{ name: 'Phone Call' }, { name: 'Visit' }] }
];
