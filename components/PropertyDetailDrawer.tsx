import React, { useState } from 'react';
import { Property, MaintenanceJob } from '../types';
import PropertyHeader from './PropertyHeader';
import PropertyContent from './PropertyContent';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import ManageStaffLinksModal from './ManageStaffLinksModal';

const PropertyDetailDrawer: React.FC = () => {
  const { properties, ivolveStaff, stakeholders, people, handleUpdateJob, handleCompleteComplianceJob, handleUpdatePropertyLinks } = useData();
  const { selectedPropertyId, selectedUnitId, selectedPersonId, drawerMode, unselectProperty, closeAllDrawers } = useUI();
  const [isManageLinksModalOpen, setIsManageLinksModalOpen] = useState(false);

  const property = properties.find(p => p.id === selectedPropertyId);
  const isOverlay = !!selectedPersonId;
  const handleClose = isOverlay ? unselectProperty : closeAllDrawers;

  if (!property) {
    return null;
  }
  
  const isBottomMode = drawerMode === 'bottom';
  const drawerClasses = isBottomMode 
    ? "fixed bottom-0 left-0 right-0 w-full h-[90vh] rounded-t-2xl bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-500 translate-y-0"
    : "fixed top-0 right-0 h-full w-3/5 bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-500 translate-x-0";

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" 
        onClick={closeAllDrawers}
      ></div>

      {/* Drawer */}
      <div className={drawerClasses}>
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
                <PropertyHeader 
                    property={property} 
                    people={people} 
                    selectedUnitId={selectedUnitId}
                    onClose={handleClose}
                    isOverlay={isOverlay}
                />
                <PropertyContent 
                    property={property} 
                    allStaff={ivolveStaff}
                    allStakeholders={stakeholders}
                    onUpdateJob={handleUpdateJob}
                    onCompleteComplianceJob={handleCompleteComplianceJob}
                    onManageStaffLinks={() => setIsManageLinksModalOpen(true)}
                />
            </div>
        </div>
      </div>

      {isManageLinksModalOpen && (
        <ManageStaffLinksModal
            property={property}
            allStaff={ivolveStaff}
            onClose={() => setIsManageLinksModalOpen(false)}
            onSave={(staffLinks) => {
                handleUpdatePropertyLinks(property.id, staffLinks);
                setIsManageLinksModalOpen(false);
            }}
        />
      )}
    </>
  );
};

export default PropertyDetailDrawer;