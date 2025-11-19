import React from 'react';
import ProfileCard from './ProfileCard';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';

const ContactDetailDrawer: React.FC = () => {
  const { ivolveStaff } = useData();
  const { selectedIvolveContactId, closeAllDrawers } = useUI();

  const person = ivolveStaff.find(s => s.id === selectedIvolveContactId);

  if (!person) return null;

  const manager = ivolveStaff.find(s => s.id === person.managerId) || null;
  const directReports = ivolveStaff.filter(s => s.managerId === person.id);
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" 
        onClick={closeAllDrawers}
      ></div>

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-app-bg shadow-2xl z-50 transform transition-transform ease-in-out duration-300 translate-x-0"
      >
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex justify-end p-2 bg-white border-b sticky top-0 z-10">
                 <button 
                    onClick={closeAllDrawers} 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-ivolve-blue"
                    aria-label="Close contact details"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                <ProfileCard 
                  person={person}
                  manager={manager}
                  directReports={directReports}
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetailDrawer;