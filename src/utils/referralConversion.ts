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
            title: referral.personal.title,
            firstName: referral.personal.firstName,
            lastName: referral.personal.lastName,
            preferredName: referral.personal.preferredName,
            dateOfBirth: referral.personal.dateOfBirth,
            age: calculateAge(referral.personal.dateOfBirth),
            niNumber: referral.personal.niNumber,
            occupantType: 'Tenant', // Default - can be updated based on service type
            email: referral.personal.email,
            phone: referral.personal.phone,
            mobile: referral.personal.mobile,
            photo: undefined // Photos added post-move-in
        },

        // Tenancy Information
        tenancy: {
            propertyId: referral.linkedProperty?.propertyId || '',
            unitId: referral.linkedProperty?.unitId,
            propertyAddress: referral.linkedProperty?.address || 'To be assigned',
            room: referral.linkedProperty?.unit,
            serviceType: referral.serviceType,
            tenancyType: 'Assured Shorthold Tenancy (AST)', // Default for Supported Living
            tenancyStatus: 'Current',
            moveInDate: today // Move-in date is today when processing
        },

        // Support & Care
        support: {
            careProvider: referral.assessmentData?.careProvider,
            socialWorker: referral.assessmentData?.socialWorker,
            keyWorker: undefined, // Assigned after move-in
            caseManager: referral.assessmentData?.socialWorker, // Often same as social worker initially
            careHours: referral.assessmentData?.requiredCareHours,
            supportLevel: referral.assessmentData?.supportLevel,
            medicationNeeds: referral.assessmentData?.medicalConditions?.join('; '),
            mobilityNeeds: referral.assessmentData?.mobilityNeeds?.join('; '),
            dietaryRequirements: referral.assessmentData?.dietaryRequirements?.join('; ')
        },

        // Emergency Contact
        emergencyContact: referral.personal.emergencyContact ? {
            name: referral.personal.emergencyContact.name,
            relationship: referral.personal.emergencyContact.relationship,
            phone: referral.personal.emergencyContact.phone,
            email: referral.personal.emergencyContact.email,
            address: referral.personal.emergencyContact.address
        } : undefined,

        // Safeguarding
        safeguarding: {
            hasCases: false,
            totalCases: 0,
            activeCases: 0,
            lastIncidentDate: undefined,
            riskLevel: referral.assessmentData?.riskLevel || 'Low'
        },

        // ASB
        asb: {
            hasCases: false,
            totalCases: 0,
            activeCases: 0,
            lastIncidentDate: undefined
        },

        // Support Plans
        supportPlan: {
            hasActivePlan: false,
            lastReviewDate: undefined,
            nextReviewDate: undefined,
            status: 'Pending' // Plan to be created post-move-in
        },

        // Risk Assessments
        riskAssessment: {
            hasActiveAssessment: false,
            lastAssessmentDate: undefined,
            nextReviewDate: undefined,
            overallRiskLevel: referral.assessmentData?.riskLevel || 'Low'
        },

        // Finance - Initialize with zeros, updated post-move-in
        finance: {
            rentAccount: {
                weeklyRent: 0,
                serviceCharge: 0,
                totalWeeklyCharge: 0,
                currentBalance: 0,
                inArrears: false,
                arrearsAmount: 0
            },
            housingBenefit: {
                receiving: false,
                weeklyAmount: 0,
                eligible: true // Assumed eligible, verify post-move-in
            },
            lastPaymentDate: undefined,
            paymentMethod: undefined
        },

        // Documents
        documents: {
            total: 0,
            categories: {
                'Tenancy Agreement': 0,
                'ID Documents': 0,
                'Medical Records': 0,
                'Support Plans': 0,
                'Risk Assessments': 0,
                'Other': 0
            },
            lastUploaded: undefined
        },

        // Notes
        notes: {
            total: 1,
            lastNoteDate: today,
            lastNotePreview: `Referral converted to Person record. Original referral: ${referral.referralRef}. Referred by ${referral.referrerName} from ${referral.referrerOrganization || 'external source'}.`
        },

        // Status and metadata
        status: 'Active',
        createdDate: today,
        lastUpdated: today,
        source: `Referral: ${referral.referralRef}`,
        tags: ['new-move-in', referral.serviceType.toLowerCase().replace(' ', '-')]
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
