import React, { useState, useMemo } from 'react';
import { Property, ServiceType, UnitStatus } from '../types';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import ToggleSwitch from './ToggleSwitch';
import StatusChip from './StatusChip';
import RpTag from './RpTag';
import { SearchIcon } from './Icons';

type LegalStatus = { type: 'Lease' | 'SLA'; status: '✅ Present' | '❌ Missing' } | null;
type DatabaseRow = { propertyId: string; address: string; rp: string; serviceType: ServiceType; region: string; legalStatus: LegalStatus; defaultUnitId: string | null };

const getLegalStatus = (property: Property): LegalStatus => {
    const hasLease = property.legalAgreements.some(a => a.type === 'Lease');
    const hasSLA = property.legalAgreements.some(a => a.type === 'SLA');
    if ([ServiceType.Residential, ServiceType.NursingCare].includes(property.serviceType)) {
        return { type: 'Lease', status: hasLease ? '✅ Present' : '❌ Missing' };
    }
    if (property.serviceType === ServiceType.SupportedLiving) {
        return { type: 'SLA', status: hasSLA ? '✅ Present' : '❌ Missing' };
    }
    return null;
};

const LegalStatusTag: React.FC<{ statusInfo: LegalStatus }> = ({ statusInfo }) => {
    if (!statusInfo) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">N/A</span>;
    const isPresent = statusInfo.status === '✅ Present';
    const text = `${isPresent ? '✅' : '❌'} ${statusInfo.type}`;
    const colorClasses = isPresent ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200';
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClasses}`}>{text}</span>;
}

const initialFilters = {
    hasLease: false,
    missingLease: false,
    hasSla: false,
    missingSla: false,
    supportedLiving: false,
    residential: false,
    nursingCare: false,
    north: false,
    midlands: false,
    south: false,
    wales: false,
};

const LegalDatabaseTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { properties } = useData();
    const { selectProperty } = useUI();
    const [filters, setFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');

    const databaseRows: DatabaseRow[] = useMemo(() => properties.map(p => {
        const masterUnit = p.units.find(u => u.status === UnitStatus.Master);
        return {
            propertyId: p.id,
            address: `${p.address.line1}, ${p.address.city}, ${p.address.postcode}`,
            rp: p.tags.rp,
            serviceType: p.serviceType,
            region: p.region,
            legalStatus: getLegalStatus(p),
            defaultUnitId: masterUnit?.id ?? p.units[0]?.id ?? null,
        }
    }), [properties]);

    const filteredRows = useMemo(() => {
        const isAnyFilterActive = Object.values(filters).some(v => v);
        const lowerQuery = searchQuery.toLowerCase();

        if (!isAnyFilterActive && !searchQuery) return [];

        return databaseRows.filter(row => {
            const matchesSearch = !searchQuery || row.address.toLowerCase().includes(lowerQuery) || row.propertyId.toLowerCase().includes(lowerQuery) || row.rp.toLowerCase().includes(lowerQuery);
            if (!matchesSearch) return false;
            
            if (!isAnyFilterActive) return true;

            const serviceTypeOk = 
                (!filters.supportedLiving && !filters.residential && !filters.nursingCare) ||
                (filters.supportedLiving && row.serviceType === ServiceType.SupportedLiving) ||
                (filters.residential && row.serviceType === ServiceType.Residential) ||
                (filters.nursingCare && row.serviceType === ServiceType.NursingCare);

            const legalStatusOk = 
                (!filters.hasLease && !filters.missingLease && !filters.hasSla && !filters.missingSla) ||
                (filters.hasLease && row.legalStatus?.type === 'Lease' && row.legalStatus.status === '✅ Present') ||
                (filters.missingLease && row.legalStatus?.type === 'Lease' && row.legalStatus.status === '❌ Missing') ||
                (filters.hasSla && row.legalStatus?.type === 'SLA' && row.legalStatus.status === '✅ Present') ||
                (filters.missingSla && row.legalStatus?.type === 'SLA' && row.legalStatus.status === '❌ Missing');

            const regionOk =
                (!filters.north && !filters.midlands && !filters.south && !filters.wales) ||
                (filters.north && row.region === 'North') ||
                (filters.midlands && row.region === 'Midlands') ||
                (filters.south && (row.region === 'South' || row.region === 'South West')) ||
                (filters.wales && row.region === 'Wales');
                
            return serviceTypeOk && legalStatusOk && regionOk;
        });
    }, [databaseRows, filters, searchQuery]);

    const stats = useMemo(() => {
        const slProps = properties.filter(p => p.serviceType === ServiceType.SupportedLiving);
        const resiProps = properties.filter(p => [ServiceType.Residential, ServiceType.NursingCare].includes(p.serviceType));
        const slaUploaded = slProps.filter(p => getLegalStatus(p)?.status === '✅ Present').length;
        const leaseUploaded = resiProps.filter(p => getLegalStatus(p)?.status === '✅ Present').length;
        return {
            slaTotal: slProps.length,
            slaUploaded,
            leaseTotal: resiProps.length,
            leaseUploaded
        };
    }, [properties]);
    
    return (
        <div className="p-6 h-full flex flex-col">
            <button onClick={onBack} className="text-brand-blue font-semibold mb-4 self-start">&larr; Back to Legal Hub</button>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold">{stats.slaUploaded} / {stats.slaTotal}</p><p className="text-xs font-semibold text-gray-500">SLAs Uploaded</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold">{stats.leaseUploaded} / {stats.leaseTotal}</p><p className="text-xs font-semibold text-gray-500">Leases Uploaded</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold text-gray-400">-</p><p className="text-xs font-semibold text-gray-500">Up for Renewal (Year)</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold text-gray-400">-</p><p className="text-xs font-semibold text-gray-500">Ending (Year)</p></div>
            </div>
            <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="grid grid-cols-5 gap-4">
                    <div><h4 className="font-bold text-sm mb-2">Legal Status</h4><ToggleSwitch label="Has SLA" enabled={filters.hasSla} onChange={() => setFilters(f=>({...f, hasSla: !f.hasSla}))} /><ToggleSwitch label="Missing SLA" enabled={filters.missingSla} onChange={() => setFilters(f=>({...f, missingSla: !f.missingSla}))} /><ToggleSwitch label="Has Lease" enabled={filters.hasLease} onChange={() => setFilters(f=>({...f, hasLease: !f.hasLease}))} /><ToggleSwitch label="Missing Lease" enabled={filters.missingLease} onChange={() => setFilters(f=>({...f, missingLease: !f.missingLease}))} /></div>
                    <div className="border-l pl-4"><h4 className="font-bold text-sm mb-2">Service Type</h4><ToggleSwitch label="Supported Living" enabled={filters.supportedLiving} onChange={() => setFilters(f=>({...f, supportedLiving: !f.supportedLiving}))} /><ToggleSwitch label="Residential" enabled={filters.residential} onChange={() => setFilters(f=>({...f, residential: !f.residential}))} /><ToggleSwitch label="Nursing Care" enabled={filters.nursingCare} onChange={() => setFilters(f=>({...f, nursingCare: !f.nursingCare}))} /></div>
                    <div className="border-l pl-4"><h4 className="font-bold text-sm mb-2">Region</h4><ToggleSwitch label="North" enabled={filters.north} onChange={() => setFilters(f=>({...f, north: !f.north}))} /><ToggleSwitch label="Midlands" enabled={filters.midlands} onChange={() => setFilters(f=>({...f, midlands: !f.midlands}))} /><ToggleSwitch label="South" enabled={filters.south} onChange={() => setFilters(f=>({...f, south: !f.south}))} /><ToggleSwitch label="Wales" enabled={filters.wales} onChange={() => setFilters(f=>({...f, wales: !f.wales}))} /></div>
                    <div className="col-span-2 border-l pl-4"><h4 className="font-bold text-sm mb-2">Search</h4><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></span><input type="search" placeholder="Search by ID, Address, or RP..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 text-sm focus:ring-brand-blue focus:border-brand-blue" /></div></div>
                </div>
            </div>
            <div className="flex-grow bg-white border rounded-lg overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Property ID</th><th className="px-4 py-3">Address</th><th className="px-4 py-3">RP</th><th className="px-4 py-3">Service Type</th><th className="px-4 py-3">Region</th><th className="px-4 py-3">Legal Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRows.map(row => (
                        <tr key={row.propertyId} onClick={() => row.defaultUnitId && selectProperty(row.propertyId, row.defaultUnitId)} className="hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                            <td className="px-4 py-3 font-medium text-brand-blue">{row.propertyId.replace('_PROP','')}</td>
                            <td className="px-4 py-3">{row.address}</td>
                            <td className="px-4 py-3"><RpTag name={row.rp} styleType="outline" /></td>
                            <td className="px-4 py-3"><StatusChip status={row.serviceType} styleType="default" /></td>
                            <td className="px-4 py-3">{row.region}</td>
                            <td className="px-4 py-3"><LegalStatusTag statusInfo={row.legalStatus} /></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRows.length === 0 && <p className="text-center p-8 text-gray-500">No properties match the selected filters. Please select a filter to begin.</p>}
            </div>
        </div>
    );
};

export default LegalDatabaseTool;