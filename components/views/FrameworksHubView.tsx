import React, { useState, useMemo } from 'react';
import { FileTextIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';
import { Framework, ServiceType, FrameworkStatus } from '../../types';
import Card from '../Card';
import FrameworkStatusTag from '../FrameworkStatusTag';
import StatusChip from '../StatusChip';

const FrameworksHubView: React.FC = () => {
    const { frameworks, stakeholders } = useData();
    const [filters, setFilters] = useState({
        type: new Set<ServiceType>(),
        status: new Set<FrameworkStatus>(),
    });

    const laMap = useMemo(() => 
        new Map(stakeholders.filter(s => s.type === 'Local Authority').map(la => [la.id, la.name])),
        [stakeholders]
    );

    const handleFilterChange = (category: 'type' | 'status', value: ServiceType | FrameworkStatus) => {
        setFilters(prev => {
            // FIX: The original implementation had a TypeScript error because it couldn't infer the type of the Set from a union.
            // This has been split into two cases to ensure type safety.
            if (category === 'type') {
                const newSet = new Set(prev.type);
                if (newSet.has(value as ServiceType)) {
                    newSet.delete(value as ServiceType);
                } else {
                    newSet.add(value as ServiceType);
                }
                return { ...prev, type: newSet };
            } else { // category === 'status'
                const newSet = new Set(prev.status);
                if (newSet.has(value as FrameworkStatus)) {
                    newSet.delete(value as FrameworkStatus);
                } else {
                    newSet.add(value as FrameworkStatus);
                }
                return { ...prev, status: newSet };
            }
        });
    };

    const filteredFrameworks = useMemo(() => {
        return frameworks.filter(fw => {
            const typeMatch = filters.type.size === 0 || filters.type.has(fw.type);
            const statusMatch = filters.status.size === 0 || filters.status.has(fw.status);
            return typeMatch && statusMatch;
        });
    }, [frameworks, filters]);
    
    const handleRowClick = (framework: Framework) => {
        // As per prompt, modal/drawer implementation is not required.
        console.log('Opening details for framework:', framework.name);
        alert(`Details for "${framework.name}" would open here.`);
    };

    const FilterCheckbox: React.FC<{ label: string, isChecked: boolean, onChange: () => void }> = ({ label, isChecked, onChange }) => (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={isChecked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue" />
            <span className="text-sm text-solas-dark">{label}</span>
        </label>
    );

    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <FileTextIcon />
                    <h1 className="text-3xl font-bold tracking-wider">Frameworks, Bids and Tenders</h1>
                </div>
            </header>
            <main className="flex-grow p-6 space-y-6 bg-gray-50">
                <Card title="Filters">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-solas-dark mb-2">Filter by Type</h4>
                            <div className="space-y-2">
                                {Object.values(ServiceType).map(type => (
                                    <FilterCheckbox 
                                        key={type}
                                        label={type}
                                        isChecked={filters.type.has(type)}
                                        onChange={() => handleFilterChange('type', type)}
                                    />
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-solas-dark mb-2">Filter by Status</h4>
                            <div className="space-y-2">
                               {Object.values(FrameworkStatus).map(status => (
                                    <FilterCheckbox 
                                        key={status}
                                        label={status}
                                        isChecked={filters.status.has(status)}
                                        onChange={() => handleFilterChange('status', status)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Live Frameworks">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['LA', 'Framework Name', 'Type', 'Status', 'Renewal Date', 'End Date'].map(header => (
                                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredFrameworks.map(fw => (
                                    <tr key={fw.id} onClick={() => handleRowClick(fw)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{laMap.get(fw.laId) || 'Unknown LA'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{fw.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusChip status={fw.type} styleType="default" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><FrameworkStatusTag status={fw.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(fw.renewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(fw.contractEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {filteredFrameworks.length === 0 && <p className="text-center text-solas-gray py-8">No frameworks match the current filters.</p>}
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default FrameworksHubView;
