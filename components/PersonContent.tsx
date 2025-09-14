import React, { useState } from 'react';
import { Person, PersonStatus, ServiceType } from '../types';
import { usePersona } from '../contexts/PersonaContext';
import PersonOverviewView from './views/person/PersonOverviewView';
import CareNeedsView from './views/person/CareNeedsView';
import TenancyView from './views/person/TenancyView';
import DocumentsView from './views/DocumentsView';
import HealthView from './views/person/HealthView';
import CircleOfSupportView from './views/person/CircleOfSupportView';
import FinanceView from './views/person/FinanceView';
import { useData } from '../contexts/DataContext';
import OverviewUpdatesView from './views/person/OverviewUpdatesView';

type PersonContentProps = {
  person: Person;
};

const PersonContent: React.FC<PersonContentProps> = ({ person }) => {
  const { t } = usePersona();
  const { properties } = useData();

  const property = properties.find(p => p.id === person.propertyId);
  const serviceType = property?.serviceType;

  const supportCareTabName = serviceType === ServiceType.SupportedLiving
    ? "Support Details"
    : "Care Details";
  
  const TABS = ['Overview & Updates', 'About Me', supportCareTabName, 'Health & Medication', 'Circle of Support', `Housing & ${t('tenancy')}`, 'Finance & Benefits', 'Documents'];
  const [activeTab, setActiveTab] = useState(TABS[0]);
  
  const isFormer = person.status === PersonStatus.Former;
  const navBgClass = isFormer ? 'bg-solas-gray' : 'bg-ivolve-dark-green';

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview & Updates':
        return <OverviewUpdatesView person={person} />;
      case 'About Me':
        return <PersonOverviewView person={person} />;
      case supportCareTabName:
        return <CareNeedsView person={person} />;
      case 'Health & Medication':
        return <HealthView person={person} />;
      case 'Circle of Support':
        return <CircleOfSupportView person={person} />;
      case `Housing & ${t('tenancy')}`:
        return <TenancyView person={person} />;
      case 'Finance & Benefits':
        return <FinanceView person={person} />;
      case 'Documents':
        return <DocumentsView documents={person.documents} isFormer={person.status === PersonStatus.Former} />;
      default:
        return <OverviewUpdatesView person={person} />;
    }
  };

  return (
    <div>
        <div className={`${navBgClass} px-6`}>
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

export default PersonContent;