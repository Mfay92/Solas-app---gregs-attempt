

import React from 'react';
import { Property, UnitStatus, Person, PersonStatus, Unit } from '../types';
import StatusChip from './StatusChip';
import RpTag from './RpTag';
import { useUI } from '../contexts/UIContext';
import { UserIcon, ArrowLeftIcon } from './Icons';
import { getRegionTagStyle } from '../../utils/theme';

type OccupantInfoProps = {
    property: Property;
    people: Person[];
    selectedUnitId: string | null;
}

const OccupantInfo: React.FC<OccupantInfoProps> = ({ property, people, selectedUnitId }) => {
    const { selectPerson } = useUI();
    const selectedUnit = property.units.find(u => u.id === selectedUnitId);
    
    // Always show only the selected unit, unless it's the master view.
    const isMasterView = !selectedUnitId || selectedUnit?.status === UnitStatus.Master;

    const unitToDisplay = isMasterView ? null : selectedUnit;

    const occupant = unitToDisplay 
        ? people.find(p => p.unitId === unitToDisplay.id && p.status === PersonStatus.Current)
        : null;

    return (
        <div className="bg-white/10 p-3 rounded-lg text-white max-w-xs w-full">
            <h4 className="font-bold text-sm border-b border-white/20 pb-1 mb-2">{isMasterView ? 'Occupancy Summary' : 'Unit Status'}</h4>
             <div className="space-y-2 h-24 overflow-y-auto pr-2">
                {isMasterView ? (
                    <p className="p-1.5 text-sm text-gray-300">Select a specific unit to see occupant details.</p>
                ) : unitToDisplay?.status === UnitStatus.Occupied ? (
                    occupant ? (
                         <button onClick={() => selectPerson(occupant.id, true)} className="w-full text-left flex items-center space-x-2 p-1.5 rounded-md hover:bg-white/20 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center"><UserIcon/></div>
                            <div>
                                <p className="text-sm font-semibold leading-tight">{occupant.preferredFirstName} {occupant.surname}</p>
                                <p className="text-xs opacity-80 leading-tight">{unitToDisplay.name}</p>
                            </div>
                        </button>
                    ) : (
                         <div className="flex items-center space-x-2 p-1.5">
                            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center"><UserIcon/></div>
                            <div>
                                <p className="text-sm font-semibold leading-tight text-gray-300 italic">Occupied (No profile)</p>
                                <p className="text-xs opacity-80 leading-tight">{unitToDisplay.name}</p>
                            </div>
                        </div>
                    )
                ) : unitToDisplay?.status === UnitStatus.Void ? (
                     <div className="p-1.5">
                         <p className="text-sm font-semibold text-cyan-300">Void</p>
                         <p className="text-xs opacity-80">{unitToDisplay.name}</p>
                    </div>
                ) : (
                    <p className="p-1.5 text-sm text-gray-300">Unit status: {unitToDisplay?.status}</p>
                )}
            </div>
        </div>
    )
};


const PropertyIdTag: React.FC<{ id: string }> = ({ id }) => (
    <span className="mt-2 px-3 py-1 text-sm font-medium rounded-md bg-brand-mid-green text-white">{id}</span>
);

const LivingTypeTag: React.FC<{ livingType: Property['livingType']; unitType?: 'flat' | 'room' | 'mixed' }> = ({ livingType, unitType }) => {
    let effectiveType: 'Self-contained' | 'Shared Living' | 'Mixed' = livingType;
    if (unitType === 'flat') effectiveType = 'Self-contained';
    if (unitType === 'room') effectiveType = 'Shared Living';

    const styles = {
        'Self-contained': 'bg-tag-self-contained text-white',
        'Shared Living': 'bg-tag-shared-living text-white',
        'Mixed': 'bg-gray-500 text-white',
    };
    
    return <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${styles[effectiveType]}`}>{effectiveType}</span>
};


const PropertyHeader: React.FC<{ 
    property: Property; 
    people: Person[]; 
    selectedUnitId: string | null;
    onClose: () => void;
    isOverlay: boolean;
}> = ({ property, people, selectedUnitId, onClose, isOverlay }) => {
  const regionStyle = getRegionTagStyle(property.region);
  const selectedUnit = property.units.find(u => u.id === selectedUnitId);
  
  const displayId = selectedUnit && selectedUnit.status !== UnitStatus.Master 
    ? selectedUnit.id 
    : (property.units.find(u => u.status === UnitStatus.Master)?.id || property.id.replace('_PROP',''));

  // Standardized address formatting
  const getAddressLine1 = () => {
    const unitName = selectedUnit?.name;
    const propertyName = property.address.propertyName;
    const street = property.address.line1;

    let parts: string[] = [];
    if (unitName && selectedUnit?.status !== UnitStatus.Master) {
        parts.push(unitName);
    }
    if (propertyName && !unitName?.toLowerCase().includes('flat')) {
        parts.push(propertyName);
    }
    parts.push(street);

    return parts.join(', ');
  };

  const addressLine1 = getAddressLine1();
  const addressLine2 = `${property.address.city}, ${property.address.postcode}`;
  
  const unitType = selectedUnit?.name.toLowerCase().includes('flat') ? 'flat' :
                   selectedUnit?.name.toLowerCase().includes('room') ? 'room' :
                   'mixed';

  return (
    <header className="relative bg-brand-dark-green text-white p-6 shadow-md">
      <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 rounded-full text-white/80 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={isOverlay ? "Back to person view" : "Close property details"}
      >
          {isOverlay ? <ArrowLeftIcon /> : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          )}
      </button>

      {property.flags.map(flag => (
        <div key={flag.id} className="mb-4 p-4 rounded-md bg-orange-100 text-status-warning border border-status-warning">
          <p className="font-bold">{flag.message}</p>
        </div>
      ))}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{addressLine1}</h2>
          <p className="text-lg text-gray-200">{addressLine2}</p>
          <div className="mt-4 flex items-center space-x-2 flex-wrap">
              <PropertyIdTag id={displayId} />
              <LivingTypeTag livingType={property.livingType} unitType={unitType} />
              <div className="mt-2 inline-block"><StatusChip status={property.serviceType} styleType="default" /></div>
              <span className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${regionStyle}`}>{property.region}</span>
              <div className="mt-2 inline-block"><RpTag name={property.tags.rp} /></div>
          </div>
        </div>
        <div className="flex-shrink-0">
            <OccupantInfo property={property} people={people} selectedUnitId={selectedUnitId} />
        </div>
      </div>
    </header>
  );
};

export default PropertyHeader;
