import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Property, Stakeholder, IvolveStaff, PpmSchedule, Person, MaintenanceJob, Contact, MaintenanceStatus, ComplianceItem, Document, LinkedContact } from '../types';
import { fetchAllProperties, fetchAllStakeholders, fetchIvolveStaff, fetchAllPpmSchedules, fetchAllPeople } from '../services/api';
import * as storage from '../services/storage';

const CURRENT_USER_ID = 'MF01';

interface DataContextState {
  properties: Property[];
  stakeholders: Stakeholder[];
  ivolveStaff: IvolveStaff[];
  ppmSchedules: PpmSchedule[];
  people: Person[];
  loading: boolean;
  error: string | null;
  pinnedContactIds: Set<string>;
  handleUpdateJob: (updatedJob: MaintenanceJob) => void;
  handleCompleteComplianceJob: (jobId: string, newCertificateName: string) => void;
  handleTogglePin: (contactId: string) => void;
  handleUpdatePropertyLinks: (propertyId: string, updatedStaffLinks: LinkedContact[]) => void;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [ivolveStaff, setIvolveStaff] = useState<IvolveStaff[]>([]);
  const [ppmSchedules, setPpmSchedules] = useState<PpmSchedule[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
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
          setPinnedContactIds(new Set(savedState.pinnedContactIds)); // Rehydrate Set from array
          console.log("App state loaded from localStorage.");
        } else {
          // If no saved state, fetch from mock API (seeding)
          console.log("No saved state found. Seeding from mock API.");
          const [propertiesData, stakeholdersData, staffData, ppmData, peopleData] = await Promise.all([
            fetchAllProperties(),
            fetchAllStakeholders(),
            fetchIvolveStaff(),
            fetchAllPpmSchedules(),
            fetchAllPeople(),
          ]);
          setProperties(propertiesData);
          setStakeholders(stakeholdersData);
          setIvolveStaff(staffData);
          setPpmSchedules(ppmData);
          setPeople(peopleData);

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
        pinnedContactIds: Array.from(pinnedContactIds), // Convert Set to array for JSON
      };
      storage.saveState(stateToSave);
    }
  }, [properties, stakeholders, ivolveStaff, ppmSchedules, people, pinnedContactIds, loading]);


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

  const value = {
    properties,
    stakeholders,
    ivolveStaff,
    ppmSchedules,
    people,
    loading,
    error,
    pinnedContactIds,
    handleUpdateJob,
    handleCompleteComplianceJob,
    handleTogglePin,
    handleUpdatePropertyLinks,
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
