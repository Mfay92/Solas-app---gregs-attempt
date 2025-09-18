
import React, { useState, useMemo } from 'react';
import { Person, Property, UnitStatus, PersonStatus } from '../types';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, WarningIcon, ExternalLinkIcon } from './Icons';
import { useUI } from '../contexts/UIContext';
import StatusChip from './StatusChip';
import RpTag from './RpTag';
import { getRegionTagStyle } from '../../utils/theme';

const LivingTypeTag: React.FC<{ livingType: Property['livingType'] }> = ({ livingType }) => {
    const styles = {
        'Self-contained': 'bg-tag-self-contained text-white',
        'Shared Living': 'bg-tag-shared-living text-white',
        'Mixed': 'bg-gray-500 text-white',
    };
    
    return <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${styles[livingType]}`}>{livingType}</span>
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};


const PersonHeader: React.FC<{ 
    person: Person; 
    property?: Property;
    onClose: () => void;
    isOverlay: boolean;
}> = ({ person, property, onClose, isOverlay }) => {
  const [showLegalName, setShowLegalName] = useState(false);
  const { selectProperty } = useUI();
  
  const isFormer = person.status === PersonStatus.Former;
  const headerBgClass = isFormer ? 'bg-solas-gray' : 'bg-ivolve-dark-green';

  const displayedName = showLegalName 
    ? `${person.legalFirstName} ${person.surname}` 
    : `${person.preferredFirstName} ${person.surname}`;
  
  const hasPreferredName = person.preferredFirstName !== person.legalFirstName;
  
  const dangerFlags = person.flags?.filter(f => f.level === 'danger');
  const warningFlags = person.flags?.filter(f => f.level === 'warning');
  
  const regionStyle = property ? getRegionTagStyle(property.region) : '';
  
  const fullAddress = useMemo(() => {
    if (!property) return null;
    const unit = property.units.find(u => u.id === person.unitId);
    const parts = [
        unit?.name,
        property.address.propertyName,
        property.address.line1,
        property.address.city,
        property.address.postcode,
    ].filter(Boolean); // Filter out any null/undefined/empty parts
    return parts.join(', ');
  }, [property, person.unitId]);


  return (
    <header className={`relative ${headerBgClass} text-white p-6 shadow-md`}>
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
        {/* Main Info Area */}
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
            
            {property && fullAddress && (
                <div className="flex items-center space-x-2 group mt-1">
                    <p className="text-lg text-gray-100">
                        {fullAddress}
                    </p>
                    <button 
                        onClick={() => selectProperty(property.id, person.unitId, true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/20"
                        title="View property profile"
                    >
                        <ExternalLinkIcon />
                    </button>
                </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-300">
                {/* Column 1 */}
                <div>
                    <p><span className="font-semibold text-gray-100">Tenancy Start:</span> {formatDate(person.tenancy?.startDate)}</p>
                    <p><span className="font-semibold text-gray-100">Move-in:</span> {formatDate(person.moveInDate)}</p>
                </div>
                {/* Column 2 (conditional) */}
                {isFormer && (
                    <div>
                        <p><span className="font-semibold text-gray-100">Tenancy End:</span> {formatDate(person.tenancy?.endDate)}</p>
                        <p><span className="font-semibold text-gray-100">Move-out:</span> {formatDate(person.moveOutDate)}</p>
                    </div>
                )}
            </div>

            {property && (
                <div className="mt-4 flex items-center space-x-2 flex-wrap">
                    <LivingTypeTag livingType={property.livingType} />
                    <div className="mt-2 inline-block"><StatusChip status={property.serviceType} styleType="default" /></div>
                    <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${regionStyle}`}>{property.region}</span>
                    <div className="mt-2 inline-block"><RpTag name={property.tags.rp} /></div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default PersonHeader;
