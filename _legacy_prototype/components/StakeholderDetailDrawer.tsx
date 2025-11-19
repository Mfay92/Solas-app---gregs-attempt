

import React, { useState } from 'react';
import { Stakeholder, Property, Unit, UnitStatus, Contact } from '../types';
import { getLogoComponent } from './StakeholderLogos';
import StatusChip from './StatusChip';
import { AddIcon, ChevronDownIcon, ChevronRightIcon, InformationCircleIcon, MapPinIcon, PhoneIcon, UserIcon } from './Icons';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import UnitStatusTag from './UnitStatusTag';

const TABS = ['Overview', 'Contacts', 'Properties'];

const StakeholderDetailDrawer: React.FC = () => {
    const { stakeholders, properties } = useData();
    const { selectedStakeholderId, closeAllDrawers, selectProperty } = useUI();

    const stakeholder = stakeholders.find(s => s.id === selectedStakeholderId);
    
    const [activeTab, setActiveTab] = useState('Overview');
    const [expandedProperties, setExpandedProperties] = useState<string[]>([]);

    if (!stakeholder) return null;
    
    const Logo = getLogoComponent(stakeholder.logoComponent);

    const linkedProperties = properties.filter(p => p.tags.la === stakeholder.name || p.tags.rp === stakeholder.name);

    const togglePropertyExpansion = (propertyId: string) => {
        setExpandedProperties(prev => 
            prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
        );
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6">
                        {stakeholder.about && (
                             <div className="p-4 border rounded-md bg-white">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-gray-400"><InformationCircleIcon /></span>
                                    <h4 className="font-bold text-solas-dark text-lg">About {stakeholder.name}</h4>
                                </div>
                                <p className="text-sm text-solas-gray leading-relaxed">{stakeholder.about}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {stakeholder.address && (
                                <div className="p-4 border rounded-md bg-white">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-gray-400"><MapPinIcon /></span>
                                        <h4 className="font-bold text-solas-dark">Head Office</h4>
                                    </div>
                                    <div className="text-sm text-solas-gray">
                                        <p>{stakeholder.address.line1}</p>
                                        <p>{stakeholder.address.city}</p>
                                        <p>{stakeholder.address.postcode}</p>
                                    </div>
                                </div>
                            )}

                           {stakeholder.contacts[0] && (
                               <div className="p-4 border rounded-md bg-white">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-gray-400"><PhoneIcon /></span>
                                        <h4 className="font-bold text-solas-dark">Primary Contact</h4>
                                    </div>
                                    <div className="text-sm text-solas-gray">
                                        <p className="font-semibold">{stakeholder.contacts[0].name}, <span className="font-normal">{stakeholder.contacts[0].role}</span></p>
                                        <p className="text-ivolve-blue">{stakeholder.contacts[0].email}</p>
                                        <p>{stakeholder.contacts[0].phone}</p>
                                    </div>
                                </div>
                           )}
                        </div>

                        {stakeholder.keyInfo && stakeholder.keyInfo.length > 0 && (
                            <div className="p-4 border rounded-md bg-white">
                                <h4 className="font-bold text-solas-dark mb-2">Key Information</h4>
                                <ul className="text-sm text-solas-gray space-y-1">
                                    {stakeholder.keyInfo.map(info => (
                                        <li key={info.label} className="flex justify-between">
                                            <span className="font-semibold">{info.label}:</span>
                                            <span>{info.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            case 'Contacts':
                return (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => alert('Add Contact form coming soon!')} 
                                className="flex items-center space-x-2 bg-ivolve-mid-green text-white font-semibold py-2 px-4 rounded-md transition-colors hover:bg-ivolve-dark-green"
                            >
                                <AddIcon />
                                <span>Add Contact</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stakeholder.contacts.map((contact: Contact) => (
                                <div key={contact.id} className="p-4 border rounded-md bg-white flex items-start space-x-3">
                                    {contact.photoUrl ? (
                                        <img src={contact.photoUrl} alt={contact.name} className="w-12 h-12 rounded-full"/>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <UserIcon />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-solas-dark">{contact.name}</p>
                                        <p className="text-sm text-solas-gray">{contact.role}</p>
                                        <p className="text-sm text-ivolve-blue mt-1">{contact.email}</p>
                                        <p className="text-sm text-solas-gray">{contact.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Properties':
                return (
                    <div className="space-y-2">
                        {linkedProperties.length > 0 ? linkedProperties.map(prop => (
                            <div key={prop.id} className="border rounded-md bg-white overflow-hidden">
                                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" onClick={() => togglePropertyExpansion(prop.id)}>
                                    <div className="flex-grow">
                                        <p className="font-bold text-solas-dark">{prop.id}</p>
                                        <p className="text-sm text-solas-gray">{prop.address.line1}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <StatusChip status={prop.serviceType} styleType="default" />
                                        <span>{expandedProperties.includes(prop.id) ? <ChevronDownIcon /> : <ChevronRightIcon />}</span>
                                    </div>
                                </div>
                                {expandedProperties.includes(prop.id) && (
                                    <div className="border-t">
                                        {prop.units.map(unit => (
                                            <div key={unit.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-blue-50">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-solas-dark">{unit.id} - {unit.name}</p>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <UnitStatusTag status={unit.status} styleType="default" />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <button onClick={() => selectProperty(prop.id, unit.id)} className="text-sm text-ivolve-blue hover:underline">
                                                        Open Property &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No properties are currently linked to this stakeholder.</p>}
                    </div>
                );
            default:
                return null;
        }
    }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={closeAllDrawers}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-ivolve-off-white shadow-2xl z-50 transform transition-transform ease-in-out duration-300 translate-x-0">
        <div className="h-full flex flex-col">
            <header className={`p-6 flex justify-between items-center ${stakeholder.branding.heroBg} ${stakeholder.branding.heroText}`}>
                <div className="flex-1">
                    {Logo ? <div className="w-48"><Logo /></div> : (
                        <div>
                            <h2 className="text-3xl font-bold">{stakeholder.name}</h2>
                            {stakeholder.subName && <p className="text-lg opacity-90">{stakeholder.subName}</p>}
                        </div>
                    )}
                    {stakeholder.website && <a href={stakeholder.website} target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:underline mt-2 inline-block">Visit website</a>}
                </div>
                <button 
                    onClick={closeAllDrawers} 
                    className={`p-2 rounded-full hover:bg-black/20 focus:outline-none`}
                    aria-label="Close stakeholder details"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>
            
            <div className="border-b border-gray-200 bg-white">
                <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-ivolve-blue text-ivolve-dark-green'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
                {renderContent()}
            </div>
        </div>
      </div>
    </>
  );
};

export default StakeholderDetailDrawer;