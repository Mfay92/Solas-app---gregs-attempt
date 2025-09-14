import React, { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import { StakeholderType } from './types';
import PropertiesView from './components/views/PropertiesView';
import ProfileView from './components/views/ProfileView';
import SettingsView from './components/views/SettingsView';
import PropertyDetailDrawer from './components/PropertyDetailDrawer';
import { ThemeProvider } from './contexts/ThemeContext';
import { PersonaProvider } from './contexts/PersonaContext';
import DashboardView from './components/views/DashboardView';
import VoidManagementView from './components/views/VoidManagementView';
import StakeholderHubView from './components/views/StakeholderHubView';
import StakeholderDetailDrawer from './components/StakeholderDetailDrawer';
import ContactHubView from './components/views/ContactHubView';
import ContactDetailDrawer from './components/ContactDetailDrawer';
import StakeholderContactDetailDrawer from './components/StakeholderContactDetailDrawer';
import MaintenanceKanbanView from './components/MaintenanceKanbanView';
import CompliancePpmView from './components/views/CompliancePpmView';
import PeopleView from './components/views/PeopleView';
import PersonDetailDrawer from './components/PersonDetailDrawer';
import { DataProvider, useData } from './contexts/DataContext';
import { UIProvider, useUI } from './contexts/UIContext';
import LegalHubView from './components/views/LegalHubView';
import DevHubButton from './components/DevHubButton';
import DevHubModal from './components/DevHubModal';
import LibraryView from './components/views/LibraryView';
import ReportsView from './components/views/ReportsView';
import FrameworksHubView from './components/views/FrameworksHubView';
import DevelopmentJourneyHubView from './components/views/DevelopmentJourneyHubView';
import ApplicationsView from './components/views/ApplicationsView';
import SmartFooter from './components/SmartFooter';

const CURRENT_USER_ID = 'MF01';

const ActiveViewRenderer: React.FC = () => {
    const { 
      properties, 
      stakeholders, 
      ivolveStaff, 
      ppmSchedules, 
      people, 
      loading, 
      error,
      handleUpdateJob,
      handleCompleteComplianceJob,
    } = useData();

    const { activeMainView } = useUI();
    
    const currentUserProfile = useMemo(() => ivolveStaff.find(s => s.id === CURRENT_USER_ID) || null, [ivolveStaff]);

    const allMaintenanceJobs = useMemo(() => {
        return properties.flatMap(p => p.maintenanceJobs);
    }, [properties]);

    const allContractors = useMemo(() => {
        return stakeholders.filter(s => s.type === StakeholderType.Contractor);
    }, [stakeholders]);

    if (loading) {
        return <div className="p-8 text-center text-lg text-app-text-gray">Loading Database...</div>;
    }
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    switch(activeMainView) {
      case 'Dashboard':
        return <DashboardView currentUserId={CURRENT_USER_ID} />;
      case 'GrowthHub':
        return <FrameworksHubView />;
      case 'Properties':
        return <PropertiesView />;
      case 'People':
        return <PeopleView />;
      case 'Maintenance':
        return <MaintenanceKanbanView 
                  jobs={allMaintenanceJobs}
                  contractors={allContractors}
                  onUpdateJob={handleUpdateJob}
                  onCompleteComplianceJob={handleCompleteComplianceJob}
                  currentUser={currentUserProfile}
                />;
      case 'Void Management':
        return <VoidManagementView />;
      case 'Stakeholder Hub':
        return <StakeholderHubView />;
      case 'Contact Hub':
        return <ContactHubView currentUserId={CURRENT_USER_ID} />;
      case 'Compliance & PPM':
        return <CompliancePpmView />;
      case 'LegalHub':
        return <LegalHubView />;
      case 'Reports':
        return <ReportsView />;
      case 'Library':
        return <LibraryView />;
      case 'Profile':
        return <ProfileView user={currentUserProfile} allStaff={ivolveStaff} />;
      case 'Settings':
        return <SettingsView />;
      case 'Development':
        return <DevelopmentJourneyHubView />;
      case 'Applications':
        return <ApplicationsView />;
      case 'Marketing':
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold text-app-text-dark">{activeMainView}</h1>
                <p className="mt-2 text-app-text-gray">This holistic, cross-property view is currently under construction.</p>
            </div>
        );
      default:
        return <DashboardView currentUserId={CURRENT_USER_ID} />;
    }
}

const AppDrawers: React.FC = () => {
  const {
    selectedPropertyId,
    selectedStakeholderId,
    selectedIvolveContactId,
    selectedStakeholderContact,
    selectedPersonId,
    activeDrawer,
  } = useUI();

  const propertyDrawer = selectedPropertyId && <PropertyDetailDrawer key={`prop-${selectedPropertyId}`} />;
  const personDrawer = selectedPersonId && <PersonDetailDrawer key={`person-${selectedPersonId}`} />;
  const stakeholderDrawer = selectedStakeholderId && <StakeholderDetailDrawer />;
  const ivolveContactDrawer = selectedIvolveContactId && <ContactDetailDrawer />;
  const stakeholderContactDrawer = selectedStakeholderContact && <StakeholderContactDetailDrawer />;

  // Conditionally render property and person drawers to ensure correct stacking for overlays
  const propertyAndPersonDrawers = activeDrawer === 'property'
      ? <>{personDrawer}{propertyDrawer}</>
      : <>{propertyDrawer}{personDrawer}</>;

  return (
    <>
      {stakeholderDrawer}
      {ivolveContactDrawer}
      {stakeholderContactDrawer}
      {propertyAndPersonDrawers}
    </>
  );
};


const AppContent: React.FC = () => {
  const { ivolveStaff, loading } = useData();
  const { activeMainView, setActiveMainView } = useUI();
  const [isDevHubOpen, setIsDevHubOpen] = useState(false);
  
  const currentUserProfile = useMemo(() => {
    if (loading) return null;
    return ivolveStaff.find(s => s.id === CURRENT_USER_ID) || null;
  }, [ivolveStaff, loading]);


  return (
    <div className="flex h-screen bg-app-bg">
      <Sidebar 
        user={currentUserProfile}
        activeView={activeMainView} 
        onNavigate={setActiveMainView}
        onDevHubClick={() => setIsDevHubOpen(true)}
      />
      <div className="flex-1 ml-64 flex flex-col h-screen">
            <main className="flex-1 overflow-y-auto">
                <ActiveViewRenderer />
            </main>
      </div>
      <AppDrawers />
      <SmartFooter />
      {isDevHubOpen && <DevHubModal onClose={() => setIsDevHubOpen(false)} />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PersonaProvider>
        <DataProvider>
          <UIProvider>
            <AppContent />
          </UIProvider>
        </DataProvider>
      </PersonaProvider>
    </ThemeProvider>
  )
}

export default App;