import React from 'react';
import PersonHeader from './PersonHeader';
import PersonContent from './PersonContent';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import DraggablePopup from './DraggablePopup';

const PersonDetailDrawer: React.FC = () => {
  const { people, properties } = useData();
  const { selectedPersonId, selectedPropertyId, drawerMode, unselectPerson, closeAllDrawers } = useUI();
  
  const person = people.find(p => p.id === selectedPersonId);
  const isOverlay = !!selectedPropertyId;
  const handleClose = isOverlay ? unselectPerson : closeAllDrawers;

  if (!person) return null;

  const personProperty = properties.find(p => p.id === person.propertyId);
  
  const drawerContent = (
    <div className="h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
            <PersonHeader 
                person={person} 
                property={personProperty}
                onClose={handleClose}
                isOverlay={isOverlay} 
            />
            <PersonContent person={person} />
        </div>
    </div>
  );

  if (drawerMode === 'popup') {
      return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={closeAllDrawers}></div>
            <DraggablePopup personName={`${person.preferredFirstName} ${person.surname}`} onClose={handleClose}>
                {drawerContent}
            </DraggablePopup>
        </>
      )
  }
  
  const isBottomMode = drawerMode === 'bottom';
  const drawerClasses = isBottomMode 
    ? "fixed bottom-0 left-0 right-0 w-full h-[90vh] rounded-t-2xl bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-500 translate-y-0"
    : "fixed top-0 right-0 h-full w-3/5 bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-500 translate-x-0";


  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" 
        onClick={closeAllDrawers}
      ></div>

      <div className={drawerClasses}>
        {drawerContent}
      </div>
    </>
  );
};

export default PersonDetailDrawer;