import React, { useState, useMemo } from 'react';
import { Stakeholder, ContractorTrade } from '../types';

type ContractorsTableViewProps = {
  contractors: Stakeholder[];
};

const ContractorsTableView: React.FC<ContractorsTableViewProps> = ({ contractors }) => {
    const allTrades = Object.values(ContractorTrade);
    const [activeFilters, setActiveFilters] = useState<ContractorTrade[]>([]);
    
    const toggleFilter = (trade: ContractorTrade) => {
        setActiveFilters(prev => 
          prev.includes(trade) ? prev.filter(f => f !== trade) : [...prev, trade]
        );
    };

    const filteredContractors = useMemo(() => {
        if (activeFilters.length === 0) return contractors;
        return contractors.filter(c => 
            c.trades?.some(trade => activeFilters.includes(trade))
        );
    }, [contractors, activeFilters]);

  return (
    <div>
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
            <button
                onClick={() => setActiveFilters([])}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilters.length === 0
                    ? 'bg-ivolve-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                All
            </button>
            {allTrades.map(trade => (
            <button
                key={trade}
                onClick={() => toggleFilter(trade)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilters.includes(trade)
                    ? 'bg-ivolve-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {trade}
            </button>
            ))}
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-solas-dark text-white">
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Name</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Trades</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Area of Operation</th>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider">Primary Contact</th>
                    </tr>
                </thead>
                <tbody className="text-app-text-dark divide-y divide-gray-200">
                    {filteredContractors.map((contractor) => (
                        <tr key={contractor.id} className="hover:bg-gray-50">
                            <td className="p-3 text-sm font-medium">{contractor.name}</td>
                            <td className="p-3 text-sm">
                                <div className="flex flex-wrap gap-1">
                                    {contractor.trades?.map(trade => <span key={trade} className="px-2 py-0.5 text-xs bg-gray-200 text-gray-800 rounded-full">{trade}</span>)}
                                </div>
                            </td>
                            <td className="p-3 text-sm">{contractor.areaOfOperation}</td>
                            <td className="p-3 text-sm">
                                {contractor.contacts[0] ? `${contractor.contacts[0].name} (${contractor.contacts[0].phone})` : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ContractorsTableView;
