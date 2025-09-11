import { MOCK_PROPERTIES, MOCK_STAKEHOLDERS, MOCK_IVOLVE_STAFF, MOCK_PPM_SCHEDULES, MOCK_PEOPLE, MOCK_FRAMEWORKS, MOCK_TENDERS } from './mockData';
import type { Property, Stakeholder, IvolveStaff, PpmSchedule, Person, Framework, Tender } from '../types';

export const fetchAllProperties = async (): Promise<Property[]> => {
  console.log('Fetching all properties');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROPERTIES);
    }, 300);
  });
};

export const fetchPropertyById = async (propertyId: string): Promise<Property | undefined> => {
  console.log(`Fetching data for property: ${propertyId}`);
  // Simulate a network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROPERTIES.find(p => p.id === propertyId));
    }, 500);
  });
};

export const fetchAllStakeholders = async (): Promise<Stakeholder[]> => {
  console.log('Fetching all stakeholders');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STAKEHOLDERS);
    }, 200);
  });
};

export const fetchIvolveStaff = async (): Promise<IvolveStaff[]> => {
    console.log('Fetching all ivolve staff');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_IVOLVE_STAFF);
        }, 250);
    });
};

export const fetchAllPpmSchedules = async (): Promise<PpmSchedule[]> => {
    console.log('Fetching all PPM schedules');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PPM_SCHEDULES);
        }, 150);
    });
};

export const fetchAllPeople = async (): Promise<Person[]> => {
    console.log('Fetching all people we support');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PEOPLE);
        }, 400);
    });
};

export const fetchAllFrameworks = async (): Promise<Framework[]> => {
    console.log('Fetching all frameworks');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_FRAMEWORKS);
        }, 180);
    });
};

export const fetchAllTenders = async (): Promise<Tender[]> => {
    console.log('Fetching all tenders');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_TENDERS);
        }, 220);
    });
};