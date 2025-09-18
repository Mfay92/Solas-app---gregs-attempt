

import React, { useState, useMemo } from 'react';
import { Property, ServiceType, UnitStatus } from '../../types';
import { BuildingIcon, SearchIcon } from '../Icons';
import StatusChip from '../StatusChip';
import ToggleSwitch from '../ToggleSwitch';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import SplitText from '../SplitText';


type TableRow = {
  propertyId: string;
  unitId: string;
  unitName: string;
  fullAddress: string;
  rp: string;
  serviceType: ServiceType;
  status: UnitStatus;
  region: string;
  handoverDate: string;
  attention?: boolean;
};

const VoidManagementView: React.FC = () => {
  const { properties } = useData();
  const { selectProperty } = useUI();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [toggles, setToggles] = useState({
    supportedLiving: true,
    residential: true,
    nursingCare: true,
    england: true,
    wales: true,
  });

  const handleToggle = (toggleName: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [toggleName]: !prev[toggleName] }));
  };

  const filteredData = useMemo(() => {
    const baseData: TableRow[] = properties.flatMap(prop =>
      prop.units
        .filter(unit => unit.status === UnitStatus.Void)
        .map(unit => ({
          propertyId: prop.id,
          unitId: unit.id,
          unitName: unit.name,
          fullAddress: `${prop.address.line1}, ${prop.address.city}, ${prop.address.postcode}`,
          rp: prop.tags.rp,
          serviceType: prop.serviceType,
          status: unit.status,
          region: prop.region,
          handoverDate: new Date(prop.handoverDate).toLocaleDateString('en-GB'),
          attention: unit.attention,
        }))
    );
    
    const lowercasedQuery = searchQuery.toLowerCase();

    return baseData.filter(row => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        row.unitId.toLowerCase().includes(lowercasedQuery) ||
        row.fullAddress.toLowerCase().includes(lowercasedQuery) ||
        row.rp.toLowerCase().includes(lowercasedQuery);

      if (!matchesSearch) return false;

      // Toggle filters
      const serviceTypeMap = {
        [ServiceType.SupportedLiving]: toggles.supportedLiving,
        [ServiceType.Residential]: toggles.residential,
        [ServiceType.NursingCare]: toggles.nursingCare,
      };
      if (serviceTypeMap[row.serviceType] === false) return false;

      const regionMap = {
        'Wales': toggles.wales,
        'England': toggles.england
      }
      const country = row.region === 'Wales' ? 'Wales' : 'England';
      if (regionMap[country] === false) return false;

      return true;
    });

  }, [properties, searchQuery, toggles]);
  
  const getRowClass = (row: TableRow) => {
    if (row.attention) return 'bg-ivolve-warning-bg';
    return 'bg-yellow-50'; // Neutral color for voids in this view
  };

  const totalVoidUnits = properties.reduce((acc, p) => acc + p.units.filter(u => u.status === UnitStatus.Void).length, 0);
  
  const toggleOptions = [
      { key: 'supportedLiving', label: 'Supported Living' },
      { key: 'residential', label: 'Residential' },
      { key: 'nursingCare', label: 'Nursing Care' },
      { key: 'england', label: 'England' },
      { key: 'wales', label: 'Wales' },
  ] as const;


  return (
    <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <BuildingIcon />
                    <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="VOID MANAGEMENT"><SplitText>VOID MANAGEMENT</SplitText></h1>
                </div>
            </div>
             <div className="mt-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        placeholder="Search by Property ID, Address, or RP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                    />
                </div>
            </div>
        </header>

        {/* Table Content */}
        <div className="flex-grow overflow-y-auto p-4">
            <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-brand-dark-green text-white">
                    <tr>
                        <th className="p-3 text-center text-sm font-semibold border-r border-white/20 tracking-wider">Property ID</th>
                        <th className="p-3 text-center text-sm font-semibold border-r border-white/20 tracking-wider">Unit</th>
                        <th className="p-3 text-left text-sm font-semibold border-r border-white/20 tracking-wider">Full Address</th>
                        <th className="p-3 text-center text-sm font-semibold border-r border-white/20 tracking-wider">RP</th>
                        <th className="p-3 text-center text-sm font-semibold border-r border-white/20 tracking-wider">Service Type</th>
                        <th className="p-3 text-center text-sm font-semibold border-r border-white/20 tracking-wider">Status</th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider">Handover Date</th>
                    </tr>
                </thead>
                <tbody className="text-app-text-dark">
                    {filteredData.map((row) => (
                        <tr 
                            key={row.unitId} 
                            className={`hover:bg-ivolve-blue hover:text-white cursor-pointer transition-colors duration-150 border-b border-gray-200 ${getRowClass(row)}`}
                            onClick={() => selectProperty(row.propertyId, row.unitId)}
                        >
                            <td className="p-3 text-sm border-r border-gray-200 text-center">{row.unitId}</td>
                            <td className="p-3 text-sm border-r border-gray-200 text-center">{row.unitName}</td>
                            <td className="p-3 text-sm border-r border-gray-200">{row.fullAddress}</td>
                            <td className="p-3 text-sm border-r border-gray-200 text-center">{row.rp}</td>
                            <td className="p-3 text-sm border-r border-gray-200 text-center">
                                <StatusChip status={row.serviceType} styleType="default" />
                            </td>
                            <td className="p-3 text-sm border-r border-gray-200 text-center">{row.status}</td>
                            <td className="p-3 text-sm text-center">{row.handoverDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer */}
        <footer className="bg-app-header text-app-header-text p-4 flex justify-between items-center z-10">
           <div className="text-sm">
                <p className="text-lg font-bold mt-2">Showing {filteredData.length} of {totalVoidUnits} Total Voids</p>
           </div>
           <div className="space-y-2">
                <h4 className="font-bold text-sm text-center text-white/80">Display Toggles</h4>
                <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                    {toggleOptions.map(opt => (
                        <ToggleSwitch
                            key={opt.key}
                            label={opt.label}
                            enabled={toggles[opt.key]}
                            onChange={() => handleToggle(opt.key)}
                        />
                    ))}
                </div>
           </div>
        </footer>
    </div>
  );
};

export default VoidManagementView;