import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Referral } from '../../types';
import { ReferralTabId } from '../../types/tabs';
import ReferralHeroBanner from './ReferralHeroBanner';
import { useToast } from '../ToastProvider';
import { convertReferralToPerson, savePersonToLocalStorage, markReferralAsMovedIn } from '../../utils/referralConversion';

// Tab content components
import OverviewTab from './tabs/OverviewTab';
import PersonalDetailsTab from './tabs/PersonalDetailsTab';
import AssessmentTab from './tabs/AssessmentTab';
import ReferrerDetailsTab from './tabs/ReferrerDetailsTab';
import LinkedPropertyTab from './tabs/LinkedPropertyTab';
import FundingTab from './tabs/FundingTab';
import DocumentsTab from './tabs/DocumentsTab';
import NotesTab from './tabs/NotesTab';

interface ReferralProfileProps {
    referral: Referral;
    onBack: () => void;
}

const ReferralProfile: React.FC<ReferralProfileProps> = ({ referral, onBack }) => {
    const [activeTab, setActiveTab] = useState<ReferralTabId>('overview');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleProcessMoveIn = () => {
        try {
            // Convert referral to person
            const newPerson = convertReferralToPerson(referral);

            // Save to localStorage (in production: API call)
            savePersonToLocalStorage(newPerson);

            // Mark referral as "Moved In"
            markReferralAsMovedIn(referral.id);

            // Show success message
            showToast(
                `${referral.personal.firstName} ${referral.personal.lastName} has been successfully moved in!`,
                'success'
            );

            // Navigate back to People Hub
            setTimeout(() => {
                navigate('/people');
            }, 1500);
        } catch (error) {
            console.error('Error processing move-in:', error);
            showToast('Failed to process move-in. Please try again.', 'error');
        }
    };

    const renderTabContent = () => {
        const props = {
            referral,
            onJumpToTab: setActiveTab
        };

        switch (activeTab) {
            case 'overview':
                return <OverviewTab {...props} />;
            case 'personal-details':
                return <PersonalDetailsTab {...props} />;
            case 'assessment':
                return <AssessmentTab {...props} />;
            case 'referrer':
                return <ReferrerDetailsTab {...props} />;
            case 'linked-property':
                return <LinkedPropertyTab {...props} />;
            case 'funding':
                return <FundingTab {...props} />;
            case 'documents':
                return <DocumentsTab />;
            case 'notes':
                return <NotesTab />;
            default:
                return <OverviewTab {...props} />;
        }
    };

    return (
        <div className="bg-ivolve-paper min-h-screen">
            {/* Hero Banner with integrated tabs */}
            <ReferralHeroBanner
                referral={referral}
                onBack={onBack}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onProcessMoveIn={handleProcessMoveIn}
            />

            {/* Content Area */}
            <div className="p-6 max-w-7xl mx-auto w-full">
                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ReferralProfile;
