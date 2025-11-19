import React from 'react';
import { getLogoComponent } from './StakeholderLogos';
import { EmailIcon, MaintenanceIcon, MessageIcon, PhoneIcon, UserIcon } from './Icons';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';

const StakeholderContactDetailDrawer: React.FC = () => {
    const { stakeholders } = useData();
    const { selectedStakeholderContact, closeAllDrawers } = useUI();

    if (!selectedStakeholderContact) return null;

    const stakeholder = stakeholders.find(s => s.id === selectedStakeholderContact.stakeholderId);
    const contact = stakeholder?.contacts.find(c => c.id === selectedStakeholderContact.contactId);

    if (!stakeholder || !contact) return null;
    
    const Logo = getLogoComponent(stakeholder.logoComponent);
    const isRepairsContact = contact.role.toLowerCase().includes('repairs');
    const repairEmailLink = `mailto:${contact.email}?subject=Repair%20Request%20(ivolve)&body=Hi%20${contact.name.split(' ')[0]}%2C%0A%0AWe'd%20like%20to%20report%20a%20new%20repair.%0A%0AProperty%20Address%3A%20%5BPlease%20fill%20in%5D%0AIssue%3A%20%5BPlease%20describe%20the%20issue%5D%0A%0AThanks%2C%0Aivolve%20Property%20Team`;


    return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={closeAllDrawers}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-300">
        <div className="h-full flex flex-col">
          <header className={`p-6 flex justify-between items-start ${stakeholder.branding.heroBg} ${stakeholder.branding.heroText}`}>
            <div className="flex-1">
              {Logo ? (
                <div className="w-40"><Logo /></div>
              ) : (
                <h2 className="text-2xl font-bold">{stakeholder.name}</h2>
              )}
            </div>
            <button onClick={closeAllDrawers} className="p-2 rounded-full hover:bg-black/20 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <main className="flex-grow overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-lg -mt-20">
                <UserIcon />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-solas-dark">{contact.name}</h2>
              <p className="text-md text-solas-gray">{contact.role}</p>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <a href={`mailto:${contact.email}`} className="p-3 bg-white border rounded-full text-solas-gray hover:bg-ivolve-blue hover:text-white transition-colors" title="Send Email"><EmailIcon /></a>
              <a href={`msteams:/l/chat/0/0?users=${contact.email}`} className="p-3 bg-white border rounded-full text-solas-gray hover:bg-ivolve-blue hover:text-white transition-colors" title="Send Teams Message"><MessageIcon /></a>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
              {isRepairsContact && (
                 <div>
                    <h4 className="font-semibold text-solas-dark mb-2 text-sm uppercase tracking-wider">Quick Actions</h4>
                    <a 
                        href={repairEmailLink}
                        className="w-full flex items-center justify-center space-x-2 bg-ivolve-dark-green text-white font-semibold py-2.5 px-4 rounded-md transition-colors hover:bg-opacity-90"
                    >
                        <MaintenanceIcon />
                        <span>Email Repair Request</span>
                    </a>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-solas-dark mb-3 text-sm uppercase tracking-wider">Contact Information</h4>
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                    <EmailIcon />
                    <span className="ml-3 text-ivolve-blue">{contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                    <PhoneIcon />
                    <span className="ml-3 text-solas-gray">{contact.phone}</span>
                    </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
    );
};

export default StakeholderContactDetailDrawer;