import React, { useState, useMemo } from 'react';
import { ComplianceItem, ComplianceType, Property, ServiceType, UnitStatus } from '../../types';
import { AsbestosIcon, ChartBarIcon, ComplianceIcon, DatabaseIcon, EmergencyLightingIcon, EPCIcon, FireAlarmIcon, FireDoorIcon, FireExtinguisherIcon, GasIcon, LiftLolerIcon, LRAIcon, SearchIcon, SprinklerIcon, TMVIcon, ChevronDownIcon, ChevronRightIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';
import RpTag from '../RpTag';
import { useUI } from '../../contexts/UIContext';
import SplitText from '../SplitText';

type ComplianceRow = ComplianceItem & {
    property: Property;
};

type ViewMode = 'summary' | 'database';

const COMPLIANCE_TYPES_WITH_ICONS: { type: ComplianceType, icon: React.ReactNode, label: string }[] = [
    { type: ComplianceType.GasSafety, icon: <GasIcon />, label: 'Gas Safety' },
    { type: ComplianceType.EICR, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'EICR' },
    { type: ComplianceType.FireRiskAssessment, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, label: 'FRA' },
    { type: ComplianceType.FEE, icon: <FireExtinguisherIcon />, label: 'FEE' },
    { type: ComplianceType.FireDoor, icon: <FireDoorIcon />, label: 'Fire Door' },
    { type: ComplianceType.Asbestos, icon: <AsbestosIcon />, label: 'Asbestos' },
    { type: ComplianceType.LRA, icon: <LRAIcon />, label: 'LRA' },
    { type: ComplianceType.TMV, icon: <TMVIcon />, label: 'TMV' },
    { type: ComplianceType.LiftLOLER, icon: <LiftLolerIcon />, label: 'Lift LOLER' },
    { type: ComplianceType.EPC, icon: <EPCIcon />, label: 'EPC' },
    { type: ComplianceType.Sprinkler, icon: <SprinklerIcon />, label: 'Sprinkler' },
    { type: ComplianceType.EmergencyLighting, icon: <EmergencyLightingIcon />, label: 'E-Lighting' },
    { type: ComplianceType.FireAlarm, icon: <FireAlarmIcon />, label: 'Fire Alarm' },
];

const getStatusStyles = (status: ComplianceItem['status'] | 'N/A') => {
    switch (status) {
        case 'Compliant': return { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-100' };
        case 'Due Soon': return { dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100' };
        case 'Action Required': return { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100' };
        case 'Expired': return { dot: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-100' };
        default: return { dot: 'bg-gray-300', text: 'text-gray-600', bg: 'bg-gray-100' };
    }
}

// Helper to generate varied mock compliance data for individual flats
const generateMockUnitCompliance = (masterItems: ComplianceItem[]): ComplianceItem[] => {
    return masterItems.map(item => {
        const newItem = { ...item, id: `${item.id}-${Math.random()}` }; // new ID
        const rand = Math.random();
        if (rand < 0.15) { // 15% chance of being expired
            newItem.status = 'Expired';
            const lastCheck = new Date();
            lastCheck.setFullYear(lastCheck.getFullYear() - 1);
            lastCheck.setDate(lastCheck.getDate() - Math.floor(Math.random() * 30));
            newItem.lastCheck = lastCheck.toISOString().split('T')[0];
            const nextCheck = new Date(lastCheck);
            nextCheck.setMonth(nextCheck.getMonth() + 12);
            newItem.nextCheck = nextCheck.toISOString().split('T')[0];
        } else { // 85% compliant
            newItem.status = 'Compliant';
            const nextCheck = new Date();
            nextCheck.setFullYear(nextCheck.getFullYear() + 1);
            nextCheck.setDate(nextCheck.getDate() - Math.floor(Math.random() * 60));
            newItem.nextCheck = nextCheck.toISOString().split('T')[0];
            const lastCheck = new Date(nextCheck);
            lastCheck.setMonth(lastCheck.getMonth() - 12);
            newItem.lastCheck = lastCheck.toISOString().split('T')[0];
        }
        return newItem;
    });
};


const CompliancePpmView: React.FC = () => {
    const { properties } = useData();
    const { selectProperty } = useUI();
    const [activeView, setActiveView] = useState<ViewMode>('database');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());
    const [typeFilters, setTypeFilters] = useState<Set<ComplianceType>>(new Set());

    const allComplianceRows = useMemo<ComplianceRow[]>(() => {
        return properties.flatMap(p => 
            p.complianceItems.map(c => ({ ...c, property: p }))
        );
    }, [properties]);
    
    const filteredProperties = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        
        const complianceItemsByPropId = allComplianceRows.reduce((acc, row) => {
            if (!acc[row.property.id]) {
                acc[row.property.id] = [];
            }
            acc[row.property.id].push(row.type);
            return acc;
        }, {} as Record<string, ComplianceType[]>);

        return properties.filter(prop => {
            // Filter out properties where all units are Out of Management
            if (prop.units.every(u => u.status === UnitStatus.OutOfManagement)) {
                return false;
            }

            const matchesSearch = !lowerQuery ||
                prop.id.toLowerCase().includes(lowerQuery) ||
                `${prop.address.line1} ${prop.address.city}`.toLowerCase().includes(lowerQuery) ||
                prop.tags.rp.toLowerCase().includes(lowerQuery);

            if (!matchesSearch) return false;

            if (typeFilters.size > 0) {
                const propComplianceTypes = complianceItemsByPropId[prop.id] || [];
                const hasFilteredType = propComplianceTypes.some(type => typeFilters.has(type));
                if (!hasFilteredType) {
                    return false;
                }
            }

            return true;
        });
    }, [properties, searchQuery, allComplianceRows, typeFilters]);

    const togglePropertyExpansion = (propertyId: string) => {
        setExpandedProperties(prev => {
            const newSet = new Set(prev);
            if (newSet.has(propertyId)) {
                newSet.delete(propertyId);
            } else {
                newSet.add(propertyId);
            }
            return newSet;
        });
    };

    const toggleTypeFilter = (type: ComplianceType) => {
        setTypeFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    const renderSummary = () => {
        const totalItems = allComplianceRows.length;
        const statusCounts = allComplianceRows.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {} as Record<ComplianceItem['status'], number>);
        
        const compliantCount = statusCounts['Compliant'] || 0;
        const expiredCount = statusCounts['Expired'] || 0;
        const actionRequiredCount = statusCounts['Action Required'] || 0;
        const dueSoonCount = statusCounts['Due Soon'] || 0;
        const complianceRate = totalItems > 0 ? Math.round((compliantCount / totalItems) * 100) : 100;

        const breakdownByType = COMPLIANCE_TYPES_WITH_ICONS.map(({ type, label }) => {
            const itemsOfType = allComplianceRows.filter(item => item.type === type);
            const counts = itemsOfType.reduce((acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            }, {} as Record<ComplianceItem['status'], number>);
            return { type, label, total: itemsOfType.length, counts };
        }).filter(b => b.total > 0);

        const StatCard: React.FC<{ title: string; value: string; color: string; }> = ({ title, value, color }) => (
            <div className={`p-4 bg-white rounded-lg shadow border`}>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
            </div>
        );

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-white rounded-lg shadow border text-center flex flex-col justify-center">
                        <p className="text-6xl font-bold text-ivolve-mid-green">{complianceRate}%</p>
                        <p className="text-sm font-semibold text-gray-500 mt-1">Portfolio Compliant</p>
                    </div>
                    <StatCard title="Expired / Overdue" value={expiredCount.toString()} color="text-red-600" />
                    <StatCard title="Action Required" value={actionRequiredCount.toString()} color="text-orange-500" />
                    <StatCard title="Due Soon" value={dueSoonCount.toString()} color="text-yellow-500" />
                </div>
                <div className="bg-white rounded-lg shadow-md border p-4">
                    <h3 className="text-lg font-bold text-solas-dark mb-4">Breakdown by Type</h3>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-center">Compliant</th>
                                <th className="p-2 text-center">Due Soon</th>
                                <th className="p-2 text-center">Action Req.</th>
                                <th className="p-2 text-center">Expired</th>
                                <th className="p-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {breakdownByType.map(({ type, label, total, counts }) => (
                                <tr key={type}>
                                    <td className="p-2 font-semibold text-solas-dark">{label}</td>
                                    <td className="p-2 text-center font-medium text-green-700">{counts['Compliant'] || 0}</td>
                                    <td className="p-2 text-center font-medium text-yellow-700">{counts['Due Soon'] || 0}</td>
                                    <td className="p-2 text-center font-medium text-orange-700">{counts['Action Required'] || 0}</td>
                                    <td className="p-2 text-center font-medium text-red-700">{counts['Expired'] || 0}</td>
                                    <td className="p-2 text-center font-bold text-solas-dark">{total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    const renderDatabase = () => {
        return (
             <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border">
                    <div className="flex flex-wrap gap-2">
                        {COMPLIANCE_TYPES_WITH_ICONS.map(({type, label, icon}) => (
                            <button 
                                key={type} 
                                onClick={() => toggleTypeFilter(type)} 
                                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${typeFilters.has(type) ? 'bg-ivolve-blue text-white border-ivolve-blue' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
                            >
                                <span className="w-5 h-5">{icon}</span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-ivolve-dark-green text-white">
                                <tr>
                                    <th className="sticky left-0 bg-ivolve-dark-green p-2 text-left font-semibold tracking-wider w-64">Property</th>
                                    <th className="p-2 text-left font-semibold tracking-wider w-48">RP</th>
                                    <th className="p-2 text-center font-semibold tracking-wider" title="RP Responsible">RP Resp.</th>
                                    <th className="p-2 text-center font-semibold tracking-wider" title="ivolve Responsible">ivolve Resp.</th>
                                    {COMPLIANCE_TYPES_WITH_ICONS.map(c => 
                                        <th key={c.type} className="p-2 text-center font-semibold tracking-wider min-w-[100px]" title={c.label}>
                                            <div className="flex flex-col items-center justify-center h-full">
                                                {c.icon}
                                                <span className="text-xs mt-1 whitespace-nowrap">{c.label}</span>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProperties.map(property => {
                                    const masterCompliance = allComplianceRows.filter(r => r.property.id === property.id);
                                    const masterItems = masterCompliance.reduce((acc, item) => {
                                        acc[item.type] = item;
                                        return acc;
                                    }, {} as Partial<Record<ComplianceType, ComplianceRow>>);
                                    
                                    const hasFlats = property.livingType !== 'Shared Living' && property.units.some(u => u.name.toLowerCase().includes('flat'));
                                    const isExpanded = expandedProperties.has(property.id);
                                    const childUnits = hasFlats ? property.units.filter(u => u.status !== UnitStatus.Master && u.status !== UnitStatus.OutOfManagement) : [];
                                    const masterUnit = property.units.find(u => u.status === UnitStatus.Master);


                                    return (
                                        <React.Fragment key={property.id}>
                                            {/* Master Row */}
                                            <tr className="hover:bg-gray-100 bg-gray-50 font-semibold cursor-pointer" onClick={() => hasFlats ? togglePropertyExpansion(property.id) : (masterUnit && selectProperty(property.id, masterUnit.id))}>
                                                <td className="sticky left-0 bg-gray-50 hover:bg-gray-100 p-2 whitespace-nowrap w-64">
                                                    <div className="flex items-center">
                                                        {hasFlats && (
                                                            <span className="mr-2">
                                                                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                                            </span>
                                                        )}
                                                        <div>
                                                            <div className="text-ivolve-blue">{property.id.replace('_PROP','')}</div>
                                                            <div className="text-xs text-gray-500 font-normal">{property.address.line1}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap w-48"><RpTag name={property.tags.rp} styleType="outline" /></td>
                                                <td className="p-2 text-center">{property.serviceType === ServiceType.SupportedLiving ? '✅' : ''}</td>
                                                <td className="p-2 text-center">{[ServiceType.Residential, ServiceType.NursingCare].includes(property.serviceType) ? '✅' : ''}</td>
                                                {COMPLIANCE_TYPES_WITH_ICONS.map(({ type }) => {
                                                    const item = masterItems[type];
                                                    const statusStyle = item ? getStatusStyles(item.status) : getStatusStyles('N/A');
                                                    return (
                                                        <td key={type} className="p-2 text-center">
                                                            <span className={`block w-4 h-4 rounded-full mx-auto ${statusStyle.dot}`} title={item ? `${item.status} - Due: ${new Date(item.nextCheck).toLocaleDateString()}` : 'N/A'}></span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            {/* Child Rows (Flats) */}
                                            {isExpanded && childUnits.map(unit => {
                                                const unitComplianceItemsMap = generateMockUnitCompliance(property.complianceItems)
                                                    .reduce((acc, item) => {
                                                        acc[item.type] = item;
                                                        return acc;
                                                    }, {} as Partial<Record<ComplianceType, ComplianceItem>>);

                                                return (
                                                    <tr key={unit.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => selectProperty(property.id, unit.id)}>
                                                        <td className="sticky left-0 bg-white hover:bg-gray-100 p-2 pl-10 whitespace-nowrap w-64">
                                                            <div className="font-medium text-gray-800">{unit.name}</div>
                                                            <div className="text-xs text-gray-500">{unit.id}</div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap w-48"><RpTag name={property.tags.rp} styleType="outline" /></td>
                                                        <td className="p-2 text-center">{property.serviceType === ServiceType.SupportedLiving ? '✅' : ''}</td>
                                                        <td className="p-2 text-center">{[ServiceType.Residential, ServiceType.NursingCare].includes(property.serviceType) ? '✅' : ''}</td>
                                                        {COMPLIANCE_TYPES_WITH_ICONS.map(({ type }) => {
                                                            const item = unitComplianceItemsMap[type];
                                                            const statusStyle = item ? getStatusStyles(item.status as ComplianceItem['status']) : getStatusStyles('N/A');
                                                            return (
                                                                <td key={type} className="p-2 text-center">
                                                                    <span className={`block w-4 h-4 rounded-full mx-auto ${statusStyle.dot}`} title={item ? `${item.status} - Due: ${new Date(item.nextCheck).toLocaleDateString()}` : 'N/A'}></span>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderActiveView = () => {
        if (activeView === 'summary') return renderSummary();
        if (activeView === 'database') return renderDatabase();
        return null;
    };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="flex-shrink-0 bg-app-header text-app-header-text p-4 shadow-md z-20">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center"><ComplianceIcon /></div>
              <h1 className="text-4xl font-extrabold tracking-tight animated-heading" aria-label="COMPLIANCE HUB"><SplitText>COMPLIANCE HUB</SplitText></h1>
            </div>
            <div className="flex items-center bg-white/20 p-1 rounded-md">
                <button
                    onClick={() => setActiveView('summary')} 
                    title="Summary View"
                    className={`p-2 rounded-md transition-colors ${activeView === 'summary' ? 'bg-ivolve-blue text-white' : 'hover:bg-white/30'}`}
                ><ChartBarIcon /></button>
                <button
                    onClick={() => setActiveView('database')} 
                    title="Database View"
                    className={`p-2 rounded-md transition-colors ${activeView === 'database' ? 'bg-ivolve-blue text-white' : 'hover:bg-white/30'}`}
                ><DatabaseIcon /></button>
            </div>
        </div>
        <div className="mt-4 relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
             <input type="search" placeholder="Search by ID, Address or RP..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30" />
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default CompliancePpmView;
