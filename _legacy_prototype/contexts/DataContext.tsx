import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Property, Stakeholder, IvolveStaff, PpmSchedule, Person, MaintenanceJob, Contact, MaintenanceStatus, ComplianceItem, Document, LinkedContact, GrowthOpportunity, Flag, PersonStatus } from '../types';
import { fetchAllProperties, fetchAllStakeholders, fetchIvolveStaff, fetchAllPpmSchedules, fetchAllPeople, fetchAllGrowthOpportunities } from '../services/api';
import * as storage from '../services/storage';
import { completeComplianceJob } from '../services/propertyService';

const CURRENT_USER_ID = 'MF01';

interface DataContextState {
  properties: Property[];
  stakeholders: Stakeholder[];
  ivolveStaff: IvolveStaff[];
  ppmSchedules: PpmSchedule[];
  people: Person[];
  growthOpportunities: GrowthOpportunity[];
  loading: boolean;
  error: string | null;
  pinnedContactIds: Set<string>;
  handleUpdateJob: (updatedJob: MaintenanceJob) => void;
  handleCompleteComplianceJob: (jobId: string, newCertificateName: string) => void;
  handleTogglePin: (contactId: string) => void;
  handleUpdatePropertyLinks: (propertyId: string, updatedStaffLinks: LinkedContact[]) => void;
  handleAddNewPerson: (newPersonData: Partial<Person>) => void;
  handleUpdatePerson: (personId: string, updatedData: Partial<Person>) => void;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

// --- Data Sanitization ---
// Ensures that data loaded from any source (API or localStorage) conforms to the expected shape,
// preventing crashes from missing array properties (e.g., calling .flatMap on undefined).

const sanitizeProperties = (props: Property[] = []): Property[] => {
  if (!Array.isArray(props)) return [];
  return props.map(p => ({
    ...p,
    units: p.units ?? [],
    maintenanceJobs: p.maintenanceJobs ?? [],
    complianceItems: p.complianceItems ?? [],
    flags: p.flags ?? [],
    contacts: p.contacts ?? [],
    timeline: p.timeline ?? [],
    legalAgreements: p.legalAgreements ?? [],
    documents: p.documents ?? [],
    features: p.features ?? [],
    photos: p.photos ?? [],
    floorplans: p.floorplans ?? [],
    linkedContacts: p.linkedContacts ?? [],
  }));
};

const sanitizeStakeholders = (stakeholders: Stakeholder[] = []): Stakeholder[] => {
    if (!Array.isArray(stakeholders)) return [];
    return stakeholders.map(s => ({
        ...s,
        contacts: s.contacts ?? [],
    }));
};

const sanitizePeople = (people: Person[] = []): Person[] => {
    if (!Array.isArray(people)) return [];
    return people.map(p => ({
        ...p,
        careNeeds: p.careNeeds ?? [],
        funding: p.funding ?? [],
        timeline: p.timeline ?? [],
        documents: p.documents ?? [],
        flags: p.flags ?? [],
        contacts: p.contacts ?? [],
        benefits: p.benefits ?? [],
        otherIncome: p.otherIncome ?? [],
        medications: p.medications ?? [],
    }));
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [ivolveStaff, setIvolveStaff] = useState<IvolveStaff[]>([]);
  const [ppmSchedules, setPpmSchedules] = useState<PpmSchedule[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [growthOpportunities, setGrowthOpportunities] = useState<GrowthOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pinnedContactIds, setPinnedContactIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Clear any potentially corrupted state from previous sessions.
        storage.clearState();
        console.log("Cleared localStorage to ensure a fresh start with mock data.");

        // Always fetch fresh data from the mock API on load.
        const [propertiesData, stakeholdersData, staffData, ppmData, peopleData, growthData] = await Promise.all([
          fetchAllProperties(),
          fetchAllStakeholders(),
          fetchIvolveStaff(),
          fetchAllPpmSchedules(),
          fetchAllPeople(),
          fetchAllGrowthOpportunities(),
        ]);
        
        // Sanitize the fresh data to ensure it has the correct structure.
        setProperties(sanitizeProperties(propertiesData));
        setStakeholders(sanitizeStakeholders(stakeholdersData));
        setIvolveStaff(staffData);
        setPpmSchedules(ppmData);
        setPeople(sanitizePeople(peopleData));
        setGrowthOpportunities(growthData);

        const initiallyPinned = new Set<string>();
        staffData.forEach(s => { if (s.isPinned) initiallyPinned.add(s.id) });
        stakeholdersData.forEach(s => s.contacts.forEach(c => { if (c.isPinned) initiallyPinned.add(c.id) }));
        setPinnedContactIds(initiallyPinned);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch application data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // NOTE: The useEffect hook responsible for saving state to localStorage has been removed.
  // This prevents any user modifications from being persisted, ensuring the app always
  // starts with a clean slate from the mock data source.

  const currentUserProfile = useMemo(() => ivolveStaff.find(s => s.id === CURRENT_USER_ID) || null, [ivolveStaff]);

  const handleTogglePin = (contactId: string) => {
    // This will only affect the current session state.
    setPinnedContactIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(contactId)) {
            newSet.delete(contactId);
        } else {
            newSet.add(contactId);
        }
        return newSet;
    });
  };

  const handleUpdateJob = (updatedJob: MaintenanceJob) => {
    setProperties(prevProps => {
        return prevProps.map(p => {
            const jobIndex = p.maintenanceJobs.findIndex(j => j.id === updatedJob.id);
            if (jobIndex === -1) {
                return p;
            }
            const updatedJobs = [...p.maintenanceJobs];
            updatedJobs[jobIndex] = updatedJob;
            return { ...p, maintenanceJobs: updatedJobs };
        });
    });
  };

  const handleCompleteComplianceJob = (jobId: string, newCertificateName: string) => {
      const updatedProperties = completeComplianceJob(
        properties,
        ppmSchedules,
        currentUserProfile,
        jobId,
        newCertificateName
      );
      setProperties(updatedProperties);
  };

  const handleUpdatePropertyLinks = (propertyId: string, updatedStaffLinks: LinkedContact[]) => {
    setProperties(prevProps => {
        return prevProps.map(p => {
            if (p.id === propertyId) {
                const stakeholderLinks = p.linkedContacts?.filter(l => l.stakeholderId) || [];
                return {
                    ...p,
                    linkedContacts: [...stakeholderLinks, ...updatedStaffLinks],
                };
            }
            return p;
        });
    });
  };
  
   const handleAddNewPerson = (newPersonData: Partial<Person>) => {
    setPeople(prevPeople => {
        const newPerson: Person = {
            // Core required fields that should come from the form
            id: `P-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More robust ID for demo
            preferredFirstName: newPersonData.preferredFirstName || 'Unknown',
            surname: newPersonData.surname || 'Unknown',
            dob: newPersonData.dob || new Date().toISOString().split('T')[0],
            status: newPersonData.status || PersonStatus.Applicant,
            
            // Sensible defaults for other required fields to ensure type safety
            legalFirstName: newPersonData.legalFirstName || newPersonData.preferredFirstName || 'Unknown',
            propertyId: '',
            unitId: '',
            moveInDate: '', // Correct for an applicant
            moveOutDate: null,
            keyWorkerId: '',
            areaManagerId: '',
            careNeeds: [],
            funding: [],
            tenancy: { type: 'Licence Agreement', startDate: '', documents: [] },
            timeline: [],
            documents: [],
            flags: [], // Add missing flags array
            contacts: [],
            title: newPersonData.title || '',
            firstLanguage: newPersonData.firstLanguage || 'English',
            isNonVerbal: newPersonData.isNonVerbal || false,
            
            // Spread remaining optional data that might have been passed
            ...newPersonData,
        };

        return [...prevPeople, newPerson];
    });
  };

  const handleUpdatePerson = (personId: string, updatedData: Partial<Person>) => {
      setPeople(prevPeople =>
          prevPeople.map(person =>
              person.id === personId ? { ...person, ...updatedData } : person
          )
      );
  };


  const value = {
    properties,
    stakeholders,
    ivolveStaff,
    ppmSchedules,
    people,
    growthOpportunities,
    loading,
    error,
    pinnedContactIds,
    handleUpdateJob,
    handleCompleteComplianceJob,
    handleTogglePin,
    handleUpdatePropertyLinks,
    handleAddNewPerson,
    handleUpdatePerson,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextState => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};