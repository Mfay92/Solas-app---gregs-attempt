import React, { useState } from 'react';
import { Person } from '../types';
import { usePersona } from '../contexts/PersonaContext';
import PersonOverviewView from './views/person/PersonOverviewView';
import CareNeedsView from './views/person/CareNeedsView';
import FundingView from './views/person/FundingView';
import TenancyView from './views/person/TenancyView';
import TimelineView from './views/TimelineView';
import DocumentsView from './views/DocumentsView';
import HealthView from './views/person/HealthView';
import CircleOfSupportView from './views/person/CircleOfSupportView';
import FinanceView from './views/person/FinanceView';

type PersonContentProps = {
  person: Person;
};

const PersonContent: React.FC<PersonContentProps> = ({ person }) => {
  const { t } = usePersona();
  
  const TABS = ['About Me', `Support & Care`, 'Health & Medication', 'Circle of Support', `Housing & ${t('tenancy')}`, 'Finance & Benefits', 'Timeline', 'Documents'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const renderContent = () => {
    switch (activeTab) {
      case 'About Me':
        return <PersonOverviewView person={person} />;
      case `Support & Care`:
        return <CareNeedsView person={person} />;
      case 'Health & Medication':
        return <HealthView person={person} />;
      case 'Circle of Support':
        return <CircleOfSupportView person={person} />;
      case `Housing & ${t('tenancy')}`:
        return <TenancyView person={person} />;
      case 'Finance & Benefits':
        return <FinanceView person={person} />;
      case 'Timeline':
        return <TimelineView events={person.timeline} moveInDate={person.moveInDate} moveOutDate={person.moveOutDate} />;
      case 'Documents':
        return <DocumentsView documents={person.documents} />;
      default:
        return <PersonOverviewView person={person} />;
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

export default PersonContent;