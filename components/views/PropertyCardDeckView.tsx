import React, { useMemo, useState } from 'react';
import { PropertyUnitRow, UnitStatus, ServiceType } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { ChevronDownIcon, StarIconSolid } from '../Icons';
import StatusChip from '../StatusChip';
import RpTag from '../RpTag';

type PropertyCardDeckViewProps = {
  rows: PropertyUnitRow[];
};

type PropertyDeck = {
  propertyId: string;
  address: string;
  rp: string;
  serviceType: ServiceType;
  masterUnit: PropertyUnitRow | undefined;
  otherUnits: PropertyUnitRow[];
  totalUnits: number;
  attention?: boolean;
}

const unitStatusStyles: Record<UnitStatus, string> = {
    [UnitStatus.Occupied]: 'text-green-700',
    [UnitStatus.Void]: 'text-cyan-600',
    [UnitStatus.Master]: 'text-amber-600',
    [UnitStatus.Unavailable]: 'text-gray-500',
    [UnitStatus.OutOfManagement]: 'text-gray-600',
    [UnitStatus.StaffSpace]: 'text-indigo-600',
};

const Deck: React.FC<{ deck: PropertyDeck }> = ({ deck }) => {
    const { selectProperty } = useUI();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectUnit = (e: React.MouseEvent, propertyId: string, unitId: string) => {
        e.stopPropagation();
        selectProperty(propertyId, unitId);
    };

    const allUnits = [...(deck.masterUnit ? [deck.masterUnit] : []), ...deck.otherUnits];

    return (
        <div className="relative w-full max-w-sm h-64" onMouseLeave={() => setIsOpen(false)}>
            {/* The stack effect */}
            {[...Array(Math.min(deck.totalUnits, 4))].map((_, i) => (
                <div 
                    key={i}
                    className="absolute inset-0 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-300"
                    style={{ 
                        transform: `translateX(${i * 4}px) translateY(${i * 4}px) rotate(${i * 1.5}deg)`,
                        zIndex: -i
                    }}
                />
            ))}
            
            {/* The top interactive card */}
            <div 
                className={`absolute inset-0 bg-white rounded-lg shadow-lg border-2 p-4 flex flex-col justify-between cursor-pointer transition-all ${isOpen ? 'border-ivolve-blue' : 'border-gray-300'}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-solas-dark text-lg leading-tight pr-2">{deck.address}</h3>
                        {deck.masterUnit && <span className="text-tag-master flex-shrink-0" title="Master Property"><StarIconSolid /></span>}
                    </div>
                     {deck.attention && <p className="text-xs font-bold text-status-orange mt-1">Attention Required</p>}
                    <div className="mt-2 flex items-center space-x-2">
                         <StatusChip status={deck.serviceType} styleType="outline" />
                         <RpTag name={deck.rp} styleType="outline" />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border shadow-lg rounded-md z-20 max-h-48 overflow-y-auto">
                        <ul>
                            {allUnits.map(unit => (
                                <li key={unit.unitId} className="px-3 py-2 hover:bg-gray-100 flex justify-between items-center" onClick={(e) => handleSelectUnit(e, deck.propertyId, unit.unitId)}>
                                    <span>
                                        {unit.unitName}
                                        <span className="text-gray-500 text-xs ml-2">({unit.unitId})</span>
                                    </span>
                                    <span className={`text-xs font-bold ${unitStatusStyles[unit.status]}`}>{unit.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-4 text-center">
                    <button className="flex items-center justify-center w-full text-sm font-semibold text-gray-600">
                        <span>{deck.totalUnits} Units</span>
                        <ChevronDownIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

const PropertyCardDeckView: React.FC<PropertyCardDeckViewProps> = ({ rows }) => {
    const decks = useMemo(() => {
        const groupedByProperty = rows.reduce<Record<string, PropertyUnitRow[]>>((acc, row) => {
            if (!acc[row.propertyId]) {
                acc[row.propertyId] = [];
            }
            acc[row.propertyId].push(row);
            return acc;
        }, {});

        return Object.values(groupedByProperty).map(units => {
            const masterUnit = units.find(u => u.unitName === 'Master');
            const otherUnits = units.filter(u => u.unitName !== 'Master').sort((a,b) => a.unitName.localeCompare(b.unitName));
            const firstUnit = units[0];
            return {
                propertyId: firstUnit.propertyId,
                address: firstUnit.fullAddress.split(',')[0], // just line 1
                rp: firstUnit.rp,
                serviceType: firstUnit.serviceType,
                masterUnit,
                otherUnits,
                totalUnits: units.length,
                attention: units.some(u => u.attention),
            };
        });
    }, [rows]);

    if (rows.length === 0) {
        return <div className="text-center text-gray-500 py-16">No properties match the current filters.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 pt-8">
            {decks.map(deck => (
                <Deck key={deck.propertyId} deck={deck} />
            ))}
        </div>
    );
};

export default PropertyCardDeckView;
