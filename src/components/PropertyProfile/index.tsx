import { useState } from 'react';
import { PropertyAsset } from '../../types';
import PropertyHeroBanner, { TabId } from './PropertyHeroBanner';
import FloatingToolbar from './FloatingToolbar';

// Tab content components
import ServiceOverviewTab from './tabs/ServiceOverviewTab';
import PropertyDetailsTab from './tabs/PropertyDetailsTab';
import UnitsOccupancyTab from './tabs/UnitsOccupancyTab';
import RepairsComplianceTab from './tabs/RepairsComplianceTab';
import RPsLandlordsTab from './tabs/RPsLandlordsTab';
import LegalTab from './tabs/LegalTab';
import RentsFinanceTab from './tabs/RentsFinanceTab';

// Sidebar components
import DocumentsSidebar from './sidebars/DocumentsSidebar';
import ActivityLogSidebar from './sidebars/ActivityLogSidebar';

// Modal components
import GalleryLightbox from './modals/GalleryLightbox';
import FloorPlanModal from './modals/FloorPlanModal';

interface PropertyProfileProps {
    asset: PropertyAsset;
    onBack: () => void;
    units: PropertyAsset[];
}

const PropertyProfile: React.FC<PropertyProfileProps> = ({ asset, onBack, units }) => {
    const [activeTab, setActiveTab] = useState<TabId>('service-overview');

    // Sidebar states
    const [isDocumentsSidebarOpen, setIsDocumentsSidebarOpen] = useState(false);
    const [isActivityLogSidebarOpen, setIsActivityLogSidebarOpen] = useState(false);

    // Modal states
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isFloorPlanOpen, setIsFloorPlanOpen] = useState(false);
    const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

    const handleGalleryClick = () => {
        setGalleryInitialIndex(0);
        setIsGalleryOpen(true);
    };

    const handleFloorPlanClick = () => {
        setIsFloorPlanOpen(true);
    };

    const handleDocumentsClick = () => {
        setIsDocumentsSidebarOpen(true);
    };

    const handleActivityLogClick = () => {
        setIsActivityLogSidebarOpen(true);
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

            {/* Floating Toolbar */}
            <FloatingToolbar
                onReportRepairClick={() => {}}
                onDocumentsClick={handleDocumentsClick}
                onFloorPlanClick={handleFloorPlanClick}
                onActivityLogClick={handleActivityLogClick}
                documentCount={asset.documents?.length || 0}
                hasFloorPlan={!!asset.floorPlanUrl}
            />

            {/* Documents Sidebar */}
            <DocumentsSidebar
                isOpen={isDocumentsSidebarOpen}
                onClose={() => setIsDocumentsSidebarOpen(false)}
                asset={asset}
            />

            {/* Activity Log Sidebar */}
            <ActivityLogSidebar
                isOpen={isActivityLogSidebarOpen}
                onClose={() => setIsActivityLogSidebarOpen(false)}
                asset={asset}
                units={units}
            />

            {/* Gallery Lightbox */}
            <GalleryLightbox
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                photos={asset.photos || []}
                initialIndex={galleryInitialIndex}
                propertyAddress={asset.address}
            />

            {/* Floor Plan Modal */}
            <FloorPlanModal
                isOpen={isFloorPlanOpen}
                onClose={() => setIsFloorPlanOpen(false)}
                floorPlanUrl={asset.floorPlanUrl}
                propertyAddress={asset.address}
            />
        </div>
    );
};

export default PropertyProfile;
