import React, { useState } from 'react';
import { Person, Property, UnitStatus } from '../types';
import { EyeIcon, EyeOffIcon, MapPinIcon, ArrowLeftIcon } from './Icons';
import { useUI } from '../contexts/UIContext';

const PersonHeader: React.FC<{ 
    person: Person; 
    property?: Property;
    onClose: () => void;
    isOverlay: boolean;
}> = ({ person, property, onClose, isOverlay }) => {
  const [showLegalName, setShowLegalName] = useState(false);
  const { selectProperty } = useUI();

  const displayedName = showLegalName 
    ? `${person.legalFirstName} ${person.surname}` 
    : `${person.preferredFirstName} ${person.surname}`;
  
  const hasPreferredName = person.preferredFirstName !== person.legalFirstName;

  return (
    <header className="relative bg-ivolve-dark-green text-white p-6 shadow-md">
       <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 rounded-full text-white/80 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={isOverlay ? "Back to property view" : "Close details"}
      >
          {isOverlay ? <ArrowLeftIcon /> : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          )}
      </button>
      <div className="flex justify-between items-start space-x-6">
        {/* Left Side: Person Info */}
        <div className="flex items-start space-x-6 flex-1">
          <img src={person.photoUrl} alt={displayedName} className="w-24 h-24 rounded-full border-4 border-gray-200 flex-shrink-0" />
          <div className="flex-1 pt-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-bold">{displayedName}</h2>
               {hasPreferredName && (
                <button 
                  onClick={() => setShowLegalName(!showLegalName)} 
                  className="p-1 text-gray-300 hover:text-white"
                  title={showLegalName ? 'Show preferred name' : 'Show legal name'}
                  aria-label={showLegalName ? 'Show preferred name' : 'Show legal name'}
                >
                  {showLegalName ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              )}
            </div>
            <p className="text-lg text-gray-200">Move-in: {new Date(person.moveInDate).toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Right Side: Property Info */}
        {property && (
            <button 
                onClick={() => selectProperty(property.id, person.unitId, true)}
                className="flex-shrink-0 text-left bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors"
            >
                <div className="flex items-center space-x-2 font-bold text-sm border-b border-white/20 pb-1 mb-2">
                    <MapPinIcon />
                    <span>Current Property</span>
                </div>
                <div className="text-sm">
                    {(() => {
                        const unit = property.units.find(u => u.id === person.unitId);
                        const unitName = unit?.name;
                        const propertyName = property.address.propertyName;
                        const street = property.address.line1;
                        let parts: string[] = [];
                        if (unitName && unit?.status !== UnitStatus.Master) parts.push(unitName);
                        if (propertyName) parts.push(propertyName);
                        parts.push(street);
                        const addressLine1 = parts.join(', ');
                        const addressLine2 = `${property.address.city}, ${property.address.postcode}`;
                        return (
                            <>
                                <p className="font-semibold">{addressLine1}</p>
                                <p className="text-xs opacity-80">{addressLine2}</p>
                            </>
                        )
                    })()}
                    <p className="text-xs font-bold text-ivolve-bright-green mt-1">View Property &rarr;</p>
                </div>
            </button>
        )}
      </div>
    </header>
  );
};

export default PersonHeader;