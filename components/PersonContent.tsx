import React, { useState } from 'react';
import { Person } from '../types';
import { usePersona } from '../contexts/PersonaContext';
import PersonOverviewView from './views/person/PersonOverviewView';
import CareNeedsView from './views/person/CareNeedsView';
import FundingView from './views/person/FundingView';
import TenancyView from './views/person/TenancyView';
import TimelineView from './views/TimelineView';
import DocumentsView from './views/DocumentsView';


type PersonContentProps = {
  person: Person;
};

const PersonContent: React.FC<PersonContentProps> = ({ person }) => {
  const { t } = usePersona();
  
  const TABS = ['About me', `${t('care')} Needs`, 'Funding', t('tenancy'), 'Timeline', 'Documents'];
  const [activeTab, setActiveTab] = useState(TABS[0]);


  const renderContent = () => {
    switch (activeTab) {
      case 'About me':
        return <PersonOverviewView person={person} />;
      case `${t('care')} Needs`:
        return <CareNeedsView careNeeds={person.careNeeds} />;
      case 'Funding':
        return <FundingView funding={person.funding} />;
      case t('tenancy'):
        return <TenancyView tenancy={person.tenancy} />;
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
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto" aria-label="Tabs">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab
                            ? 'border-ivolve-blue text-ivolve-dark-green'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
        <div className="pt-6">{renderContent()}</div>
    </div>
  );
};

export default PersonContent;
