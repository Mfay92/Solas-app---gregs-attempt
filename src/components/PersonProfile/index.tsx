import { useState } from 'react';
import { Person, ServiceType } from '../../types';
import { PersonTabId } from '../../types/tabs';
import PersonHeroBanner from './PersonHeroBanner';
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';

// Tab content components
import OverviewTab from './tabs/OverviewTab';
import PersonalDetailsTab from './tabs/PersonalDetailsTab';
import TenancyTab from './tabs/TenancyTab';
import SupportTab from './tabs/SupportTab';
import SafeguardingTab from './tabs/SafeguardingTab';
import ASBTab from './tabs/ASBTab';
import SupportPlansTab from './tabs/SupportPlansTab';
import RiskAssessmentsTab from './tabs/RiskAssessmentsTab';
import ComplianceTab from './tabs/ComplianceTab';
import FinanceTab from './tabs/FinanceTab';
import DocumentsTab from './tabs/DocumentsTab';
import NotesTab from './tabs/NotesTab';

interface PersonProfileProps {
    person: Person;
    onBack: () => void;
}

const PersonProfile: React.FC<PersonProfileProps> = ({ person, onBack }) => {
    const [activeTab, setActiveTab] = useState<PersonTabId>('overview');

    // Get service type and colors for consistent theming
    // Default to 'Supported Living' if serviceType is not set
    const serviceType = person.tenancy.serviceType || 'Supported Living';
    const colors = getServiceTypeColor(serviceType);

    const renderTabContent = () => {
        const props = {
            person,
            onJumpToTab: setActiveTab,
            serviceType,
            borderColor: colors.border
        };

        switch (activeTab) {
            case 'overview':
                return <OverviewTab {...props} />;
            case 'personal-details':
                return <PersonalDetailsTab {...props} />;
            case 'tenancy':
                return <TenancyTab {...props} />;
            case 'support':
                return <SupportTab {...props} />;
            case 'safeguarding':
                return <SafeguardingTab {...props} />;
            case 'asb':
                return <ASBTab {...props} />;
            case 'support-plans':
                return <SupportPlansTab {...props} />;
            case 'risk-assessments':
                return <RiskAssessmentsTab {...props} />;
            case 'compliance':
                return <ComplianceTab {...props} />;
            case 'finance':
                return <FinanceTab {...props} />;
            case 'documents':
                return <DocumentsTab {...props} />;
            case 'notes':
                return <NotesTab {...props} />;
            default:
                return <OverviewTab {...props} />;
        }
    };

    return (
        <div className="bg-ivolve-paper min-h-screen">
            {/* Hero Banner with integrated tabs */}
            <PersonHeroBanner
                person={person}
                onBack={onBack}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content Area */}
            <div className="p-6 max-w-7xl mx-auto w-full">
                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default PersonProfile;
