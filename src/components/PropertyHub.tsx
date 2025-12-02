import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertiesData from '../data/properties.json';
import { PropertyAsset } from '../types';
import { Search, List, LayoutGrid, ChevronRight, Home, BedDouble, FileText, AlertCircle, FileQuestion, Check } from 'lucide-react';
import PropertyProfile from './PropertyProfile';
import LoadingSpinner from './shared/LoadingSpinner';
import StatusBadge from './shared/StatusBadge';
import { UI_CONSTANTS } from '../constants';

// Type guard to validate property asset structure from JSON
function isValidPropertyData(obj: unknown): obj is Record<string, unknown> {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'address' in obj &&
        'type' in obj
    );
}

// Safely cast JSON import with validation - JSON types are compatible with PropertyAsset
const properties: PropertyAsset[] = Array.isArray(propertiesData)
    ? (propertiesData.filter(isValidPropertyData) as PropertyAsset[])
    : [];

const PropertyHub: React.FC = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedMasters, setExpandedMasters] = useState<Set<string>>(new Set());

    const toggleMaster = (id: string) => {
        const newExpanded = new Set(expandedMasters);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedMasters(newExpanded);
    };

    const handleViewModeChange = (mode: 'table' | 'card') => {
        if (mode === viewMode) return;
        setIsLoading(true);
        setTimeout(() => {
            setViewMode(mode);
            setIsLoading(false);
        }, UI_CONSTANTS.VIEW_TRANSITION_DELAY);
    };

    const filteredAssets = useMemo(() => {
        return properties.filter(asset => {
            const matchesSearch =
                (asset.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (asset.registeredProvider || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (asset.housingManager || '').toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
    }, [searchQuery]);

    const tableData = useMemo(() => {
        const masters = filteredAssets.filter(a => a.type === 'Master');
        const units = filteredAssets.filter(a => a.type === 'Unit');

        let rows: PropertyAsset[] = [];

        masters.forEach(master => {
            rows.push(master);
            if (expandedMasters.has(master.id)) {
                const masterUnits = units.filter(u => u.parentId === master.id);
                rows = [...rows, ...masterUnits];
            }
        });

        return rows;
    }, [filteredAssets, expandedMasters]);

    const selectedProperty = useMemo(() => {
        if (!propertyId) return null;
        return properties.find(p => p.id === propertyId);
    }, [propertyId]);

    const selectedPropertyUnits = useMemo(() => {
        if (!propertyId) return [];
        return properties.filter(p => p.parentId === propertyId);
    }, [propertyId]);

    if (selectedProperty) {
        return (
            <PropertyProfile
                asset={selectedProperty}
                units={selectedPropertyUnits}
                onBack={() => navigate('/properties')}
            />
        );
    }

    return (
        <div className="p-4 space-y-4 bg-ivolve-paper min-h-screen">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-black text-ivolve-dark font-rounded">Property Hub</h1>
                    <p className="text-ivolve-slate text-sm">Manage your portfolio, units, and assets.</p>
                </div>

                <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ivolve-slate/70 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            aria-label="Search properties by address, provider, or manager"
                            className="pl-10 pr-4 py-3 md:py-2 bg-ivolve-paper rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 w-full sm:w-64 md:w-80 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
                        <button
                            onClick={() => handleViewModeChange('table')}
                            className={`p-3 md:p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-ivolve-dark' : 'text-ivolve-slate/70 hover:text-gray-600'}`}
                            aria-label="Table view"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => handleViewModeChange('card')}
                            className={`p-3 md:p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-ivolve-dark' : 'text-ivolve-slate/70 hover:text-gray-600'}`}
                            aria-label="Card view"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-ivolve-slate/20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl shadow-sm border border-ivolve-slate/20">
                    <div className="bg-ivolve-paper p-4 rounded-full mb-4">
                        <FileQuestion size={48} className="text-ivolve-slate/70" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-ivolve-slate mb-6">Try adjusting your search terms</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="px-6 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium"
                    >
                        Clear search
                    </button>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-xl shadow-sm border border-ivolve-slate/20 overflow-hidden">
                    <table className="w-full text-left border-collapse" role="table">
                        <thead className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid shadow-sm">
                            <tr>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider w-1/3">Address / Unit</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider">Service / Status</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider">Units / Since</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider">Compliance</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider">Docs</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider">Manager</th>
                                <th scope="col" className="px-3 py-2 text-white font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tableData.map((asset) => {
                                const isDecommissioned = asset.status === 'Out of Management' && asset.type === 'Unit';
                                const rowOpacity = isDecommissioned ? 'opacity-50 grayscale' : 'opacity-100';
                                const isMaster = asset.type === 'Master';
                                const isUnit = asset.type === 'Unit';

                                let rowClasses = "transition-all duration-200 hover:shadow-md hover:scale-[1.002] cursor-pointer";

                                if (isMaster) {
                                    rowClasses += " border-l-4 border-ivolve-mid bg-white hover:bg-ivolve-mid/5";
                                } else if (isUnit) {
                                    rowClasses += " bg-ivolve-paper/50";
                                }

                                rowClasses += ` ${rowOpacity}`;

                                return (
                                    <tr
                                        key={asset.id}
                                        className={rowClasses}
                                        onClick={() => navigate(`/properties/${asset.id}`)}
                                    >
                                        <td className="px-3 py-2">
                                            <div className={`flex items-center ${isUnit ? 'pl-6' : ''}`}>
                                                {asset.type === 'Master' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMaster(asset.id);
                                                        }}
                                                        className="mr-2 text-ivolve-slate/70 hover:text-ivolve-mid"
                                                        aria-expanded={expandedMasters.has(asset.id)}
                                                        aria-label={`${expandedMasters.has(asset.id) ? 'Collapse' : 'Expand'} ${asset.address}`}
                                                    >
                                                        <ChevronRight
                                                            size={16}
                                                            className={`transition-transform duration-200 ${expandedMasters.has(asset.id) ? 'rotate-90' : ''}`}
                                                        />
                                                    </button>
                                                )}
                                                {asset.type === 'Unit' && <div className="w-4 mr-2" />}

                                                <div className="flex items-center space-x-3">
                                                    {/* Icon Logic */}
                                                    <div className={`p-2 rounded-lg ${asset.type === 'Master'
                                                        ? (asset.serviceType === 'Supported Living' ? 'bg-green-100 text-ivolve-mid' : 'bg-blue-100 text-ivolve-blue')
                                                        : (asset.status === 'Occupied' ? 'bg-green-50 text-green-600' :
                                                            asset.status === 'Void' ? 'bg-purple-50 text-purple-600' :
                                                                'bg-gray-100 text-ivolve-slate/70')
                                                        }`}>
                                                        {asset.type === 'Master' ? <Home size={18} /> : <BedDouble size={18} />}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className={`font-medium ${asset.type === 'Master' ? 'text-lg font-bold text-ivolve-dark' : 'text-gray-600 text-sm'}`}>
                                                            {asset.address}
                                                        </span>
                                                        {asset.type === 'Master' && asset.buildingPhone && (
                                                            <span className="text-xs text-ivolve-slate/70">{asset.buildingPhone}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Service / Status Column */}
                                        <td className="px-3 py-2">
                                            {asset.type === 'Master' ? (
                                                <StatusBadge status={asset.serviceType} />
                                            ) : (
                                                <StatusBadge status={asset.status} size="sm" />
                                            )}
                                        </td>

                                        {/* Units / Since Column */}
                                        <td className="px-3 py-2">
                                            {asset.type === 'Master' ? (
                                                <span className="text-sm font-bold text-gray-700">{asset.totalUnits} Units</span>
                                            ) : (
                                                <span className="text-sm text-ivolve-slate">
                                                    {asset.unitType}
                                                </span>
                                            )}
                                        </td>

                                        {/* Compliance Column */}
                                        <td className="px-3 py-2">
                                            {asset.type === 'Master' && asset.complianceStatus ? (
                                                <StatusBadge status={asset.complianceStatus} size="sm" />
                                            ) : (
                                                <span className="text-ivolve-slate/70">-</span>
                                            )}
                                        </td>

                                        {/* Docs Column */}
                                        <td className="px-3 py-2">
                                            {asset.documents && asset.documents.length > 0 ? (
                                                <div className="flex items-center space-x-1 text-gray-600">
                                                    <FileText size={16} />
                                                    <span className="text-sm font-medium">{asset.documents.length}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1 text-red-400">
                                                    <AlertCircle size={16} />
                                                    <span className="text-sm font-medium">0</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <span>{asset.housingManager}</span>
                                                {asset.areaManager && <span className="text-xs text-ivolve-slate/70">AM: {asset.areaManager}</span>}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                                onClick={() => navigate(`/properties/${asset.id}`)}
                                                className="text-ivolve-mid hover:text-ivolve-dark font-medium text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card View Logic (Simplified for now) */}
                    {filteredAssets.filter(a => a.type === 'Master').map((asset, index) => {
                        const occupancyRate = (asset.totalUnits || 0) > 0 ? ((asset.occupiedUnits || 0) / (asset.totalUnits || 1)) * 100 : 0;
                        let progressColor = 'bg-red-500';
                        if (occupancyRate === 100) progressColor = 'bg-ivolve-mid';
                        else if (occupancyRate > 50) progressColor = 'bg-ivolve-mid/70';
                        else if (occupancyRate > 0) progressColor = 'bg-amber-500';

                        return (
                            <div
                                key={asset.id}
                                onClick={() => navigate(`/properties/${asset.id}`)}
                                className={`bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-ivolve-mid overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer animate-fade-in-up stagger-${(index % 6) + 1}`}
                            >
                                <div className={`p-4 flex justify-between items-start relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${asset.serviceType === 'Supported Living' ? 'bg-ivolve-mid' : 'bg-ivolve-blue'}`}>
                                    <div>
                                        <h3 className="text-white font-bold text-lg font-rounded">{asset.address}</h3>
                                        <p className="text-white/80 text-sm">{asset.postcode}</p>
                                    </div>
                                    <Home className="text-white" size={20} />
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-ivolve-slate">Units</span>
                                        <span className="font-bold text-gray-900">{asset.totalUnits}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-ivolve-slate text-sm">Occupancy</span>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                                                style={{ width: `${occupancyRate}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-end items-center gap-1">
                                            <span className={`text-xs font-bold ${occupancyRate === 100 ? 'text-ivolve-mid' : 'text-gray-700'}`}>
                                                {asset.occupiedUnits} / {asset.totalUnits}
                                            </span>
                                            {occupancyRate === 100 && <Check size={12} className="text-ivolve-mid" />}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-ivolve-slate">Documents</span>
                                        {asset.documents && asset.documents.length > 0 ? (
                                            <div className="flex items-center gap-1 text-green-600 font-bold">
                                                <span>{asset.documents.length}</span>
                                                <Check size={14} />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-red-500 font-bold text-xs">Missing</span>
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center text-xs text-ivolve-slate">
                                            <span>Manager: {asset.housingManager}</span>
                                            <span>AM: {asset.areaManager}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default PropertyHub;
