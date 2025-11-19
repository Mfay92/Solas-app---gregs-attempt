
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/views/DashboardView';
import PropertiesView from './components/views/PropertiesView';
import PeopleView from './components/views/PeopleView';
import StakeholderHubView from './components/views/StakeholderHubView';
import ContactHubView from './components/views/ContactHubView';
import CompliancePpmView from './components/views/CompliancePpmView';
import MaintenanceKanbanView from './components/MaintenanceKanbanView';
import LegalHubView from './components/views/LegalHubView';
import LibraryView from './components/views/LibraryView';
import SettingsView from './components/views/SettingsView';
import ProfileView from './components/views/ProfileView';
import DevelopmentJourneyHubView from './components/views/DevelopmentJourneyHubView';
import FrameworksHubView from './components/views/FrameworksHubView';
import ApplicationsView from './components/views/ApplicationsView';
import VoidManagementView from './components/views/VoidManagementView';
import ReportsView from './components/views/ReportsView';

import PropertyDetailDrawer from './components/PropertyDetailDrawer';
import PersonDetailDrawer from './components/PersonDetailDrawer';
import StakeholderDetailDrawer from './components/StakeholderDetailDrawer';
import ContactDetailDrawer from './components/ContactDetailDrawer';
import StakeholderContactDetailDrawer from './components/StakeholderContactDetailDrawer';

import { useUI } from './contexts/UIContext';
import { useData } from './contexts/DataContext';
import SkeletonLoader from './components/SkeletonLoader';
import DevHubModal from './components/DevHubModal';
import SmartFooter from './components/SmartFooter';

const CURRENT_USER_ID = 'MF01';

const App: React.FC = () => {
  const { 
    activeMainView, 
    setActiveMainView,
    selectedPropertyId, 
    selectedPersonId,
    selectedStakeholderId,
    selectedIvolveContactId,
    selectedStakeholderContact,
  } = useUI();
  const { loading, error, ivolveStaff, properties, stakeholders, handleUpdateJob, handleCompleteComplianceJob } = useData();
  const [isDevHubOpen, setIsDevHubOpen] = useState(false);

  const currentUser = ivolveStaff.find(s => s.id === CURRENT_USER_ID) || null;

  const renderActiveView = () => {
    switch (activeMainView) {
      case 'Dashboard':
        return <DashboardView currentUserId={CURRENT_USER_ID} />;
      case 'Properties':
        return <PropertiesView />;
      case 'People':
        return <PeopleView />;
      case 'Stakeholder Hub':
        return <StakeholderHubView />;
      case 'Contact Hub':
        return <ContactHubView currentUserId={CURRENT_USER_ID} />;
      case 'Compliance & PPM':
        return <CompliancePpmView />;
      case 'Maintenance':
        return <MaintenanceKanbanView 
                  jobs={properties.flatMap(p => p.maintenanceJobs)} 
                  contractors={stakeholders.filter(s => s.type === 'Contractor')} 
                  currentUser={currentUser} 
                  onUpdateJob={handleUpdateJob}
                  onCompleteComplianceJob={handleCompleteComplianceJob} 
                />;
      case 'LegalHub':
        return <LegalHubView />;
      case 'Library':
        return <LibraryView />;
      case 'Reports':
          return <ReportsView />;
      case 'Settings':
        return <SettingsView />;
      case 'Profile':
        return <ProfileView user={currentUser} allStaff={ivolveStaff} />;
      case 'Development':
        return <DevelopmentJourneyHubView />;
      case 'GrowthHub':
        return <FrameworksHubView />;
      case 'Applications':
        return <ApplicationsView />;
      case 'Void Management':
        return <VoidManagementView />;
      default:
        return <DashboardView currentUserId={CURRENT_USER_ID} />;
    }
  };

  // With data fetching disabled, loading will be false, and data will be empty.
  // The UI should render its empty state.
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }
  
  return (
    <div className="flex h-screen bg-app-bg">
      {isDevHubOpen && <DevHubModal onClose={() => setIsDevHubOpen(false)} />}
      <Sidebar 
        user={currentUser}
        activeView={activeMainView}
        onNavigate={setActiveMainView}
        onDevHubClick={() => setIsDevHubOpen(true)}
      />
      <main className="flex-1 ml-64 flex flex-col">
        {renderActiveView()}
      </main>

      {/* Detail Drawers */}
      {selectedPropertyId && <PropertyDetailDrawer />}
      {selectedPersonId && !selectedPropertyId && <PersonDetailDrawer />}
      {selectedStakeholderId && <StakeholderDetailDrawer />}
      {selectedIvolveContactId && <ContactDetailDrawer />}
      {selectedStakeholderContact && <StakeholderContactDetailDrawer />}
      
      <SmartFooter />
    </div>
  );
};

export default App;
