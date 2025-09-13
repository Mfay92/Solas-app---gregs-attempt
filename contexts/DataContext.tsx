import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Property, Stakeholder, IvolveStaff, PpmSchedule, Person, MaintenanceJob, Contact, MaintenanceStatus, ComplianceItem, Document, LinkedContact, GrowthOpportunity } from '../types';
import { fetchAllProperties, fetchAllStakeholders, fetchIvolveStaff, fetchAllPpmSchedules, fetchAllPeople, fetchAllGrowthOpportunities } from '../services/api';
import * as storage from '../services/storage';

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
}

const DataContext = createContext<DataContextState | undefined>(undefined);

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

  // Effect to load initial data from storage or API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const savedState = storage.loadState();

        if (savedState) {
          // If we have saved state, use it
          setProperties(savedState.properties);
          setStakeholders(savedState.stakeholders);
          setIvolveStaff(savedState.ivolveStaff);
          setPpmSchedules(savedState.ppmSchedules);
          setPeople(savedState.people);
          setGrowthOpportunities(savedState.growthOpportunities || []);
          setPinnedContactIds(new Set(savedState.pinnedContactIds)); // Rehydrate Set from array
          console.log("App state loaded from localStorage.");
        } else {
          // If no saved state, fetch from mock API (seeding)
          console.log("No saved state found. Seeding from mock API.");
          const [propertiesData, stakeholdersData, staffData, ppmData, peopleData, growthData] = await Promise.all([
            fetchAllProperties(),
            fetchAllStakeholders(),
            fetchIvolveStaff(),
            fetchAllPpmSchedules(),
            fetchAllPeople(),
            fetchAllGrowthOpportunities(),
          ]);
          setProperties(propertiesData);
          setStakeholders(stakeholdersData);
          setIvolveStaff(staffData);
          setPpmSchedules(ppmData);
          setPeople(peopleData);
          setGrowthOpportunities(growthData);

          const initiallyPinned = new Set<string>();
          staffData.forEach(s => { if (s.isPinned) initiallyPinned.add(s.id) });
          stakeholdersData.forEach(s => s.contacts.forEach(c => { if (c.isPinned) initiallyPinned.add(c.id) }));
          setPinnedContactIds(initiallyPinned);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch application data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    // Don't save during the initial load, wait until data is populated.
    if (!loading) {
      const stateToSave: storage.AppState = {
        properties,
        stakeholders,
        ivolveStaff,
        ppmSchedules,
        people,
        growthOpportunities,
        pinnedContactIds: Array.from(pinnedContactIds), // Convert Set to array for JSON
      };
      storage.saveState(stateToSave);
    }
  }, [properties, stakeholders, ivolveStaff, ppmSchedules, people, growthOpportunities, pinnedContactIds, loading]);


  const currentUserProfile = useMemo(() => ivolveStaff.find(s => s.id === CURRENT_USER_ID) || null, [ivolveStaff]);

  const handleTogglePin = (contactId: string) => {
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
    setProperties(prevProps => {
        let targetProperty: Property | undefined;
        let targetJob: MaintenanceJob | undefined;

        for (const p of prevProps) {
            const job = p.maintenanceJobs.find(j => j.id === jobId);
            if (job) {
                targetProperty = p;
                targetJob = job;
                break;
            }
        }

        if (!targetProperty || !targetJob || !targetJob.linkedComplianceId) {
            console.error("Could not find property or job for compliance completion.");
            return prevProps;
        }
        
        const propId = targetProperty.id;
        const updatedProperty = JSON.parse(JSON.stringify(targetProperty));

        const jobIndex = updatedProperty.maintenanceJobs.findIndex((j: MaintenanceJob) => j.id === jobId);
        updatedProperty.maintenanceJobs[jobIndex].status = MaintenanceStatus.Completed;
        updatedProperty.maintenanceJobs[jobIndex].activityLog.push({
            date: new Date().toISOString(),
            actor: currentUserProfile?.name || 'System',
            action: `Compliance certificate uploaded. Job completed.`
        });

        const complianceIndex = updatedProperty.complianceItems.findIndex((c: ComplianceItem) => c.id === targetJob!.linkedComplianceId);
        if (complianceIndex > -1) {
            const complianceItem = updatedProperty.complianceItems[complianceIndex];
            complianceItem.lastCheck = new Date().toISOString().split('T')[0];
            const nextCheckDate = new Date();
            const frequency = ppmSchedules.find(p => p.complianceType === complianceItem.type)?.frequencyMonths || 12;
            nextCheckDate.setMonth(nextCheckDate.getMonth() + frequency);
            complianceItem.nextCheck = nextCheckDate.toISOString().split('T')[0];
            complianceItem.status = 'Compliant';
            complianceItem.reportUrl = `/docs/${newCertificateName}.pdf`;
        }

        updatedProperty.documents.push({
            id: `doc-${Date.now()}`,
            name: newCertificateName,
            type: 'PDF',
            date: new Date().toISOString().split('T')[0],
            year: new Date().getFullYear(),
            url: `/docs/${newCertificateName}.pdf`,
            linkedJobRef: targetJob.ref,
        } as Document);

        return prevProps.map(p => p.id === propId ? updatedProperty : p);
      });
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
        // This is a simplified version for mock data. A real implementation would
        // use a proper ID generation strategy and ensure all required fields are present.
        const newPerson: Person = {
            id: `P${(prevPeople.length + 1).toString().padStart(3, '0')}`,
            legalFirstName: newPersonData.preferredFirstName || '', // Default legal to preferred if not provided
            photoUrl: `https://i.pravatar.cc/150?u=P${prevPeople.length + 1}`,
            // Provide default empty values for required fields
            propertyId: '',
            unitId: '',
            moveInDate: new Date().toISOString(),
            moveOutDate: null,
            keyWorkerId: '',
            areaManagerId: '',
            careNeeds: [],
            funding: [],
            tenancy: { type: 'Licence Agreement', startDate: '', documents: [] },
            timeline: [],
            documents: [],
            contacts: [],
            title: '',
            firstLanguage: 'English',
            isNonVerbal: false,
            ...newPersonData,
        } as Person;

        return [...prevPeople, newPerson];
    });
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
