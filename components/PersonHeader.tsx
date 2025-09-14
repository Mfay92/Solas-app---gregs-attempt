import React, { useState } from 'react';
import { Person, Property, UnitStatus } from '../types';
import { EyeIcon, EyeOffIcon, MapPinIcon, ArrowLeftIcon, WarningIcon } from './Icons';
import { useUI } from '../contexts/UIContext';
import StatusChip from './StatusChip';
import RpTag from './RpTag';

const getRegionTagStyle = (region: string): string => {
    switch(region) {
        case 'North': return 'bg-region-north text-white';
        case 'Midlands': return 'bg-region-midlands text-white';
        case 'South': return 'bg-region-south text-white';
        case 'South West': return 'bg-region-south-west text-white';
        case 'Wales': return 'bg-white text-region-wales-text border-2 border-region-wales-border font-bold';
        default: return 'bg-gray-200 text-gray-700';
    }
}

const LivingTypeTag: React.FC<{ livingType: Property['livingType'] }> = ({ livingType }) => {
    const styles = {
        'Self-contained': 'bg-tag-self-contained text-white',
        'Shared Living': 'bg-tag-shared-living text-white',
        'Mixed': 'bg-gray-500 text-white',
    };
    
    return <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${styles[livingType]}`}>{livingType}</span>
};


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
  
  const dangerFlags = person.flags?.filter(f => f.level === 'danger');
  const warningFlags = person.flags?.filter(f => f.level === 'warning');
  
  const regionStyle = property ? getRegionTagStyle(property.region) : '';

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

        {/* Render danger flags first for prominence */}
        {dangerFlags && dangerFlags.length > 0 && (
            <div className="mb-4 p-4 rounded-md bg-flag-danger-bg text-flag-danger-text border border-flag-danger-border person-flag-banner danger-pulse">
                {dangerFlags.map(flag => (
                    <div key={flag.id} className="flex items-start space-x-2">
                        <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="font-bold">{flag.message}</p>
                    </div>
                ))}
            </div>
        )}
        {/* Then render warning flags */}
        {warningFlags && warningFlags.length > 0 && (
             <div className="mb-4 p-4 rounded-md bg-flag-warning-bg text-flag-warning-text border border-flag-warning-border">
                {warningFlags.map(flag => (
                    <div key={flag.id} className="flex items-start space-x-2">
                        <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="font-bold">{flag.message}</p>
                    </div>
                ))}
            </div>
        )}
        
      <div className="flex justify-between items-start space-x-6">
        {/* Left Side: Person Info */}
        <div className="flex-1">
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
            {property && (
                <div className="mt-4 flex items-center space-x-2 flex-wrap">
                    <LivingTypeTag livingType={property.livingType} />
                    <div className="mt-2 inline-block"><StatusChip status={property.serviceType} styleType="default" /></div>
                    <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${regionStyle}`}>{property.region}</span>
                    <div className="mt-2 inline-block"><RpTag name={property.tags.rp} /></div>
                </div>
            )}
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