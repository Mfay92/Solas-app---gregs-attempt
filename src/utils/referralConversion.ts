import { Referral, Person } from '../types';

/**
 * Converts a Referral to a Person record when move-in is processed
 * 
 * Maps all relevant referral data to the Person structure:
 * - Personal details (name, DOB, contact info)
 * - Tenancy information (property, service type, move-in date)
 * - Support & care details (provider, social worker, care hours)
 * - Emergency contacts
 * - Notes and medical needs
 */
export function convertReferralToPerson(referral: Referral): Person {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Calculate age from DOB if available
    const calculateAge = (dob: string | undefined): number | undefined => {
        if (!dob) return undefined;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const person: Person = {
        id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

        // Personal Information from Referral
        personal: {
            title: referral.personal.title || 'Mr', // Default title if missing
            firstName: referral.personal.firstName,
            lastName: referral.personal.lastName,
            preferredName: referral.personal.preferredName,
            dateOfBirth: referral.personal.dateOfBirth,
            age: referral.personal.age || calculateAge(referral.personal.dateOfBirth),
            niNumber: referral.personal.niNumber,
            occupantType: 'Main Tenant', // Default
            email: referral.personal.email,
            phone: referral.personal.phone,
            mobile: referral.personal.mobile,
            photo: undefined // Photos added post-move-in
        },

        // Tenancy Information
        tenancy: {
            propertyId: referral.linkedProperty?.propertyId || '',
            unitId: referral.linkedProperty?.unitId,
            propertyAddress: referral.linkedProperty?.propertyAddress || 'To be assigned',
            room: referral.linkedProperty?.room,
            serviceType: referral.serviceType,
            tenancyType: 'Assured Shorthold', // Default for Supported Living
            tenancyStatus: 'Current',
            moveInDate: today // Move-in date is today when processing
        },

        // Support & Care
        support: {
            careProvider: referral.source === 'Care Provider' ? referral.referrerOrganization : undefined,
            socialWorker: referral.source === 'Social Worker' ? referral.referrerName : undefined,
            keyWorker: referral.keyWorker,
            caseManager: undefined,
            careHours: undefined,
            supportLevel: referral.supportLevel,
            medicationNeeds: referral.medicalNeeds,
            mobilityNeeds: referral.mobilityNeeds,
            dietaryRequirements: referral.dietaryRequirements
        },

        // Emergency Contact - Person expectation is an array
        emergencyContacts: referral.personal.phone || referral.personal.mobile ? [
            {
                id: `ec_${Date.now()}`,
                name: 'Referrer (Backup)',
                relationship: 'Referrer',
                phone: referral.referrerContact.phone || '',
                email: referral.referrerContact.email,
                isPrimary: true
            }
        ] : [],

        // Finance
        finance: {
            rentAmount: referral.weeklyBudget,
            serviceCharge: 0,
            supportCharge: 0,
            totalCharges: referral.weeklyBudget || 0,
            currentBalance: 0,
            housingBenefit: referral.fundingSource?.toLowerCase().includes('benefit'),
            housingBenefitAmount: 0,
            paymentMethod: 'Direct Debit'
        },

        // Case Records
        cases: {
            safeguardingCases: [],
            asbCases: [],
            supportPlans: [],
            riskAssessments: []
        },

        // Notes
        notes: `Referral converted to Person record on ${today}. Original reference: ${referral.referralRef}. Referred by ${referral.referrerName} (${referral.referrerOrganization}). ${referral.assessmentNotes || ''}`,

        tags: ['new-move-in', referral.serviceType.toLowerCase().replace(' ', '-')],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return person;
}

/**
 * Saves a new Person to localStorage
 * In production, this would be replaced with a backend API call
 */
export function savePersonToLocalStorage(person: Person): void {
    try {
        // Get existing people from localStorage
        const existingPeopleJson = localStorage.getItem('solas_people');
        const existingPeople: Person[] = existingPeopleJson ? JSON.parse(existingPeopleJson) : [];

        // Add new person
        const updatedPeople = [...existingPeople, person];

        // Save back to localStorage
        localStorage.setItem('solas_people', JSON.stringify(updatedPeople));
    } catch (error) {
        console.error('Error saving person to localStorage:', error);
        throw new Error('Failed to save person record');
    }
}

/**
 * Marks a referral as "Moved In" status
 * In production, this would be replaced with a backend API call
 */
export function markReferralAsMovedIn(referralId: string): void {
    try {
        // Get existing referrals from localStorage
        const existingReferralsJson = localStorage.getItem('solas_referrals');
        if (!existingReferralsJson) return;

        const existingReferrals: Referral[] = JSON.parse(existingReferralsJson);

        // Update the referral status
        const updatedReferrals = existingReferrals.map(ref =>
            ref.id === referralId
                ? { ...ref, status: 'Moved In' as const }
                : ref
        );

        // Save back to localStorage
        localStorage.setItem('solas_referrals', JSON.stringify(updatedReferrals));
    } catch (error) {
        console.error('Error updating referral status:', error);
        throw new Error('Failed to update referral status');
    }
}
