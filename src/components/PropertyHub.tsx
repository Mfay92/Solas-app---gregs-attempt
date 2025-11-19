import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Home, Users } from 'lucide-react';
import propertiesData from '../data/properties.json';
import { Property, ServiceType } from '../types';

// Cast the imported JSON to the Property type
const properties = propertiesData as unknown as Property[];

const PropertyHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState<string>('All');
    const [serviceFilter, setServiceFilter] = useState<string>('All');

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.postcode.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRegion = regionFilter === 'All' || p.region === regionFilter;
            const matchesService = serviceFilter === 'All' || p.serviceType === serviceFilter;

            return matchesSearch && matchesRegion && matchesService;
        });
    }, [searchTerm, regionFilter, serviceFilter]);

    const regions = ['All', ...Array.from(new Set(properties.map(p => p.region).filter(Boolean)))];
    const serviceTypes = ['All', 'Supported Living', 'Residential', 'Nursing'];

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ivolve-dark">Property Hub</h1>
                    <p className="text-gray-500 text-sm">{filteredProperties.length} properties found</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-ivolve-mid"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                    >
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-ivolve-mid"
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                    >
                        {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                    <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                        <div className={`h-2 w-full ${property.serviceType === 'Residential' ? 'bg-ivolve-blue' :
                                property.serviceType === 'Nursing' ? 'bg-ivolve-rouge' : 'bg-ivolve-mid'
                            }`}></div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-ivolve-mid transition-colors">
                                    {property.name}
                                </h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${property.serviceType === 'Residential' ? 'bg-blue-50 text-ivolve-blue' :
                                        'bg-green-50 text-ivolve-mid'
                                    }`}>
                                    {property.serviceType}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                    <span className="truncate">{property.address.line1}, {property.address.postcode}</span>
                                </div>
                                <div className="flex items-center">
                                    <Home size={16} className="mr-2 text-gray-400" />
                                    <span>{property.totalUnits} Units ({property.units.filter(u => !u.isMaster).length} Beds)</span>
                                </div>
                                <div className="flex items-center">
                                    <Users size={16} className="mr-2 text-gray-400" />
                                    <span>{property.landlord}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-400">{property.region}</span>
                                <button className="text-sm font-bold text-ivolve-mid hover:text-ivolve-dark">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyHub;
