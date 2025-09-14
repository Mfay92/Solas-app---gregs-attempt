import React, { useState } from 'react';
import { Property, IvolveStaff, Stakeholder, MaintenanceJob } from '../types';
import TimelineView from './views/TimelineView';
import RentView from './views/RentView';
import MaintenanceView from './views/MaintenanceView';
import ComplianceView from './views/ComplianceView';
import LegalView from './views/LegalView';
import DocumentsView from './views/DocumentsView';
import FrameworksView from './views/FrameworksView';
import KeyContactsView from './views/KeyContactsView';

type PropertyContentProps = {
  property: Property;
  allStaff: IvolveStaff[];
  allStakeholders: Stakeholder[];
  onUpdateJob: (job: MaintenanceJob) => void;
  onCompleteComplianceJob: (jobId: string, newCertificateName: string) => void;
  onManageStaffLinks: () => void;
};

const TABS = ['Key Dates & Timeline', 'Key Contacts', 'Rent', 'Compliance', 'Maintenance', 'Legal', 'Documents', 'Frameworks & Commissioning', 'Features', 'Photos'];

const PropertyContent: React.FC<PropertyContentProps> = ({ property, allStaff, allStakeholders, onUpdateJob, onCompleteComplianceJob, onManageStaffLinks }) => {
  const [activeTab, setActiveTab] = useState('Key Dates & Timeline');

  const renderContent = () => {
    switch (activeTab) {
      case 'Key Dates & Timeline':
        return <TimelineView serviceType={property.serviceType} events={property.timeline} handoverDate={property.handoverDate} handbackDate={property.handbackDate} keyDates={property.keyDates} />;
      case 'Key Contacts':
        return <KeyContactsView 
                  property={property} 
                  allStaff={allStaff} 
                  allStakeholders={allStakeholders}
                  onManageLinks={onManageStaffLinks} 
                />;
      case 'Rent':
        return <RentView rentData={property.rentData} />;
      case 'Maintenance':
        return <MaintenanceView 
                    jobs={property.maintenanceJobs} 
                    contractors={allStakeholders.filter(s => s.type === 'Contractor')}
                    onUpdateJob={onUpdateJob}
                    onCompleteComplianceJob={onCompleteComplianceJob}
                    currentUser={allStaff.find(s => s.id === 'MF01')}
                />;
      case 'Compliance':
          return <ComplianceView items={property.complianceItems} maintenanceJobs={property.maintenanceJobs} />;
      case 'Legal':
          return <LegalView agreements={property.legalAgreements} />;
      case 'Documents':
          return <DocumentsView documents={property.documents} />;
      case 'Frameworks & Commissioning':
        return property.commissioning ? <FrameworksView commissioning={property.commissioning} /> : <div className="p-6"><p>No commissioning information available for this property.</p></div>;
      case 'Features':
        return (
             <div className="p-6"><p>Features view coming soon.</p></div>
        );
      case 'Photos':
        return (
             <div className="p-6"><p>Photos view coming soon.</p></div>
        );
      default:
        return (
            <div className="p-6">
                 <p>Overview content coming soon.</p>
            </div>
        );
    }
  };

  return (
    <div>
        <div className="bg-ivolve-dark-green px-6">
            <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap py-3 px-4 text-sm font-medium transition-colors focus:outline-none rounded-t-lg ${
                            activeTab === tab
                            ? 'bg-ivolve-off-white text-ivolve-dark-green font-bold'
                            : 'text-white/80 hover:bg-ivolve-mid-green hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
        <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default PropertyContent;