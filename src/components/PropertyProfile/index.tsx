import { useState, useMemo } from 'react';
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

// Compliance components
import { PropertyComplianceTab, DocumentViewerModal } from '../Compliance';
import complianceData from '../../data/compliance-data.json';
import { ComplianceRecord } from '../../types/compliance';

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

    // Document viewer state
    const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<{ fileName: string; filePath: string } | null>(null);

    // Get compliance records for this property
    const propertyComplianceRecords = useMemo(() => {
        // Try to match by property name (normalize for comparison)
        const normalizedAddress = asset.address.toLowerCase().replace(/\s+/g, ' ').trim();

        const propertyData = complianceData.properties.find(p => {
            const normalizedPropertyName = p.propertyName.toLowerCase().replace(/\s+/g, ' ').trim();
            return normalizedAddress.includes(normalizedPropertyName) ||
                normalizedPropertyName.includes(normalizedAddress) ||
                normalizedAddress.includes(normalizedPropertyName.split(' ')[0]);
        });

        return (propertyData?.records || []) as ComplianceRecord[];
    }, [asset.address]);

    const handleViewDocument = (doc: { fileName: string; filePath: string }) => {
        setSelectedDocument(doc);
        setDocumentViewerOpen(true);
    };

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
            case 'compliance':
                return (
                    <PropertyComplianceTab
                        propertyId={asset.id}
                        propertyName={asset.address}
                        records={propertyComplianceRecords}
                        onViewDocument={handleViewDocument}
                    />
                );
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
            <div className="p-6 max-w-7xl mx-auto w-full">
                {/* Tab Content */}
                {renderTabContent()}
            </div>

            {/* Floating Toolbar */}
            <FloatingToolbar
                onReportRepairClick={() => { }}
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

            {/* Compliance Document Viewer */}
            <DocumentViewerModal
                isOpen={documentViewerOpen}
                onClose={() => {
                    setDocumentViewerOpen(false);
                    setSelectedDocument(null);
                }}
                documentInfo={selectedDocument}
            />
        </div>
    );
};

export default PropertyProfile;
