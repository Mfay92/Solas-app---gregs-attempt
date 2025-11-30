import { useState } from 'react';
import { PropertyAsset } from '../../types';
import PropertyHeroBanner, { TabId } from './PropertyHeroBanner';

// Tab content components
import ServiceOverviewTab from './tabs/ServiceOverviewTab';
import PropertyDetailsTab from './tabs/PropertyDetailsTab';
import UnitsOccupancyTab from './tabs/UnitsOccupancyTab';
import RepairsComplianceTab from './tabs/RepairsComplianceTab';
import RPsLandlordsTab from './tabs/RPsLandlordsTab';
import LegalTab from './tabs/LegalTab';
import RentsFinanceTab from './tabs/RentsFinanceTab';

// TODO: Re-enable when ready
// import FloatingToolbar from './FloatingToolbar';
// import DocumentsSidebar from './sidebars/DocumentsSidebar';
// import ActivityLogSidebar from './sidebars/ActivityLogSidebar';
// import GalleryLightbox from './modals/GalleryLightbox';
// import FloorPlanModal from './modals/FloorPlanModal';

interface PropertyProfileProps {
    asset: PropertyAsset;
    onBack: () => void;
    units: PropertyAsset[];
}

const PropertyProfile: React.FC<PropertyProfileProps> = ({ asset, onBack, units }) => {
    const [activeTab, setActiveTab] = useState<TabId>('service-overview');

    // Gallery click handler for hero banner
    const handleGalleryClick = () => {
        // TODO: Open gallery lightbox when ready
        console.log('Gallery clicked - feature coming soon');
    };

    const renderTabContent = () => {
        const props = {
            asset,
            units,
            onJumpToTab: setActiveTab
        };

        switch (activeTab) {
            case 'service-overview':
                return <ServiceOverviewTab {...props} />;
            case 'property-details':
                return <PropertyDetailsTab {...props} />;
            case 'units-occupancy':
                return <UnitsOccupancyTab {...props} />;
            case 'repairs-compliance':
                return <RepairsComplianceTab {...props} />;
            case 'rps-landlords':
                return <RPsLandlordsTab {...props} />;
            case 'legal':
                return <LegalTab {...props} />;
            case 'rents-finance':
                return <RentsFinanceTab {...props} />;
            default:
                return <ServiceOverviewTab {...props} />;
        }
    };

    return (
        <div className="bg-ivolve-paper min-h-screen">
            {/* Hero Banner with integrated tabs */}
            <PropertyHeroBanner
                asset={asset}
                onBack={onBack}
                onGalleryClick={handleGalleryClick}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content Area */}
            <div className="px-4 md:px-8 py-6">
                {/* Tab Content */}
                {renderTabContent()}
            </div>

            {/* TODO: Re-enable sidebars, modals, and floating toolbar when ready */}
        </div>
    );
};

export default PropertyProfile;
