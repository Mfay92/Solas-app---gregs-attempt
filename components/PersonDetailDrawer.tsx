import React, { useState, useEffect, useRef } from 'react';
import PersonHeader from './PersonHeader';
import PersonContent from './PersonContent';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import { ArrowsPointingOutIcon, MinusIcon } from './Icons';

const DraggablePopup: React.FC<{ children: React.ReactNode; personName: string; onClose: () => void }> = ({ children, personName, onClose }) => {
    const { popupPosition, setPopupPosition, isPopupMinimized, setPopupMinimized } = useUI();
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!nodeRef.current) return;
        setIsDragging(true);
        const rect = nodeRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        // Prevents text selection while dragging
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !nodeRef.current) return;
        setPopupPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    
    if (isPopupMinimized) {
        return null; // The SmartFooter will handle rendering the minimized tab
    }

    return (
        <div
            ref={nodeRef}
            className="fixed w-full max-w-2xl h-[85vh] bg-ivolve-off-white shadow-2xl z-50 rounded-lg flex flex-col"
            style={{ top: popupPosition.y, left: popupPosition.x }}
        >
            <div
                onMouseDown={handleMouseDown}
                className="flex-shrink-0 flex justify-between items-center p-2 bg-ivolve-dark-green text-white rounded-t-lg cursor-grab"
            >
                <h3 className="font-bold text-sm ml-2">{personName}</h3>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setPopupMinimized(true)} className="p-2 hover:bg-white/20 rounded-full" title="Minimize"><MinusIcon /></button>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
};


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
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity" onClick={closeAllDrawers}></div>
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
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity" 
        onClick={closeAllDrawers}
      ></div>

      <div className={drawerClasses}>
        {drawerContent}
      </div>
    </>
  );
};

export default PersonDetailDrawer;